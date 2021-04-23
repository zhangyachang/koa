"use strict";

const url = require("url");

module.exports = function (req, res) {
  req.query = url.parse(req.url, true).query;
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(req.query));
};
