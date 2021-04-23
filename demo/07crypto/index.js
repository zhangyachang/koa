const crypto = require("crypto");

function createMd5(str) {
  return crypto.createHash("md5").update(str).digest("hex");
}
console.log(createMd5("hello world!!"));
console.log(createMd5("hello world!!"));
