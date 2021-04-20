# Node

本来想分享Koa2和Express的源码的，后面发现如果不介绍一些Node的基础模块直接进入主题有点直接，这里会简单的介绍一下Node的基础和一些使用node去获取网络相关的知识，我们如何构建一个web应用服务器，然后再来分析一下Node的两个知名框架 [Express](https://github.com/expressjs/express)和 [Koa2](https://github.com/koajs/koa)的源码是如何做的。



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

+ [请求方法的判断](#请求方法的判断)
+ [URL的路径解析](#URL路径解析)
+ [URL中查询字符串解析](#URL中查询字符串解析)
+ [Cookie的解析](#Cookie的解析)
+ [Basic认证](#Basic认证)
+ [数据上传](#数据上传)
+ [数据上传与安全](#数据上传与安全)
+ [路由解析](#路由解析)
+ [RESTful](#RESTful)
+ [中间件](#中间件)





## [Koa2源码分析]()







## [Express源码分析]()







## [常用的中间件]()

+ 路由中间件
+ 静态资源目录中间件
+ 







#### V8的垃圾回收机制与内存限制









### 难点

#### 1. 异常处理规范

> Node在处理异常上形成了一种约定，将异常作为回调函数的第一个实参传回，如果为空值，则表明异步调用没有抛出异常。

我们在自行编写的异步方法上，也需要去遵循这样一些原则。

+ 原则一：必须执行调用者传入的回调函数。
+ 原则二：正确传递回异常供调用者判断。

示例代码如下：

```js
var async = function (callback) {
  process.nextTick(function () {
    var results = something;
    if (error) {
      return callback(error);
    }
    callback(null, results);
  });
};
```



```js
举出一些函数的例子

fs读取文件模块
mysql的查询模块
```



#### 2. 函数嵌套过深



我们自己写一些组件库的时候，需要

```js

```



#### 3. 阻塞代码









```js
fs模块读取文件
	

fs.createReadStream  // 流文件

Buffer  // 操作二进制

```



```
学好文件操作，编写各种程序都不怕。

如果不是很在意性能，fs模块的同步API能让生活更加美好。

需要对文件读写做到字节级别的精细控制时，请使用fs模块的文件底层操作API。

不要使用拼接字符串的方式来处理路径，使用path模块。

掌握好目录遍历和文件编码处理技巧，很实用。
```







## 一些node基础知识的简单介绍



Koa 通过 node.js 实现了一个十分具有表现力的 HTTP 中间件框架，力求让 Web 应用开发和 API 使用更加地愉快。Koa 的中间件之间按照编码顺序在栈内依次执行，允许您执行操作并向下传递请求（downstream），之后过滤并逆序返回响应（upstream）。

几乎所有 HTTP 服务器通用的方法都被直接集成到 Koa 大约570行源码的代码库中。其中包括内容协商，节点不一致性的规范化，重定向等等操作。

Koa没有捆绑任何中间件。





> **koa2**是由 Express 原班人马打造的，致力于成为一个更小、更富有表现力、更健壮的 Web 框架。 使用 koa 编写 web 应用，可以免除重复繁琐的回调函数嵌套， 并极大地提升错误处理的效率。koa 不在内核方法中绑定任何中间件， 它仅仅提供了一个轻量优雅的函数库，使得编写 Web 应用变得得心应手。开发思路和express差不多，最大的特点就是可以避免异步嵌套。



> **koa2**利用ES7的async/await特性，极大的解决了我们在做nodejs开发的时候异步给我们带来的烦恼。









```js
app.use(router.routes()); //作用：启动路由
app.use(router.allowedMethods()); // 作用： 这是官方文档的推荐用法,我们可以看到router.allowedMethods()用在了路由匹配router.routes()之后,所以在当所有路由中间件最后调用.此时根据ctx.status设置response响应头
```





## 使用http启动一个服务

> Node的http模块包含对HTTP处理的封装。在Node中，HTTP服务继承自TCP服务器(net模块)，它能够与多个客户端保持连接，由于其采用事件驱动的形式，并不为每一个连接创建额外的线程或进程，保持很低的内存占用，所以能实现高并发。HTTP服务于TCP服务模型有区别的地方在于，在开启 keepalive 后，一个TCP回话可以用于多次请求和响应。TCP服务以 connection 为单位进行服务，HTTP服务以 request 为单位进行服务。http模块即是将 connection 到 request 的过程进行了封装。



```js
var http = require('http'); 
var querystring = require('querystring'); 
// 侦听服务器的request事件
http.createServer(function (req, res) { 
 var postData = ''; 
 req.setEncoding('utf8'); 
 // 侦听请求的data事件
 req.on('data', function (trunk) { 
 postData += trunk; 
 }); 
 // 侦听请求的end事件
 req.on('end', function () { 
 res.end(postData); 
 }); 
}).listen(8080); 
console.log('服务器启动完成');
```



```js
function (req, res) { 
 // console.log(req.headers); 
 var buffers = []; 
 req.on('data', function (trunk) { 
 buffers.push(trunk); 
 }).on('end', function () { 
 var buffer = Buffer.concat(buffers); 
 // TODO
 res.end('Hello world'); 
 }); 
}
```





> 值得注意的是，无论服务器端在处理业务逻辑时是否发生异常，务必在结束时调用 `res.end()` 结束请求，否则客户端将一直处于等待状态。













## 防止频繁启动





## 中间件

> 通俗的讲，中间件就是匹配路由之前或者匹配路由完成做的一系列的操作，我们就可以把它叫做中间件。



> 在express中间件（Middleware） 是一个函数，它可以访问请求对象（request object (req)）, 响应对象（response object (res)）, 和 web 应用中处理请求-响应循环流程中的中间件，一般被命名为 next 的变量。在Koa中中间件和express有点类似。



>中间件的功能包括：
>
>执行任何代码。
>修改请求和响应对象。
>终结请求-响应循环。
>调用堆栈中的下一个中间件。
>
>如果我的get、post回调函数中，没有next参数，那么就匹配上第一个路由，就不会往下匹配了。如果想往下匹配的话，那么需要写next()





### koa应用可使用如下几种中间件

应用级中间件
路由级中间件
错误处理中间件
第三方中间件



![img](https://www.itying.com/koa/data/news/image/20180406/20180406134220_35560.png)



#### 一些常用中间件





## 路由

#### 接口是什么？如何写一个接口



#### POST请求参数获取原理

> 对于POST请求的处理，koa2没有封装获取参数的方法，需要通过解析上下文context中的原生node.js请求对象req，将POST表单数据解析成query string（例如：a=1&b=2&c=3），再将query string 解析成JSON格式（例如：{"a":"1", "b":"2", "c":"3"}）



```js
// 解析上下文里node原生请求的POST参数
function parsePostData( ctx ) {
  return new Promise((resolve, reject) => {
    try {
      let postdata = "";
      ctx.req.addListener('data', (data) => {
        postdata += data
      })
      ctx.req.addListener("end",function(){
        let parseData = parseQueryStr( postdata )
        resolve( parseData )
      })
    } catch ( err ) {
      reject(err)
    }
  })
}

// 将POST请求参数字符串解析成JSON
function parseQueryStr( queryStr ) {
  let queryData = {}
  let queryStrList = queryStr.split('&')
  console.log( queryStrList )
  for (  let [ index, queryStr ] of queryStrList.entries()  ) {
    let itemList = queryStr.split('=')
    queryData[ itemList[0] ] = decodeURIComponent(itemList[1])
  }
  return queryData
}
```





#### 设置一些cookie





#### 参数类型校验



## [模板引擎]()

服务端渲染、前后端分离

```js
ejs
jade
```







## 上传图片

**koa-multer**





## [数据存储]

* [Mysql]()
* [Mongodb]()
* [Redis]()



## 多个进程通讯

> Node的多进程之间如何通讯？





## [我能做什么]()

填充我们对后台的知识盲区，理解它们正在做的事情，实现我们曾经没有实现过的功能。

* [跨域解决]()
* [jsonp原理]()
* [发送邮件]()
* [websocket后台]()
* [github第三方登录]()
* [jwt接口认证]()