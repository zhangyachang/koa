exports.setting = function (req, res) {
  res.end("Hello world 自然映射");
};

exports.get = function (req, res, ...rest) {
  console.log(rest);
  res.end("user file .get", );
};
