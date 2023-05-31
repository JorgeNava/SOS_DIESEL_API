'use strict';
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const body_parser = require('body-parser');
const { verifyToken } = require('./middlewares');
const { catalogInitByConfiguration } = require('./packages/catalog-express-routes');
const { usersInitByConfiguration } = require('./packages/users-express-routes');

const startServer = async () => {
  const PORT = process.env.PORT || 3000;
  const app = express().use(body_parser.json({ limit: '10mb' }));
  app.use(body_parser.urlencoded({ limit: '10mb', extended: true }));
  const router = express.Router();

  const CONFIG = {};

  const CORS_OPTIONS = {
    origin: '*',
    optionsSuccessStatus: 200,
  };
  
  app.use('/health', (req, res) => {
    res.send('OK')
  })

  app.use('/api/v1', router);
  router.use(cors(CORS_OPTIONS));
  router.use(verifyToken);

  await catalogInitByConfiguration(
    CONFIG,
    router
  );

  await usersInitByConfiguration(
    CONFIG,
    router
  );

  app.listen(PORT, () =>
    console.log('SOS Diesel API is listening on port ' + PORT)
  );
};

module.exports = {
  startServer,
};
