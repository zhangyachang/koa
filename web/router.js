// 手工映射

const url = require("url");

const controller = require("./controllers/index");

var routes = [];
var use = function (path, action) {
  routes.push([path, action]);
};

// --设置路由---
use("/user/setting", controller.setting);
use("/setting/user", controller.setting);
// 甚至
use("/setting/user/jacksontian", controller.setting);

module.exports = function (req, res) {
  var pathname = url.parse(req.url).pathname;
  for (var i = 0; i < routes.length; i++) {
    var route = routes[i];
    if (pathname === route[0]) {
      var action = route[1];
      action(req, res);
      return;
    }
  }

  res.writeHead(404);
  res.end("404");
};
