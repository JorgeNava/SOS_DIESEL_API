const MODULE_ID = '';

const {CATALOG_OPERATIONS} = require('../../../../../airtable-client-provider');

const getOneProduct = async (req, res) => {
  try {
    const PRODUCT_PARAMS = req.query;
    const OPERATION_RESULT = await CATALOG_OPERATIONS.getOneProduct(PRODUCT_PARAMS);
    if (Object.keys(OPERATION_RESULT).length) {
      res.status(200).send(OPERATION_RESULT);
    } else {
      res.status(500).send({error: OPERATION_RESULT.message});
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  getOneProduct,
};
