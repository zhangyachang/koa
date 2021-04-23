const fork = require("child_process").fork;

const cpus = require("os").cpus();
console.log("cpus: ", cpus);

for (let i = 0; i < cpus.length; i++) {
  fork("./worker.js");
}
// const n = fork("./worker.js");

// n.on("message", function (msg) {
//   console.log("PARENT get MESSAGE" + JSON.stringify(msg));
// });

// n.send({ hello: "world" });
