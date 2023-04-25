const MODULE_ID = 'airtable-client-provider';
const Airtable = require('airtable');

const { CATALOG_TABLE_NAME, USERS_TABLE_NAME } = require('./utils/constants');


class AirtableClient {
  constructor(apiKey, baseId) {
    this.base = new Airtable({ apiKey: apiKey }).base(baseId);
  }

  async checkConnection() {
    try {
      await this.base.table(CATALOG_TABLE_NAME);
      await this.base.table(USERS_TABLE_NAME);
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
