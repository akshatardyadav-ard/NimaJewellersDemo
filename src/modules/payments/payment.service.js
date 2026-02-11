const db = require("../../config/db.config");

/* ================= INITIATE PAYMENT ================= */
exports.initiatePayment = async (orderId, paymentMethod) => {
  // Check order
  const [[order]] = await db.query(
    "SELECT id, total_amount, status FROM orders WHERE id = ?",
    [orderId],
  );

  if (!order) throw new Error("Order not found");

  // Create payment record
  const [result] = await db.query(
    `INSERT INTO payments 
     (order_id, payment_method, payment_status)
     VALUES (?, ?, 'PENDING')`,
    [orderId, paymentMethod],
  );

  return {
    message: "Payment initiated",
    paymentId: result.insertId,
    amount: order.total_amount,
    paymentMethod,
  };
};

/* ================= PAYMENT CALLBACK ================= */
exports.paymentCallback = async ({ paymentId, transactionId, status }) => {
  // Update payment
  await db.query(
    `UPDATE payments 
     SET payment_status = ?, transaction_id = ?
     WHERE id = ?`,
    [status, transactionId, paymentId],
  );

  // Get order id
  const [[payment]] = await db.query(
    "SELECT order_id FROM payments WHERE id = ?",
    [paymentId],
  );

  if (status === "SUCCESS") {
    await db.query("UPDATE orders SET status = 'PROCESSING' WHERE id = ?", [
      payment.order_id,
    ]);
  } else {
    await db.query("UPDATE orders SET status = 'CANCELLED' WHERE id = ?", [
      payment.order_id,
    ]);
  }

  return { message: "Payment status updated" };
};

/* ================= PAYMENT STATUS ================= */
exports.getPaymentStatus = async (orderId) => {
  const [[payment]] = await db.query(
    `SELECT payment_method, payment_status, transaction_id
     FROM payments
     WHERE order_id = ?
     ORDER BY id DESC`,
    [orderId],
  );

  if (!payment) throw new Error("Payment not found");

  return payment;
};
