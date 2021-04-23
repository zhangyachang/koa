const http = require("http");

http
  .createServer(function (req, res) {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Hello world!");
    process.send({ msg: "子进程向父进程传递消息" });
  })
  .listen(3000, "127.0.0.1");
// .listen(Math.round((1 + Math.random()) * 1000), "127.0.0.1");

// console.log('object')
process.on("message", function (msg) {
  console.log("Child get Message", msg);
});

// 0 null undefined false "" NaN
