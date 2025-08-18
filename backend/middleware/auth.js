const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN

  console.log('🔍 Middleware - Authorization header:', req.headers.authorization);
  console.log('🔍 Middleware - Token:', token ? 'Token present' : 'No token');

  if (!token) {
    console.log('❌ Middleware - No token found');
    return res.status(401).json({ 
      success: false, 
      message: 'Token tidak ditemukan' 
    });
  }

  try {
    console.log('🔍 Middleware - Verifying token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Middleware - Token verified, userId:', decoded.userId);
    
    // Ambil data user dari database dengan role
    const [users] = await pool.execute(
      `SELECT u.*, r.nama_role as role 
       FROM users u 
       LEFT JOIN roles r ON u.role_id = r.id 
       WHERE u.id = ?`,
      [decoded.userId]
    );

    console.log('🔍 Middleware - Database query result:', users.length, 'users found');

    if (users.length === 0) {
      console.log('❌ Middleware - User not found in database');
      return res.status(401).json({ 
        success: false, 
        message: 'User tidak ditemukan atau tidak aktif' 
      });
    }

    req.user = users[0];
    console.log('✅ Middleware - User authenticated:', req.user.nama_lengkap);
    next();
  } catch (error) {
    console.error('❌ Middleware - Token verification failed:', error.message);
    return res.status(401).json({ 
      success: false, 
      message: 'Token tidak valid' 
    });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User tidak terautentikasi' 
      });
    }

    if (!req.user.role || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Akses ditolak. Role tidak sesuai' 
      });
    }

    next();
  };
};

module.exports = {
  verifyToken,
  requireRole
};
