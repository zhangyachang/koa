# 构建Web应用

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



## 简述

```js
var http = require('http'); 
http.createServer(function (req, res) { 
 res.writeHead(200, {'Content-Type': 'text/plain'}); 
 res.end('Hello World\n'); 
}).listen(3000, '127.0.0.1'); 
console.log('Server running at http://127.0.0.1:3000/');
```



```js
// 对于浏览器中文乱码无法识别的是因为没有指定编码格式
res.writeHead(200, { "Content-Type": "text/plain;charset=utf-8;" });
```



当使用 response.setHeader() 设置响应头时，则与传给 response.writeHead() 的任何响应头合并，且 response.writeHead() 的优先。

```js
res.setHeader("Content-Type", "text/plain;charset=utf-8;");
```





对于一个Web应用而言，仅仅只是上面这样的响应远远达不到业务的需求。在具体的业务中，我们可能有如下这些需求。

* 请求方法的判断
* URL的路径解析
* URL中查询字符串解析
* Cookie的解析
* Basic认证
* 表单数据的解析
* 任意格式文件的上传处理

>除此之外，可能还需要 `Session`(会话)的需求。尽管 `Node`提供的底层 API 相对来说比较简单，但是要完成业务需求，还需要大量的工作，仅仅一个 `request` 事件似乎无法满足这些需求。但是要实现这些需求并非难事，一切的一切，都从如下这个函数展开。



```js
function (req, res) {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello world!");
}
```



