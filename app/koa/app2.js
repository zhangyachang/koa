const Koa = require("koa");
const app = new Koa();

app.use(async (ctx, next) => {
  console.log("第一层 - 开始");
  await next();
  // await next();
  const rt = ctx.response.get("X-Response-Time");
  console.log(`${ctx.method} ----------- ${ctx.url} ----------- ${rt}`);
  console.log("第一层 - 结束");
});

// x-response-time
app.use(async (ctx, next) => {
  console.log("第二层 - 开始");
  const start = Date.now();
  // await next();
  const ms = Date.now() - start;
  ctx.set("X-Response-Time", `${ms}ms`);
  console.log("第二层 - 结束");
});

// response
app.use(async (ctx, next) => {
  console.log("第三层 - 开始");
  ctx.body = "Hello World";
  // await next();
  console.log("ctx", ctx);
  console.log("第三层 - 结束");
});

app.listen(3000);
