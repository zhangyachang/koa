function middleWare1(ctx = {}) {
  console.log("第一层 - 开始");
  // await next();
  middleWare2(ctx);
  // const rt = ctx.response.get("X-Response-Time");
  console.log(`${ctx.method} ----------- ${ctx.url} ----------- `);
  console.log("第一层 - 结束");
}

function middleWare2(ctx) {
  console.log("第二层 - 开始");
  const start = Date.now();
  // await next();
  middleWare3(ctx);
  const ms = Date.now() - start;
  // ctx.set("X-Response-Time", `${ms}ms`);
  console.log("第二层 - 结束");
}
function middleWare3(ctx) {
  console.log("第三层 - 开始");
  ctx.body = "Hello World";
  console.log("第三层 - 结束");
}

middleWare1();
