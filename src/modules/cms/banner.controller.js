const db = require("../../config/db.config");

exports.getBanners = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      "SELECT id, title, image_url FROM banners WHERE status = 'ACTIVE'",
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};
