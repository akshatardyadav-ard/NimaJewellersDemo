const productService = require("./product.service");

exports.getAll = async (req, res, next) => {
  try {
    const data = await productService.getProducts();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await productService.getProductById(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.search = async (req, res, next) => {
  try {
    const data = await productService.searchProducts(req.query.q);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.filter = async (req, res, next) => {
  try {
    const data = await productService.filterProducts(
      req.body.attributeValueIds,
    );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.compare = async (req, res, next) => {
  try {
    const data = await productService.compareProducts(req.body.productIds);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
