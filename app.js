const AirtableClient = require('airtable-client-provider');

(async () => {
  try {
    const config = {};

    const AIRTABLE_CLIENT = new AirtableClient(
      process.env.AIRTABLE_ADMIN_ACCESS_TOKEN,
      process.env.AIRTABLE_SOS_DIESEL_DATABASE_ID
    );

    const CONNECTION_SUCCESS = await AIRTABLE_CLIENT.checkConnection();
    console.log('[AirtableClient] CONNECTION_SUCCESS :', CONNECTION_SUCCESS);

    const { startServer } = require('./server');
    await startServer();
  } catch (error) {
    console.error(error);
  }
})();
