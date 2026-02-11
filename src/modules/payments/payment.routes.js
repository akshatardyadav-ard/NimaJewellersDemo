const router = require("express").Router();
const controller = require("./payment.controller");
const auth = require("../../middlewares/auth.middleware");

router.post("/initiate", auth, controller.initiate);
router.post("/callback", controller.callback); // Gateway webhook
router.get("/status/:orderId", auth, controller.status);

module.exports = router;
