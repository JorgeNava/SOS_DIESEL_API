const MODULE_ID = '';

const AirtableClient = require('airtable-client-provider');

const { sanitizeProductRecord } = require('../utils/sanitize-product-records');

const getManyById = async (req, res) => {
  const BODY = req.body;
  const PRODUCTS_ID = BODY?.productsId;
  const AIRTABLE_CLIENT = new AirtableClient();

  try {
    const OPERATION_RESULT = await AIRTABLE_CLIENT.getManyProductsByIds(
      PRODUCTS_ID
    );

    if (OPERATION_RESULT) {
      const RET_VAL = OPERATION_RESULT.map((record) => {
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
  getManyById,
};
