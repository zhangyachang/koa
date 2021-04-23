const fs = require("fs/promises");

(async function (path) {
  try {
    await fs.unlink(path);
    console.log(`${path} 已被成功地删除`);
  } catch (error) {
    console.log("error: ", error);
    // console.dir(error);
    console.error("有一个错误：", error.message);
  }
})("/tmp/hello");

setInterval(() => {}, 10000);
