'use strict';
require('dotenv').config();

const startServer = async () => {
  const express = require('express'),
    body_parser = require('body-parser'),
    app = express().use(body_parser.json());

  const config = {};

  const apiV1Router = express.Router();
  app.use('/api/v1', apiV1Router);

  // TODO: IMPLEMENT AUTHORIZATION TOKEN

  apiV1Router.get('/test-connection', (req, res) => {
    res.status(200).send('Successful Testing!');
  });

  await require('catalog-express-routes').initByConfiguration(
    config,
    apiV1Router
  );

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () =>
    console.log('SOS Diesel API is listening on port ' + PORT)
  );
};

module.exports = {
  startServer,
};
