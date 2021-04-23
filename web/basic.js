// Basic认证

var encode = function (username, password) {
  return Buffer.from(username + ":" + password).toString("base64");
};

function checkUser(user, pass) {
  if (user === "saien" && pass === "123456") {
    return true;
  }
  return false;
}

module.exports = function (req, res) {
  console.log("req", req);
  var auth = req.headers["authorization"] || "";
  var parts = auth.split(" ");
  var method = parts[0] || ""; // Basic
  var encoded = parts[1] || ""; // dXNlcjpwYXNz
  var decoded = Buffer.from(encoded, "base64").toString("utf-8").split(":");
  var user = decoded[0]; // user
  var pass = decoded[1]; // pass

  console.log("服务端接收到的用户名和密码", user, pass);

  if (!checkUser(user, pass)) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Secure Area"');
    res.writeHead(401);
    res.end();
  } else {
    // handle(req, res);
    res.end("Hello world!!");
  }
};
