const express = require('express');
const cors = require('cors');
const skillsRouter = require('./routes/skillsRouter');
const certificatesRouter = require('./routes/certificatesRouter');

/** Assembles the Express app (no listening — used directly by server.js and by tests). */
function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

  app.use('/api/skills', skillsRouter);
  app.use('/api/certificates', certificatesRouter);

  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}

module.exports = { createApp };
