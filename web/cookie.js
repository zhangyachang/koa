//

// 解析cookie
var parseCookie = function (cookie) {
  var cookies = {};
  if (!cookie) {
    return cookies;
  }
  var list = cookie.split(";");
  for (var i = 0; i < list.length; i++) {
    var pair = list[i].split("=");
    cookies[pair[0].trim()] = unescape(pair[1]);
  }
  return cookies;
};

var serialize = function (name, val, opt) {
  var pairs = [name + "=" + escape(val)];
  opt = opt || {};
  if (opt.maxAge) pairs.push("Max-Age=" + opt.maxAge);
  if (opt.domain) pairs.push("Domain=" + opt.domain);
  if (opt.path) pairs.push("Path=" + opt.path);
  if (opt.expires) pairs.push("Expires=" + opt.expires.toUTCString());
  if (opt.httpOnly) pairs.push("HttpOnly");
  if (opt.secure) pairs.push("Secure");
  return pairs.join("; ");
};

module.exports = function (req, res) {
  res.setHeader("Content-Type", "application/json;charset=utf-8");
  console.log("req: ", req);
  req.cookies = parseCookie(req.headers.cookie);
  console.log("解析后的", req.cookies);
  if (req.url === "/setCookie") {

    // 设置多个cookie的例子
    // res.setHeader('Set-Cookie', [serialize('foo', 'bar'), serialize('baz', 'val')]);
    
    if (!req.cookies.isVisit) {
      res.setHeader("Set-Cookie", serialize("isVisit", "1", {
        httpOnly: true,
      }));
      
      res.writeHead(200);
      res.end("欢迎第一次访问");
    } else {
      res.writeHead(200);
      res.end("欢迎再次访问!!");
    }
  } else {
    res.end(JSON.stringify(req.cookies));
  }
};
