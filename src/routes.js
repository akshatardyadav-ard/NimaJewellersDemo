const router = require("express").Router();

router.use("/api/auth", require("./modules/auth/auth.routes"));
router.use("/api/users", require("./modules/users/user.routes"));
router.use("/api/categories", require("./modules/categories/category.routes"));
router.use("/api/attributes", require("./modules/attributes/attribute.routes"));

module.exports = router;
