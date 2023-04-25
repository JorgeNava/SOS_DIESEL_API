const MODULE_ID = 'whatsapp-api-express-routes-controller-verify-webhook';

const AirtableClient = require('airtable-client-provider');

const { sanitizeProductRecord } = require('../../utils/sanitize-product-records');

const insertOne = async (req, res) => {
  const BODY = req.body;
  const AIRTABLE_CLIENT = new AirtableClient();

  try {
    const OPERATION_RESULT = await AIRTABLE_CLIENT.insertOneProduct(BODY);

    if (OPERATION_RESULT) {
      res.status(200).send(sanitizeProductRecord(OPERATION_RESULT[0]));
    } else {
      res.sendStatus(500);
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  insertOne,
};
