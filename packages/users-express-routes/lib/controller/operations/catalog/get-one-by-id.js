const MODULE_ID = '';

const AirtableClient = require('airtable-client-provider');

const { sanitizeProductRecord } = require('../../utils/sanitize-product-records');

const getOneById = async (req, res) => {
  const BODY = req.body;
  const CODIGO = BODY?.codigo;
  const AIRTABLE_CLIENT = new AirtableClient();

  try {
    const OPERATION_RESULT = await AIRTABLE_CLIENT.getProductById(CODIGO);

    if (OPERATION_RESULT) {
      const SANITIZED_RECORD = sanitizeProductRecord(OPERATION_RESULT);
      res.status(200).send(SANITIZED_RECORD);
    } else {
      res.sendStatus(500);
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  getOneById,
};
