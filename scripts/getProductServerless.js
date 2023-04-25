import Airtable from 'airtable';

async function main(args) {
  const apiKey = process.env.AIRTABLE_ADMIN_ACCESS_TOKEN;
  const baseId = proccess.env.AIRTABLE_SOS_DIESEL_DATABASE_ID;
  const CATALOG_TABLE_NAME = 'Catalog';
  const base = new Airtable({ apiKey }).base(baseId);

  const records = await base(CATALOG_TABLE_NAME).select({
    filterByFormula: `Codigo = '${args.codigo}'`,
    maxRecords: 1,
  })
  .all();

  console.log("records", records);

  if (records.length > 0) {
    return {"body": records[0]}
  } else {
    const error_message = `No record found with Codigo ${codigo}`;
    console.log(error_message);
    return {"body": error_message}
  }
}