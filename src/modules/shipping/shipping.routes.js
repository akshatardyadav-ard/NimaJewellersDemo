const router = require("express").Router();
const controller = require("./shipping.controller");
const auth = require("../../middlewares/auth.middleware");

router.get("/methods", controller.getMethods);
router.post("/calculate", auth, controller.calculate);

module.exports = router;
