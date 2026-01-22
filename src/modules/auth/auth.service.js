const db = require("../../config/db.config");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../../config/jwt.config");
const { hashPassword, comparePassword } = require("../../utils/password.util");
const emailUtil = require("../../utils/email.util");
const crypto = require("crypto");

// /* ================= REGISTER ================= */
// exports.register = async (userData) => {
//   const { name, email, phone, password } = userData;

//   const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [
//     email,
//   ]);
//   if (existing.length) {
//     throw new Error("Email already registered");
//   }

//   const hashedPassword = await hashPassword(password);

//   const [userResult] = await db.query(
//     "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)",
//     [name, email, phone, hashedPassword]
//   );

//   const userId = userResult.insertId;

//   // Assign CUSTOMER role
//   await db.query("INSERT INTO user_roles (user_id, role_id) VALUES (?, 1)", [
//     userId,
//   ]);

//   return { message: "Registration successful" };
// };

// INSERT INTO nima_jewellersdemo.users (name, email, phone, password)
// VALUES (
//   'Admin',
//   'admin@nima.com',
//   '9999999999',
//   'admin123'
// );

// INSERT INTO nima_jewellersdemo.roles (user_id, role_id)
// VALUES (LAST_INSERT_ID(), 2);

// INSERT INTO roles (id, name) VALUES
// (1, 'USER'),
// (2, 'ADMIN');

exports.register = async (userData) => {
  const { name, email, phone, password } = userData;

  // 1. Check existing user
  const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [
    email,
  ]);

  if (existing.length) {
    throw new Error("Email already registered");
  }

  // 2. Hash password
  const hashedPassword = await hashPassword(password);

  // 3. Insert user
  const [result] = await db.query(
    "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)",
    [name, email, phone, hashedPassword],
  );

  const userId = result.insertId;

  // 4. Assign CUSTOMER role (make sure role_id = 1 exists)
  await db.query("INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)", [
    userId,
    1,
  ]);

  // 5. Send welcome email
  try {
    await emailUtil.sendEmail({
      to: email,
      templateName: "WELCOME",
      data: { name },
    });
  } catch (err) {
    console.error("Welcome email failed:", err.message);
  }

  return { message: "Registration successful" };
};

/* ================= LOGIN ================= */
exports.login = async ({ email, password }) => {
  const [users] = await db.query(
    `
    SELECT u.*, r.name AS role
    FROM users u
    JOIN user_roles ur ON ur.user_id = u.id
    JOIN roles r ON r.id = ur.role_id
    WHERE email = ?
  `,
    [email],
  );

  if (!users.length) {
    throw new Error("Invalid email or password");
  }

  const user = users[0];
  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign({ id: user.id, role: user.role }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

// exports.forgotPassword = async (email) => {
//   const [users] = await db.query("SELECT id FROM users WHERE email = ?", [
//     email,
//   ]);

//   if (!users.length) {
//     throw new Error("User not found");
//   }

//   const resetToken = crypto.randomBytes(32).toString("hex");
//   const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

//   await db.query(
//     `UPDATE users
//      SET reset_token = ?, reset_token_expires = ?
//      WHERE id = ?`,
//     [resetToken, expiresAt, users[0].id]
//   );

//   return resetToken;
// };

exports.forgotPassword = async (email) => {
  const [[user]] = await db.query(
    "SELECT id, name, email FROM users WHERE email = ?",
    [email],
  );
  if (!user) throw new Error("User not found");

  const token = crypto.randomBytes(32).toString("hex");

  await db.query(
    `UPDATE users 
     SET reset_token = ?, reset_token_expires = DATE_ADD(NOW(), INTERVAL 1 HOUR)
     WHERE id = ?`,
    [token, user.id],
  );

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  // 📧 SEND RESET EMAIL
  await emailUtil.sendEmail({
    to: user.email,
    templateName: "PASSWORD_RESET",
    data: {
      name: user.name,
      link: resetLink,
    },
  });

  return { message: "Password reset email sent" };
};

exports.resetPassword = async ({ token, newPassword }) => {
  // 1. Validate token
  const [[user]] = await db.query(
    `SELECT id, email, name 
     FROM users 
     WHERE reset_token = ? 
     AND reset_token_expires > NOW()`,
    [token],
  );

  if (!user) {
    throw new Error("Invalid or expired reset token");
  }

  // 2. Hash new password
  const hashedPassword = await hashPassword(newPassword);

  // 3. Update password & clear token
  await db.query(
    `UPDATE users 
     SET password = ?, reset_token = NULL, reset_token_expires = NULL
     WHERE id = ?`,
    [hashedPassword, user.id],
  );

  return { message: "Password reset successfully" };
};
