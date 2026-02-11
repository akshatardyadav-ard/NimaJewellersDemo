const router = require("express").Router();
const controller = require("./product.controller");

/* Public */
router.get("/", controller.getAll);
router.get("/search", controller.search);
router.post("/filter", controller.filter);
router.post("/compare", controller.compare);
router.get("/:id", controller.getById);

module.exports = router;
