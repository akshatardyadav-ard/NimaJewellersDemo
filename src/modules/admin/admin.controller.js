const adminService = require("./admin.service");
const db = require("../../config/db.config");

exports.login = async (req, res, next) => {
  try {
    const data = await adminService.adminLogin(req.body);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const data = await adminService.getUsers();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.updateUserStatus = async (req, res, next) => {
  try {
    const data = await adminService.updateUserStatus(
      req.params.id,
      req.body.status,
    );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const data = await adminService.createProduct(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const data = await adminService.deleteProduct(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const data = await adminService.getOrders();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const data = await adminService.updateOrderStatus(
      req.params.id,
      req.body.status,
    );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.createBanner = async (req, res, next) => {
  try {
    const data = await adminService.createBanner(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.uploadProductImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });
    }

    const productId = req.params.id;

    // Create array of image URLs
    const imageUrls = req.files.map(
      (file) => `/uploads/products/${file.filename}`,
    );

    // Insert all images into DB
    const values = imageUrls.map((url) => [productId, url, 0]); // is_primary = 0 by default

    // Bulk insert
    await db.query(
      "INSERT INTO product_images (product_id, image_url, is_primary) VALUES ?",
      [values],
    );

    res.status(201).json({
      success: true,
      message: "Product images uploaded",
      images: imageUrls,
    });
  } catch (err) {
    next(err);
  }
};

exports.uploadBanner = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });
    }

    const title = req.body.title;

    // Build array of banner image URLs
    const imageUrls = req.files.map(
      (file) => `/uploads/banners/${file.filename}`,
    );

    // Prepare bulk insert values
    const values = imageUrls.map((url) => [title, url]);

    // Insert multiple banner records
    await db.query("INSERT INTO banners (title, image_url) VALUES ?", [values]);

    res.status(201).json({
      success: true,
      message: "Banners uploaded",
      images: imageUrls,
    });
  } catch (err) {
    next(err);
  }
};
