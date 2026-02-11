const db = require("../../config/db.config");

/* ================= PRODUCT LIST ================= */
exports.getProducts = async () => {
  const [rows] = await db.query(`
    SELECT p.id, p.name, p.price, p.discount,
           pi.image_url
    FROM products p
    LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary = 1
    WHERE p.status = 'ACTIVE'
  `);
  return rows;
};

/* ================= PRODUCT DETAILS ================= */
exports.getProductById = async (id) => {
  const [[product]] = await db.query("SELECT * FROM products WHERE id = ?", [
    id,
  ]);

  if (!product) throw new Error("Product not found");

  const [images] = await db.query(
    "SELECT image_url FROM product_images WHERE product_id = ?",
    [id],
  );

  const [attributes] = await db.query(
    `
    SELECT a.name AS attribute, av.value
    FROM product_attribute_mapping pam
    JOIN attribute_values av ON av.id = pam.attribute_value_id
    JOIN attributes a ON a.id = av.attribute_id
    WHERE pam.product_id = ?
  `,
    [id],
  );

  return { product, images, attributes };
};

/* ================= PRODUCT SEARCH ================= */
exports.searchProducts = async (keyword) => {
  const [rows] = await db.query(
    "SELECT id, name, price FROM products WHERE name LIKE ?",
    [`%${keyword}%`],
  );
  return rows;
};

/* ================= PRODUCT FILTER ================= */
exports.filterProducts = async (attributeValueIds) => {
  const [rows] = await db.query(
    `
    SELECT DISTINCT p.id, p.name, p.price
    FROM products p
    JOIN product_attribute_mapping pam ON pam.product_id = p.id
    WHERE pam.attribute_value_id IN (?)
  `,
    [attributeValueIds],
  );

  return rows;
};

/* ================= PRODUCT COMPARE ================= */
exports.compareProducts = async (productIds) => {
  const [rows] = await db.query(
    "SELECT id, name, price, specifications FROM products WHERE id IN (?)",
    [productIds],
  );
  return rows;
};
