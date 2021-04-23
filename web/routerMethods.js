// 手工映射

const url = require("url");
const controller = require("./controllers/index");

var pathRegexp = function (path) {
  var keys = [];
  path = path
    // .concat(strict ? "" : "/?")
    .replace(/\/\(/g, "(?:/")
    .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g, function (_, slash, format, key, capture, optional, star) {
      // 将೅配ڟ的॰ኵԍ存ഐઠ
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

var routes = { all: [] };
var app = {};
app.use = function (path, action) {
  routes.all.push([pathRegexp(path), action]);
};
["get", "put", "delete", "post"].forEach(function (method) {
  routes[method] = [];
  app[method] = function (path, action) {
    routes[method].push([pathRegexp(path), action]);
  };
});

// 增加用户
app.post("/user/:username", controller.addUser);
// 删除用户
app.delete("/user/:username", controller.deleUser);
// 修改用户
app.put("/user/:username", controller.updateUser);
// 查询用户
app.get("/user/:username", controller.getUser);

var match = function (pathname, routes, req, res) {
  for (var i = 0; i < routes.length; i++) {
    var route = routes[i];
    // 正则೅匹配
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
      return true;
    }
  }
  return false;
};

module.exports = function (req, res) {
  var pathname = url.parse(req.url).pathname;
  // 将请求方法变为小写
  var method = req.method.toLowerCase();
  if (routes.hasOwnProperty(method)) {
    // 根据请求方法分发
    if (match(pathname, routes[method], req, res)) {
      return;
    } else {
      // 如果路径没有匹配成功，尝试让 all() 来处理
      if (match(pathname, routes.all, req, res)) {
        return;
      }
    }
  } else {
    // 直接让all()来处理
    if (match(pathname, routes.all, req, res)) {
      return;
    }
  }

  res.writeHead(404);
  res.end(404);
};
