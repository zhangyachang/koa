const Router = require("koa-router");

const apiControl = require("../controllers/api");

const router = new Router({
  prefix: "/api/v1",
});

router.get("/list", apiControl.getList); // 通过
router.post("/list", apiControl.addList); // 增加list
router.put("/list", apiControl.updateList); // 更新list
router.delete("/list", apiControl.deleteList);

module.exports = router;
