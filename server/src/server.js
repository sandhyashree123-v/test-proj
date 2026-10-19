const { createApp } = require('./app');
const { initializeDatabase } = require('./seed/seedDataLoader');

const PORT = process.env.PORT || 4000;

function start() {
  // Schema creation + seeding completes before the HTTP listener binds, so the catalog
  // and certificate verification are never "empty" on first run.
  initializeDatabase();

  const app = createApp();
  app.listen(PORT, () => {
    console.log(`AI Skills Catalog API listening on port ${PORT}`);
  });
}

start();

module.exports = { start };
