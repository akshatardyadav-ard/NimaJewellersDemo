const db = require("../../config/db.config");

/* ================= CHECKOUT ================= */
exports.checkout = async (userId) => {
  // 1. Get cart
  const [[cart]] = await db.query("SELECT id FROM cart WHERE user_id = ?", [
    userId,
  ]);
  if (!cart) throw new Error("Cart is empty");

  // 2. Get cart items
  const [items] = await db.query(
    "SELECT product_id, quantity, price FROM cart_items WHERE cart_id = ?",
    [cart.id],
  );
  if (!items.length) throw new Error("Cart is empty");

  // 3. Calculate total
  const totalAmount = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0,
  );

  // 4. Create order
  const [orderResult] = await db.query(
    "INSERT INTO orders (user_id, total_amount) VALUES (?, ?)",
    [userId, totalAmount],
  );
  const orderId = orderResult.insertId;

  // 5. Create order items
  for (const item of items) {
    await db.query(
      `INSERT INTO order_items (order_id, product_id, quantity, price)
       VALUES (?, ?, ?, ?)`,
      [orderId, item.product_id, item.quantity, item.price],
    );
  }

  // 6. Clear cart
  await db.query("DELETE FROM cart_items WHERE cart_id = ?", [cart.id]);

  return { message: "Order placed successfully", orderId };
};

/* ================= MY ORDERS ================= */
exports.getMyOrders = async (userId) => {
  const [orders] = await db.query(
    "SELECT id, total_amount, status, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC",
    [userId],
  );
  return orders;
};

/* ================= ORDER DETAILS ================= */
exports.getOrderById = async (userId, orderId) => {
  const [[order]] = await db.query(
    "SELECT * FROM orders WHERE id = ? AND user_id = ?",
    [orderId, userId],
  );
  if (!order) throw new Error("Order not found");

  const [items] = await db.query(
    `SELECT p.name, oi.quantity, oi.price
     FROM order_items oi
     JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = ?`,
    [orderId],
  );

  return { order, items };
};

/* ================= REORDER ================= */
exports.reorder = async (userId, orderId) => {
  const [items] = await db.query(
    "SELECT product_id, quantity FROM order_items WHERE order_id = ?",
    [orderId],
  );
  if (!items.length) throw new Error("No items found");

  let [[cart]] = await db.query("SELECT id FROM cart WHERE user_id = ?", [
    userId,
  ]);
  if (!cart) {
    const [cartResult] = await db.query(
      "INSERT INTO cart (user_id) VALUES (?)",
      [userId],
    );
    cart = { id: cartResult.insertId };
  }

  for (const item of items) {
    const [[product]] = await db.query(
      "SELECT price FROM products WHERE id = ?",
      [item.product_id],
    );
    if (!product) continue;

    await db.query(
      `INSERT INTO cart_items (cart_id, product_id, quantity, price)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
      [cart.id, item.product_id, item.quantity, product.price],
    );
  }

  return { message: "Items added to cart for reorder" };
};

/* ================= TRACK ORDER ================= */
exports.trackOrder = async (orderId) => {
  const [[order]] = await db.query(
    "SELECT id, status, created_at FROM orders WHERE id = ?",
    [orderId],
  );
  if (!order) throw new Error("Order not found");
  return order;
};
