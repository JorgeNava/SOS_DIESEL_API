const { getOneById } = require('./get-one-by-id');
const { getManyById } = require('./get-many-by-id');
const { updateOneById } = require('./update-one-by-id');
const { updateManyById } = require('./update-many-by-id');
const { insertOne } = require('./insert-one');
const { insertMany } = require('./insert-many');
const { removeOneById } = require('./remove-one-by-id');
const { removeManyById } = require('./remove-many-by-id');
const { getAll } = require('./get-all');

module.exports = {
  getOneById,
  getManyById,
  updateOneById,
  updateManyById,
  insertOne,
  insertMany,
  removeOneById,
  removeManyById,
  getAll,
};