我们都知道[高阶函数](https://baike.baidu.com/item/%E9%AB%98%E9%98%B6%E5%87%BD%E6%95%B0/506389?fr=aladdin) 我们的应用可能无限地复杂，但是只要最终返回一个上面的函数作为参数，传递给 `createServer()` 方法作为 `request` 事件的侦听器就可以了。



 我们在具体业务开始前，需要为业务预处理一些细节，这些细节将会挂载在 `req` 或 `res` 对象上，供业务代码使用。







## 请求方法的判断

> 在Web应用中，最常见的请求方法是 GET 和 POST，除此之外，还有 HEAD、DELETE、PUT、CONNECT等方法。请求方法存在于报文的第一行的第一个单词，通常是大写。

```http
GET / HTTP/1.1
Host: localhost:3000
Connection: keep-alive
Cache-Control: max-age=0
sec-ch-ua: "Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"
sec-ch-ua-mobile: ?0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: none
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9
```



---



**关于HTTP_Parser**

[源码](https://github.com/nodejs/http-parser)

[HTTP解析库http-parser简介及使用](HTTP解析库http-parser简介及使用)



HTTP_Parser 在解析请求报文的时候，将报文头抽取出来，设置为 `req.method`，通常我们只需处理 GET 和 POST 两类请求方法，但是RESETful类在Web服务中请求方法十分重要

+ GET 查询资源
+ POST 新增资源
+ PUT 更新资源
+ DELETE 删除资源



我们可以通过请求方法来决定响应行为。

```js
function create(req, res) {
  res.end("POST 方法 create资源");
}

function remove(req, res) {
  res.end("DELETE 方法 删除资源");
}

function update(req, res) {
  res.end("PUT 方法 更新资源");
}

function get(req, res) {
  res.end("GET 方法 查询资源");
}

function handleMethods(req, res) {
  switch (req.method) {
    case "POST":
      create(req, res);
      break;
    case "DELETE":
      remove(req, res);
      break;
    case "PUT":
      update(req, res);
      break;
    case "GET":
    default:
      get(req, res);
  }
}
```

上述代码根据请求方法将复杂的业务逻辑分发。





## URL路径解析

除了根据请求方法来进行分发外，最常见的请求判断莫过于路径的判断了。部分路径存在于报文的第一行的第二部分，如下所示：

```js
GET /path?a=1&b=2 HTTP/1.1
```

HTTP_Parser 将其解析为 `req.url` 。一般而言，完整的URL地址是这样的。

```js
http://user:pass@host.com:8080/p/a/t/h?query=string#hash
```

客户端代理（浏览器）会将这个地址解析成报文，将路径和查询部分放在报文第一行。需要注意的是，hash 部分会被丢弃，不会存在于报文的任何地方。

最常见的根据路径进行业务处理的应用是静态文件服务器，它会根据路径去查找磁盘中的文件，然后将其响应给客户端。

```js
const http = require("http");
const path = require("path");
const url = require("url");
const fs = require("fs");

const ROOT = path.join(__dirname, "..", "..", "public");
function handleFilePath(req, res) {
  var pathname = url.parse(req.url).pathname;
  console.log("这个");
  fs.readFile(path.join(ROOT, pathname), function (err, file) {
    if (err) {
      res.writeHead(404);
      res.end("找不到相关文件--");
      return;
    }
    res.writeHead(200);
    res.end(file);
  });
}
```





## URL中查询字符串解析

查询字符串位于路径之后，在地址栏中路径后 `?a=1&b=2` 字符串就是查询字符串。这个字符串会跟随在路径后，形成请求报文的第二部分。这部分内容经常需要为业务逻辑所用，Node 提供了 `querystring` 模块用于处理这部分数据。



```js
var url = require('url'); 
var querystring = require('querystring'); 
var query = querystring.parse(url.parse(req.url).query);
```



更简洁的方法是给 `url.parse()` 传递第二个参数

```js
var query = url.parse(req.url, true).query;
```



这些方法会将 `a=1&b=2` 解析为一个 `JSON` 对象

```js
{ a: '1', b: '2' }
```



在业务调用产生前，我们的中间件或者框架会将查询字符串转换，然后挂载在请求对象上供业务使用，如下所示：

```js
function (req, res) {
  req.query = url.parse(req.url, true).query;
  hande(req, res);
}
```

**注意：**要注意的点是，如果查询字符串中的键出现多次，那么它的值会是一个数组，如下所示：

```js
// foo=bar&foo=baz 
var query = url.parse(req.url, true).query; 
// { 
// foo: ['bar', 'baz'] 
// }
```

业务的判断一定要检查值是数组还是字符串，否则可能出现 TypeError 异常的情况。



…………感觉这种情况还是要看一下后台代码是如何对url参数进行解析的，是覆盖还是怎样处理。





## Cookie的解析

> 在Web应用中，请求路径和查询字符串对业务至关重要，通过它们已经可以进行很多业务操作了，但是HTTP是一个无状态的协议，现实中的业务却是需要一定的状态的，否则无法区分用户之间的身份。如果标识和认证一个用户，最早的方案就是 Cookie 了。



Cookie的处理分为如下几步

* 服务器向客户端发送Cookie
* 浏览器将Cookie保存
* 之后每次浏览器都会将Cookie发向服务器端。



HTTP_Parser 会将所有的报文字段解析到 `req.headers`上，那么Cookie就是 `req.headers.cookie`。根据规范中的定义，Cookie值的格式是 `key=value; key2=value2`形式的，如果我们需要Cookie，解析它也十分容易，如下所示：

```js
var parseCookie = function (cookie) {
  var cookies = {};
  if (!cookie) {
    return cookies;
  }
  var list = cookie.split(";");
  for (var i = 0; i < list.length; i++) {
    var pair = list[i].split("=");
    cookies[pair[0].trim()] = unescape(pair[1]);
  }
  return cookies;
};
```



在业务逻辑代码执行之前，我们将其挂载在 `req` 对象上，让业务代码可以直接访问，如下所示：

```js
function fn(req, res) {
  req.cookies = parseCookie(req.headers.cookie);
  hande(req, res);
}
```



这样我们的业务代码就可以进行判断处理了，如下所示

```js
var handle = function (req, res) {
  res.writeHead(200);
  if (!req.cookies.isVisit) {
    res.end("欢迎第一次访问");
  } else {
    // TODO
  }
};
```





任何请求报文中，如果Cookie值没有 `isVisit`，都会收到 `"欢迎第一次访问"`这样的响应。如果识别到用户没有访问过我们的站点，那么我们的站点是否应该告诉客户端已经访问过的标识呢？告知客户端的方式是通过响应报文实现的，响应的 Cookie 值在 `Set-Cookie`字段中。它的格式与请求中的格式不太相同，规范中对它的定义如下所示：

[Set-Cookie规范](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Set-Cookie)

```js
Set-Cookie: name=value; Path=/; Expires=Sun, 23-Apr-23 09:01:35 GMT; Domain=.domain.com;
```

其中 `name=value`是必须包含的部分，其余部分皆是可选参数。这些可选参数将会影响浏览器在后续将 Cookie 发送给服务端的行为。

+ path表示这个Cookie影响到的路径，当前访问的路径不满足该匹配时，浏览器则不发送这个Cookie。
+ Expire 和 Max-Age是用来告知浏览器这个 Cookie 何时过期的。如果不设置该选项，在关闭浏览器时会丢失掉这个Cookie。如果设置了过期时间，浏览器会把Cookie写入到磁盘中并保存，下次打开浏览器依旧有效。Expire的值是一个UTC格式的时间字符串，告知浏览器此Cookie何时将过期，Max-Age 则告知浏览器此Cookie多久后过期。前者一般而言不存在问题，但是如果服务端的时间和客户端的时间不能匹配，这种时间设置就会存在偏差。为此 Max-Age 告知浏览器这条 Cookie 多久之后过期，而不是一个具体的时间点。
+ HttpOnly 告知浏览器不允许通过脚本`document.cookie` 去更改这个 Cookie 值，事实上，设置 HttpOnly 之后，这个值在`document.cookie`中不可见。但是在 HTTP 请求的过程中，依然会发送这个Cookie到服务器端。
+ Secure 当 Secure 值为true时，在HTTP中是无效的，在HTTPS中才有效，表示创建这的 Cookie只能在HTTPS连接中被浏览器传递到服务端进行会话验证，如果HTTP连接则不会传递该信息，所以很难被且听到。



知道Cookie在报文头中的具体格式后，下面我们将Cookie序列化成符合规范的字符串，相关代码如下。

```js
var serialize = function (name, val, opt) {
  var pairs = [name + "=" + escape(val)];
  opt = opt || {};
  if (opt.maxAge) pairs.push("Max-Age=" + opt.maxAge);
  if (opt.domain) pairs.push("Domain=" + opt.domain);
  if (opt.path) pairs.push("Path=" + opt.path);
  if (opt.expires) pairs.push("Expires=" + opt.expires.toUTCString());
  if (opt.httpOnly) pairs.push("HttpOnly");
  if (opt.secure) pairs.push("Secure");
  return pairs.join("; ");
};
```

略改前文的访问逻辑，我们就能轻松地判断用户的状态了，如下所示：

```js
if (!req.cookies.isVisit) {
  res.setHeader("Set-Cookie", serialize("isVisit", "1", {
    httpOnly: true,
  }));
  res.writeHead(200);
  res.end("欢迎第一次访问");
} else {
  res.writeHead(200);
  res.end("欢迎再次访问!!");
}
```



客户端收到这个带 Set-Cookie 的响应后，在之后的请求时会在Cookie字段中带上这个值。

值得注意的是，Set-Cookie 是较少的，在报头中可能存在多个字段。为此 `res.setHeader` 的第二个参数可以是一个数组

```js
res.setHeader('Set-Cookie', [serialize('foo', 'bar'), serialize('baz', 'val')]);
```



---



Cookie对性能的影响

> 由于Cookie的实现机制，一旦服务器端向客户端发送了设置Cookie的意图，除非Cookie过期，否则客户端每次请求都会发送这些Cookie到服务器端，一旦设置的Cookie过多，将会导致报头较大。大多数的Cookie并不需要每次都用上，因为这会造成带宽的部分浪费。

* 减小Cookie的大小
* 为静态资源使用不同的域名
* 减少DNS查询





**js操作cookie**



**设置cookie**

```js
function setCookie(name, value, days) {
  // 设置cookie days设置过期时间 单位:天 不传默认是 cookie 在浏览器关闭时删除
  var exp = new Date();
  exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}
```

**获取cookie**

```js
function getCookie(name) {
  // 获取一个cookie
  var strCookie = document.cookie;
  var arr = strCookie.split(";");
  for (var i = 0; i < arr.length; i++) {
    var t = arr[i].split("=");
    if (t[0] == name) {
      return t[1];
    }
  }
  return null;
}
```

**删除cookie**

```js
function clearCookie(name) {
  setCookie(name, "", -1);
}
```





---



### Session

> 通过Cookie，浏览器和服务器可以实现状态的记录。但是Cookie并非是完美的，前面提到的体积过大就是一个显著的问题，最为严重的问题是Cookie可以在前后端进行修改，因此数据就极容易被篡改和伪造。如果服务器端有部分逻辑是根据Cookie中的 isVIP 字段进行判断，那么一个普通用户通过修改Cookie就可以轻松享受到 VIP 服务了。综上所述，Cookie对于敏感数据的保护是无效的。
>
> 为了解决Cookie敏感数据的问题，Session应运而生。Session的数据只保留在服务器端，客户端无法修改，这样数据的安全性得到一定的保障，数据也无须在协议中每次都被传递。







## Basic认证

> Basic认证是当客户端与服务端进行请求时，允许通过用户名和密码实现的一种身份认证方式。这里简要介绍它的原理和它在服务器端通过Node处理的流程。
>
> 如果一个页面需要Basic认证，它会检查请求报文头中的 `Authorization`字段的内容，该字段的值由认证方式和加密值构成，如下所示。

```js
> Authorization: Basic dXNlcjpwYXNz 
> User-Agent: curl/7.24.0 (x86_64-apple-darwin12.0) libcurl/7.24.0 OpenSSL/0.9.8r zlib/1.2.5 
> Host: www.baidu.com 
> Accept: */*
```

在Basic认证中，它会将用户和密码部分组合：`username` + `:` + `password` 。然后进行Base64编码，如下所示。

```js
var encode = function (username, password) {
  return new Buffer(username + ":" + password).toString("base64");
};
```

如果用户首次访问该网页，URL地址中也没携带认证内容，那么浏览器会响应一个 401 未授权的状态码，如下所示

```js
function (req, res) {
  var auth = req.headers["authorization"] || "";
  var parts = auth.split(" ");
  var method = parts[0] || ""; // Basic
  var encoded = parts[1] || ""; // dXNlcjpwYXNz
  var decoded = new Buffer(encoded, "base64").toString("utf-8").split(":");
  var user = decoded[0]; // user
  var pass = decoded[1]; // pass
  if (!checkUser(user, pass)) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Secure Area"');
    res.writeHead(401);
    res.end();
  } else {
    handle(req, res);
  }
}
```

上面的代码中，响应头中的 `WWW-Authenticate`字段告知浏览器采用什么样的认证和加密方式。一般而言，未认证的情况下，浏览器会弹出对话框进行交互式认证信息。



当认证通过后，服务器端响应 200 状态码之后，浏览器会保存用户名和密码口令，在后续的请求中都携带上 `Authorization`信息。



Basic认证有太多的缺点，它虽然经过 `Base64` 加密后在网络中传送，但是这近乎于明文，十分危险，一般只有在 HTTPS 的情况下才会使用。不过 Basic 认证的范围十分广泛，几乎所有的浏览器都支持它。

为了改进Basic认证，RFC 2069 规范提出了摘要访问认证，它加入了服务器端随机数来保护认证过程，在此不做深入的解释。





## 数据上传

> 上述的内容基本都集中在HTTP请求报文头中，适用于 GET 请求和大多数其他请求。头部报文中的内容已经能够让服务端进行大多数业务逻辑操作了，但是单纯的头部报文无法携带大量的数据，在业务中，我们往往需要接收一些数据，比如表单提交、文件提交、JSON上传、XML上传等。
>
> Node的http模块只对HTTP报文的头部进行了解析，然后触发 request 事件。如果请求中还带有内容部分（如POST请求、它具有报头和内容），内容部分需要用户自行接收和解析。通过报头的 `Transfer-Encoding` 或 `Content-Length`即可判断请求中是否带有内容。



```js
var hasBody = function (req) {
  return "transfer-encoding" in req.headers || "content-length" in req.headers;
};
```



在HTTP_Parser解析报文头结束后，报文内容部分会通过 data 事件触发，我们只需以流的方式处理即可。

```js
function (req, res) {
  if (hasBody(req)) {
    var buffers = [];
    req.on("data", function (chunk) {
      buffers.push(chunk);
    });
    req.on("end", function () {
      req.rawBody = Buffer.concat(buffers).toString();
      handle(req, res);
    });
  } else {
    handle(req, res);
  }
}
```

将接收到的 `Buffer`列表转化为一个 `Buffer`对象后，再转换为没有乱码的字符串，暂时挂置在 `req.rawBody`处。



### 表单数据

最为常见的数据提交就是通过网页表单提交数据到服务端，如下所示：

```js
<form action="/upload" method="post">
  <label for="username">Username:</label> <input type="text" name="username" id="username" />
  <br />
  <input type="submit" name="submit" value="Submit" />
</form>
```

默认的表单提交，请求头中的 `Content-Type`字段值为 `application/x-www-form-urlencoded`，如下所示:

```http
Content-Type: application/x-www-form-urlencoded
```

由于它的报文体内容跟查询字符串相同：

```js
foo=bar&baz=val
```

因此解析它十分容易

```js
var handle = function (req, res) {
  if (req.headers["content-type"] === "application/x-www-form-urlencoded") {
    req.body = querystring.parse(req.rawBody);
  }
  todo(req, res);
};
```

后续业务中直接访问 `req.body` 就可以得到表单中提交的数据。



### 其他格式

除了表单数据外，最常见的提交还有` JSON `和 `XML` 文件类型等，判断和解析他们的原理都比较相似，都是根据 `Content-Type` 中的值决定，其中 `JSON` 类型的值为 `applicaiton/json` ，`XML`的值为 `application/xml`。

需要注意的是，在Content-Type中可能还附带如下的编码信息：

```http
Content-Type: application/json; charset=utf-8
```

所以在做判断时，需要注意区分，如下所示：

```js
var mime = function (req) {
  var str = req.headers["content-type"] || "";
  return str.split(";")[0];
};
```



### JSON文件

如果客户端提交 `JSON` 内容，这对于 Node 来说，要处理它都不需要额外的任何库，如下所示：

```js
var handle = function (req, res) {
  if (mime(req) === "application/json") {
    try {
      req.body = JSON.parse(req.rawBody);
    } catch (e) {
      // 异常内容ǈ响应Bad request
      res.writeHead(400);
      res.end("Invalid JSON");
      return;
    }
  }
  todo(req, res);
};

```



### XML文件

解析XML文件稍微复杂一点，但是社区有支持 `XML` 文件到 `JSON` 对象转换的库，这里使用 `xml2js` 的库为例，如下所示：

```js
var xml2js = require("xml2js");
var handle = function (req, res) {
  if (mime(req) === "application/xml") {
    xml2js.parseString(req.rawBody, function (err, xml) {
      if (err) {
        // 异常内容，响应Bad request
        res.writeHead(400);
        res.end("Invalid XML");
        return;
      }
      req.body = xml;
      todo(req, res);
    });
  }
};
```

采用类似的方式，无论客户端提交的数据是什么格式，我们都可以通过这种方式来判断该数据是何种类型，然后采用对应的解析方法解析即可。



### 附件上传

除了常见的表单和特殊格式的内容提交外，还有一种比较独特的表单。通常的表单，其内容可以通过 `urlencoded`的方式编码内容形成报文体，再发送给服务器端，但是业务场景往往需要用户提交文件。在前端 `HTML`代码中，特殊表单与普通表单的差异在于该表单中可以含有 `file` 类型的控件，以及需要指定表单属性 `enctype` 为 `multipart/form-data`如下所示:

```html
<form action="/upload" method="post" enctype="multipart/form-data">
  <label for="username">Username:</label> <input type="text" name="username" id="username" /> 
  <label for="file">Filename:</label> <input type="file" name="file" id="file" />
  <br />
  <input type="submit" name="submit" value="Submit" />
</form>
```

浏览器在遇到 `multipart/form-data`表单提交时，构造的请求报文与普通表单完全不同。首先，它的报头中最为特殊的如下所示：

```http
Content-Type: multipart/form-data; boundary=AaB03x 
Content-Length: 18231
```

它代表本次提交的内容是由多部分构成的，其中 `boundary=AaB03x` 指定的是每部分内容的分界符，`AaB03x`是随机生成的一段字符串，报文体的内容将通过在它前面添加 `--` 进行分割，报文结束时在它前后都加上`--` 表示结束。另外，`Content-Type`的值必须确保是报文体的长度。

假设上面的表单选择了一个名为 `diveintonode.js` 的文件上传，并进行提交上传，那么生成的报文如下所示：

```http
--AaB03x\r\n 
Content-Disposition: form-data; name="username"\r\n 
\r\n 
Jackson Tian\r\n 
--AaB03x\r\n 
Content-Disposition: form-data; name="file"; filename="diveintonode.js"\r\n 
Content-Type: application/javascript\r\n 
\r\n 
 ... contents of diveintonode.js ... 
--AaB03x--
```

普通的表单控件的报文体如下所示：

```http
--AaB03x\r\n 
Content-Disposition: form-data; name="username"\r\n 
\r\n 
Jackson Tian\r\n
```

文件控件形成的报文如下所示：

```js
--AaB03x\r\n 
Content-Disposition: form-data; name="file"; filename="diveintonode.js"\r\n 
Content-Type: application/javascript\r\n 
\r\n 
 ... contents of diveintonode.js ...
```

一旦我们知晓报文是如何构成的，那么解析它就变得十分容易。值得注意的一点是，由于是文件上传，那么像普通表单、`JSON`或 `XML` 那样先接收内容再解析的方式将变得不可接受。接收大小未知的数据量时，我们需要十分谨慎，如下所示：

```js
function (req, res) {
  if (hasBody(req)) {
    var done = function () {
      handle(req, res);
    };
    if (mime(req) === "application/json") {
      parseJSON(req, done);
    } else if (mime(req) === "application/xml") {
      parseXML(req, done);
    } else if (mime(req) === "multipart/form-data") {
      parseMultipart(req, done);
    }
  } else {
    handle(req, res);
  }
}
```



这里我们将 req`这个流对象直接交给对应的解析方法，由解析方法自行处理上传的内容，或接收内容并保存在内存中，或流式处理掉。

这里要介绍的模块是 `formidable` 。它是基于流式处理解析报文，将接收到的文件写入到系统的临时文件夹中，并返回对应的路径，如下所示：

```js
var formidable = require("formidable");
function (req, res) {
  if (hasBody(req)) {
    if (mime(req) === "multipart/form-data") {
      var form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {
        req.body = fields;
        req.files = files;
        handle(req, res);
      });
    }
  } else {
    handle(req, res);
  }
}
```

 因此在业务逻辑中只要检查 `req.body` 和 `req.files` 中的内容即可。



## 数据上传与安全

> Node提供了相对底层的API，通过它构建各种各样的Web应用都是相对容易的，但是在Web应用中，不得不重视与数据上传相关的安全问题。由于Node与前端 JavaScript 的近缘性，前端 JavaScript甚至可以上传到服务器直接执行，但在这里我们并不讨论这样危险的动作，而是介绍内存和CSRF相关的安全问题。



### 内存限制

在解析表单、`JSON`、`XML` 部分，我们采取的策略是先保存用户提交的所有数据，然后再解析处理，最后才传递给业务逻辑。这种策略存在的潜在问题是，它仅仅适合数据量小的提交请求，一旦数据量过大，将发生内存被占光的情况。攻击者通过客户端能够十分容易地模拟伪造大量数据，如果攻击者每次提交 `1MB` 的内容，那么只要并发请求数量一大，内存就会很快地被吃光。

要解决这个问题主要有2个方案。

* 限制上传内容的大小，一旦超过限制，停止接收数据，并响应400状态码。
* 通过流式解析，将数据导向到磁盘中，Node只保留文件路径等小数据。

流式处理在文件`fs`模块中已经有所体现，这里介绍一下 `Connect` 中采用的上传数据量的限制方式，如下所示：

```js
var bytes = 1024;
function (req, res) {
  var received = 0;
  var len = req.headers["content-length"] ? parseInt(req.headers["content-length"], 10) : null;
  // 如果内容超过长度限制，返回请求体过长的状态码
  if (len && len > bytes) {
    res.writeHead(413);
    res.end();
    return;
  }
  // limit
  req.on("data", function (chunk) {
    received += chunk.length;
    if (received > bytes) {
      // 停止接收数据，触发 end
      req.destroy();
    }
  });
  handle(req, res);
}
```

从上面的代码中我们可以看到，数据是由包含 `Content-Type`的请求报文判断是否长度超过限制的，超过则直接响应 413 状态码。对于没有 `Content-Type`的请求报文，略微简略一点，在每个 `data`事件中判定即可。一旦超过限制值，服务器停止接收新的数据片段。如果是`JSON`文件或`XML`文件，极有可能无法完成解析。对于上线的 `Web`应用，添加一个上传大小限制十分有利于保护服务器，在遭遇攻击时，能镇定从容应对。



### CSRF

**注：**本次分享先不做这部分，后续再完善。

跨站请求伪造。 







## 路由解析

前文讲述了许多 Web 请求过程中的预处理过程，对于不同的业务，我们还是期望有不同的处理方式，这带来了路由的选择问题。后续将会介绍文件路径、MVC、RESETful等路由方式。



### 文件路径型

####  静态文件

> 这种方式的路径在路径解析的部分有过简单描述，其让人舒服的地方在于URL的路径与网站目录的路径一致，无须转换，非常直观。这种路由的处理方式也十分简单，将请求路径对应的文件发送给客户端即可。这在前文路径解析部分有介绍，不再重复。



#### 动态文件

> 在MVC模式流行起来之前，根据文件路径执行动态脚本也是基本的路由方式，它的处理原理是 Web 服务器，根据URL路径找到对应的文件，如 /index.asp 或 /index.php。Web服务器根据文件名后缀去寻找脚本的解析器，并传入 HTTP 请求的上下文。
>
> 以下是 Apache 中配置 PHP 支持的方式：
>
> AddType application/x-httpd-php .php 
>
> 解析器执行脚本，并输出响应报文，达到完成服务的目的。现今大多数的服务器都很智能地根据后缀同时服务动态和静态文件。这种方式在 Node 中不太常见，主要原因是文件的后缀名都是 `.js` ，分不清是后端脚本，还是前端脚本，这可不是什么好的设计。而且Node中Web服务器与应用业务脚本是一体的，无须按照这种方式实现。





#### MVC

在MVC流行之前，主流的处理方式都是通过文件路径进行处理的，甚至以为是常态。直到有一天开发者发现用户请求的URL路径原来可以跟具体脚本所在的路径没有任何关系。

MVC模型的主要思想是将业务逻辑按职责分离，主要分为以下几种。

* 控制器(Controller)，一组行为的集合。
* 模型(Model)，数据相关的操作和封装。
* 视图（View）,视图的渲染。

这是目前最为经典的分层模式，大致而言，它的工作模式如下说明。

* 路由解析，根据URL寻找对应的控制器和行为。
* 行为调用相关的模型，进行数据操作。
* 数据操作结束后，调用视图和相关数据进行页面渲染，输出到客户端。



![mvc](../../assets/mvc.png)



控制器如何调用模型和如何渲染页面，各种实现都大同小异。如何根据URL做路由映射，这里有两个分支实现。一种方式是通过手工关联映射，一种是自然关联映射。前者会有一个对应的路由文件来将URL映射到对应的控制器，后者没有这样的文件



##### 手工映射

```js
/user/setting 
/setting/user
```

这里假设已经拥有了一个处理设置用户信息的控制器，如下所示：

```js
exports.setting = function (req, res) {
  // TODO
};
```

再添加一个映射的方法就行，为了方便后续的行文，这个方法名叫 `use()`，如下所示：

```js
var routes = [];
var use = function (path, action) {
  routes.push([path, action]);
};
```

我们在入口程序中判断 `URL`，然后执行对应的逻辑，于是就完成了基本的路由映射过程，如下所示：

```js
function (req, res) {
  var pathname = url.parse(req.url).pathname;
  for (var i = 0; i < routes.length; i++) {
    var route = routes[i];
    if (pathname === route[0]) {
      var action = route[1];
      action(req, res);
      return;
    }
  }
  // 处理404请求
  handle404(req, res);
}
```

手工映射十分方便，由于它对URL十分灵活，所以我们可以将两个路径都映射到相同的业务逻辑，如下所示。

```js
use("/user/setting", exports.setting);
use("/setting/user", exports.setting);
// 甚至
use('/setting/user/jacksontian', exports.setting);
```





**正则匹配**

对于简单的路径，采用上述的硬匹配方式即可，但是如下的路径请求就完全无法满足需求了:

```js
/profile/jacksontian 
/profile/hoover
/profile/saien
```

这些请求需要根据不同的用户显示不同的内容，这里只有两个用户，假如系统中存在成千上万个用户，我们就不太可能去手工维护所有用户的路由请求，因此正则匹配应运而生，我们期望通过以下的方式就可以匹配到任意用户：

```js
use("/profile/:username", function (req, res) {
  // TODO
});
```

于是我们改进我们的匹配方式，在通过 `use` 注册路由时需要将路径转换成为一个正则表达式，然后通过它来进行匹配，如下所示：

```js
var pathRegexp = function (path) {
  path = path
    .concat(strict ? "" : "/?")
    .replace(/\/\(/g, "(?:/")
    .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g, function (_, slash, format, key, capture, optional, star) {
      slash = slash || "";
      return "" 
      + (optional ? "" : slash) 
      + "(?:" + (optional ? slash : "") 
      + (format || "") 
      + (capture || (format && "([^/.]+?)") || "([^/]+?)") + ")" 
      + (optional || "") 
      + (star ? "(/*)?" : "");
    })
    .replace(/([\/.])/g, "\\$1")
    .replace(/\*/g, "(.*)");
  return new RegExp("^" + path + "$");
};
```

上述的正则表达式十分复杂，总体而言，它能实现如下的匹配:

```js
/profile/:username => /profile/jacksontian, /profile/hoover 
/user.:ext => /user.xml, /user.json
```

现在我们重新改进注册部分。

```js
var use = function (path, action) {
  routes.push([pathRegexp(path), action]);
};
```

以及匹配部分：

```js
function (req, res) {
  var pathname = url.parse(req.url).pathname;
  for (var i = 0; i < routes.length; i++) {
    var route = routes[i];
    // 正则೅配
    if (route[0].exec(pathname)) {
      var action = route[1];
      action(req, res);
      return;
    }
  }
  // 处理404请求
  handle404(req, res);
}
```

现在我们的路由功能就能实现正则匹配了，无须再为大量的用户进行手工路由映射了。



**参数解析**

尽管完成了正则匹配，可以实现相似URL的匹配，但是 `:username`到底匹配了啥，还没有解决。为此我们还需要进一步将匹配到的内容抽取出来，希望在业务中能如下这样调用：

```js
use("/profile/:username", function (req, res) {
  var username = req.params.username;
  // TODO
});
```

这里的目标是将抽取的内容设置到 `req.params`处。那么第一步就是将键值抽取出来，如下所示：

```js
var pathRegexp = function(path) { 
  var keys = []; 
  path = path 
  .concat(strict ? '' : '/?') 
  .replace(/\/\(/g, '(?:/') 
  .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g, function(_, slash, format, key, capture, 
  optional, star){ 
  // 将೅配ڟ的॰ኵԍ存ഐઠ
  keys.push(key); 
  slash = slash || ''; 
  return '' 
  + (optional ? '' : slash) 
  + '(?:' 
  + (optional ? slash : '') 
  + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')' 
  + (optional || '') 
  + (star ? '(/*)?' : ''); 
  }) 
  .replace(/([\/.])/g, '\\$1') 
  .replace(/\*/g, '(.*)'); 
  return { 
  keys: keys, 
  regexp: new RegExp('^' + path + '$') 
  }; 
 }
```

我们将根据抽取的键值和实际的URL得到键值匹配到的实际值，并设置到 `req.params`处，如下所示：

```js
function (req, res) {
  var pathname = url.parse(req.url).pathname;
  for (var i = 0; i < routes.length; i++) {
    var route = routes[i];
    // 正则匹配
    var reg = route[0].regexp;
    var keys = route[0].keys;
    var matched = reg.exec(pathname);
    if (matched) {
      // 抽取具体值
      var params = {};
      for (var i = 0, l = keys.length; i < l; i++) {
        var value = matched[i + 1];
        if (value) {
          params[keys[i]] = value;
        }
      }
      req.params = params;
      var action = route[1];
      action(req, res);
      return;
    }
  }
  // 处理404请求
  handle404(req, res);
}
```

至此，我们除了从 查询字符串（`req.query`）或提交数据（`req.body`）中取到值外，还能从路由映射里取到值。



#### 自然映射

> 手工映射的优点在于路径可以很灵活，但是如果项目比较大，路由映射的数量也会很多。从前端路径到具体的控制器文件，需要进行查阅才能定位到实际代码的位置，为此有人提出，尽是路由不如无路由。实际上并非没有路由，而是路由按照一种约定的方式自然而然地实现了路由，而无须去维护路由映射。、

上文的路径解析部分对这种自然映射的实现有稍许介绍，简单而言，它将如下路径进行了划分处理：

```http
/controller/action/param1/param2/param3
```

以 `/user/setting/12/1987`为例，它会按照约定去找 `controllers` 目录下的 `user`文件，将其 `require` 出来后，调用这个文件模块的 `setting()`方法，而其余的值作为参数直接传递给这个方法。

```js
function (req, res) {
  var pathname = url.parse(req.url).pathname;
  var paths = pathname.split("/");
  var controller = paths[1] || "index";
  var action = paths[2] || "index";
  var args = paths.slice(3);
  var module;
  try {
    // require的缓存机制使ڥኻ有ڼᅃْ是阻塞的
    module = require("./controllers/" + controller);
  } catch (ex) {
    handle500(req, res);
    return;
  }
  var method = module[action];
  if (method) {
    method.apply(null, [req, res].concat(args));
  } else {
    handle500(req, res);
  }
}
```

由于这种自然映射的方式没有指明参数的名称，所以无法采用 `req.params`的方式提取，但是直接通过参数获取更简洁，如下所示：

```js
exports.setting = function (req, res, month, year) {
  // 如果路径为  /user/setting/12/1987，那么 month为12，year为1987
  // TODO
};
```

事实上手工映射也能将值作为参数进行传递，而不是通过 `req.params`。但是这个观点见仁见智，这里不做比较和讨论。

自然映射这种路由方式在 `PHP`的`MVC`框架 `CodeLgniter`中应用十分广泛，设计十分简洁，在`Node`中实现它也十分容易。与手工映射相比，如果 `URL` 变动，它的文件也需要发生变动，手工映射只需改动路由映射即可。





### RESTful

> MVC模式大行其道了很多年，直到 RESETful 的流行，大家才意识到 URL 也可以设计得很规范，请求方法也能作为逻辑分发的单元。



> REST的全称是 Representational State Transfer，中文含义为表现层状态转化。符合REST规范的设计，我们称为 RESTful 设计。它的设计哲学主要将服务器端提供的内容实体看作一个资源，并表现在 URL 上。

比如一个用户的地址如下所示：

```http
/users/jacksontian
```

这个地址代表了一个资源，对这个资源的操作，主要体现在 `HTTP`的请求方法上，不是体现在 URL 上。过去我们对用户的增删改查获取是如下这样设计 `URL`的：

```http
POST /user/add?username=jacksontian 

GET /user/remove?username=jacksontian 

POST /user/update?username=jacksontian 

GET /user/get?username=jacksontian
```

操作行为主要体现在行为上，主要使用的请求方法是 `POST` 和 `GET`。在 `RESTful`设计中，它是如下这样设计的。

```http
POST /user/jacksontian 

DELETE /user/jacksontian 

PUT /user/jacksontian 

GET /user/jacksontian
```

它将 `DELETE` 和 `PUT`请求方法引入设计中，参与资源的操作和更改资源的状态。

对于这个资源的具体表现形态，也不再如过去一样表现在 `URL`的文件后缀上。过去设计资源的格式与后缀有很大的关联，例如：

```js
GET /user/jacksontian.json 
GET /user/jacksontian.xml
```

在 `RESTful`设计中，资源的具体格式由请求报头中的 `Accept`字段和服务器端的支持情况来决定。如果客户端同时接受 `JSON` 和 `XML`格式的响应，那么它的 `Accept`字段值是如下这样的：

```js
Accept: application/json,application/xml
```

靠谱的服务器端应该要顾及这个字段，然后根据自己能响应的格式做出响应。在响应报文中，通过 `Content-Type`字段告知客户端是什么格式，如下所示：

```http
Content-Type: application/json
```

具体格式，我们称之为具体的表现。所以 `RESTful`设计就是，通过 `URL`设计资源、请求方法定义资源的操作，通过 `Accept`决定资源的表现形式。

`RESTful`与`MVC`设计并不冲突，而是更好的改进。相比 `MVC`,`RESTful`只是将 `HTTP` 请求方法也加入了路由的过程，以及在 `URL`路径上体现的更资源化。



**请求方法**

> 为了让Node能够支持 RESTful 需求，我们改进了我们的设计。如果 use 是对所有请求方法的处理，那么在 RESTful 的场景下，我们需要区分请求方法设计。示例如下所示。

```js
var routes = { all: [] };
var app = {};
app.use = function (path, action) {
  routes.all.push([pathRegexp(path), action]);
};
["get", "put", "delete", "post"].forEach(function (method) {
  routes[method] = [];
  app[method] = function (path, action) {
    routes[method].push([pathRegexp(path), action]);
  };
});
```



上面的代码添加了 `get()` 、`put()` 、`delete()`、`post()` 4个方法后，我们希望通过如下的方式完成路由映射：

```js
// 增加用户
app.post('/user/:username', addUser); 
// 删除用户
app.delete('/user/:username', removeUser); 
// 修改用户
app.put('/user/:username', updateUser); 
// 查询用户
app.get('/user/:username', getUser);
```

这样的路由能够识别请求方法，并将业务进行分发。为了让分发部分更简洁，我们先将匹配的部分抽取为 `match()`方法，如下所示：

```js
var match = function (pathname, routes) {
  for (var i = 0; i < routes.length; i++) {
    var route = routes[i];
    // 正则೅匹配
    var reg = route[0].regexp;
    var keys = route[0].keys;
    var matched = reg.exec(pathname);
    if (matched) {
      // 抽取具体值
      var params = {};
      for (var i = 0, l = keys.length; i < l; i++) {
        var value = matched[i + 1];
        if (value) {
          params[keys[i]] = value;
        }
      }
      req.params = params;
      var action = route[1];
      action(req, res);
      return true;
    }
  }
  return false;
};
```

然后改进我们的分发部分

```js
function (req, res) {
  var pathname = url.parse(req.url).pathname;
  // 将请求方法变为小写
  var method = req.method.toLowerCase();
  if (routes.hasOwnPerperty(method)) {
    // 根据请求方法分发
    if (match(pathname, routes[method])) {
      return;
    } else {
      // 如果路径没有匹配成功，尝试让 all() 来处理
      if (match(pathname, routes.all)) {
        return;
      }
    }
  } else {
    // 直接让all()来处理
    if (match(pathname, routes.all)) {
      return;
    }
  }
  // 处理404请求
  handle404(req, res);
}
```

至此，我们完成了实现 `RESTful` 支持的必要条件。这里的实现过程采用了手工映射的方法完成，事实上通过自然映射也能完成 `RESTful`的支持，但是根据 `Control/Action` 的约定必须要转化为 `Resource/Method`的约定，此处已经引出实现思路，不再详述。

目前 `RESTful`应用已经开始广泛起来，随着业务逻辑前端化、客户端的多样化，`RESTful`模式以其轻量的设计，得到广大开发者的青睐。对于多数的应用而言，只需要构建一套 `RESTful`服务接口，就能适应移动端、PC端的各种客户端应用。



### 中间件

> 片段式地接触完Web应用的基础功能和路由功能后，我们发现从响应 Hello World的示例代码到实际的项目，其实有太多琐碎的细节工作要完成，上述内容只是介绍了主要的部分。对于Web应用而言，我们希望不用接触到这么多细节性的处理，为此我们引入中间件(middleware)来简化和隔离这些基础设施与业务逻辑之间的细节，让开发者能够关注在业务的开发上，以达到提升开发效率的目录。



![middleware](../../assets/middleware.png)





好的，这里就不细细分析了，我们来使用并看一下Node的两个知名框架 [Express](https://github.com/expressjs/express)和 [Koa2](https://github.com/koajs/koa)的源码是如何做的。

