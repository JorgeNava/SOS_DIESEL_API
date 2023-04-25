var Airtable = require('airtable');
var base = new Airtable({
  apiKey:
    'patJ2vCbbNsgHSDRR.1c7898c45244922241a35074d9772a990a2212b52c1dc8dafc400d4417b1e8e2',
}).base('appTFmRkJCpLWJSP5');

base('Catalog')
  .select({
    maxRecords: 3,
    view: 'Grid view',
  })
  .eachPage(
    function page(records, fetchNextPage) {
      records.forEach(function (record) {
        console.log('Retrieved', record.get('Nombre'));
      });
      fetchNextPage();
    },
    function done(err) {
      if (err) {
        console.error(err);
        return;
      }
    }
  );

base('Catalog').find('reczeyI2uaWsXfWEv', function (err, record) {
  if (err) {
    console.error(err);
    return;
  }
  console.log('Retrieved', record.id);
});
