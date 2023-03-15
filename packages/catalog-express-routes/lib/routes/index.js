const express = require('express');

const catalogRoutes = express.Router({ mergeParams: true });

const { catalogController } = require('../controller');

catalogRoutes.post('/get-product-by-id', catalogController.getProductById);
catalogRoutes.post('/create-product', catalogController.createProduct);

module.exports = catalogRoutes;
