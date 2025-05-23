### 介绍

WebServer采用I/O复用技术**Epoll与线程池**实现的**多线程Reactor**高并发模型，下面则来介绍Socket、Epoll、线程池与Reactor技术，及在项目中的实现方式。

### Socket

先建立TCP服务端通信，得到监听的文件描述符，再去等待客户端的连接，以此来建立双方的通信，以下是Socket通信流程：

![Socket通信流程.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0906db030f634678b84eb96ed661fa6e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)





Socket接口使用与实现方式（为简化代码，未对异常处理）：

```C++
#include <sys/socket.h>
#include <netinet/in.h>
/**
 * socket的一般步骤
 * 1.建立套接字
 * 2.配置addr，端口号，端口复用（可选）
 * 3.bind（）
 * 4.监听端口listen（）
 */


listenFd_ = socket(AF_INET, SOCK_STREAM, 0);
struct sockaddr_in addr;
addr.sin_family = AF_INET;
addr.sin_addr.s_addr = htonl(INADDR_ANY);
addr.sin_port = htons(port_);

int optval = 1;
/* 端口复用 */
ret = setsockopt(listenFd_, SOL_SOCKET, SO_REUSEADDR, (const void*)&optval, sizeof(int));

ret = bind(listenFd_, (struct sockaddr *)&addr, sizeof(addr));
ret = listen(listenFd_, 6);

```

### Epoll

![img](https://i-blog.csdnimg.cn/blog_migrate/cb79739a87823a9e9917719879311a68.png)

​	远端的很多用户会尝试去`connect()`这个Web Server上正在`listen`的这个`port`，而监听到的这些连接会排队等待被`accept()`。由于用户连接请求是随机到达的异步事件，每当监听socket（`listenfd`）`listen`到新的客户连接并且放入监听队列，我们都需要告诉我们的Web服务器有连接来了，`accept`这个连接，并分配一个逻辑单元来处理这个用户请求。而且，我们在处理这个请求的同时，还需要继续监听其他客户的请求并分配其另一逻辑单元来处理（并发，同时处理多个事件，后面会提到使用线程池实现并发）。



​	这里，服务器通过**epoll**这种I/O复用技术（还有select和poll）来实现对监听socket（`listenfd`）和连接socket（客户请求）的同时监听。注意I/O复用虽然可以同时监听多个文件描述符，但是它本身是阻塞（read(),recv())的，并且当有多个文件描述符同时就绪的时候，如果不采取额外措施，程序则只能按顺序处理其中就绪的每一个文件描述符，所以为提高效率，我们将在这部分通过线程池来实现并发（多线程并发），为每个就绪的文件描述符分配一个逻辑单元（线程）来处理。

```C++
#include <sys/epoll.h>
/* 将fd上的EPOLLIN和EPOLLET事件注册到epollfd指示的epoll内核事件中 */
void addfd(int epollfd, int fd, bool one_shot) {
    epoll_event event;
    event.data.fd = fd;
    event.events = EPOLLIN | EPOLLET | EPOLLRDHUP;
    /* 针对connfd，开启EPOLLONESHOT，因为我们希望每个socket在任意时刻都只被一个线程处理 */
    if(one_shot)
        event.events |= EPOLLONESHOT;
    epoll_ctl(epollfd, EPOLL_CTL_ADD, fd, &event);
    setnonblocking(fd);
}
/* 创建一个额外的文件描述符来唯一标识内核中的epoll事件表 */
int epollfd = epoll_create(5);  
/* 用于存储epoll事件表中就绪事件的event数组 */
epoll_event events[MAX_EVENT_NUMBER];  
/* 主线程往epoll内核事件表中注册监听socket事件，当listen到新的客户连接时，listenfd变为就绪事件 */
addfd(epollfd, listenfd, false);  
/* 主线程调用epoll_wait等待一组文件描述符上的事件，并将当前所有就绪的epoll_event复制到events数组中 */
int number = epoll_wait(epollfd, events, MAX_EVENT_NUMBER, -1);
/* 然后我们遍历这一数组以处理这些已经就绪的事件 */
for(int i = 0; i < number; ++i) {
    int sockfd = events[i].data.fd;  // 事件表中就绪的socket文件描述符
    if(sockfd == listenfd) {  // 当listen到新的用户连接，listenfd上则产生就绪事件
        struct sockaddr_in client_address;
        socklen_t client_addrlength = sizeof(client_address);
        /* ET模式 */
        while(1) {
            /* accept()返回一个新的socket文件描述符用于send()和recv() */
            int connfd = accept(listenfd, (struct sockaddr *) &client_address, &client_addrlength);
            /* 并将connfd注册到内核事件表中 */
            users[connfd].init(connfd, client_address);
            /* ... */
        }
    }
    else if(events[i].events & (EPOLLRDHUP | EPOLLHUP | EPOLLERR)) {
        // 如有异常，则直接关闭客户连接，并删除该用户的timer
        /* ... */
    }
    else if(events[i].events & EPOLLIN) {
        /* 当这一sockfd上有可读事件时，epoll_wait通知主线程。*/
        if(users[sockfd].read()) { /* 主线程从这一sockfd循环读取数据, 直到没有更多数据可读 */
            pool->append(users + sockfd);  /* 然后将读取到的数据封装成一个请求对象并插入请求队列 */
            /* ... */
        }
        else
            /* ... */
    }
    else if(events[i].events & EPOLLOUT) {
        /* 当这一sockfd上有可写事件时，epoll_wait通知主线程。主线程往socket上写入服务器处理客户请求的结果 */
        if(users[sockfd].write()) {
            /* ... */
        }
        else
            /* ... */
    }
}
```

