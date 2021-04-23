console.log("delegates模块被导入");

const delegates = require("delegates");

const petShop = {
  dog: {
    name: "旺财",
    age: 1,
    sex: "猛汉",
    bar() {
      console.log("bar!");
    },
  },
};

console.log(petShop);

// 将内部对象 dog 的属性、函数
// 委托至暴露在外的 petShop 上
delegates(petShop, "dog").getter("name").setter("age").access("sex").method("bar");
console.log("petShop: ", petShop);

// 访问对象内部属性
// console.log(petShop.name);
console.log("111", petShop.age);

// 修改对象内部属性
petShop.age = 2;
console.log("修改后", petShop);

// 读取和设置
console.log("读取和设置", petShop.sex);
petShop.sex = "张三";
console.log("petShop.sex", petShop.sex);

// 可以调用方法
petShop.bar();
