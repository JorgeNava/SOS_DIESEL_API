const express = require('express');

const usersRoutes = express.Router({ mergeParams: true });

const { USERS_CONTROLLER } = require('../controller');

usersRoutes.post('/create-one', USERS_CONTROLLER.createOne);
usersRoutes.post('/update-one', USERS_CONTROLLER.updateOne);
usersRoutes.delete('/delete-one-by-email', USERS_CONTROLLER.deleteUserByEmail);
usersRoutes.post('/get-one-by-email', USERS_CONTROLLER.getUserByEmail);
usersRoutes.get('/get-all', USERS_CONTROLLER.getAllUsers);

module.exports = usersRoutes;
