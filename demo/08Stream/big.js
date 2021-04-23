// 我们来创建一个大文件

const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "public", "big.txt");
const file = fs.createWriteStream(filePath);

// 循环500万次
for (let i = 0; i <= 5000000; i++) {
  file.write("我是空智，我来测试一个大文件, 你看看我会有多大?");
}

file.end();
