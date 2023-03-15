const MODULE_ID = 'whatsapp-api-express-routes';

const ramda = require('ramda');
const lodash = require('lodash');

const whatsappRoutes = require('./lib/routes');

const initByConfiguration = async (configuration, app) => {
  try {
    // TODO: CHECK CONFIGS PARAMS
    // TODO: CHECK APP PARAMS

    app.use('/whatsapp-api', whatsappRoutes);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  initByConfiguration,
};
