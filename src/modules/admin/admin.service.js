// const db = require("../../config/db.config");
// exports.createProduct = async (data) => {
//   const {
//     name,
//     category_id,
//     price,
//     discount = 0,
//     description,
//     status = "ACTIVE",
//   } = data;

//   const [result] = await db.query(
//     `INSERT INTO products
//      (name, category_id, price, discount, description, status)
//      VALUES (?, ?, ?, ?, ?, ?)`,
//     [name, category_id, price, discount, description, status],
//   );

//   return {
//     message: "Product created successfully",
//     productId: result.insertId,
//   };
// };
const db = require("../../config/db.config");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../../config/jwt.config");
const { comparePassword } = require("../../utils/password.util");

exports.adminLogin = async ({ email, password }) => {
  const [rows] = await db.query(
    `
    SELECT u.*, r.name AS role
    FROM users u
    JOIN user_roles ur ON ur.user_id = u.id
    JOIN roles r ON r.id = ur.role_id
    WHERE u.email = ? AND r.name = 'ADMIN'
  `,
    [email],
  );

  if (!rows.length) throw new Error("Unauthorized admin");

  const admin = rows[0];
  const valid = await comparePassword(password, admin.password);
  if (!valid) throw new Error("Invalid credentials");

  const token = jwt.sign({ id: admin.id, role: admin.role }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });

  return { token, admin: { id: admin.id, email: admin.email } };
};

exports.getUsers = async () => {
  const [rows] = await db.query(
    "SELECT id, name, email, status FROM users WHERE is_deleted = 0",
  );
  return rows;
};

exports.updateUserStatus = async (userId, status) => {
  await db.query("UPDATE users SET status = ? WHERE id = ?", [status, userId]);
  return { message: "User status updated" };
};

exports.createProduct = async (data) => {
  const { name, category_id, price, description } = data;
  await db.query(
    "INSERT INTO products (name, category_id, price, description) VALUES (?, ?, ?, ?)",
    [name, category_id, price, description],
  );
  return { message: "Product created" };
};

exports.deleteProduct = async (id) => {
  await db.query("UPDATE products SET status='INACTIVE' WHERE id = ?", [id]);
  return { message: "Product deleted" };
};

exports.getOrders = async () => {
  const [rows] = await db.query(
    "SELECT id, user_id, total_amount, status FROM orders ORDER BY created_at DESC",
  );
  return rows;
};

exports.updateOrderStatus = async (orderId, status) => {
  await db.query("UPDATE orders SET status = ? WHERE id = ?", [
    status,
    orderId,
  ]);
  return { message: "Order updated" };
};

exports.createBanner = async (data) => {
  await db.query("INSERT INTO banners (title, image_url) VALUES (?, ?)", [
    data.title,
    data.image_url,
  ]);
  return { message: "Banner added" };
};
