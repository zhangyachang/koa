"use strict";
const url = require("url");
const path = require("path");
const fs = require("fs");

const ROOT = path.join(__dirname, "public");

// 路径有  a.js
// 1.html
// a/1.txt

module.exports = function (req, res) {
  var pathname = url.parse(req.url).pathname;
  console.log("pathname: ", pathname);

  // res.setHeader("Content-Type", "text/plain");
  // res.setHeader("Content-Type", "text/html;charset=utf-8");
  res.setHeader("Content-Type", "text/plain;charset=utf-8");

  fs.readFile(path.join(ROOT, pathname), function (err, file) {
    if (err) {
      res.writeHead(404);
      res.end("找不到相关文件--");
      return;
    }

    res.writeHead(200);
    res.end(file);
  });
};
