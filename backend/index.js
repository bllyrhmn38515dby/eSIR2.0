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
const dokumenRoutes = require('./routes/dokumen');

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
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('⚠️  Using mock data mode');
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
app.use('/api/dokumen', dokumenRoutes);

// Socket.IO middleware for authentication
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Authentication error: Token required'));
  }

  try {
    // Verify JWT token
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user data from database
    const [users] = await pool.execute(
      `SELECT u.*, r.nama_role as role 
       FROM users u 
       LEFT JOIN roles r ON u.role_id = r.id 
       WHERE u.id = ?`,
      [decoded.userId]
    );

    if (users.length === 0) {
      return next(new Error('Authentication error: User not found'));
    }

    // Store user info in socket
    socket.user = users[0];
    socket.userToken = token;
    
    console.log(`🔐 Socket authenticated: ${socket.user.nama_lengkap} (${socket.user.role})`);
    return next();
  } catch (error) {
    console.error('❌ Socket authentication error:', error.message);
    return next(new Error('Authentication error: Token verification failed'));
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.id} - ${socket.user?.nama_lengkap} (${socket.user?.role})`);
  
  // Auto-join rooms based on user role
  if (socket.user) {
    if (socket.user.role === 'admin') {
      socket.join('admin');
      console.log(`👑 Admin ${socket.user.nama_lengkap} joined admin room: ${socket.id}`);
    } else if ((socket.user.role === 'puskesmas' || socket.user.role === 'rs') && socket.user.faskes_id) {
      socket.join(`faskes-${socket.user.faskes_id}`);
      console.log(`🏥 ${socket.user.role} ${socket.user.nama_lengkap} joined faskes room ${socket.user.faskes_id}: ${socket.id}`);
    }
  }

  // Manual room joining (for backward compatibility)
  socket.on('join-admin', () => {
    socket.join('admin');
    console.log(`👑 Manual admin join: ${socket.id}`);
  });

  socket.on('join-faskes', (faskesId) => {
    socket.join(`faskes-${faskesId}`);
    console.log(`🏥 Manual faskes join ${faskesId}: ${socket.id}`);
  });

  socket.on('join-tracking', (rujukanId) => {
    socket.join(`tracking-${rujukanId}`);
    console.log(`🛰️ Tracking room ${rujukanId} joined: ${socket.id}`);
  });

  // Handle disconnect
  socket.on('disconnect', (reason) => {
    // Only log disconnects in development or for specific reasons
    if (process.env.NODE_ENV === 'development' || reason !== 'transport close') {
      console.log(`❌ User disconnected: ${socket.id} - ${socket.user?.nama_lengkap} (${reason})`);
    }
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
  
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server berjalan di port ${PORT}`);
    console.log(`✅ Test endpoint: http://localhost:${PORT}/test`);
    console.log(`✅ Login endpoint: http://localhost:${PORT}/api/auth/login`);
    console.log(`✅ Stats endpoint: http://localhost:${PORT}/api/rujukan/stats/overview`);
    console.log(`✅ Network access: http://192.168.18.6:${PORT}`);
    
    if (dbConnected) {
      console.log(`✅ Database terhubung: ${process.env.DB_DATABASE || 'prodsysesirv02'}`);
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

const databaseMonitor = require('./utils/databaseMonitor');

// Start database monitoring
databaseMonitor.startMonitoring();

// Add health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const dbStatus = databaseMonitor.getConnectionStatus();
    const isHealthy = dbStatus.isConnected;
    
    res.json({
      success: true,
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      database: dbStatus,
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 'error',
      message: error.message
    });
  }
});