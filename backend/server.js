require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const factcheckRouter = require('./src/routes/factcheck');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

// CORS — allow both local dev and deployed frontend
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all in dev; tighten for production
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: '15mb' }));

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
