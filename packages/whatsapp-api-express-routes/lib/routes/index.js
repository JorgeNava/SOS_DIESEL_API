const express = require('express');

const whatsappRoutes = express.Router({ mergeParams: true });

const { whatsappController } = require('../controller');

whatsappRoutes.get('/webhook', whatsappController.verifyWebhook);
whatsappRoutes.post('/webhook', whatsappController.receiveMessage);

module.exports = whatsappRoutes;
