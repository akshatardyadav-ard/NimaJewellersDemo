const router = require("express").Router();
const controller = require("./category.controller");
const auth = require("../../middlewares/auth.middleware");
const role = require("../../middlewares/role.middleware");

/* Public */
router.get("/", controller.getAll);

/* Admin */
router.post("/create", auth, role("ADMIN"), controller.create);
router.put("/:id", auth, role("ADMIN"), controller.update);
router.delete("/:id", auth, role("ADMIN"), controller.remove);

module.exports = router;
