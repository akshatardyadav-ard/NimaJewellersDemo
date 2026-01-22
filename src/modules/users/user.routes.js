const router = require("express").Router();
const userController = require("./user.controller");
const auth = require("../../middlewares/auth.middleware");

router.get("/profile", auth, userController.getProfile);
router.put("/profile", auth, userController.updateProfile);
router.post("/address", auth, userController.saveAddress);
router.delete("/delete", auth, userController.deleteAccount);

module.exports = router;
