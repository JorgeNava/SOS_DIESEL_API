const MODULE_ID = 'whatsapp-api-express-routes-controller-verify-webhook';

const ramda = require('ramda');
const lodash = require('lodash');

const createProduct = (req, res) => {
  let body = req.body;
  let retVal;

  try {
    if (true) {
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  createProduct,
};
