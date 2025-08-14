require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const pool = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const pasienRoutes = require('./routes/pasien');
const rujukanRoutes = require('./routes/rujukan');
const faskesRoutes = require('./routes/faskes');
const notificationRoutes = require('./routes/notifications');
const tempatTidurRoutes = require('./routes/tempatTidur');
const laporanRoutes = require('./routes/laporan');
const searchRoutes = require('./routes/search');
const trackingRoutes = require('./routes/tracking');

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

// Test database connection
async function testDatabaseConnection() {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    return false;
  }
}

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Routes (with error handling)
app.use('/api/auth', authRoutes);
app.use('/api/pasien', pasienRoutes);
app.use('/api/rujukan', rujukanRoutes);
app.use('/api/faskes', faskesRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/tempat-tidur', tempatTidurRoutes);
app.use('/api/laporan', laporanRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/tracking', trackingRoutes);

// Socket.IO middleware for authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Authentication error: Token required'));
  }

  try {
    // Verify token (you can use your existing JWT verification logic)
    // For now, we'll just check if token exists
    if (token) {
      socket.userToken = token;
      return next();
    } else {
      return next(new Error('Authentication error: Invalid token'));
    }
  } catch (error) {
    return next(new Error('Authentication error: Token verification failed'));
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.id}`);
  
  // Store user info
  socket.userToken = socket.handshake.auth.token;

  // Join admin room
  socket.on('join-admin', () => {
    socket.join('admin');
    console.log(`👑 Admin joined room: ${socket.id}`);
  });

  // Join faskes room
  socket.on('join-faskes', (faskesId) => {
    socket.join(`faskes-${faskesId}`);
    console.log(`🏥 Faskes ${faskesId} joined room: ${socket.id}`);
  });

  // Join tracking room
  socket.on('join-tracking', (rujukanId) => {
    socket.join(`tracking-${rujukanId}`);
    console.log(`🛰️ Tracking room ${rujukanId} joined: ${socket.id}`);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });

  // Handle errors
  socket.on('error', (error) => {
    console.error(`❌ Socket error for ${socket.id}:`, error);
  });
});

// Make io available globally
global.io = io;

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  
  // Handle database connection errors
  if (err.code === 'ECONNREFUSED') {
    return res.status(503).json({
      success: false,
      message: 'Database tidak tersedia. Silakan coba lagi nanti.'
    });
  }
  
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

// Start server with database check
async function startServer() {
  const dbConnected = await testDatabaseConnection();
  
  server.listen(PORT, () => {
    console.log(`✅ Server berjalan di port ${PORT}`);
    console.log(`✅ Test endpoint: http://localhost:${PORT}/test`);
    console.log(`✅ Login endpoint: http://localhost:${PORT}/api/auth/login`);
    console.log(`✅ Stats endpoint: http://localhost:${PORT}/api/rujukan/stats/overview`);
    
    if (dbConnected) {
      console.log(`✅ Database terhubung: ${process.env.DB_DATABASE || 'esirv2'}`);
    } else {
      console.log(`⚠️  Database tidak tersedia, menggunakan mock data`);
    }
  });
}

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} sudah digunakan. Silakan matikan proses yang menggunakan port ini.`);
  } else {
    console.error('❌ Server error:', error);
  }
  process.exit(1);
});

// Start the server
startServer();