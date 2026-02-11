const paymentService = require("./payment.service");

exports.initiate = async (req, res, next) => {
  try {
    const { orderId, paymentMethod } = req.body;
    const data = await paymentService.initiatePayment(orderId, paymentMethod);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.callback = async (req, res, next) => {
  try {
    const data = await paymentService.paymentCallback(req.body);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.status = async (req, res, next) => {
  try {
    const data = await paymentService.getPaymentStatus(req.params.orderId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
