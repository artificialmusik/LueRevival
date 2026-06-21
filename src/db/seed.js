const { migrate } = require('./migrate');

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
