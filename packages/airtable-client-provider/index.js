require('dotenv').config();
const MODULE_ID = 'airtable-client-provider';

const Airtable = require('airtable');
const { CATALOG_TABLE_NAME } = require('./utils/constants');

const constructProductObject = (productData, isUpdateObject = false) => {
  const PRODUCT_ID = productData?.productId;
  const PRODUCT_NAME = productData?.name;
  const PRODUCT_NOTE = productData?.notes;
  const PRODUCT_DESCRIPTION = productData?.description;
  const PRODUCT_COST = productData?.cost;
  const PRODUCT_STATUS = productData?.status;
  const PRODUCT_QUANTITY = productData?.quantity;
  const PRODUCT_IMAGE_URL = productData?.imageUrl;
  const PRODUCT_TYPE = productData?.productType;

  //TODO: INSERT DATA VALIDATION AND HANDLING HERE

  const PRODUCT_OBJECT = {
    ProductId: PRODUCT_ID,
    Name: PRODUCT_NAME,
    Notes: PRODUCT_NOTE,
    Description: PRODUCT_DESCRIPTION,
    Cost: PRODUCT_COST,
    Status: PRODUCT_STATUS,
    Quantity: PRODUCT_QUANTITY,
    /*       Image: [
        {
          url: PRODUCT_IMAGE_URL,
        },
      ], */
    ProductType: PRODUCT_TYPE,
  };

  const RET_VAL = isUpdateObject
    ? PRODUCT_OBJECT
    : {
        fields: PRODUCT_OBJECT,
      };
  return RET_VAL;
};

class AirtableClient {
  //* IF MORE DATABASES WILL BE REQUIRED TO BE CONNECTED CHANGE FROM SINGLETON APPROACH TO CONNECTION POOLING
  constructor(apiKey, baseId) {
    if (!AirtableClient.instance) {
      this.base = new Airtable({ apiKey }).base(baseId);
      AirtableClient.instance = this;
    }
    return AirtableClient.instance;
  }

  async checkConnection() {
    try {
      await this.base.table(CATALOG_TABLE_NAME);
      return true;
    } catch (error) {
      console.error('Error connecting to Airtable:', error);
      return false;
    }
  }

  async getAll() {
    try {
      const records = await this.base(CATALOG_TABLE_NAME).select().all();
      return records.map((record) => record.fields);
    } catch (error) {
      console.error('Error retrieving records from Airtable:', error);
      throw error;
    }
  }

  async getProductById(productId) {
    try {
      const records = await this.base(CATALOG_TABLE_NAME)
        .select({
          filterByFormula: `ProductId = '${productId}'`,
          maxRecords: 1,
        })
        .all();

      if (records.length > 0) {
        return records[0];
      } else {
        console.log(`No record found with ProductId ${productId}`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getManyProductsByIds(productIds) {
    try {
      const records = await this.base(CATALOG_TABLE_NAME)
        .select({
          filterByFormula: `OR(${productIds
            .map((productId) => `{ProductId}='${productId}'`)
            .join(',')})`,
        })
        .all();

      if (records && records.length) {
        const products = records.map((record) => {
          return record;
        });
        return products;
      }
      return [];
    } catch (error) {
      console.error('Error retrieving products:', error);
    }
  }

  async insertOneProduct(productData) {
    try {
      const RET_VAL = await this.base(CATALOG_TABLE_NAME).create([
        constructProductObject(productData),
      ]);
      return RET_VAL;
    } catch (error) {
      console.error(error);
    }
  }

  async insertManyProducts(products) {
    const records = products.map((product) => {
      return constructProductObject(product);
    });

    try {
      const createdRecords = await this.base(CATALOG_TABLE_NAME).create(
        records
      );
      console.log(`Created ${createdRecords.length} records`);
      return createdRecords;
    } catch (err) {
      console.error(`Error creating records: ${err}`);
    }
  }

  async updateProductById(updateFields) {
    try {
      const PRODUCT_ID = updateFields?.productId;
      const RECORD = await this.getProductById(PRODUCT_ID);

      updateFields = constructProductObject(updateFields, true);
      delete updateFields.ProductId;

      if (RECORD) {
        const UPDATED_RECORD = await this.base(CATALOG_TABLE_NAME).update(
          RECORD.getId(),
          updateFields
        );
        return UPDATED_RECORD;
      } else {
        console.log(`No record found with ProductId ${PRODUCT_ID}`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async updateManyProductsByIds(productIds, updateFields) {
    try {
      const products = await this.getManyProductsByIds(productIds);
      const updateObjects = products.map((product) => {
        const UPDATE_FIELD = updateFields.find(
          (updateField) => updateField.productId === product.fields.ProductId
        );
        return {
          id: product.id,
          fields: constructProductObject(UPDATE_FIELD, true),
        };
      });
      const updatedRecords = await this.base(CATALOG_TABLE_NAME).update(
        updateObjects
      );
      return updatedRecords;
    } catch (error) {
      console.error('Error updating records:', error);
      throw error;
    }
  }

  async removeProductById(productId) {
    try {
      const RECORDS = await this.base(CATALOG_TABLE_NAME)
        .select({
          filterByFormula: `{ProductId} = '${productId}'`,
          maxRecords: 1,
          fields: ['ProductId'],
        })
        .all();

      if (RECORDS.length === 0) {
        throw new Error(`Record with ProductId ${productId} not found`);
      }

      const RECORD = RECORDS[0];
      await this.base(CATALOG_TABLE_NAME).destroy(RECORD.getId());
      const RET_VAL = `Record with ProductId ${productId} was deleted`;
      return RET_VAL;
    } catch (error) {
      console.error(
        `Error deleting record with ProductId ${productId}: ${error}`
      );
    }
  }

  async removeManyProductsById(productIds) {
    try {
      const filterFormula = `OR(${productIds
        .map((id) => `ProductId = '${id}'`)
        .join(',')})`;

      const records = await this.base(CATALOG_TABLE_NAME)
        .select({
          filterByFormula: filterFormula,
          fields: ['ProductId'],
        })
        .all();

      const recordIds = records.map((record) => record.getId());
      const deleteResult = await this.base(CATALOG_TABLE_NAME).destroy(
        recordIds
      );

      return `Deleted ${deleteResult.length} records`;
    } catch (error) {
      console.error(`Error deleting many records: ${error}`);
    }
  }
}

module.exports = AirtableClient;
