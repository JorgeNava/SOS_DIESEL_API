const MODULE_ID = 'open-ai-service';

const ramda = require('ramda');
const lodash = require('lodash');

const initByConfiguration = async (config) => {
  // TODO: HANDLE VALIDATION OF CONFIG
};

const { naturalLanguageIntoQuery } = require('./lib/api/mongo');

module.exports = {
  initByConfiguration,
  naturalLanguageIntoQuery,
};
