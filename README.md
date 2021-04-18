# Node

本来想分享Koa2和Express的源码的，后面发现如果不介绍一些Node的基础模块直接进入主题有点直接，这里会简单的介绍一下Node的基础和一些使用node去获取网络相关的知识，我们如何构建一个web应用服务器，然后再来分析一下Node的两个知名框架 [Express](https://github.com/expressjs/express)和 [Koa2](https://github.com/koajs/koa)的源码是如何做的。



## [简单介绍](/sections/zh-cn/简单介绍.md)

+ [为什么要学Node](/sections/zh-cn/简单介绍.md/#为什么要学node)
+ [简单介绍](/sections/zh-cn/简单介绍.md/#简单介绍)
+ [与浏览器对比](/sections/zh-cn/简单介绍.md/#与浏览器对比)
+ [使用场景](/sections/zh-cn/简单介绍.md/#使用场景)





## [基础知识]()

* [`Basic`] [模块的导入导出]()
* [`Basic`] [顶层对象]()
* [`Basic`] [模块封装器]()

[浏览器与Node的事件循环(Event Loop)有何区别?](https://zhuanlan.zhihu.com/p/54882306)





### 模块的导入导出

在 Node.js 模块系统中，每个文件都被视为一个独立的模块。



**导出方法一**

```js
// a.js
const b = require("./b");

b
// { name: '张三', a: 111 }
```



```js
// b.js
module.exports = {
  name: "张三",
  a: 111,
};
```



**导出方法二**

> `exports` 变量是在模块的文件级作用域内可用的，且在模块执行之前赋值给 `module.exports`。
>
> 它允许使用快捷方式，因此 `module.exports.f = ...` 可以更简洁地写成 `exports.f = ...`。 但是，就像任何变量一样，如果为 `exports` 赋予了新值，则它将不再绑定到 `module.exports`：

```js
// b.js
exports.name = "张三";
exports.a = 111;
```



```js
module.exports.hello = true; // 从模块的引用中导出。
exports = { hello: false };  // 不导出，仅在模块中可用。
```



**注意：** `exports` 实际上是 `module.exports`的引用，所以如果尝试给 `exports` 重新赋值是无法导出内容的

```js
// a.js
const b = require("./b");
b
// {}
```

```js
// b.js
exports = {
  a: 1,
  b: 2,
};
```



**注意：**对 `module.exports` 的赋值必须立即完成。 不能在任何回调中完成。 以下是不起作用的：

```js
setTimeout(() => {
  module.exports = { a: 'hello' };
}, 0);
```





**缓存**

>模块在第一次加载后会被缓存。 这也意味着（类似其他缓存机制）如果每次调用 `require('foo')` 都解析到同一文件，则返回相同的对象。
>
>多次调用 `require(foo)` 不会导致模块的代码被执行多次。 这是一个重要的特性。 借助它, 可以返回“部分完成”的对象，从而允许加载依赖的依赖, 即使它们会导致循环依赖。
>
>如果想要多次执行一个模块，可以导出一个函数，然后调用该函数。



**循环引用**

`a.js`

```js
console.log('a 开始');
exports.done = false;
const b = require('./b.js');
console.log('在 a 中，b.done = %j', b.done);
exports.done = true;
console.log('a 结束');
```

`b.js`

```js
console.log('b 开始');
exports.done = false;
const a = require('./a.js');
console.log('在 b 中，a.done = %j', a.done);
exports.done = true;
console.log('b 结束');
```

`main.js`

```js
console.log('main 开始');
const a = require('./a.js');
const b = require('./b.js');
console.log('在 main 中，a.done=%j，b.done=%j', a.done, b.done);
```



当 `main.js` 加载 `a.js` 时， `a.js` 又加载 `b.js`。 此时， `b.js` 会尝试去加载 `a.js`。 为了防止无限的循环，会返回一个 `a.js` 的 `exports` 对象的 **未完成的副本** 给 `b.js` 模块。 然后 `b.js` 完成加载，并将 `exports` 对象提供给 `a.js` 模块。

当 `main.js` 加载这两个模块时，它们都已经完成加载。 因此，该程序的输出会是：

```js
$ node main.js
main 开始
a 开始
b 开始
在 b 中，a.done = false
b 结束
在 a 中，b.done = true
a 结束
在 main 中，a.done=true，b.done=true
```



### 顶层对象

```js
global

在浏览器中是window，在Node中是global
```





### 模块封装器

在执行模块代码之前，Node.js 会使用一个如下的函数封装器将其封装：

```js
(function(exports, require, module, __filename, __dirname) {
	// 模块的代码实际上在这里
});
```

通过这样做，Node.js 实现了以下几点：

- 它保持了顶层的变量（用 `var`、 `const` 或 `let` 定义）作用在模块范围内，而不是全局对象。
- 它有助于提供一些看似全局的但实际上是模块特定的变量，例如：
  - 实现者可以用于从模块中导出值的 `module` 和 `exports` 对象。
  - 包含模块绝对文件名和目录路径的快捷变量 `__filename` 和 `__dirname` 。



```js
__dirname // 当前模块的目录名。 相当于 __filename 的 path.dirname()。

__filename // 当前模块的文件名。 这是当前的模块文件的绝对路径（符号链接会被解析）。
```







## [核心模块](./sections/zh-cn/module.md)

* [`Basic`] [Event](./sections/zh-cn/module.md)
* [`Basic`] [Path]()
* 



### Event (事件触发器)

> 大多数 Node.js 核心 API 构建于惯用的异步事件驱动架构，其中某些类型的对象（又称触发器，Emitter）会触发命名事件来调用函数（又称监听器，Listener）
>
> 例如，[`net.Server`](http://nodejs.cn/api/net.html#net_class_net_server) 会在每次有新连接时触发事件，[`fs.ReadStream`](http://nodejs.cn/api/fs.html#fs_class_fs_readstream) 会在打开文件时触发事件，[stream](http://nodejs.cn/api/stream.html)会在数据可读时触发事件。
>
> 所有能触发事件的对象都是 `EventEmitter` 类的实例。 这些对象有一个 `eventEmitter.on()` 函数，用于将一个或多个函数绑定到命名事件上。 事件的命名通常是驼峰式的字符串，但也可以使用任何有效的 JavaScript 属性键。。
>
> 当 `EventEmitter` 对象触发一个事件时，所有绑定在该事件上的函数都会被同步地调用。 被调用的监听器返回的任何值都将会被忽略并丢弃。



例子，一个简单的 `EventEmitter` 实例，绑定了一个监听器。 `eventEmitter.on()` 用于注册监听器， `eventEmitter.emit()` 用于触发事件。

```js
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('触发事件');
});
myEmitter.emit('event');
```



使用 `eventEmitter.once()` 可以注册最多可调用一次的监听器。 当事件被触发时，监听器会被注销，然后再调用。

```js
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.once('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// 打印: 1
myEmitter.emit('event');
// 不触发
```



**注意：** 事件触发器的实例化对象最多监听10个，如果监听超过10个会报错

```js
internal/process/warning.js:41 (node:14279) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 event listeners added to [EventEmitter]. Use emitter.setMaxListeners() to increase limit
(Use `node --trace-warnings ...` to show where the warning was created)
```



```js
myEmitter.getMaxListeners(); // 10
```

可以通过 

```js
myEmitter.setMaxListeners(100); // 来设置可以监听的个数。
```







### Path模块

>`path` 模块提供了一些实用工具，用于处理文件和目录的路径。 可以使用以下方式访问它：

```js
const path = require('path');
```



>`path` 模块的默认操作会因 Node.js 应用程序运行所在的操作系统而异。 具体来说，当在 Windows 操作系统上运行时， `path` 模块会假定正被使用的是 Windows 风格的路径。

> 因此，使用 `path.basename()` 可能会在 POSIX 和 Windows 上产生不同的结果

> 如果要在任意操作系统上使用 Windows 文件路径时获得一致的结果，则使用 [`path.win32`](http://nodejs.cn/api/path.html#path_path_win32)：



**Path.join**

> `path.join()` 方法会将所有给定的 `path` 片段连接到一起（使用平台特定的分隔符作为定界符），然后规范化生成的路径。
>
> 长度为零的 `path` 片段会被忽略。 如果连接后的路径字符串为长度为零的字符串，则返回 `'.'`，表示当前工作目录。

```js
path.join('/目录1', '目录2', '目录3/目录4', '目录5', '..');
// 返回: '/目录1/目录2/目录3/目录4'

path.join('目录1', {}, '目录2');
// 抛出 'TypeError: Path must be a string. Received {}'
```



```js
__dirname 
// 返回: '/Users/saien/'

path.join(__dirname, "..", "a") 
// 返回： '/Users/a'

path.join(__dirname, "a", "b");
// 返回： '/Users/saien/a/b'


在windows电脑上盘符是右划线  '\Users\saien\a\b'
```



**Path.parse**

> `path.parse()` 方法会返回一个对象，其属性表示 `path` 的有效元素。 尾部的目录分隔符会被忽略



```js
path.parse(__filename)

返回
{
  root: '/',
  dir: '/Users/saien/devProject/share/koa/demo/小案例/04path',
  base: 'main.js',
  ext: '.js',
  name: 'main'
}
```



**Path.format**

> `path.format()` 方法从对象返回路径字符串。 与 [`path.parse()`](http://nodejs.cn/api/path.html#path_path_parse_path) 相反。

```js
const file = {
  root: "/",
  dir: "/Users/saien/devProject/share/koa/demo/小案例/04path",
  base: "main.js",
  ext: ".js",
  name: "main",
};

path.format(file);
// 返回：/Users/saien/devProject/share/koa/demo/小案例/04path/main.js
```





### url(URL)

> `url` 模块用于处理与解析 URL。 使用方法如下：

```js
const url = require('url');
```





### Assert(断言)





### crypto (加密)

> `crypto` 模块提供了加密功能，包括对 OpenSSL 的哈希、HMAC、加密、解密、签名、以及验证功能的一整套封装。

```js
const crypto = require('crypto');

function createMd5(str) {
  return crypto.createHash("md5").update(str).digest("hex");
}
createMd5("hello world!!");
// 570599d420acc25723b337b0db95c7c7
```



```js
const crypto = require('crypto');

const secret = 'abcdefg';
const hash = crypto.createHmac('sha256', secret)
                   .update('I love cupcakes')
                   .digest('hex');
console.log(hash);
// 打印:
//   c0fa1bc00531bd78ef38c628449c5102aeabd49b5dc3a2a516ea6ea959d6658e
```







### Stream(流)

https://www.cnblogs.com/tugenhua0707/p/10821768.html



流式读取一个文件的信息

```js
const fs = require('fs');
let read = fs.createReadStream('./1.txt');

read.setEncoding('utf8'); /* 这个东西要设置上，如果不设置上默认的是 toString() */

read.on('data',()=>{
    console.log('1');
});
read.on('end',()=>{
    console.log('读取结束');
});
```





把一个文件的内容写入到另外一个文件内

```js
const fs = require('fs');
const read = fs.createReadStream('./1.txt');
const write = fs.createWriteStream('./2.txt');
read.pipe(write);
```



read.resume

```js
read.resume();  //让流从停止状态变为流动状态
```



**原生stream**

```js
const Readable = require('stream').Readable;
const fs = require('fs');
const rs = new Readable();

const write = fs.createWriteStream('./3.txt');


rs.push('1');
rs.push('2');
rs.push(null);  // 关门 不能再push了 如果在也不push之后了就

// rs.pipe(process.stdout);

rs.pipe(write);

// rs.on('data',(chuck)=>{
//     console.log(chuck);
// });


```





### fs (文件系统)

> `fs` 模块使能够以一种模仿标准 POSIX 函数的方式与文件系统进行交互。

用来操作文件的

​	方法有2个，后面都可以加上后缀名 `Sync` 代表的是同步操作



要使用此模块：

```js
const fs = require('fs');
```

所有的文件系统操作都具有同步的、回调的、以及基于 promise 的形式。





**同步的示例**

> 同步的形式阻塞 Node.js 事件循环和进一步的 JavaScript 执行，直到操作是完成的。 异常是被立即地抛出，且可以被使用 `try…catch` 处理，或者可以被允许冒泡。

```js
const fs = require('fs');

try {
  fs.unlinkSync('/tmp/hello');
  console.log('/tmp/hello 已被成功地删除');
} catch (err) {
  // 处理错误

```



**回调的示例**

> 回调的形式把一个完成回调函数作为其最后一个参数，并且异步地调用该操作。 被传给完成回调的参数取决于方法，但是第一个参数总是被预留给一个异常。 如果操作被成功地完成，则第一个参数是 `null` 或 `undefined`。

```js
const fs = require('fs');

fs.unlink('/tmp/hello', (err) => {
  if (err) throw err;
  console.log('/tmp/hello 已被成功地删除');
});
```



**Promise 的示例**

> 基于 promise 的操作返回一个当异步的操作是完成的时被解决的 `Promise`。

```js
const fs = require('fs/promises');

(async function(path) {
  try {
    await fs.unlink(path);
    console.log(`${path} 已被成功地删除`);
  } catch (error) {
    console.error('有一个错误：', error.message);
  }
})('/tmp/hello');
```





**appendFile**

> 异步地追加数据到文件，如果文件尚不存在则创建文件。 `data` 可以是字符串或 [`Buffer`](http://nodejs.cn/api/buffer.html#buffer_buffer)。

```js
fs.appendFile('文件.txt', '追加的数据', (err) => {
  if (err) throw err;
  console.log('数据已被追加到文件');
});
```





`fs.mkdir` 创建文件夹

`fs.open` 异步的打开文件

`fs.opendir` 异步的打开文件目录

`fs.readFile` 异步地读取文件的全部内容

`rmdir`  删除文件夹

`unlik`  删除文件

`writeFile`  写入 (替换文件的内容)

`readdir` 读取文件夹信息

`rename` 重命名

.... 





### http模块

```js
const http = require('http')
const fs = require('fs')

const server = http.createServer(function(req, res) {
  fs.readFile(__dirname + '/data.txt', (err, data) => {
    res.end(data)
  })
})
server.listen(3000)
```

`readFile()` 读取文件的全部内容，并在完成时调用回调函数。

回调中的 `res.end(data)` 会返回文件的内容给 HTTP 客户端。

如果文件很大，则该操作会花费较多的时间。 以下是使用流编写的相同内容：



```js
const http = require('http')
const fs = require('fs')

const server = http.createServer((req, res) => {
  const stream = fs.createReadStream(__dirname + '/data.txt')
  stream.pipe(res)
})
server.listen(3000)
```



**发起一个http请求**

```js
var options = { 
 hostname: '127.0.0.1', 
 port: 1334, 
 path: '/', 
 method: 'GET' 
}; 
var req = http.request(options, function(res) { 
 console.log('STATUS: ' + res.statusCode); 
 console.log('HEADERS: ' + JSON.stringify(res.headers)); 
 res.setEncoding('utf8'); 
 res.on('data', function (chunk) { 
 console.log(chunk); 
 }); 
}); 
req.end();
```







### Buffer

> js对于字符串 (string) 的操作十分友好，无论是宽字节字符串还是单字节字符串，都被认为是一个字符串。



> 文件和网络 I/O对于前端而言都是不曾有的应用场景。但是在Node中，应用需要处理网络协议、操作数据库、处理图片、接收上传文件等，在网络流和文件的操作中，还要处理大量的二进制数据，JavaScript自有的字符串远远不能满足这些需求，于是Buffer对象应运而生。



由于 `Buffer` 太过常见，Node在进程启动时就已经加载了它，并将其放在全局对象 (global) 上。所以在使用 `Buffer` 时，无须通过 `require` 即可直接使用。



**字符串转 Buffer**

```js
Buffer.from("要转的字符串", [encoding])
```



**Buffer转字符串**

```js
buf.toString([encoding], [start], [end]);
```



**Buffer的拼接**

> Buffer 在使用场景中，通常是以一段一段的方式传输。以下是常见的从输入流中读取内容的示例代码

```js
const fs = require("fs");

const rs = fs.createReadStream("./public/1.txt");

let data = "";
rs.on("data", function (chunk) {
  console.log("流data触发");
  data += chunk;
});

rs.on("end", function () {
  console.log("end", data);
});
```

> 上面这段代码常见于国外，用于流读取的示范，data事件中获取chunk对象即是 Buffer 对象。对于初学者而言，容易将 Buffer 当做字符串来理解，所以在接受上面的示例时不会觉得有任何异常。
>
> 一旦输入流中有宽字节编码时，问题就会暴露出来。如果你在通过 Node 开发的网站上看到 乱码符号，那么该问题多半来自这里

```js 
data += chunk;

// 这句代码里隐藏了 toString() 操作，它等价于如下的代码。

data = data.toString() + chunk.toString()
```

> 值得注意的是，外国人的语境通常是指英文环境，在他们的场景下，这个 toString() 不会造成任何问题。但对于宽字节的中文，确会形成问题。为了重现这个问题，下面我们模拟近似的场景，将文件可读流的每次读取的 Buffer 长度限制为 11，代码如下

```js
const rs = fs.createReadStream("./public/1.txt", { highWaterMark: 11 });

<Buffer e5 ba 8a e5 89 8d e6 98 8e e6 9c>,
<Buffer 88 e5 85 89 ef bc 8c e7 96 91 e6>,
<Buffer 98 af e5 9c b0 e4 b8 8a e9 9c 9c>,
<Buffer e3 80 82 e4 b8 be e5 a4 b4 e6 9c>,
<Buffer 9b e6 98 8e e6 9c 88 ef bc 8c e4>,
<Buffer bd 8e e5 a4 b4 e6 80 9d e6 95 85>,
<Buffer e4 b9 a1 e3 80 82>

床前明��光，疑���地上霜。举头��明月，���头思故乡。
```

> 上文提到的 buf.toString() 方法默认是以 UTF-8 为编码，中文字在 UTF-8 下占 3 个字节。所以第一个 Buffer 对象在输出的时候，只能显示 3 个字符，Buffer 中剩下的 2 个字节 (6c 9c)将会以乱码的形式显示。第二个 Buffer 对象的第一个字节也不能形成文字，只能以乱码显示。于是形成一些文字无法正常显示的问题。
>
> 在这个示例中我们构造了11这个限制，但是对于任意长度的Buffer而言，宽字节字符串都有可能存在被截断的情况，只不过 Buffer 的长度越大出现的概率越低而已，但该问题依然不可忽视。





**Buffer的性能**

> Buffer在文件 I/O 和网络 I/O 中运用广泛，尤其在网络传输中，它的性能举足轻重。在应用中，我们通常会操作字符串，但一旦在网络中传输，都需要转换为 Buffer，以二进制数据传输。
>
> 在Web应用中，字符串转到Buffer是时时刻刻发生的，提高字符串到Buffer的转换效率，可以很大程度的提高网络吞吐率。





### 网络编程

> Node提供了 net、dgram、http、https这四个模块，分别用于处理 TCP、UDP、HTTP、HTTPS，适用于服务器端和客户端。



同样的https的模块

```js
tls

https
```





## [方便调试的一些模块]()

+ nodemon
+ pm2
+ chrome 调试 --inspect



### nodemon

我们在改写代码后需要在终端中 `ctrl + c` 将程序结束，然后再次 `node 程序文件名入口.js` 继续启动，这样频繁的操作对我们来说浪费时间和精力，使用此模块启动后，就有类似于开发 web 中热更新的作用，他会自动的再次执行我们的程序。

```js
npm install -g nodemon // 安装

nodemon [your node app]
```

  

### pm2

由于 Node.js 是单线程的，我们开发的程序不可避免的会在代码执行过程中出错，然后将整个应用程序中断，所以我们需要在程序中断后再次启动，但是我们不可以一直守着服务器看到服务中断后自己再去重新执行程序。

> 果直接通过 node app 来启动，如果报错了可能直接停止导致整个服务崩溃；

```undefined
1. pm2 是开源的基于Nodejs的进程管理器，包括守护进程、监控、日志的一整套完整的功能；
2. pm2 基本是node应用程序不二的守护进程选择；
3. 事实上，pm2并不仅仅可以启动node程序，对于一般的脚本程序同样可以胜任；
4. pm2 带有负载均衡功能，可以保持node应用进程永远运行在后台；
5. pm2 还有个非常强大的deploy功能，可以从本地直接部署线上网站。
```



```js
pm2 start app.js --name mynode：启动node，并指定进程名称为mynode
pm2 list // 查看当前使用pm2启动的服务列表
pm2 logs // 查看日志
```



使用一个例子来看一下。



### 使用谷歌浏览器调试

```
1. node --inspect app.js
2. 打开chrome浏览器
```



详细的可以查看阮一峰 [Node 调试工具入门教程](http://www.ruanyifeng.com/blog/2018/03/node-debugger.html)







## [常用的中间件]()

+ 路由中间件
+ 静态资源目录中间件
+ 











## [构建Web应用]()

+ 请求方法的判断
+ URL的路径解析
+ URL中查询字符串解析
+ Cookie的解析
+ Basic认证
+ 表单数据的解析
+ 任意格式文件的上传处理



### Web应用的基础

对于一个Web应用而言，仅仅只是上面这样的响应远远达不到业务的需求。在具体的业务中，我们可能有如下这些需求。











```js
微信小程序--云开发
```





## Node的一些基础知识



1. 全局变量

2. 模块的导入导出

3. 





#### V8的垃圾回收机制与内存限制





#### 单线程的弱点

+ 无法利用多核CPU
+ 错误会引起整个应用退出，应用的健壮性值得考验。
+ 大量的计算占用CPU导致无法继续调用异步 I/O。



#### 应用场景

+ I/O密集型

  socket.io 聊天

+ CPU密集型

  大量的计算、







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



#### 跨域





#### chorme浏览器调试



#### 接口鉴权。





## 模板引擎

服务端渲染、前后端分离

```js
ejs
jade

```







## 上传图片

**koa-multer**







## 操作数据库

### mysql

### mongodb

### redis









## 多个进程通讯



> Node的多进程之间如何通讯？







### 小案例



##### jsonp

##### 发送邮件

##### websocket  (参考ws模块)

##### github第三方登录

##### jwt接口认证
