"use strict";

const querystring = require("querystring");
const path = require("path");
const fs = require("fs");
var sd = require("silly-datetime");
const formidable = require("formidable");

var hasBody = function (req) {
  return "transfer-encoding" in req.headers || "content-length" in req.headers;
};

var getMime = function (req) {
  var str = req.headers["content-type"] || "";
  return str.split(";")[0];
};

module.exports = function (req, res) {
  console.log("post内容解析");
  if (hasBody(req)) {
    const mime = getMime(req);
    if (mime === "multipart/form-data") {
      console.log("formData2");
      var form = new formidable({ multiples: false, uploadDir: path.join(__dirname, "upload") });
      form.parse(req, function (err, fields, files) {
        if (err) {
          throw err;
          res.end("fail ");
          return;
        }
        console.log("parse完成是怎么样的", fields, "files", files);
        req.body = fields;
        req.files = files;
        res.end("form data is done");

        //使用第三方模块silly-datetime
        var t = sd.format(new Date(), "YYYYMMDDHHmmss");
        //生成随机数
        var ran = parseInt(Math.random() * 8999 + 10000);
        //拿到扩展名
        var extname = path.extname(files.file.name);
        console.log("extname: ", extname);
        //旧的路径
        var oldpath = files.file.path;
        const newPath = path.join(__dirname, "upload", Date.now() + extname);
        // console.log('oldpath: ', oldpath);
        //新的路径
        // var newpath = __dirname + "/upload/" + t + ran + extname;
        // console.log('newpath: ', newpath);
        //改名

        fs.rename(oldpath, newPath, function (err) {
          if (err) {
            throw Error("改名失败");
          }
        });
      });
    } else {
      res.end("post is no formData");
    }
  } else {
    res.end("post is no data");
  }
};
