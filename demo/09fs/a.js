const fs = require("fs");

try {
  const result = fs.unlinkSync("./1.txt");
  console.log("删除结果", result);
  console.log("文件已经被成功删除");
} catch (e) {
  console.log("删除文件报错了", e);
}
