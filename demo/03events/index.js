// const EventEmitter = require("events");

// const myEmitter = new EventEmitter();
// // myEmitter.setMaxListeners(100);
// myEmitter.on("event", (data) => {
//   console.log("触发事件");
// });
// myEmitter.on("event1", (data) => {
//   console.log("触发事件111111");
// });
// myEmitter.on("event", (data) => {
//   console.log("触发事件");
// });
// myEmitter.on("event", (data) => {
//   console.log("触发事件");
// });
// myEmitter.on("event", (data) => {
//   console.log("触发事件");
// });
// myEmitter.on("event", (data) => {
//   console.log("触发事件");
// });

// myEmitter.emit("event");

// myEmitter.emit("event11", new Error("错误信息"));

// myEmitter.emit("event1");
// myEmitter.emit("event1");
// myEmitter.emit("event1");
// myEmitter.emit("event1");
// myEmitter.emit("event1");
// myEmitter.emit("event1");
// myEmitter.emit("event1");

// console.log("myEmitter.getMaxListeners()", myEmitter.getMaxListeners());

const EventEmitter = require("events");

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on("event", () => {
  console.log("触发事件");
});
myEmitter.emit("event");
myEmitter.emit("event");
