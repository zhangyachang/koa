const path = require("path");

console.log(__dirname);

console.log(path.dirname(""));

const a = path.win32.basename("/Users/saien/devProject/share/koa/demo/小案例/04path/main.js", ".js");

console.log("a--->", a);
// /Users/saien/
// const joinPath = path.win32.join("/Users/saien/", "a", "b");
// console.log("joinPath: ", joinPath);

const type = path.parse(__filename);
const file = {
  root: "/",
  dir: "/Users/saien/devProject/share/koa/demo/小案例/04path",
  base: "main.js",
  ext: ".js",
  name: "main",
};
console.log(path.format(file));
