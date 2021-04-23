var http = require("http");

// 请求方法的判断
// const handle = require("./methods");

// URL路径解析
// const handle = require("./url");

// URL中的查询字符串
// const handle = require("./searchUrl");

// cookie的解析与响应
// const handle = require("./cookie");

//Basic的认证简单演示
// const handle = require('./basic');

// POST数据解析
// const handle = require("./post");

// FORMData 数据解析
// const handle = require("./postFormData");

// 路由解析 -- 手工映射
// const handle = require("./router");

// 路由解析 -- 正则
// const handle = require("./routerReg");

// 自然映射
// const handle = require("./router2");

// 路由请求方法解析
const handle = require("./routerMethods");

// http
//   .createServer(function (req, res) {
//     res.writeHead(200, { "Content-Type": "text/plain" });
//     methodsHandle(req, res);
//     // res.end("Hello World\n");
//   })
//   .listen(3000, "127.0.0.1");

const server = http.createServer(handle);

server.listen(3000, "127.0.0.1");

console.log("Server running at http://127.0.0.1:3000/");
