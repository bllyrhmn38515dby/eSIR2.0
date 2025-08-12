require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const db = require('./config/db');
const socketAuth = require('./middleware/socketAuth');

// Import routes
const authRoutes = require('./routes/auth');
const pasienRoutes = require('./routes/pasien');
const rujukanRoutes = require('./routes/rujukan');
const faskesRoutes = require('./routes/faskes');
const notificationRoutes = require('./routes/notifications');
const tempatTidurRoutes = require('./routes/tempatTidur');
const laporanRoutes = require('./routes/laporan');

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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pasien', pasienRoutes);
app.use('/api/rujukan', rujukanRoutes);
app.use('/api/faskes', faskesRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/tempat-tidur', tempatTidurRoutes);
app.use('/api/laporan', laporanRoutes);

// Socket.IO connection handling with authentication
io.use(socketAuth);

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id} (${socket.user.nama})`);

  // Join room based on user's faskes_id
  if (socket.user.faskes_id) {
    socket.join(`faskes-${socket.user.faskes_id}`);
    console.log(`User ${socket.user.nama} joined faskes room: ${socket.user.faskes_id}`);
  }

  // Join admin room if user is admin
  if (socket.user.role === 'admin') {
    socket.join('admin-room');
    console.log(`Admin ${socket.user.nama} joined admin room`);
  }

  // Handle realtime notifications
  socket.on('send-notification', (data) => {
    console.log('Notification sent:', data);
    // Broadcast to appropriate rooms
    if (data.targetRoom) {
      io.to(data.targetRoom).emit('notification', data);
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id} (${socket.user.nama})`);
  });
});

// Make io available globally
global.io = io;

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
  console.log(`Server berjalan di port ${PORT}`);
  console.log(`Socket.IO server siap untuk koneksi realtime`);
});