const MODULE_ID = 'whatsapp-api-express-routes-controller-verify-webhook';

const AirtableClient = require('airtable-client-provider');

const { sanitizeProductRecord } = require('../utils/sanitize-product-records');

const insertMany = async (req, res) => {
  const BODY = req.body;
  const AIRTABLE_CLIENT = new AirtableClient();
  const PRODUCTOS = BODY?.productos;

  try {
    let operationResult = await AIRTABLE_CLIENT.insertManyProducts(PRODUCTOS);

    if (operationResult) {
      const RET_VAL = operationResult.map((record) => {
        return sanitizeProductRecord(record);
      });
      res.status(200).send(RET_VAL);
    } else {
      res.sendStatus(500);
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  insertMany,
};
