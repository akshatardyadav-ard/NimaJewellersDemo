const db = require("../../config/db.config");

/* ================= GET ALL ATTRIBUTES ================= */
exports.getAttributes = async () => {
  const [rows] = await db.query(
    `SELECT id, name 
     FROM attributes 
     WHERE status = 'ACTIVE'`,
  );
  return rows;
};

/* ================= GET ATTRIBUTE VALUES ================= */
exports.getAttributeValues = async (attributeId) => {
  const [rows] = await db.query(
    `SELECT id, value 
     FROM attribute_values 
     WHERE attribute_id = ?`,
    [attributeId],
  );
  return rows;
};

/* ================= CREATE ATTRIBUTE ================= */
exports.createAttribute = async (name, values) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Check duplicate attribute
    const [existing] = await connection.query(
      "SELECT id FROM attributes WHERE name = ?",
      [name],
    );

    if (existing.length) {
      throw new Error("Attribute already exists");
    }

    // Insert attribute
    const [attrResult] = await connection.query(
      "INSERT INTO attributes (name) VALUES (?)",
      [name],
    );

    const attributeId = attrResult.insertId;

    // Insert values
    for (const value of values) {
      await connection.query(
        "INSERT INTO attribute_values (attribute_id, value) VALUES (?, ?)",
        [attributeId, value],
      );
    }

    await connection.commit();

    return {
      attributeId,
      message: "Attribute created successfully",
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/* ================= MAP PRODUCT ATTRIBUTES ================= */
exports.mapProductAttributes = async (productId, attributeValueIds) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Optional: validate product exists
    const [product] = await connection.query(
      "SELECT id FROM products WHERE id = ?",
      [productId],
    );

    if (!product.length) {
      throw new Error("Product not found");
    }

    for (const valueId of attributeValueIds) {
      await connection.query(
        `INSERT IGNORE INTO product_attribute_mapping 
         (product_id, attribute_value_id) 
         VALUES (?, ?)`,
        [productId, valueId],
      );
    }

    await connection.commit();

    return {
      message: "Attributes mapped to product successfully",
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
