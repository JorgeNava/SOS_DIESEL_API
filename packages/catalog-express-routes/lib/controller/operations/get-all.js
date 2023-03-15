const MODULE_ID = '';

const AirtableClient = require('airtable-client-provider');

const getAll = async (req, res) => {
  const AIRTABLE_CLIENT = new AirtableClient();

  try {
    const OPERATION_RESULT = await AIRTABLE_CLIENT.getAll();
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
  getAll,
};
