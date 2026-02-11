const db = require("../../config/db.config");

/* ================= GET CART ================= */
exports.getCart = async (userId) => {
  const [[cart]] = await db.query("SELECT id FROM cart WHERE user_id = ?", [
    userId,
  ]);

  if (!cart) return { items: [], total: 0 };

  const [items] = await db.query(
    `
    SELECT ci.id, p.id AS product_id, p.name, ci.quantity, ci.price,
           (ci.quantity * ci.price) AS subtotal
    FROM cart_items ci
    JOIN products p ON p.id = ci.product_id
    WHERE ci.cart_id = ?
  `,
    [cart.id],
  );

  const total = items.reduce((sum, item) => sum + item.subtotal, 0);

  return { items, total };
};

/* ================= ADD TO CART ================= */
exports.addToCart = async (userId, productId, quantity) => {
  const [[product]] = await db.query(
    "SELECT price FROM products WHERE id = ? AND status = 'ACTIVE'",
    [productId],
  );
  if (!product) throw new Error("Product not available");

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

  const [[existing]] = await db.query(
    "SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?",
    [cart.id, productId],
  );

  if (existing) {
    await db.query(
      "UPDATE cart_items SET quantity = quantity + ? WHERE id = ?",
      [quantity, existing.id],
    );
  } else {
    await db.query(
      "INSERT INTO cart_items (cart_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
      [cart.id, productId, quantity, product.price],
    );
  }

  return { message: "Product added to cart" };
};

/* ================= UPDATE CART ITEM ================= */
exports.updateCartItem = async (itemId, quantity) => {
  await db.query("UPDATE cart_items SET quantity = ? WHERE id = ?", [
    quantity,
    itemId,
  ]);
  return { message: "Cart updated" };
};

/* ================= REMOVE CART ITEM ================= */
exports.removeCartItem = async (itemId) => {
  await db.query("DELETE FROM cart_items WHERE id = ?", [itemId]);
  return { message: "Item removed from cart" };
};

/* ================= CLEAR CART ================= */
exports.clearCart = async (cartId) => {
  await db.query("DELETE FROM cart_items WHERE cart_id = ?", [cartId]);
};
