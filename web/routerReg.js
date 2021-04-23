// 手工映射
"use strict";
const url = require("url");
const model = require("./model/index");

var pathRegexp = function (path) {
  var keys = [];
  path = path
    // .concat(strict ? "" : "/?")
    .replace(/\/\(/g, "(?:/")
    .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g, function (_, slash, format, key, capture, optional, star) {
      keys.push(key);
      slash = slash || "";
      return "" + (optional ? "" : slash) + "(?:" + (optional ? slash : "") + (format || "") + (capture || (format && "([^/.]+?)") || "([^/]+?)") + ")" + (optional || "") + (star ? "(/*)?" : "");
    })
    .replace(/([\/.])/g, "\\$1")
    .replace(/\*/g, "(.*)");
  return {
    keys: keys,
    regexp: new RegExp("^" + path + "$"),
  };
};

var routes = [];
var use = function (path, action) {
  routes.push([pathRegexp(path), action]);
};

// --设置路由---
use("/user/setting", model.setting);
use("/setting/user", model.setting);
use("/setting/user/jacksontian", model.setting);

use("/profile/:username", model.profile);

console.log(typeof pathRegexp);

module.exports = function (req, res) {
  var pathname = url.parse(req.url).pathname;
  for (var i = 0; i < routes.length; i++) {
    var route = routes[i];
    var reg = route[0].regexp;
    var keys = route[0].keys;
    var matched = reg.exec(pathname);
    if (matched) {
      // 抽取具体值
      var params = {};
      for (var i = 0, l = keys.length; i < l; i++) {
        var value = matched[i + 1];
        if (value) {
          params[keys[i]] = value;
        }
      }
      req.params = params;
      var action = route[1];
      action(req, res);
      return;
    }
  }

  res.writeHead(404);
  res.end("404");
};
