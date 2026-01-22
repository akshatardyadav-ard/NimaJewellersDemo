const attributeService = require("./attribute.service");

exports.getAll = async (req, res, next) => {
  try {
    const data = await attributeService.getAttributes();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.getValues = async (req, res, next) => {
  try {
    const data = await attributeService.getAttributeValues(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name, values } = req.body;
    const result = await attributeService.createAttribute(name, values);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

exports.mapProduct = async (req, res, next) => {
  try {
    const { productId, attributeValueIds } = req.body;
    const result = await attributeService.mapProductAttributes(
      productId,
      attributeValueIds,
    );
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};
