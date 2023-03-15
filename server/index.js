'use strict';
require('dotenv').config();

/**
 * UPDATE TEMPORARY WEBHOOK URL (ON PROD WON'T BE NECESSARY)
 * UPDATE TEMPORARY ACCESS TOKEN (GET PERMANENT TOKEN: https://developers.facebook.com/docs/whatsapp/business-management-api/get-started#1--acquire-an-access-token-using-a-system-user-or-facebook-login)
 *
 * Use IBM's Watson API to get intents
 * Use chatgpy to answer and get queries
 */

const startServer = async () => {
  const express = require('express'),
    body_parser = require('body-parser'),
    app = express().use(body_parser.json());

  const config = {};

  const apiV1Router = express.Router();
  app.use('/api/v1', apiV1Router);

  apiV1Router.get('/test-connection', (req, res) => {
    res.status(200).send('Successful Testing!');
  });

  await require('whatsapp-api-express-routes').initByConfiguration(
    config,
    apiV1Router
  );

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log('SOE is listening on port ' + PORT));
};

module.exports = {
  startServer,
};
