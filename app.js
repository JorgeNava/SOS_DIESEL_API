(async () => {
  try {
    const config = {};

    await require('assistant-datasource-provider').initByConfiguration(config);
    await require('open-ai-service').initByConfiguration(config);

    const { startServer } = require('./server');
    await startServer();
  } catch (error) {
    console.error(error);
  }
})();
