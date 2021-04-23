# Koa

Koa 通过 node.js 实现了一个十分具有表现力的 HTTP 中间件框架，力求让 Web 应用开发和 API 使用更加地愉快。Koa 的中间件之间按照编码顺序在栈内依次执行，允许您执行操作并向下传递请求（downstream），之后过滤并逆序返回响应（upstream）。

几乎所有 HTTP 服务器通用的方法都被直接集成到 Koa 大约570行源码的代码库中。其中包括内容协商，节点不一致性的规范化，重定向等等操作。

Koa没有捆绑任何中间件。



> **koa2**是由 Express 原班人马打造的，致力于成为一个更小、更富有表现力、更健壮的 Web 框架。 使用 koa 编写 web 应用，可以免除重复繁琐的回调函数嵌套， 并极大地提升错误处理的效率。koa 不在内核方法中绑定任何中间件， 它仅仅提供了一个轻量优雅的函数库，使得编写 Web 应用变得得心应手。开发思路和express差不多，最大的特点就是可以避免异步嵌套。



> **koa2**利用ES7的async/await特性，极大的解决了我们在做nodejs开发的时候异步给我们带来的烦恼。





## 通过结果分析一个Koa的洋葱模型

```js
const Koa = require("koa");
const app = new Koa();

app.use(async (ctx, next) => {
  console.log("第一层 - 开始");
  await next();
  const rt = ctx.response.get("X-Response-Time");
  console.log(`${ctx.method} ----------- ${ctx.url} ----------- ${rt}`);
  console.log("第一层 - 结束");
});

// x-response-time
app.use(async (ctx, next) => {
  console.log("第二层 - 开始");
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set("X-Response-Time", `${ms}ms`);
  console.log("第二层 - 结束");
});

// response
app.use(async (ctx) => {
  console.log("第三层 - 开始");
  ctx.body = "Hello World";
  console.log("第三层 - 结束");
});

app.listen(3000);

```

一个请求发过来之后的结果是

```js
第一层 - 开始
第二层 - 开始
第三层 - 开始
第三层 - 结束
第二层 - 结束
POST ----------- /api/v1/list ----------- 3ms
第一层 - 结束
```



我们可以分析得出，调用 `next()` 的时候回调用下一个`use`的函数代码。

**假如我们想实现这样的功能应该如何做呢**



```js
function middleWare1(ctx = {}) {
  console.log("第一层 - 开始");
  // await next();
  middleWare2(ctx);
  // const rt = ctx.response.get("X-Response-Time");
  console.log(`${ctx.method} ----------- ${ctx.url} ----------- `);
  console.log("第一层 - 结束");
}

function middleWare2(ctx) {
  console.log("第二层 - 开始");
  const start = Date.now();
  // await next();
  middleWare3(ctx);
  const ms = Date.now() - start;
  // ctx.set("X-Response-Time", `${ms}ms`);
  console.log("第二层 - 结束");
}
function middleWare3(ctx) {
  console.log("第三层 - 开始");
  ctx.body = "Hello World";
  console.log("第三层 - 结束");
}

middleWare1();
```

得到的执行结果其实是一致的。

```js
第一层 - 结束
第一层 - 开始
第二层 - 开始
第三层 - 开始
第三层 - 结束
第二层 - 结束
undefined ----------- undefined ----------- 
第一层 - 结束
```



![img](https://www.itying.com/koa/data/news/image/20180406/20180406134220_35560.png)







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





koa中的中间件本质上就是一个async函数，形如：

```js
async (ctx, next) => {
  await next();
}
```

该函数接受两个参数，ctx和next，ctx即为application的context属性，其封装了req和res；next函数用于将程序控制权交个下一个中间件。 通过koa应用实例的use函数，可以将中间件加入到koa实例的middleware数组中。 当node服务启动的时候，会通过koa-compose的compose函数，将middleware数组组织成一个fn对象。 当有请求访问时，会调用callback函数内部的handleRequest函数，该函数主要做两件事:

* 根据req和res创建context对象；
* 执行koa实例的handleRequest函数（注意区分两个handleRequest函数）； koa实例的handleRequest函数通过其最后一行代码，开启了中间件函数的洋葱式调用。

```js
const server = http.createServer(this.callback());
callback() {
    const fn = compose(this.middleware);

    if (!this.listeners('error').length) this.on('error', this.onerror);

    const handleRequest = (req, res) => {
      const ctx = this.createContext(req, res);
      return this.handleRequest(ctx, fn);
    };

    return handleRequest;
  }
handleRequest(ctx, fnMiddleware) {
    const res = ctx.res;
    res.statusCode = 404;
    const onerror = err => ctx.onerror(err);
    const handleResponse = () => respond(ctx);
    onFinished(res, onerror);
    return fnMiddleware(ctx).then(handleResponse).catch(onerror);
  }
```





















### Koa-Compose

```js
'use strict'

/**
 * Expose compositor.
 */

module.exports = compose

/**
 * Compose `middleware` returning
 * a fully valid middleware comprised
 * of all those which are passed.
 *
 * @param {Array} middleware
 * @return {Function}
 * @api public
 */

function compose (middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */

  [middleware1, middleware2, middleware3]
  return function (context, next) {
    // last called middleware #
    let index = -1
    return dispatch(0)
    function dispatch (i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
```





