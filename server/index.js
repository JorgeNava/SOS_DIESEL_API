'use strict';
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const body_parser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { verifyToken } = require('./middlewares');

const startServer = async () => {
  const PORT = process.env.PORT || 3000;
  const app = express().use(body_parser.json());
  const apiV1Router = express.Router();

  const CONFIG = {};

  const CORS_OPTIONS = {
    origin: '*',
    optionsSuccessStatus: 200,
  };

  app.use('/api/v1', apiV1Router);
  apiV1Router.use(cors(CORS_OPTIONS));
  apiV1Router.use(verifyToken);

  apiV1Router.post('/authenticate', (req, res) => {
    const REACT_CLIENT_USER = process.env.REACT_CLIENT_API_USER;
    const REACT_CLIENT_PASSWORD = process.env.REACT_CLIENT_API_PASSWORD;
    const API_SECRET = process.env.ACCESS_TOKEN_SECRET;
    const { username, password } = req.body;

    const user = REACT_CLIENT_USER === username;

    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    bcrypt.compare(password, REACT_CLIENT_PASSWORD, (err, result) => {
      if (err || !result) {
        return res.status(401).json({ message: 'Authentication failed' });
      }
      const token = jwt.sign({ username }, API_SECRET, {
        expiresIn: '1y',
      });
      res.json({ token });
    });
  });

  await require('catalog-express-routes').initByConfiguration(
    CONFIG,
    apiV1Router
  );

  app.listen(PORT, () =>
    console.log('SOS Diesel API is listening on port ' + PORT)
  );
};

module.exports = {
  startServer,
};
