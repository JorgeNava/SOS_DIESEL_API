const express = require('express');

const catalogRoutes = express.Router({ mergeParams: true });

const { catalogController } = require('../controller');

catalogRoutes.post('/get-one-by-id', catalogController.getOneById);
catalogRoutes.post('/get-many-by-ids', catalogController.getManyById);
catalogRoutes.post('/insert-one', catalogController.insertOne);
catalogRoutes.post('/insert-many', catalogController.insertMany);
catalogRoutes.post('/update-one-by-id', catalogController.updateOneById);
catalogRoutes.post('/update-many-by-ids', catalogController.updateManyById);
catalogRoutes.delete('/remove-one-by-id', catalogController.removeOneById);
catalogRoutes.delete('/remove-many-by-ids', catalogController.removeManyById);
catalogRoutes.get('/get-all', catalogController.getAll);

module.exports = catalogRoutes;
