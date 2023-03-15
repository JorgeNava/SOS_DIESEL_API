const express = require('express');

const catalogRoutes = express.Router({ mergeParams: true });

const { catalogController } = require('../controller');

catalogRoutes.post('/get-one-by-id', catalogController.getProductById);
catalogRoutes.post('/insert-one', catalogController.insertOne);

module.exports = catalogRoutes;
