const MODULE_ID = 'users-express-routes';

const usersRoutes = require('./lib/routes');

const initByConfiguration = async (configuration, app) => {
  try {
    app.use('/users', usersRoutes);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  initByConfiguration,
};
