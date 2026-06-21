const { app } = require('./app');
const { migrate } = require('./db/migrate');
const { config } = require('./config');

migrate().then(() => {
  app.listen(config.port, () => {
    console.log(`LueRevival listening on ${config.baseUrl} (port ${config.port})`);
    console.log('Source material: https://github.com/acjordan2/AlpacaBoards');
  });
}).catch((err) => {
  console.error('Startup failed:', err);
  process.exit(1);
});
