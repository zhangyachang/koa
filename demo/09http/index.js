// const http = require("http");
// const path = require("path");
// const url = require("url");
// const fs = require("fs");
// const querystring = require("querystring");

// function create(req, res) {
//   res.end("POST 方法 create资源");
// }

// function remove(req, res) {
//   res.end("DELETE 方法 删除资源");
// }

// function update(req, res) {
//   res.end("PUT 方法 更新资源");
// }

// function get(req, res) {
//   res.end("GET 方法 查询资源");
// }

// const ROOT = path.join(__dirname, "..", "..", "public");
// function handleFilePath(req, res) {
//   var pathname = url.parse(req.url).pathname;
//   console.log("这个");
//   fs.readFile(path.join(ROOT, pathname), function (err, file) {
//     if (err) {
//       res.writeHead(404);
//       res.end("找不到相关文件--");
//       return;
//     }
//     res.writeHead(200);
//     res.end(file);
//   });
// }

// function handleMethods(req, res) {
//   switch (req.method) {
//     case "POST":
//       create(req, res);
//       break;
//     case "DELETE":
//       remove(req, res);
//       break;
//     case "PUT":
//       update(req, res);
//       break;
//     case "GET":
//     default:
//       get(req, res);
//   }
// }

// var parseCookie = function (cookie) {
//   var cookies = {};
//   if (!cookie) {
//     return cookies;
//   }
//   var list = cookie.split(";");
//   for (var i = 0; i < list.length; i++) {
//     var pair = list[i].split("=");
//     cookies[pair[0].trim()] = unescape(pair[1]);
//   }
//   return cookies;
// };

// var serialize = function (name, val, opt) {
//   var pairs = [name + "=" + escape(val)];
//   opt = opt || {};
//   if (opt.maxAge) pairs.push("Max-Age=" + opt.maxAge);
//   if (opt.domain) pairs.push("Domain=" + opt.domain);
//   if (opt.path) pairs.push("Path=" + opt.path);
//   if (opt.expires) pairs.push("Expires=" + opt.expires.toUTCString());
//   if (opt.httpOnly) pairs.push("HttpOnly");
//   if (opt.secure) pairs.push("Secure");
//   return pairs.join("; ");
// };

// function handleReq(req, res) {
//   res.setHeader("Content-Type", "text/plain;charset=utf-8;");
//   // console.log("req", req);
//   req.query = url.parse(req.url, true).query;

//   console.log("解析cookie", parseCookie(req.headers.cookie));
//   req.cookies = parseCookie(req.headers.cookie);

//   console.log("req,", req);
//   if (!req.cookies.isVisit) {
//     res.setHeader("Set-Cookie", [serialize("isVisit", "1"), serialize("name", "张三"), serialize("name1", "222")]);
//     res.writeHead(200);
//     res.end("欢迎第一次访问");
//   } else {
//     res.writeHead(200);
//     res.end("欢迎再次访问!!");
//   }
//   // handleFilePath(req, res);
// }
// http.createServer(handleReq).listen(3000, "127.0.0.1");
// console.log("Server running at http://127.0.0.1:3000/");

// var handle = function (req, res) {
//   res.writeHead(200);
//   if (!req.cookies.isVisit) {
//     res.end("欢迎第一次访问");
//   } else {
//     // TODO
//   }
// };

// function clearCookie(name) {
//   setCookie(name, "", -1);
// }

// var encode = function (username, password) {
//   return Buffer.from(username + ":" + password).toString("base64");
// };

// var handle = function (req, res) {
//   if (req.headers["content-type"] === "application/x-www-form-urlencoded") {
//     req.body = querystring.parse(req.rawBody);
//   }
//   todo(req, res);
// };

// var mime = function (req) {
//   var str = req.headers["content-type"] || "";
//   return str.split(";")[0];
// };

// // var handle = function (req, res) {
// //   if (mime(req) === "application/json") {
// //     try {
// //       req.body = JSON.parse(req.rawBody);
// //     } catch (e) {
// //       // 异常内容ǈ响应Bad request
// //       res.writeHead(400);
// //       res.end("Invalid JSON");
// //       return;
// //     }
// //   }
// //   todo(req, res);
// // };

// var xml2js = require("xml2js");
// var handle = function (req, res) {
//   if (mime(req) === "application/xml") {
//     xml2js.parseString(req.rawBody, function (err, xml) {
//       if (err) {
//         // 异常内容ǈ响应Bad request
//         res.writeHead(400);
//         res.end("Invalid XML");
//         return;
//       }
//       req.body = xml;
//       todo(req, res);
//     });
//   }
// };

const http = require("http");

console.log("http模块", http);
const server = http.createServer(function (req, res) {
  res.setHeader("Content-Type", "text/plain;charset=utf-8;");
  res.end("Hello world!!");
});
console.log("server", server);
server.listen(3000, function () {
  console.log("3000端口服务启动成功");
});
