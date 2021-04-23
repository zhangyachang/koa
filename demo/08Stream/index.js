// 流式读取一个文件的信息

const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "public", "1.txt");
let read = fs.createReadStream(filePath);

read.setEncoding("utf-8");

read.on("data", (chunk) => {
  console.log("1");
  console.log(chunk);
  console.log(chunk.toString());
});

read.on("end", function () {
  console.log("读取结束");
});

// 执行a.js文件的内容信息
require("./a");
