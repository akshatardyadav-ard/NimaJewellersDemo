const router = require("express").Router();
const controller = require("./attribute.controller");
const auth = require("../../middlewares/auth.middleware");
const role = require("../../middlewares/role.middleware");

/* Public */
router.get("/", controller.getAll);
router.get("/values/:id", controller.getValues);

/* Admin */
router.post("/create", auth, role("ADMIN"), controller.create);
router.post("/map-product", auth, role("ADMIN"), controller.mapProduct);

module.exports = router;
