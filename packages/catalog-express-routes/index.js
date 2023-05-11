const MODULE_ID = 'catalog-express-routes';

const ramda = require('ramda');
const lodash = require('lodash');

const CATALOG_ROUTES = require('./lib/routes');

const initByConfiguration = async (configuration, app) => {
  try {
    app.use('/catalog', CATALOG_ROUTES);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  initByConfiguration,
};
