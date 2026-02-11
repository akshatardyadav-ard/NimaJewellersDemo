const cartService = require("./cart.service");

exports.getCart = async (req, res, next) => {
  try {
    const data = await cartService.getCart(req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const result = await cartService.addToCart(
      req.user.id,
      productId,
      quantity,
    );
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

exports.updateItem = async (req, res, next) => {
  try {
    const result = await cartService.updateCartItem(
      req.params.id,
      req.body.quantity,
    );
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

exports.removeItem = async (req, res, next) => {
  try {
    const result = await cartService.removeCartItem(req.params.id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};
