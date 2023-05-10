const MODULE_ID = '';

const {USERS_OPERARIONS} = require('airtable-client-provider');

const createOne = async (req, res) => {
  try {
    const BODY = req.body;
    const EMAIL = BODY?.email;
    const USERNAME = BODY?.username;
    const PASSWORD = BODY?.password;
    const NOTES = BODY?.notes;
    const ROLE = BODY?.role;

    const OPERATION_RESULT = await USERS_OPERARIONS.createUser(EMAIL, USERNAME, PASSWORD, NOTES, ROLE);
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
  createOne,
};
