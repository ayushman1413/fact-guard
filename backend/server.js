require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const factcheckRouter = require('./src/routes/factcheck');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'FactGuard API is live' });
});

// Routes
app.use('/api', factcheckRouter);

// Global error handler
app.use(errorHandler);

// MongoDB connection
const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.warn('[WARNING] MONGODB_URI not set. Running without database persistence.');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');
  } catch (error) {
    console.warn('[WARNING] Failed to connect to MongoDB:', error.message);
    console.warn('App will continue running without database persistence.');
  }
};

connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✓ FactGuard API running on port ${PORT}`);
});
