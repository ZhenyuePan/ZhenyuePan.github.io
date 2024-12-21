# 引言

我是一名跨考的研一的计算机学生OvO，TinyWebServer是我选择的第一个项目，之所以选择这个项目作为我的第一个项目有以下几点原因：

- C++选手写这个的非常多，网上有大量资源。
- 涉及的技术栈全面，比如：I/O多路复用（epoll），reactor网络模型，线程池，数据库连接池，日志，测压软件webbench，有助于建立起Linux/C++网络编程的技术框架

参考链接：
C++ Linux轻量级WebServer-FoolOne大佬:https://juejin.cn/post/7098659904721780749

一文流：https://huixxi.github.io/2020/06/02/%E5%B0%8F%E7%99%BD%E8%A7%86%E8%A7%92%EF%BC%9A%E4%B8%80%E6%96%87%E8%AF%BB%E6%87%82%E7%A4%BE%E9%95%BF%E7%9A%84TinyWebServer/#more

github仓库：https://github.com/ZhenyuePan/TinyWebServer

csdn:https://blog.csdn.net/ambition_zhou/article/details/118577759
社长本人的庖丁解牛：https://mp.weixin.qq.com/s?__biz=MzAxNzU2MzcwMw==&mid=2649274278&idx=3&sn=5840ff698e3f963c7855d702e842ec47&chksm=83ffbefeb48837e86fed9754986bca6db364a6fe2e2923549a378e8e5dec6e3cf732cdb198e2&scene=0&xtrack=1#rd

# 介绍

此项目是基于Linux轻量级多线程的Web服务器，应用层实现了一个简单的HTTP服务器，支持静态消息的访问与动态消息的回显。

**项目功能：**

- 利用IO复用技术Epoll与线程池实现的多线程Reactor高并发模型；
- 利用正则表达式与有限状态机解析HTTP请求报文，实现静态资源的处理；
- 利用标准库容器封装的char，实现自动增长的缓冲区；
- 基于小根堆实现的定时器，关闭超时的非活动连接；
- 利用单例模式和阻塞队列实现异步的日志系统，记录服务器的运行状态；

**项目成果：**

使用C++实现的高性能WEB服务器，经过webbench压力测试在**2核4G**配置下可以实现**上万QPS**。

# 框架

![WebServer框架图.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/303a02376d264e1a97145f5c56776f3a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

**1.什么是Web Server（网络服务器）**

一个Web Server就是一个服务器软件（程序），或者是运行这个服务器软件的硬件（计算机）。其主要功能是通过HTTP协议与客户端（通常是浏览器（Browser））进行通信，来接收，存储，处理来自客户端的HTTP请求，并对其请求做出HTTP响应，返回给客户端其请求的内容（文件、网页等）或返回一个Error信息。 

**2.用户如何与你的Web服务器进行通信**

通常用户使用Web浏览器与相应服务器进行通信。在浏览器中键入“域名”或“IP地址:端口号”，浏览器则先将你的域名解析成相应的IP地址或者直接根据你的IP地址向对应的Web服务器发送一个HTTP请求。这一过程首先要通过TCP协议的三次握手建立与目标Web服务器的连接，然后HTTP协议生成针对目标Web服务器的HTTP请求报文，通过TCP、IP等协议发送到目标Web服务器上。

**3.Web服务器如何接收客户端发来的HTTP请求报文呢?**

Web服务器端通过`socket`监听来自用户的请求。