const MODULE_ID = 'whatsapp-api-express-routes-controller-verify-webhook';

const AirtableClient = require('airtable-client-provider');

const removeOneById = async (req, res) => {
  const BODY = req.body;
  const AIRTABLE_CLIENT = new AirtableClient();
  const PRODUCT_ID = BODY?.productId;

  try {
    const OPERATION_RESULT = await AIRTABLE_CLIENT.removeProductById(
      PRODUCT_ID
    );

    if (OPERATION_RESULT) {
      res.status(200).send(OPERATION_RESULT);
    } else {
      res.sendStatus(500);
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  removeOneById,
};
