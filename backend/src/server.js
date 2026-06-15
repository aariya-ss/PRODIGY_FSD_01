require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { initDB } = require('./config/db');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database Schema
initDB();

// Global Middlewares
app.use(helmet()); // Set security-related HTTP headers
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true, // Allow cookies to be sent along with API calls
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use(express.json()); // Parse incoming JSON payloads
app.use(cookieParser()); // Parse cookies from requests

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Root health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy and running.' });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start listening
app.listen(PORT, () => {
  console.log(`[Secure Auth Server] running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
