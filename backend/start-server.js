require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Simple auth route for testing
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simple mock login
  if (email === 'admin@pusat.com' && password === 'admin123') {
    res.json({
      success: true,
      data: {
        token: 'mock-jwt-token',
        user: {
          id: 1,
          nama: 'Admin Pusat',
          email: 'admin@pusat.com',
          role: 'admin_pusat',
          faskes_id: null
        }
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Email atau password salah'
    });
  }
});

// Simple stats route for testing
app.get('/api/rujukan/stats/overview', (req, res) => {
  // Check if Authorization header exists
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Token tidak ditemukan'
    });
  }

  // Return mock stats
  res.json({
    success: true,
    data: {
      total: 0,
      pending: 0,
      diterima: 0,
      ditolak: 0,
      selesai: 0
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan internal server'
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

server.listen(PORT, () => {
  console.log(`✅ Server berjalan di port ${PORT}`);
  console.log(`✅ Test endpoint: http://localhost:${PORT}/test`);
  console.log(`✅ Login endpoint: http://localhost:${PORT}/api/auth/login`);
  console.log(`✅ Stats endpoint: http://localhost:${PORT}/api/rujukan/stats/overview`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} sudah digunakan. Silakan matikan proses yang menggunakan port ini.`);
  } else {
    console.error('❌ Server error:', error);
  }
  process.exit(1);
});
