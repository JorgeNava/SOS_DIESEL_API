'use strict';
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const body_parser = require('body-parser');
const { verifyToken } = require('./middlewares');

const startServer = async () => {
  const PORT = process.env.PORT || 3000;
  const app = express().use(body_parser.json());
  const router = express.Router();

  const CONFIG = {};

  const CORS_OPTIONS = {
    origin: '*',
    optionsSuccessStatus: 200,
  };

  app.use('/', (req, res) => {
    res.json({
      message: 'Hello ;D'
    })
  });
  
  app.use('/api/v1', router);
  router.use(cors(CORS_OPTIONS));
  router.use(verifyToken);

  await require('catalog-express-routes').initByConfiguration(
    CONFIG,
    router
  );

  await require('users-express-routes').initByConfiguration(
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
