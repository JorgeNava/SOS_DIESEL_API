const MODULE_ID = '';

const {USERS_OPERARIONS} = require('airtable-client-provider');

const deleteUserByEmail = async (req, res) => {
  try {
    const BODY = req.body;
    const EMAIL = BODY?.email;

    const OPERATION_RESULT = await USERS_OPERARIONS.deleteUserByEmail(EMAIL);
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
  deleteUserByEmail,
};
