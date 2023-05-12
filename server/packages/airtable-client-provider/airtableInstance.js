require('dotenv').config();

const AirtableClient = require('./airtableClient');

const airtableClient = new AirtableClient(process.env.AIRTABLE_ADMIN_ACCESS_TOKEN, process.env.AIRTABLE_SOS_DIESEL_DATABASE_ID);
(async () => {
  try {
    const CONNECTION_SUCCESS = await airtableClient.checkConnection();
    console.log('[AirtableClient] CONNECTION_SUCCESS :', CONNECTION_SUCCESS);
  } catch (error) {
    console.error(error);
  }
})();

module.exports = airtableClient;
