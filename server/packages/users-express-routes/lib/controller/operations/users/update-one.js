const MODULE_ID = '';

const {USERS_OPERARIONS} = require('../../../../../airtable-client-provider');


const updateOne = async (req, res) => {
  try {
    const BODY = req.body;
    const EMAIL = BODY.email;
    const USERNAME = BODY.username;
    const PASSWORD = BODY.password;
    const NOTES = BODY.notes;
    const STATUS = BODY.status;
    const PROFILE_IMAGE = BODY.profileImage;

    const OPERATION_RESULT = await USERS_OPERARIONS.updateUser(EMAIL, USERNAME, PASSWORD, NOTES, STATUS, PROFILE_IMAGE);
    if (Object.keys(OPERATION_RESULT).length) {
      res.status(200).send(OPERATION_RESULT);
    } else {
      res.status(500).send({error: OPERATION_RESULT.message});
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({error: error.message});
  }
};

module.exports = {
  updateOne,
};
