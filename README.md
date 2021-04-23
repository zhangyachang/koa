# Node

本来想分享Koa的源码的，后面发现如果不介绍一些Node的基础模块直接进入主题有点直接，这里会简单的介绍一下Node的基础和一些使用node去获取网络相关的知识，我们如何构建一个web应用服务器，然后再来分析一下Node的 [Koa2](https://github.com/koajs/koa)框架是如何做的。



由于时间原因导致部分细节实现不太清楚见谅~~



## [简单介绍](/sections/zh-cn/简单介绍.md)

+ [为什么要学Node](/sections/zh-cn/简单介绍.md/#为什么要学node)
+ [简单介绍](/sections/zh-cn/简单介绍.md/#简单介绍)
+ [与浏览器对比](/sections/zh-cn/简单介绍.md/#与浏览器对比)
+ [使用场景](/sections/zh-cn/简单介绍.md/#使用场景)





## [基础知识](/sections/zh-cn/基础知识.md)

* [`[Basic]` 模块的导入导出](/sections/zh-cn/基础知识.md/#模块的导入导出)
* [`[Basic]` 顶层对象](/sections/zh-cn/基础知识.md/#顶层对象)
* [`[Basic]` 模块封装器](/sections/zh-cn/基础知识.md/#模块封装器)
  [浏览器与Node的事件循环(Event Loop)有何区别?](https://zhuanlan.zhihu.com/p/54882306)





## [核心模块](./sections/zh-cn/核心模块.md)

* [event](./sections/zh-cn/核心模块.md/#event (事件触发器))
* [path](./sections/zh-cn/核心模块.md/#path模块)
* [url(URL)](./sections/zh-cn/核心模块.md/#url(URL))
* [assert](./sections/zh-cn/核心模块.md/#assert(断言))
* [crypto](./sections/zh-cn/核心模块.md/#crypto (加密))
* [stream](./sections/zh-cn/核心模块.md/#stream(流))
* [fs](./sections/zh-cn/核心模块.md/#fs (文件系统))
* [http](./sections/zh-cn/核心模块.md/#http模块)
* [Buffer](./sections/zh-cn/核心模块.md/#Buffer)
* [网络编程](./sections/zh-cn/核心模块.md/#网络编程)

...



## [调试相关](./sections/zh-cn/调试相关.md)

+ [nodemon](./sections/zh-cn/调试相关.md/#nodemon)
+ [使用谷歌浏览器调试](./sections/zh-cn/调试相关.md/#使用谷歌浏览器调试)
+ [pm2](./sections/zh-cn/调试相关.md/#pm2)





## [构建Web应用](./sections/zh-cn/构建Web应用.md)

+ [请求方法的判断](./sections/zh-cn/构建Web应用.md/#请求方法的判断)
+ [URL的路径解析](./sections/zh-cn/构建Web应用.md/#URL路径解析)
+ [URL中查询字符串解析](./sections/zh-cn/构建Web应用.md/#URL中查询字符串解析)
+ [Cookie的解析](./sections/zh-cn/构建Web应用.md/#Cookie的解析)
+ [Basic认证](./sections/zh-cn/构建Web应用.md/#Basic认证)
+ [数据上传](./sections/zh-cn/构建Web应用.md/#数据上传)
+ [数据上传与安全](./sections/zh-cn/构建Web应用.md/#数据上传与安全)
+ [路由解析](./sections/zh-cn/构建Web应用.md/#路由解析)
+ [RESTful](./sections/zh-cn/构建Web应用.md/#RESTful)
+ [中间件](./sections/zh-cn/构建Web应用.md/#中间件)



## [Koa分析](./sections/Koa.md)



## [常用的中间件](./sections/zh-cn/常用中间件.md)



## [模板引擎]()

服务端渲染、前后端分离

```js
ejs
jade
```



## [数据存储]() --暂未实现

* [Mysql]()
* [Mongodb]()
* [Redis]()



## [我能做什么]() -- 暂未实现

填充我们对后台的知识盲区，理解它们正在做的事情，实现我们曾经没有实现过的功能。

* [跨域解决]()
* [jsonp原理]()
* [发送邮件]()
* [websocket后台]()
* [github第三方登录]()
* [jwt接口认证]()

