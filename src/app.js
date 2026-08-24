const path = require('node:path');
const express = require('express');
const accountRoutes = require('./routes/accountRoutes');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());

// Serve the frontend (public/index.html) as static files
app.use(express.static(path.join(__dirname, '..', 'public')));

// Simple health check endpoint (used by the frontend to detect connection status)
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Savings Account API is running.',
  });
});

app.use('/api/accounts', accountRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
