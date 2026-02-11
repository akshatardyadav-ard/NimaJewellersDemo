const orderService = require("./order.service");

exports.checkout = async (req, res, next) => {
  try {
    const data = await orderService.checkout(req.user.id);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.myOrders = async (req, res, next) => {
  try {
    const data = await orderService.getMyOrders(req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.orderDetails = async (req, res, next) => {
  try {
    const data = await orderService.getOrderById(req.user.id, req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.reorder = async (req, res, next) => {
  try {
    const data = await orderService.reorder(req.user.id, req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.track = async (req, res, next) => {
  try {
    const data = await orderService.trackOrder(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
