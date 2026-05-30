// src/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./utils/errorHandler');

// Routes
const authRoutes = require('./routes/authRoutes');
const farmerRoutes = require('./routes/farmerRoutes');
const laborRoutes = require('./routes/laborRoutes');
const archiveRoutes = require('./routes/archiveRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Connect Database
connectDB();

// ==================== MIDDLEWARE ====================

// CORS - allow frontend
app.use(cors());

// Body parsers - INCREASED LIMIT FOR BASE64 IMAGES
app.use(express.json({ limit: '30mb' }));                    // ← Critical for large images
app.use(express.urlencoded({ extended: true, limit: '30mb' })); // ← Also for form data

// Serve uploaded files (if you ever use file uploads later)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ==================== ROUTES ====================

app.use('/api/auth', authRoutes);
app.use('/api/farmer', farmerRoutes);
app.use('/api/labor', laborRoutes);
app.use('/api/archive', archiveRoutes);
app.use('/api/admin', adminRoutes);

// ==================== ERROR HANDLING ====================

app.use(errorHandler);

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

module.exports = app;