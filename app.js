(async () => {
  try {
    const config = {};
    const { startServer } = require('./server');
    await startServer();
  } catch (error) {
    console.error(error);
  }
})();
