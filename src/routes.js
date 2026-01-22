const router = require("express").Router();

router.use("/api/auth", require("./modules/auth/auth.routes"));
router.use("/api/users", require("./modules/users/user.routes"));

module.exports = router;
