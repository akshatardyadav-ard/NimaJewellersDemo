const router = require("express").Router();
const controller = require("./order.controller");
const auth = require("../../middlewares/auth.middleware");

router.post("/checkout", auth, controller.checkout);
router.get("/my-orders", auth, controller.myOrders);
router.get("/:id", auth, controller.orderDetails);
router.post("/reorder/:id", auth, controller.reorder);
router.get("/track/:id", controller.track);

module.exports = router;
