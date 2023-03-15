const MODULE_ID = 'whatsapp-api-express-routes-controller-verify-webhook';

const AirtableClient = require('airtable-client-provider');

const removeManyById = async (req, res) => {
  const BODY = req.body;
  const AIRTABLE_CLIENT = new AirtableClient();
  const PRODUCTS_ID = BODY?.prodcutsId;

  try {
    const OPERATION_RESULT = await AIRTABLE_CLIENT.removeManyProductsById(
      PRODUCTS_ID
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
  removeManyById,
};
