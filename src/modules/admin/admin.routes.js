const router = require("express").Router();
const controller = require("./admin.controller");
const auth = require("../../middlewares/auth.middleware");
const role = require("../../middlewares/role.middleware");
const { productUpload } = require("../../utils/upload.util");
const { bannerUpload } = require("../../utils/upload.util");

/* Auth */
router.post("/login", controller.login);

/* Users */
router.get("/users", auth, role("ADMIN"), controller.getUsers);
router.put(
  "/users/:id/status",
  auth,
  role("ADMIN"),
  controller.updateUserStatus,
);

/* Products */
router.post("/products", auth, role("ADMIN"), controller.createProduct);
router.delete("/products/:id", auth, role("ADMIN"), controller.deleteProduct);

/* Orders */
router.get("/orders", auth, role("ADMIN"), controller.getOrders);
router.put(
  "/orders/:id/status",
  auth,
  role("ADMIN"),
  controller.updateOrderStatus,
);

/* CMS */
router.post("/banners", auth, role("ADMIN"), controller.createBanner);

router.post(
  "/products/:id/images",
  auth,
  role("ADMIN"),
  productUpload.single("image"),
  controller.uploadProductImage,
);

router.post(
  "/banners/upload",
  auth,
  role("ADMIN"),
  bannerUpload.single("image"),
  controller.uploadBanner,
);

module.exports = router;
