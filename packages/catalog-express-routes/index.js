const MODULE_ID = 'catalog-express-routes';

const ramda = require('ramda');
const lodash = require('lodash');

const catalogRoutes = require('./lib/routes');

const initByConfiguration = async (configuration, app) => {
  try {
    // TODO: CHECK CONFIGS PARAMS
    // TODO: CHECK APP PARAMS

    app.use('/catalog', catalogRoutes);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  initByConfiguration,
};
