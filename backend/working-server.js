require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const pool = require('./config/db');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Test route
app.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'eSIR 2.0 Backend is running!',
    database: 'prodsysesirv02',
    timestamp: new Date().toISOString()
  });
});

// Login route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('🔐 Login attempt:', { email });
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password wajib diisi'
      });
    }

    // Cari user berdasarkan email
    const [users] = await pool.execute(
      `SELECT u.*, r.nama_role as role 
       FROM users u 
       LEFT JOIN roles r ON u.role_id = r.id 
       WHERE u.email = ?`,
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    const user = users[0];

    // Verifikasi password (development mode - plain text)
    if (password !== user.password) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    // Update last_login
    await pool.execute(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [user.id]
    );

    // Generate simple token
    const token = `token_${user.id}_${Date.now()}`;

    res.json({
      success: true,
      message: 'Login berhasil',
      data: {
        token,
        user: {
          id: user.id,
          nama_lengkap: user.nama_lengkap,
          email: user.email,
          role: user.role,
          last_login: new Date().toISOString()
        }
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('🔌 User disconnected:', socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`✅ eSIR 2.0 Backend running on port ${PORT}`);
  console.log(`🔗 Test endpoint: http://localhost:${PORT}/test`);
  console.log(`🔐 Login endpoint: http://localhost:${PORT}/api/auth/login`);
  console.log(`🔌 WebSocket: ws://localhost:${PORT}`);
  console.log(`📊 Database: ${process.env.DB_DATABASE}`);
});
