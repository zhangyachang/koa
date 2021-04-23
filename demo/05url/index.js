const myURL = new URL("https://user:pass@sub.host.com:8080/p/a/t/h?query=string&a=b#hash");

console.log("myURL", myURL);

// const url = require("url");
// console.log("url: ", url);

const querystring = require("querystring");
const params = querystring.parse("query=string&a=b");
console.log("params: ", params);
// console.log("myURL1: ", myURL1);

// const result = qs.parse(myURL1.query);
// console.log("result: ", result);

// // const obj = u("?a=1&name=张三");
// console.log("obj: ", obj);

// const url = require("url");
// url.parse("?a=1&b=2", true).query;
