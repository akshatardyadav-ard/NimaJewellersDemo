const router = require("express").Router();

router.use("/api/auth", require("./modules/auth/auth.routes"));

module.exports = router;
