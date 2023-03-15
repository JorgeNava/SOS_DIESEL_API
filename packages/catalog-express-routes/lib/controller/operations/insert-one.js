const MODULE_ID = 'whatsapp-api-express-routes-controller-verify-webhook';

const AirtableClient = require('airtable-client-provider');

const insertOne = (req, res) => {
  const BODY = req.body;
  const PRODUCT_DATA = BODY?.data;
  const AIRTABLE_CLIENT = new AirtableClient();

  try {
    const OPERATION_RESULT = AIRTABLE_CLIENT.insertOne(PRODUCT_DATA);

    if (OPERATION_RESULT) {
      res.status(200).send(OPERATION_RESULT);
    } else {
      res.sendStatus(403);
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  insertOne,
};
