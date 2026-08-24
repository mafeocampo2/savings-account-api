const express = require('express');
const accountRoutes = require('./routes/accountRoutes');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());

// Simple health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Savings Account API is running.',
  });
});

app.use('/api/accounts', accountRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
