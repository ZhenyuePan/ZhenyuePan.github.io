### 介绍

当一个网站用户量到达一定规模时，会对网站的**并发量**有很高的要求，当我们实现了一个高性能的服务器时，就需要对**服务器所能达到的最高并发量进行测试即压力测试**，而最常使用的压力测试工具是webbench。

### 压力测试

webbench是一款轻量级的网站压力测试工具，最多可以对网站模拟3w左右的并发请求，可以控制时间，是否启用缓存，是否等待服务器回复等，**对中小网站测试效果明显即基本可以测出中小网站的承受能力。**

webbench实现原理：

父进程fork出若干个子进程，每个子进程在用户要求的时间内对目标网站循环发出实际访问请求，父子进程会通过管道进行通信，子进程通过管道写端向父进程传递请求访问完毕后记录到的总信息，父进程通过管道读端读取子进程发来的相关信息，待时间到后所有子进程结束，父进程统计并给用户显示最后的测试结果，然后退出。

> 测试处在相同硬件上不同服务的性能，以及不同硬件上相同服务的运行状况。
>
> 展示服务器的两项内容：每秒钟的响应请求数和每秒钟传输的数据量。

获取webbench工具：

```bash
git clone git@github.com:EZLippi/WebBench.git
```

```bash
cd WebBench
sudo make && sudo make install
```

之后就可以对服务器进行压力测试，压力测试的命令行参数可参考[WebBench 命令行选项](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FEZLippi%2FWebBench)，在此只需要对`-c`与`-t`选项进行测试即可。

**因为是云服务器，配置只有1核2G，所以实际在压力测试时的QPS是很低的，这是受限于服务器的性能而言的，并不代表WebServer的程序性能不够优秀。**

![压力测试.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/42e822d706594b3f8abba7e54e2d6ac4~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

128÷5=25.6128÷5=25.6 128÷5=25.6128÷5=25.6128÷5=25.6 qps，QPS很低，在更高配置的机器下才能凸显WebServer程序的性能，而**达到上万QPS是不成问题的**，可参考[qinguoyi/TinyWebServer-压力测试部分](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fqinguoyi%2FTinyWebServer)。 qps，QPS很低，在更高配置的机器下才能凸显WebServer程序的性能，而**达到上万QPS是不成问题的**，可参考[qinguoyi/TinyWebServer-压力测试部分](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fqinguoyi%2FTinyWebServer)。

### 结尾

压力测试下的高并发量更多体现的是程序的高性能，尤其是对拥有大量用户的网站而言更为重要，而**这部分的压力测试更多的是针对中小型网站而言**，以认识服务器的承载能力。之前在专栏写了5篇Tiny WebServer的文章，以结束对Tiny Webserver功能的解析，但后来想想，压力测试对程序性能的判定也是极为重要的，由此就有了这篇文章。

