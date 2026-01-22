const db = require("../../config/db.config");

/* ================= GET PROFILE ================= */
exports.getProfile = async (userId) => {
  const [users] = await db.query(
    "SELECT id, name, email, phone FROM users WHERE id = ? AND is_deleted = 0",
    [userId],
  );

  if (!users.length) {
    throw new Error("User not found");
  }

  const [addresses] = await db.query(
    "SELECT * FROM addresses WHERE user_id = ?",
    [userId],
  );

  return {
    user: users[0],
    addresses,
  };
};

/* ================= UPDATE PROFILE ================= */
exports.updateProfile = async (userId, data) => {
  const { name, phone } = data;

  await db.query("UPDATE users SET name = ?, phone = ? WHERE id = ?", [
    name,
    phone,
    userId,
  ]);

  return { message: "Profile updated successfully" };
};

/* ================= SAVE / UPDATE ADDRESS ================= */
exports.saveAddress = async (userId, address) => {
  const { type, address_line1, city, state, country, zip_code } = address;

  const [existing] = await db.query(
    "SELECT id FROM addresses WHERE user_id = ? AND type = ?",
    [userId, type],
  );

  if (existing.length) {
    await db.query(
      `UPDATE addresses 
       SET address_line1=?, city=?, state=?, country=?, zip_code=? 
       WHERE user_id=? AND type=?`,
      [address_line1, city, state, country, zip_code, userId, type],
    );
  } else {
    await db.query(
      `INSERT INTO addresses 
       (user_id, type, address_line1, city, state, country, zip_code)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, type, address_line1, city, state, country, zip_code],
    );
  }

  return { message: "Address saved successfully" };
};

/* ================= DELETE ACCOUNT ================= */
exports.deleteAccount = async (userId) => {
  await db.query(
    "UPDATE users SET is_deleted = 1, status = 'INACTIVE' WHERE id = ?",
    [userId],
  );

  return { message: "Account deleted successfully" };
};
