"use strict";

// // module.exports = {
// //   sex: "男",
// // };

// // console.log(exports === this);

// // exports = {
// //   a: 1,
// //   b: 2,
// // };

// exports.aaa = 111;
// module.exports = {
//   name: "张三",
//   a: 111,
// };

// console.log("requireb.js", require.main);
// // console.log("exports", exports);

console.log("b 开始");
exports.done = false;
const a = require("./a.js");
const a1 = require("./a.js");
console.log("在 b 中，a.done = %j", a.done);
exports.done = true;
console.log("b 结束");
