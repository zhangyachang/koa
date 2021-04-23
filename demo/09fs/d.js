const fs = require("fs");
// { encoding: "buffer" },
let i = 0;
fs.watch("./1.txt", (eventType, filename) => {
  if (filename) {
    console.log(filename, eventType);
    // console.log(filename.toString("utf-8"));
    // 打印: <Buffer ...>
    i++;
    console.log("i", i);
    if (i === 3) {
      fs.close("", (err, data) => {
        console.log("err", err);
        if (err) {
          throw err;
        }
        console.log("data", data);
      });
    }
    // fs.close()
  }
});
