const db = require("../../config/db.config");

exports.getFaqs = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      "SELECT id, question, answer FROM faqs WHERE status = 'ACTIVE'",
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};
