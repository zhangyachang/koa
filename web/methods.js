"use strict";

function create(req, res) {
  res.end(
    JSON.stringify({
      code: 0,
      msg: "POST 方法 create资源",
    })
  );
}

function remove(req, res) {
  res.end(
    JSON.stringify({
      code: 0,
      msg: "DELETE 方法 删除资源",
    })
  );
}

function update(req, res) {
  res.end(
    JSON.stringify({
      code: 0,
      msg: "PUT 方法 更新资源",
    })
  );
}

function get(req, res) {
  res.end(
    JSON.stringify({
      code: 0,
      msg: "GET 方法 查询资源",
    })
  );
}
module.exports = function (req, res) {
  // res.setHeader("Access-Control-Allow-Origin", "*");
  // res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE");
  // res.setHeader(200, { "Content-Type": "text/html" });
  res.writeHead(200, { "Content-Type": "text/plain;charset=utf-8;" });

  console.log("req", req);
  console.log("res", res);
  // res.end("请求方法的判断");
  switch (req.method) {
    case "POST":
      create(req, res);
      break;
    case "DELETE":
      remove(req, res);
      break;
    case "PUT":
      update(req, res);
      break;
    case "GET":
    default:
      get(req, res);
  }
};
