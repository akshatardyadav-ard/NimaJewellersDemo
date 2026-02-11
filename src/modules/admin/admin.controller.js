// const adminService = require("./admin.service");

// exports.createProduct = async (req, res, next) => {
//   try {
//     const result = await adminService.createProduct(req.body);

//     res.status(201).json({
//       success: true,
//       data: result,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

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

exports.uploadProductImage = async (req, res, next) => {
  try {
    const imageUrl = `/uploads/products/${req.file.filename}`;

    await db.query(
      "INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, ?)",
      [req.params.id, imageUrl, 1],
    );

    res.status(201).json({
      success: true,
      message: "Product image uploaded",
      imageUrl,
    });
  } catch (err) {
    next(err);
  }
};

exports.uploadBanner = async (req, res, next) => {
  try {
    const imageUrl = `/uploads/banners/${req.file.filename}`;

    await db.query("INSERT INTO banners (title, image_url) VALUES (?, ?)", [
      req.body.title,
      imageUrl,
    ]);

    res.status(201).json({
      success: true,
      message: "Banner uploaded",
      imageUrl,
    });
  } catch (err) {
    next(err);
  }
};
