const router = require("express").Router();

router.use("/api/auth", require("./modules/auth/auth.routes"));
router.use("/api/users", require("./modules/users/user.routes"));
router.use("/api/categories", require("./modules/categories/category.routes"));
router.use("/api/attributes", require("./modules/attributes/attribute.routes"));
router.use("/api/products", require("./modules/products/product.routes"));
router.use("/api/cart", require("./modules/cart/cart.routes"));
router.use("/api/orders", require("./modules/orders/order.routes"));
router.use("/api/payments", require("./modules/payments/payment.routes"));
router.use("/api/shipping", require("./modules/shipping/shipping.routes"));
router.use("/api/cms", require("./modules/cms/cms.routes"));

router.use("/api/admin", require("./modules/admin/admin.routes"));

module.exports = router;
