const shippingService = require("./shipping.service");

exports.getMethods = async (req, res, next) => {
  try {
    const data = await shippingService.getMethods();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.calculate = async (req, res, next) => {
  try {
    const data = await shippingService.calculateShipping(req.body.methodId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
