const db = require("../../config/db.config");

exports.getPageByKey = async (req, res, next) => {
  try {
    const [[page]] = await db.query(
      "SELECT title, content FROM static_pages WHERE page_key = ?",
      [req.params.key],
    );

    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    res.json({ success: true, data: page });
  } catch (err) {
    next(err);
  }
};
