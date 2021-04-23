const fs = require("fs");

const msg = "追加的内容\n";
fs.appendFile("./1.txt", msg, (err, data) => {
  if (err) {
    throw err;
  }
  console.log("data", data);
});
