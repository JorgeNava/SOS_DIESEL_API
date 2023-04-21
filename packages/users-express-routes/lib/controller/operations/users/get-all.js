const MODULE_ID = '';

const {USERS_OPERARIONS} = require('airtable-client-provider');

const getAllUsers = async (req, res) => {
  try {
    const OPERATION_RESULT = await USERS_OPERARIONS.getAllUsers();
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
  getAllUsers,
};
