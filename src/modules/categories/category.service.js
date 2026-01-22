const db = require("../../config/db.config");

/* ================= GET ALL CATEGORIES ================= */
exports.getAllCategories = async () => {
  const [rows] = await db.query(
    "SELECT id, name FROM categories WHERE status = 'ACTIVE'",
  );
  return rows;
};

/* ================= CREATE CATEGORY ================= */
exports.createCategory = async (name) => {
  await db.query("INSERT INTO categories (name) VALUES (?)", [name]);
  return { message: "Category created successfully" };
};

/* ================= UPDATE CATEGORY ================= */
exports.updateCategory = async (id, name) => {
  await db.query("UPDATE categories SET name = ? WHERE id = ?", [name, id]);
  return { message: "Category updated successfully" };
};

/* ================= DELETE CATEGORY (SOFT DELETE) ================= */
exports.deleteCategory = async (id) => {
  await db.query("UPDATE categories SET status = 'INACTIVE' WHERE id = ?", [
    id,
  ]);
  return { message: "Category deleted successfully" };
};
