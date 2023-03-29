const MODULE_ID = 'whatsapp-api-express-routes-controller-verify-webhook';

const AirtableClient = require('airtable-client-provider');

const { sanitizeProductRecord } = require('../utils/sanitize-product-records');

const updateManyById = async (req, res) => {
  const BODY = req.body;
  const AIRTABLE_CLIENT = new AirtableClient();
  const PRODUCTOS = BODY?.productos;
  const PRODUCTS_IDS = PRODUCTOS.map((product) => {
    return product.codigo;
  });

  try {
    const OPERATION_RESULT = await AIRTABLE_CLIENT.updateManyProductsByIds(
      PRODUCTS_IDS,
      PRODUCTOS
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
  updateManyById,
};
