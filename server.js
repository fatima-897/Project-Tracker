require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const projectsRouter = require('./routes/projects');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/project_tracker';

// ── Middleware ──────────
app.use(cors());
app.use(express.json());

// ── Routes ───────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok', time: new Date() }));
app.use('/api/projects', projectsRouter);

// ── 404 ───────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

// ── Global error handler ───
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Connect to MongoDB then start server ───
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(`Connected to MongoDB: ${MONGO_URI}`);
    app.listen(PORT, () =>
      console.log(`Server running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
