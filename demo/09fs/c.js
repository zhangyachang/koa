// 文件描述符

const fs = require("fs");

fs.open("./1.txt", "r", (err, fd) => {
  if (err) throw err;
  fs.fstat(fd, (err, stat) => {
    if (err) throw err;
    // 使用文件属性。
    console.log(stat, "stat");
    // 始终关闭文件描述符！
    console.log("fd", fd);
  });
});

// fs.close(fd, (err) => {
//   if (err) throw err;
// });
