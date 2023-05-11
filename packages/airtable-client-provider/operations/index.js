const CATALOG_OPERATIONS = {
  createProduct,
  updateProduct,
  deleteProduct,
  getOneProduct,
  getAllProducts
} = require('./catalog');

const USERS_OPERARIONS = {
  createUser,
  updateUser,
  deleteUserByEmail,
  deleteManyUsersByEmail,
  getUserByEmail,
  getAllUsers
}  = require('./users');

module.exports = {
  CATALOG_OPERATIONS,
  USERS_OPERARIONS
};
