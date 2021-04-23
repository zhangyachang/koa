// 流式读取一个文件的信息

const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "public", "a.txt");
const filePath2 = path.join(__dirname, "public", "b.txt");
const read = fs.createReadStream(filePath);
const write = fs.createWriteStream(filePath2);

read.pipe(write);
read.pipe(write);
read.pipe(write);

// read.setEncoding("utf-8");

// read.on("data", (chunk) => {
//   console.log("1");
//   console.log(chunk);
//   console.log(chunk.toString());
// });

// read.on("end", function () {
//   console.log("读取结束");
// });
