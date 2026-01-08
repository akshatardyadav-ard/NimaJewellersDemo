const db = require("../../config/db.config");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../../config/jwt.config");
const { hashPassword, comparePassword } = require("../../utils/password.util");

/* ================= REGISTER ================= */
exports.register = async (userData) => {
  const { name, email, phone, password } = userData;

  const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [
    email,
  ]);
  if (existing.length) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await hashPassword(password);

  const [userResult] = await db.query(
    "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)",
    [name, email, phone, hashedPassword]
  );

  const userId = userResult.insertId;

  // Assign CUSTOMER role
  await db.query("INSERT INTO user_roles (user_id, role_id) VALUES (?, 2)", [
    userId,
  ]);

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
    [email]
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
