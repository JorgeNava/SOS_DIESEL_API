const { createProduct } = require('./create-product');
const { updateProduct } = require('./update-product');
const { deleteProduct } = require('./delete-product');
const { getOneProduct } = require('./get-one-product');
const { getAllProducts } = require('./get-all-products');

const CATALOG_CONTROLLER = {
  createProduct,
  updateProduct,
  deleteProduct,
  getOneProduct,
  getAllProducts
}

module.exports = {
  CATALOG_CONTROLLER
};
