// const express=require('express');
// const app=express();
// app.use(express.json());

// app.use('/api/users',require('./modules/users/user.routes'));
// app.use('/api/products',require('./modules/products/product.routes'));
// app.use('/api/categories',require('./modules/categories/category.routes'));
// app.use('/api/attributes',require('./modules/attributes/attribute.routes'));
// app.use('/api/cart',require('./modules/cart/cart.routes'));
// app.use('/api/orders',require('./modules/orders/order.routes'));
// app.use('/api/payments',require('./modules/payments/payment.routes'));
// app.use('/api/shipping',require('./modules/shipping/shipping.routes'));
// app.use('/api/cms',require('./modules/cms/cms.routes'));
// app.use('/api/admin',require('./modules/admin/admin.routes'));

// module.exports=app;

const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

module.exports = app;
