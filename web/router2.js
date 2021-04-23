// 手工映射

const url = require("url");

// const controller = require("./controller/index");

function handle500(req, res) {
  res.writeHead(500);
  res.end();
}

module.exports = function (req, res) {
  var pathname = url.parse(req.url).pathname;
  var paths = pathname.split("/");
  var controller = paths[1] || "index";
  var action = paths[2] || "index";
  var args = paths.slice(3);
  var module;

  try {
    // require的缓存机制使ڥኻ有ڼᅃْ是阻塞的
    module = require("./controllers/" + controller);
    console.log(module);
  } catch (ex) {
    handle500(req, res);
    return;
  }
  var method = module[action];
  if (method) {
    method.apply(null, [req, res].concat(args));
  } else {
    handle500(req, res);
  }
};
