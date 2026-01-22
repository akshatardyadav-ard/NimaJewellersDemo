const categoryService = require("./category.service");

exports.getAll = async (req, res, next) => {
  try {
    const data = await categoryService.getAllCategories();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const result = await categoryService.createCategory(req.body.name);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const result = await categoryService.updateCategory(
      req.params.id,
      req.body.name,
    );
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const result = await categoryService.deleteCategory(req.params.id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};
