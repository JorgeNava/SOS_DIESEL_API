const { createOne } = require('./create-one');
const { updateOne } = require('./update-one');
const { deleteUserByEmail } = require('./delete-one-by-email');
const { getUserByEmail } = require('./get-one-by-email');
const { getAllUsers } = require('./get-all');
const { login } = require('./login');

const USERS_CONTROLLER = {
  createOne,
  updateOne,
  deleteUserByEmail,
  getUserByEmail,
  getAllUsers,
  login
}

module.exports = {
  USERS_CONTROLLER
};
