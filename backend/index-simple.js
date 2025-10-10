require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// CORS Configuration
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://192.168.1.7:3000', 
    'http://192.168.1.2:3000',
    'https://esirv02.my.id',
    'https://www.esirv02.my.id'
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Server is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Basic auth route (without database for now)
app.post('/api/auth/login', (req, res) => {
  res.json({
    success: true,
    message: 'Login endpoint ready (database connection needed)',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint tidak ditemukan'
  });
});

const PORT = process.env.PORT || 3001;

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server berjalan di port ${PORT}`);
  console.log(`✅ Test endpoint: http://localhost:${PORT}/test`);
  console.log(`✅ Health endpoint: http://localhost:${PORT}/api/health`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle server errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
