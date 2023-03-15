const MODULE_ID = 'catalog-express-routes-controller-receive-message';

const { runCommand } = require('assistant-datasource-provider');

const getProductById = async (req, res) => {
  let body = req.body;
  let retVal;

  try {
    if (true) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  getProductById,
};
