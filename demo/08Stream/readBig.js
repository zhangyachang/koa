// 读取大文件
const fs = require("fs");
const path = require("path");
const http = require("http");

const filePath = path.join(__dirname, "public", "big.txt");
// readFile 它会把 big.txt的文件内容整个的读进以Buffer格式存入到内存中，然后再写进返回对象，
// 那么这样的效率非常低的，并且如果该文件如果是1G或2G以上的文件，那么内存会直接被卡死掉的。或者服务器直接会奔溃掉。
// const server = http.createServer(function (req, res) {
//   fs.readFile(filePath, (err, data) => {
//     if (err) throw err;
//     res.end(data);
//   });
// });

// 下面我们使用 Node中的createReadStream方法就可以避免占用内存多的情况发生。我们把app.js 代码改成如下所示：
// 可以看到我们的占用的内存只有12.8兆。也就是说：createReadStream 在读取大文件的过程中，不会一次性的读入到内存中。
// 每次只会读取数据源的一个数据块。这就是流的优点。下面我们来分别看下流吧。
const server = http.createServer(function (req, res) {
  console.log("res", res);
  const file = fs.createReadStream(filePath);
  file.pipe(res);
});

server.listen(3000, function () {
  console.log("3000服务端口启动成功");
});
