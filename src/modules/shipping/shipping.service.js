const db = require("../../config/db.config");

/* ================= GET SHIPPING METHODS ================= */
exports.getMethods = async () => {
  const [rows] = await db.query(
    "SELECT id, name, amount FROM shipping_methods WHERE status = 'ACTIVE'",
  );
  return rows;
};

/* ================= CALCULATE SHIPPING ================= */
exports.calculateShipping = async (methodId) => {
  const [[method]] = await db.query(
    "SELECT amount FROM shipping_methods WHERE id = ? AND status = 'ACTIVE'",
    [methodId],
  );

  if (!method) throw new Error("Shipping method not found");

  return { shippingCost: method.amount };
};
