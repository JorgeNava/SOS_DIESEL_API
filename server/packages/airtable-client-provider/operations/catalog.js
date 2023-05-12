const MODULE_ID = 'airtable-client-provider-controllers-catalog';

const airtableClient = require('../airtableInstance');
const { CATALOG_TABLE_NAME } = require('../utils/constants');
const CatalogTable = airtableClient.getBase()(CATALOG_TABLE_NAME);

async function createProduct(productParams) {
  try {
    const PRODUCT_CODE = productParams?.code;
    const existingProduct = await CatalogTable.select({
      filterByFormula: `{Code} = "${PRODUCT_CODE}"`
    }).firstPage()

    if (existingProduct && existingProduct.length > 0) {
      throw new Error('Product with code already exists')
    }

    const newProduct = await CatalogTable.create({
      Code: PRODUCT_CODE,
      Name: productParams?.name,
      Description: productParams?.description,
      Price: productParams?.price,
      Brand: productParams?.brand,
      TruckModel: productParams?.truckModel
    })
    return newProduct
  } catch (error) {
    console.error(error)
    return error
  }
}

async function updateProduct(productParams) {
  try {
    const fieldsToUpdate = {};
    const PRODUCT_CODE = productParams?.code;

    if (PRODUCT_CODE) fieldsToUpdate.Code = PRODUCT_CODE
    if (productParams?.price) fieldsToUpdate.Price = productParams?.price
    if (productParams?.name) fieldsToUpdate.Name = productParams?.name
    if (productParams?.description) fieldsToUpdate.Description = productParams?.description
    if (productParams?.brand) fieldsToUpdate.Brand = productParams?.brand
    if (productParams?.truckModel) fieldsToUpdate.TruckModel = productParams?.truckModel

    const filterByFormula = `SEARCH("${PRODUCT_CODE}", {Code}) > 0`;
    const products = await CatalogTable.select({ filterByFormula }).all();
    if (products.length === 0) {
      throw new Error(`Product with code ${PRODUCT_CODE} not found`);
    } else if (products.length > 1) {
      throw new Error(`Found multiple products with code ${PRODUCT_CODE}`)
    }
    const product = products[0]

    const updatedProduct = await CatalogTable.update(product.id, fieldsToUpdate)
    return updatedProduct
  } catch (error) {
    console.error(error)
    return error;
  }
}

async function deleteProduct(productParams) {
  try {
    const PRODUCT_CODE = productParams?.code;
    const filterByFormula = `{Code} = "${PRODUCT_CODE}"`
    const products = await CatalogTable.select({ filterByFormula }).all()
    if (products.length === 0) {
      throw new Error(`Product with code ${PRODUCT_CODE} not found`)
    } else if (products.length > 1) {
      throw new Error(`Found multiple products with code ${PRODUCT_CODE}`)
    }
    const product = products[0]
    return await CatalogTable.destroy(product.id)
  } catch (error) {
    console.error(error)
    return error
  }
}

async function getOneProduct(productParams) {
  const PRODUCT_CODE = productParams?.code;
  const filterByFormula = `SEARCH("${PRODUCT_CODE}", {Code}) > 0`
  const products = await CatalogTable.select({ filterByFormula }).all()
  if (products.length === 0) {
    throw new Error(`Product with code ${PRODUCT_CODE} not found`)
  } else if (products.length > 1) {
    throw new Error(`Found multiple products with code ${PRODUCT_CODE}`)
  }
  const product = products[0]
  return product;
}

async function getAllProducts() {
  const allProducts = await CatalogTable.select().all();
  return allProducts;
}

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getOneProduct,
  getAllProducts
}
