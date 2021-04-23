"use strict";

const querystring = require("querystring");
var xml2js = require("xml2js");
var formidable = require("formidable");

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
    var buffers = [];
    req.on("data", function (chunk) {
      buffers.push(chunk);
    });
    req.on("end", function () {
      req.rawBody = Buffer.concat(buffers).toString();
      handleBody(req, res);
    });
  } else {
    res.end("post is no data");
  }
};

function handleBody(req, res) {
  console.log("req.headers", req.headers);
  console.log("req.rawBody -->");
  console.log(req.rawBody);

  const mime = getMime(req);
  console.log("mime: ", mime);
  if (mime === "application/x-www-form-urlencoded") {
    console.log("进来返回值了吗", req.rawBody);
    req.body = querystring.parse(req.rawBody);
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(req.body));
    return;
  } else if (mime === "application/json") {
    console.log(req.rawBody);
    res.setHeader("Content-Type", "application/json");
    try {
      req.body = JSON.parse(req.rawBody);
      res.end(JSON.stringify(req.body));
    } catch (e) {
      // 异常内容ǈ响应Bad request
      res.writeHead(400);
      res.end("Invalid JSON");
      return;
    }
  } else if (mime === "application/xml") {
    xml2js.parseString(req.rawBody, function (err, xml) {
      if (err) {
        // 异常内容，响应Bad request
        res.writeHead(400);
        res.end("Invalid XML");
        return;
      }
      req.body = xml;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(req.body));
      return;
    });
  } else if (mime === "multipart/form-data") {
    console.log("formData1");
    res.end("formData");
    // var form = new formidable({ multiples: true });
    // console.log("formData2");
    // form.parse(req, function (err, fields, files) {
    //   if (err) throw err;
    //   console.log("parse完成是怎么样的", fields, "files", files);
    //   req.body = fields;
    //   req.files = files;
    //   res.end("form data is done");
    //   // handle(req, res);
    // });
  } else {
    res.end("无法解析的格式");
  }
}
