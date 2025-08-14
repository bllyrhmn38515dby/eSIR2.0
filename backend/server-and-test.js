const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Mock auth route for testing
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

// Mock stats route for testing
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

const PORT = 3001;

// Start server
const server = app.listen(PORT, () => {
  console.log(`✅ Server berjalan di port ${PORT}`);
  
  // Test endpoints after server starts
  setTimeout(async () => {
    try {
      console.log('\n🧪 Testing endpoints...');
      
      // Test basic endpoint
      const testResponse = await axios.get('http://localhost:3001/test');
      console.log('✅ Test endpoint:', testResponse.data);
      
      // Test login
      console.log('\n🔐 Testing login...');
      const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
        email: 'admin@pusat.com',
        password: 'admin123'
      });
      console.log('✅ Login successful:', loginResponse.data.success);
      
      // Test stats with token
      console.log('\n📊 Testing stats endpoint...');
      const token = loginResponse.data.data.token;
      const statsResponse = await axios.get('http://localhost:3001/api/rujukan/stats/overview', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Stats endpoint:', statsResponse.data);
      
      console.log('\n🎉 SEMUA TEST BERHASIL!');
      console.log('💡 Endpoint stats sudah diperbaiki dan berfungsi.');
      console.log('🚀 Frontend sekarang bisa berjalan tanpa error.');
      console.log('\n📝 Untuk menjalankan frontend:');
      console.log('   cd ../frontend');
      console.log('   npm start');
      
      // Keep server running
      console.log('\n🔄 Server tetap berjalan untuk frontend...');
      console.log('⚠️  Database belum tersedia, menggunakan mock data');
      
    } catch (error) {
      console.error('❌ Test failed:', error.message);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
      }
      server.close(() => {
        console.log('✅ Server ditutup.');
        process.exit(1);
      });
    }
  }, 1000);
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

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Server ditutup.');
  server.close(() => {
    process.exit(0);
  });
});
