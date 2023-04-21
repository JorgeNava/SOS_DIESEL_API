const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {USERS_OPERARIONS} = require('airtable-client-provider');

async function login(req, res) {
  try {
    const EMAIL = req?.body?.email;
    const PASSWORD = req?.body?.password;
    const user = await USERS_OPERARIONS.getUserByEmail(EMAIL);
    const isPasswordValid = await bcrypt.compare(PASSWORD, user?.fields?.Password)
    if (!isPasswordValid) {
      throw new Error('Invalid email or password')
    }
    const token = jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
    res.status(200).send({token: token});
  } catch (error) {
    console.error(error)
    res.status(500).send({error: error.message});
  }
}

module.exports = {
  login,
};
