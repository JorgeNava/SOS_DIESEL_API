const express = require('express');

const CATALOG_ROUTES = express.Router({ mergeParams: true });

const {CATALOG_CONTROLLER}  = require('../controller');
CATALOG_ROUTES.post('/create-product', CATALOG_CONTROLLER.createProduct);
CATALOG_ROUTES.post('/update-product', CATALOG_CONTROLLER.updateProduct);
CATALOG_ROUTES.delete('/delete-product', CATALOG_CONTROLLER.deleteProduct);
CATALOG_ROUTES.get('/get-one-product', CATALOG_CONTROLLER.getOneProduct);
CATALOG_ROUTES.get('/get-five-products', CATALOG_CONTROLLER.getFiveProducts);
CATALOG_ROUTES.get('/get-all-products', CATALOG_CONTROLLER.getAllProducts);

module.exports = CATALOG_ROUTES;
