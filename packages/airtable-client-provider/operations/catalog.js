require('dotenv').config();
const MODULE_ID = 'airtable-client-provider';

const lodash = require('lodash');
const Airtable = require('airtable');
const { CATALOG_TABLE_NAME } = require('./utils/constants');

class AirtableClient {
  constructor(apiKey, baseId) {
    this.base = new Airtable({ apiKey: apiKey }).base(baseId);
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

  getBase() {
    return this.base;
  }
}

module.exports = AirtableClient;

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

  async getProductById(codigo) {
    try {
      const records = await this.base(CATALOG_TABLE_NAME)
        .select({
          filterByFormula: `Codigo = '${codigo}'`,
          maxRecords: 1,
        })
        .all();

      if (records.length > 0) {
        return records[0];
      } else {
        console.log(`No record found with Codigo ${codigo}`);
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
            .map((codigo) => `{Codigo}='${codigo}'`)
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
      const VALID_DATA_INPUT = validateProductData(productData);
      if (!VALID_DATA_INPUT) {
        const INVALID_PRODUCT_ERROR = new Error();
        INVALID_PRODUCT_ERROR.statusCode = 400;
        INVALID_PRODUCT_ERROR.message = 'Bad Request';
        INVALID_PRODUCT_ERROR.data = {
          reason: 'Invalid input (missing required data)',
          product: product,
        };
        throw INVALID_PRODUCT_ERROR;
      }
      const RET_VAL = await this.base(CATALOG_TABLE_NAME).create([
        constructProductObject(productData),
      ]);
      return RET_VAL;
    } catch (error) {
      console.error(error);
    }
  }

  async insertManyProducts(products) {
    try {
      products.forEach((product) => {
        const VALID_DATA_INPUT = validateProductData(product);
        if (!VALID_DATA_INPUT) {
          const INVALID_PRODUCT_ERROR = new Error();
          INVALID_PRODUCT_ERROR.statusCode = 400;
          INVALID_PRODUCT_ERROR.message = 'Bad Request';
          INVALID_PRODUCT_ERROR.data = {
            reason: 'Invalid input (missing required data)',
            product: product,
          };
          throw INVALID_PRODUCT_ERROR;
        }
      });
      const records = products.map((product) => {
        return constructProductObject(product);
      });
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
      const CODIGO = updateFields?.codigo;
      const RECORD = await this.getProductById(CODIGO);

      updateFields = constructProductObject(updateFields, true);
      delete updateFields.Codigo;

      if (RECORD) {
        const UPDATED_RECORD = await this.base(CATALOG_TABLE_NAME).update(
          RECORD.getId(),
          updateFields
        );
        return UPDATED_RECORD;
      } else {
        console.log(`No record found with Codigo ${CODIGO}`);
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
          (updateField) => updateField.codigo === product.fields.Codigo
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

  async removeProductById(codigo) {
    try {
      const RECORDS = await this.base(CATALOG_TABLE_NAME)
        .select({
          filterByFormula: `{Codigo} = '${codigo}'`,
          maxRecords: 1,
          fields: ['Codigo'],
        })
        .all();

      if (RECORDS.length === 0) {
        throw new Error(`Record with Codigo ${codigo} not found`);
      }

      const RECORD = RECORDS[0];
      await this.base(CATALOG_TABLE_NAME).destroy(RECORD.getId());
      const RET_VAL = `Record with Codigo ${codigo} was deleted`;
      return RET_VAL;
    } catch (error) {
      console.error(
        `Error deleting record with Codigo ${codigo}: ${error}`
      );
    }
  }

  async removeManyProductsById(productIds) {
    try {
      const filterFormula = `OR(${productIds
        .map((id) => `Codigo = '${id}'`)
        .join(',')})`;

      const records = await this.base(CATALOG_TABLE_NAME)
        .select({
          filterByFormula: filterFormula,
          fields: ['Codigo'],
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
