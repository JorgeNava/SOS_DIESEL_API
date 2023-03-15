require('dotenv').config();
//const Datasource = require('./datasource');
const MODULE_ID = 'assistant-datasource-mongo-provider';

const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.ASSISTANT_DATASOURCE_PROVIDER_URI;
const dbName = process.env.ASSISTANT_DATASOURCE_PROVIDER_DB_NAME;
let client;

const initByConfiguration = async (config) => {
  // TODO: HANDLE VALIDATION OF CONFIG
  try {
    client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1,
    });

    // TODO: HANDLE CONNECTION ERROR CORRECTLY
    client.connect(function (err) {
      if (err) {
        throw new Error(err);
      }
    });

    if (!(client instanceof MongoClient)) {
      throw new Error('Invalid MongoDB client instance');
    }
    await checkMongoDBConnection(client);
  } catch (error) {
    console.error(error);
  }
};

async function checkMongoDBConnection(client) {
  try {
    await client.db().admin().ping();
    console.log('MongoDB server is running and accessible');
  } catch (err) {
    console.error(
      'MongoDB server is not running or inaccessible:',
      err.message
    );
  }
}

async function runCommand(commandString) {
  try {
    const db = client.db(dbName);
    const result = await db.command(eval(commandString));
    console.log('Command executed:', result);
    return 'Command executed';
  } catch (err) {
    if (err.code === 59) {
      return 'Command executed';
    } else {
      console.error('Error running command:', err);
    }
  }
}

module.exports = { initByConfiguration, runCommand };
