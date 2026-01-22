const db = require("../../config/db.config");

/* ================= GET ALL ATTRIBUTES ================= */
exports.getAttributes = async () => {
  const [rows] = await db.query(
    "SELECT id, name FROM attributes WHERE status = 'ACTIVE'",
  );
  return rows;
};

/* ================= GET ATTRIBUTE VALUES ================= */
exports.getAttributeValues = async (attributeId) => {
  const [rows] = await db.query(
    "SELECT id, value FROM attribute_values WHERE attribute_id = ?",
    [attributeId],
  );
  return rows;
};

/* ================= CREATE ATTRIBUTE ================= */
exports.createAttribute = async (name, values) => {
  const [attrResult] = await db.query(
    "INSERT INTO attributes (name) VALUES (?)",
    [name],
  );

  const attributeId = attrResult.insertId;

  for (const value of values) {
    await db.query(
      "INSERT INTO attribute_values (attribute_id, value) VALUES (?, ?)",
      [attributeId, value],
    );
  }

  return { message: "Attribute created successfully" };
};

/* ================= MAP PRODUCT ATTRIBUTES ================= */
exports.mapProductAttributes = async (productId, attributeValueIds) => {
  for (const valueId of attributeValueIds) {
    await db.query(
      "INSERT IGNORE INTO product_attribute_mapping (product_id, attribute_value_id) VALUES (?, ?)",
      [productId, valueId],
    );
  }

  return { message: "Attributes mapped to product" };
};
