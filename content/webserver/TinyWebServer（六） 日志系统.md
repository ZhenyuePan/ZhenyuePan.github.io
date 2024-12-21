### 介绍

系统日志是用来记录服务器的运行状态，以保证系统的正常运行，**记录的信息如时间日期、客户端的读写操作、当前客户端连接数量、Error与Warn状况等，Tiny Webserver是采用单例模式与阻塞队列实现的异步的日志系统**，如下为日志的记录情况：

![日志记录.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c275bee3b5846198b03df8b1e0dd20e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

### 实现过程

`Log`类在被实例化时系统有且最多只有一个`Log`类的对象即单例模式，它是如何实现的呢?

首先会**将`Log`类的构造函数、拷贝构造函数和赋值运算符重载函数私有化**，由此外界就不能直接创建`Log`类对象，这时我们需要一个**静态`Log`类型的对象，以便系统使用同一的类对象**，而外界想要获取静态`Log`类型的对象，就需要**定义一个静态成员方法，因为只有静态成员方法才能访问静态成员变量**，由此实现`Log`类的单例模式。

`Log`类及`Instance`函数的定义：

```C++
class Log {
public:
    void init(int level, const char* path = "./log",
                const char* suffix =".log",
                int maxQueueCapacity = 1024);

    static Log* Instance();    
private:
    Log();
    virtual ~Log();
};
Log* Log::Instance() {  // 懒汉式，不存在线程安全问题
    static Log inst;
    return &inst;
}
```

系统中有4种类型的日志，分别是`LOG_DEBUG`、`LOG_INFO`、`LOG_WARN`与`LOG_ERROR`，它们共同使用`LOG_BASE`，**以level来区分不同级别的日志**，以实现代码的复用。同时**自己初始设置的日志等级可以控制不同级别的日志是否被记录**。

`log.h`宏定义代码如下：

```C++
// level = 1
// LOG_DEBUG  0 <= 1  y
// LOG_INFO   1 <= 1  y
// LOG_WARN   2 <= 1  n
// LOG_ERROR  3 <= 1  n
#define LOG_BASE(level, format, ...) \
    do {\
        Log* log = Log::Instance();\  // 获取Log类对象
        if (log->IsOpen() && log->GetLevel() <= level) {\
            log->write(level, format, ##__VA_ARGS__); \
            log->flush();\
        }\
    } while(0);

#define LOG_DEBUG(format, ...) do {LOG_BASE(0, format, ##__VA_ARGS__)} while(0);
#define LOG_INFO(format, ...)  do {LOG_BASE(1, format, ##__VA_ARGS__)} while(0);
#define LOG_WARN(format, ...)  do {LOG_BASE(2, format, ##__VA_ARGS__)} while(0);
#define LOG_ERROR(format, ...) do {LOG_BASE(3, format, ##__VA_ARGS__)} while(0);

```

在`webserver.cpp`中，如果开启日志即`openLog = true`时，则会先调用`init()`去**初始化日志信息**，当`maxQueueSize > 0`时则会创建一个阻塞队列与写线程，**值得注意的是日志系统是单线程模式**，因为并不需要较高的并发量，**写线程的回调函数则当阻塞队列不空时持续向`FILE\*`类型的指针`fp_`写入字符串**，再使用`fflush(fp_)`刷新至文件中。

`init`函数定义：

``` C++
void Log::init(int level = 1, const char* path, const char* suffix,
    int maxQueueSize) {
    isOpen_ = true;
    level_ = level;
    if(maxQueueSize > 0) {
        isAsync_ = true;
        if(!deque_) {
            unique_ptr<BlockDeque<std::string>> newDeque(new BlockDeque<std::string>);
            deque_ = move(newDeque);
            
            std::unique_ptr<std::thread> NewThread(new thread(FlushLogThread));
            writeThread_ = move(NewThread);  // 写线程
        }
    } else {
        isAsync_ = false;
    }
}
```

`FlushLogThread`回调函数：

```C++
void Log::FlushLogThread() {
    Log::Instance()->AsyncWrite_();
}

void Log::AsyncWrite_() {
    string str = "";
    while(deque_->pop(str)) {
        lock_guard<mutex> locker(mtx_);
        fputs(str.c_str(), fp_);
    }
}
```

```C++
void Log::flush() {
    if(isAsync_) { 
        deque_->flush(); 
    }
    fflush(fp_);
}
```

当使用`LOG_DEBUG`、`LOG_INFO`、`LOG_WARN`与`LOG_ERROR`时，则会宏替换为`LOG_BASE`，`LOG_BASE`继续宏替换至执行代码，然后依据日志开关与等级是否记录，如果记录则会调用`write()`函数，在`write()`函数中会制作日志记录如日志日期、日志行数、日志内容等至`buff_`中，然后添加至阻塞队列中，在`AsyncWrite_()`函数的循环能继续向下执行，向`FILE*`类型的指针`fp_`写入字符串，然后再调用`flush()`函数刷新至日志文件中，这是日志记录的整个过程，可结合上述的具体实现。而`write()`函数可自行查看源代码。

