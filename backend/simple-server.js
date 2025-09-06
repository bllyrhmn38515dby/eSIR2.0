const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running!',
    timestamp: new Date().toISOString()
  });
});

// Simple login route
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log('🔐 Login attempt:', { email, password });
  
  if (email === 'admin@esir.com' && password === 'admin123') {
    res.json({
      success: true,
      message: 'Login berhasil',
      data: {
        token: 'test-token-123',
        user: {
          id: 1,
          nama_lengkap: 'Admin Pusat',
          email: 'admin@esir.com',
          role: 'admin_pusat'
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

// Start server
app.listen(PORT, () => {
  console.log(`✅ Simple server running on port ${PORT}`);
  console.log(`🔗 Test endpoint: http://localhost:${PORT}/test`);
  console.log(`🔐 Login endpoint: http://localhost:${PORT}/api/auth/login`);
});
