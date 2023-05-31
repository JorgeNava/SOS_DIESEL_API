const MODULE_ID = 'airtable-client-provider-controllers-catalog';

const airtableClient = require('../airtableInstance');
const { CATALOG_TABLE_NAME } = require('../utils/constants');
const CatalogTable = airtableClient.getBase()(CATALOG_TABLE_NAME);
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: "du1cxbsxb",
  api_key: "362398978389318",
  api_secret: "ERteTOBI33rmpfmhId9GPilxYXo"
});

function base64ToFile(base64String, fileName) {
  const fileData = base64String.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(fileData, 'base64');
  fs.writeFileSync(fileName, buffer, 'base64');
}

async function createProduct(productParams) {
  try {
    const PRODUCT_CODE = productParams.code;
    const existingProduct = await CatalogTable.select({
      filterByFormula: `{Code} = "${PRODUCT_CODE}"`
    }).firstPage();

    if (existingProduct && existingProduct.length > 0) {
      throw new Error('Product with code already exists');
    }

    const NEW_PRODUCT_DATA = {
      Code: PRODUCT_CODE,
      Name: productParams.name,
      Description: productParams.description,
      Price: productParams.price,
      Quantity: productParams.quantity,
      Brand: productParams.brand,
      TruckModel: productParams.truckModel,
      Images: [],
    };

    for (let index = 0; index < productParams.images.length; index++) {
      const FILENAME = `product_${PRODUCT_CODE}_image_${index}`;
      const filePath = `server/temp/${FILENAME}.jpg`;
      base64ToFile(productParams.images[index], filePath);
      const res = await cloudinary.uploader.upload(filePath, { public_id: FILENAME });
      const ASSET_URL = res.secure_url;
      NEW_PRODUCT_DATA.Images.push({ url: ASSET_URL });

      fs.unlink(filePath, (err) => {
        if (err) {
          return;
        }
      });
    }
    
    const NEW_PRODUCT = await CatalogTable.create(NEW_PRODUCT_DATA);
    return NEW_PRODUCT;
  } catch (error) {
    console.error(error)
    return error
  }
}

async function updateProduct(productParams) {
  try {
    const fieldsToUpdate = {};
    const PRODUCT_CODE = productParams.code;

    if (PRODUCT_CODE) fieldsToUpdate.Code = PRODUCT_CODE
    if (productParams.price) fieldsToUpdate.Price = productParams.price 
    if (productParams.quantity) fieldsToUpdate.Quantity = productParams.quantity
    if (productParams.name) fieldsToUpdate.Name = productParams.name
    if (productParams.description) fieldsToUpdate.Description = productParams.description
    if (productParams.brand) fieldsToUpdate.Brand = productParams.brand
    if (productParams.truckModel) fieldsToUpdate.TruckModel = productParams.truckModel

    if (productParams.images) {
      fieldsToUpdate.Images = [];
      for (let index = 0; index < productParams.images.length; index++) {
        const FILENAME = `product_${PRODUCT_CODE}_image_${index}_${new Date().getTime()}`;
        const filePath = `server/temp/${FILENAME}.jpg`;
        base64ToFile(productParams.images[index], filePath);
        const res = await cloudinary.uploader.upload(filePath, { public_id: FILENAME });
        const ASSET_URL = res.secure_url;
        fieldsToUpdate.Images.push({ url: ASSET_URL });
  
        fs.unlink(filePath, (err) => {
          if (err) {
            return;
          }
        });
      }
    }


    const filterByFormula = `{Code} = "${PRODUCT_CODE}"`;
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
    const PRODUCT_CODE = productParams.code;
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
  const PRODUCT_CODE = productParams.code;
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
