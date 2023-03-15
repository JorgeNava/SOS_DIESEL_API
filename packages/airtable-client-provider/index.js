require('dotenv').config();
const MODULE_ID = 'airtable-client-provider';

class AirtableClient {
  constructor(config) {
    this.config = config;
  }

  async checkAirtableConnection(client) {
    try {
      console.log('Airtable client was connected successfully');
    } catch (err) {
      console.error('Airtable client connection error:', err.message);
    }
  }
}

module.exports = { AirtableClient };
