require('dotenv').config();
const MODULE_ID = 'airtable-client-provider';

const Airtable = require('airtable');
const { CATALOG_TABLE_NAME } = require('./utils/constants');

const constructProductObject = (productData) => {
  const PRODUCT_ID = productData?.id;
  const PRODUCT_NAME = productData?.name;
  const PRODUCT_NOTE = productData?.notes;
  const PRODUCT_DESCRIPTION = productData?.description;
  const PRODUCT_COST = productData?.cost;
  const PRODUCT_STATUS = productData?.status;
  const PRODUCT_QUANTITY = productData?.quantity;
  const PRODUCT_IMAGE_URL = productData?.imageUrl;
  const PRODUCT_TYPE = productData?.type;

  //TODO: INSERT DATA VALIDATION AND HANDLING HERE

  const RET_VAL = {
    fields: {
      ProductId: PRODUCT_ID,
      Name: PRODUCT_NAME,
      Notes: PRODUCT_NOTE,
      Description: PRODUCT_DESCRIPTION,
      Cost: PRODUCT_COST,
      Status: PRODUCT_STATUS,
      Quantity: PRODUCT_QUANTITY,
      Image: [
        {
          url: PRODUCT_IMAGE_URL,
        },
      ],
      Type: PRODUCT_TYPE,
    },
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

  async getAll(tableName) {
    try {
      const records = await this.base(tableName).select().all();
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

  async insertOne(productData) {
    const RET_VAL = await this.base(CATALOG_TABLE_NAME).create([
      constructProductObject(productData),
    ]);
    return RET_VAL;
  }

  async updateProductById(updateFields) {
    try {
      const PRODUCT_ID = updateFields?.productId;
      const RECORD = await this.getProductById(PRODUCT_ID);
      const UPDATE_OBJECT = constructProductObject(updateFields);

      if (RECORD) {
        const UPDATED_RECORD = await this.base(CATALOG_TABLE_NAME).update(
          RECORD.getId(),
          UPDATE_OBJECT
        );
        console.log(
          `Record with ProductId ${PRODUCT_ID} updated:`,
          UPDATED_RECORD
        );
      } else {
        console.log(`No record found with ProductId ${PRODUCT_ID}`);
      }
    } catch (error) {
      console.error(error);
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
      console.log(`Record with ProductId ${productId} was deleted`);
    } catch (error) {
      console.error(
        `Error deleting record with ProductId ${productId}: ${error}`
      );
    }
  }
}

module.exports = AirtableClient;
