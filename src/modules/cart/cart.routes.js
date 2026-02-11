const router = require("express").Router();
const controller = require("./cart.controller");
const auth = require("../../middlewares/auth.middleware");

router.get("/", auth, controller.getCart);
router.post("/add", auth, controller.addToCart);
router.put("/update/:id", auth, controller.updateItem);
router.delete("/remove/:id", auth, controller.removeItem);

module.exports = router;
