// 逻辑
exports.setting = async function (req, res) {
  const result = await new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        msg: "成功",
      });
    }, 2000);
  });

  res.end(JSON.stringify(result));
};

exports.profile = async function (req, res) {
  console.log("正则匹配的部分", req.params);
  res.end("Hello world!");
};

exports.addUser = function (req, res) {
  console.log("新增用户");
  res.end("add User");
};

exports.deleUser = function (req, res) {
  console.log("新增用户");
  res.end("delete User");
};

exports.updateUser = function (req, res) {
  console.log("新增用户");
  res.end("update User");
};

exports.getUser = function (req, res) {
  res.end("get User");
};
