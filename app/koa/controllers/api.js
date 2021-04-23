/**
 * 业务逻辑方法
 */

const list = [];

exports.getList = async (ctx) => {
  console.log(ctx.request.query);
  try {
    const result = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(list);
      }, 500);
    });

    ctx.body = {
      code: 0,
      data: result,
      msg: "ok",
    };
  } catch (e) {
    ctx.body = {
      code: -1,
      msg: "服务器繁忙，请稍后再试",
    };
  }
};

exports.addList = async (ctx) => {
  console.log(ctx.request.query);
  try {
    const result = await new Promise((resolve) => {
      setTimeout(() => {
        // resolve(list)
      }, 500);
    });

    ctx.body = {
      code: 0,
      data: result,
      msg: "ok",
    };
  } catch (e) {
    ctx.body = {
      code: -1,
      msg: "服务器繁忙，请稍后再试",
    };
  }
};

exports.addList = async (ctx) => {
  try {
    // console.log("增加");
    console.log(ctx.request.body);
    const { title, con } = ctx.request.body;
    list.push({
      title,
      con,
    });
    ctx.body = {
      code: 0,
      msg: "成功",
    };
  } catch (e) {
    ctx.body = {
      code: -1,
      msg: "服务器繁忙，请稍后再试",
    };
  }
};

exports.deleteList = async (ctx) => {};

exports.updateList = async (ctx) => {};
