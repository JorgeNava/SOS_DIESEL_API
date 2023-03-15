class Datasource {
  constructor(client, name, databaseName) {
    this.name = name;
    this.db = client.db(databaseName);
    this.client = client;
  }

  async executeCommand(commandString) {
    console.log('[NAVA] this.db :', this.db);
    return await this.db.command(eval(commandString));
  }
}

module.exports = Datasource;

/* 
const { MongoClient } = require('mongodb');
const uri = '<Atlas URI>';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function insertDocument() {
  try {
    await client.connect();
    const database = client.db('<database name>');
    const collection = database.collection('<collection name>');
    const document = {nombre: "Avril", cantidad: 500, fecha_entrega: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)};
    const result = await collection.insertOne(document);
    console.log(`Document inserted with _id: ${result.insertedId}`);
  } finally {
    await client.close();
  }
}

insertDocument().catch(console.error);

*/
