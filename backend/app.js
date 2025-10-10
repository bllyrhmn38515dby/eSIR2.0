// Production startup file for cPanel
require('dotenv').config({ path: '.env.production' });
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
const routingRoutes = require('./routes/routing');

const app = express();
const server = http.createServer(app);

// Socket.IO setup for production
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "https://yourdomain.com",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "https://yourdomain.com",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

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
  res.json({ 
    message: 'eSIR 2.0 Server is running!',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Routes
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
app.use('/api/routing', routingRoutes);
const chatRoutes = require('./routes/chat');
app.use('/api/chat', chatRoutes);

// Socket.IO middleware for authentication
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Authentication error: Token required'));
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
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
  
  if (socket.user) {
    if (socket.user.role === 'admin') {
      socket.join('admin');
    } else if ((socket.user.role === 'puskesmas' || socket.user.role === 'rs') && socket.user.faskes_id) {
      socket.join(`faskes-${socket.user.faskes_id}`);
    }
  }

  socket.on('join-admin', () => {
    socket.join('admin');
  });

  socket.on('join-faskes', (faskesId) => {
    socket.join(`faskes-${faskesId}`);
  });

  socket.on('join-tracking', (rujukanId) => {
    socket.join(`tracking-${rujukanId}`);
  });

  // New chat room join event
  socket.on('join-chat', (rujukanId) => {
    socket.join(`chat-${rujukanId}`);
    console.log(`User ${socket.user?.nama_lengkap} joined chat room for rujukan ${rujukanId}`);
  });

  socket.on('disconnect', (reason) => {
    if (process.env.NODE_ENV === 'development' || reason !== 'transport close') {
      console.log(`❌ User disconnected: ${socket.id} - ${socket.user?.nama_lengkap} (${reason})`);
    }
  });

  socket.on('error', (error) => {
    console.error(`❌ Socket error for ${socket.id}:`, error);
  });
});

// Make io available globally
global.io = io;

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  
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

// Start server
async function startServer() {
  const dbConnected = await testDatabaseConnection();
  
  server.listen(PORT, () => {
    console.log(`✅ eSIR 2.0 Server berjalan di port ${PORT}`);
    console.log(`✅ Environment: ${process.env.NODE_ENV}`);
    console.log(`✅ Test endpoint: http://localhost:${PORT}/test`);
    
    if (dbConnected) {
      console.log(`✅ Database terhubung: ${process.env.DB_DATABASE}`);
    } else {
      console.log(`⚠️  Database tidak tersedia`);
    }
  });
}

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} sudah digunakan.`);
  } else {
    console.error('❌ Server error:', error);
  }
  process.exit(1);
});

// Start the server
startServer();

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const dbStatus = await testDatabaseConnection();
    
    res.json({
      success: true,
      status: dbStatus ? 'healthy' : 'unhealthy',
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