### 并发模型

服务器程序通常需要处理三类事件：I/O事件，信号及定时事件。有两种事件处理模式：

- Reactor模式：要求主线程（I/O处理单元）只负责监听文件描述符上是否有事件发生（可读、可写），若有，则立即通知工作线程（逻辑单元），将socket可读可写事件放入请求队列，交给工作线程处理。
- Proactor模式：将所有的I/O操作都交给主线程和内核来处理（进行读、写），工作线程仅负责处理逻辑，如主线程读完成后`users[sockfd].read()`，选择一个工作线程来处理客户请求`pool->append(users + sockfd)`。

通常使用同步I/O模型（如`epoll_wait`）实现Reactor，使用异步I/O（如`aio_read`和`aio_write`）实现Proactor。那么什么是同步I/O，什么是异步I/O呢？

- 同步（阻塞）I/O：在一个线程中，CPU执行代码的速度极快，然而，一旦遇到IO操作，如读写文件、发送网络数据时，就需要等待IO操作完成(等待结果），才能继续进行下一步操作。这种情况称为同步IO。
- 异步（非阻塞）I/O：当代码需要执行一个耗时的IO操作时，它只发出IO指令，并不等待IO结果，然后就去执行其他代码了。一段时间后，当IO返回结果时，再通知CPU进行处理。该项目的并发模型则采用Reactor模型，但不同的是**主线程不仅监听文件描述符是否有事件发生，还负责接收新的客户连接**，

- `epoll_wait()`用来同时监听多个文件描述符，如果是连接请求则会封装成一个`HttpConnection`对象，并与服务器建立连接，如果是读写事件，采用线程池的方式唤醒其中的工作线程去处理读写事件。
- 该项目的并发模型则采用Reactor模型，但不同的是**主线程不仅监听文件描述符是否有事件发生，还负责接收新的客户连接**，`epoll_wait()`用来同时监听多个文件描述符，如果是连接请求则会封装成一个`HttpConnection`对象，并与服务器建立连接，如果是读写事件，采用线程池的方式唤醒其中的工作线程去处理读写事件。

- 主线程（I/O处理单元）只负责监听文件描述符上是否有事件发生，有就立即将该事件通知给工作线程（逻辑单元），将socket可读可写事件放入请求队列。除此之外，主线程不做任何其它实质性的工作。读写数据，接收新的连接，以及处理客户请求均在工作线程中完成。

  ![Reactor模型.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/575d5b980011426da7b21429f14afbe5~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 线程池

`ThreadPool`的创建是发生在`WebServer`的构造函数中，并指定工作线程的线程数，在`ThreadPool`的构造函数中，循环创建工作线程并执行`task()`函数用来处理任务队列中的读写事件，为了避免过度占用cpu，采用条件变量的方式唤醒或阻塞工作线程，而任务队列则需要加锁，因为它被所有线程所共享，线程也会被设置为脱离状态即`detach`状态，以至于线程运行结束时，资源会被系统自动回收，无需再对线程`join`操作。

使用线程池而不是使用多线程即来一个请求创建一个线程，执行完又将该线程销毁，是为了避免由于线程频繁的创建和销毁所带来的性能消耗，而为了任务的并发执行，将任务交给线程池即可。

线程池中线程的数量大小：`最佳线程数 = cpu核数 * 当前cpu利用率 * (1 + cpu等待时间 / cpu处理时间)`

![线程池.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2896eb72eaea44e488f73fd8b9a3dc17~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

以下是`threadpool.h`

```C++
#ifndef THREADPOOL_H
#define THREADPOOL_H

#include <mutex>
#include <condition_variable>
#include <queue>
#include <thread>
#include <functional>
class ThreadPool {
public:
    explicit ThreadPool(size_t threadCount = 8): pool_(std::make_shared<Pool>()) {  // explicit防止构造函数进行隐式类型转换
            assert(threadCount > 0);

            // 创建threadCount个子线程
            for(size_t i = 0; i < threadCount; i++) {
                std::thread([pool = pool_] {
                    std::unique_lock<std::mutex> locker(pool->mtx);
                    while(true) {
                        if(!pool->tasks.empty()) {
                            // 从任务队列中取第一个任务
                            auto task = std::move(pool->tasks.front());
                            // 移除掉队列中第一个元素
                            pool->tasks.pop();
                            locker.unlock();
                            task();
                            locker.lock();  // 这里是对工作队列加锁
                        } 
                        else if(pool->isClosed) break;
                        else pool->cond.wait(locker);   // 如果队列为空，等待
                    }
                }).detach();// 线程分离
            }
    }

    ThreadPool() = default;

    ThreadPool(ThreadPool&&) = default;
    
    ~ThreadPool() {
        if(static_cast<bool>(pool_)) {
            {
                std::lock_guard<std::mutex> locker(pool_->mtx);
                pool_->isClosed = true;
            }
            pool_->cond.notify_all();
        }
    }

    template<class F>
    void AddTask(F&& task) {
        {
            std::lock_guard<std::mutex> locker(pool_->mtx);
            pool_->tasks.emplace(std::forward<F>(task));
        }
        pool_->cond.notify_one();   // 唤醒一个等待的线程
    }

private:
    // 结构体
    struct Pool {
        std::mutex mtx;     // 互斥锁
        std::condition_variable cond;   // 条件变量
        bool isClosed;          // 是否关闭
        std::queue<std::function<void()>> tasks;    // 队列（保存的是任务）
    };
    std::shared_ptr<Pool> pool_;  //  池子
};


#endif //THREADPOOL_H
```

实现线程池步骤：

1. 设置一个生产者消费者队列，作为临界资源。
2. 初始化几个线程，并让其运行起来，加锁去队列里取任务运行
3. 当任务队列为空时，所有线程阻塞。
4. 当生产者队列来了一个任务后，先对队列加锁，把任务挂到队列上，然后使用条件变撞去通知阻塞中的一个线程来处理。

# 扩展：

### EPOLLONESHOT事件

即使可以使用 ET 模式，一个 socket 上的某个事件还是可能被触发多次。这在并发程序中就会引起一个问题。比如一个线程在读取完某个 socket 上的数据后开始处理这些数据，而在数据的处理过程中该socket 上又有新数据可读（ EPOLLIN 再次被触发），此时另外一个线程被唤醒来读取这些新的数据。于是就出现了两个线程同时操作一个 socket 的局面。一个 socket 连接在任一时刻都只被一个线程处理，可以使用 epoll 的 EPOLLONESHOT 事件实现。

对于注册了 EPOLLONESHOT 事件的文件描述符，操作系统最多触发其上注册的一个可读、可写或者异常事件，且只触发一次，除非我们使用 epoll_ctl 函数重置该文件描述符上注册的 EPOLLONESHOT 事件。这样，当一个线程在处理某个 socket 时，其他线程是不可能有机会操作该 socket 的。但反过来思考，注册了 EPOLLONESHOT 事件的 socket 一旦被某个线程处理完毕， 该线程就应该立即重置这个socket 上的 EPOLLONESHOT 事件，以确保这个 socket 下一次可读时，其 EPOLLIN 事件能被触发，进而让其他工作线程有机会继续处理这个 socket 
