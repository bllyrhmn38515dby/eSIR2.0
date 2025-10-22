const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN

  // Only log in development mode or for specific routes
  const shouldLog = process.env.NODE_ENV === 'development' || 
                   req.path.includes('/tracking') || 
                   req.path.includes('/auth');

  if (shouldLog) {
    console.log('🔍 Middleware - Token:', token ? 'Token present' : 'No token');
  }

  if (!token) {
    if (shouldLog) console.log('❌ Middleware - No token found');
    return res.status(401).json({ 
      success: false, 
      message: 'Token tidak ditemukan' 
    });
  }

  try {
    if (shouldLog) console.log('🔍 Middleware - Verifying token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.userId) {
      if (shouldLog) console.log('❌ Middleware - Decoded token tidak memiliki userId');
      return res.status(401).json({
        success: false,
        message: 'Token tidak valid'
      });
    }
    if (shouldLog) console.log('✅ Middleware - Token verified, userId:', decoded.userId);
    
    // Ambil data user dari database dengan role
    let users;
    try {
      const result = await pool.execute(
      `SELECT u.*, r.nama_role as role 
       FROM users u 
       LEFT JOIN roles r ON u.role_id = r.id 
       WHERE u.id = ?`,
      [decoded.userId]
      );
      users = result[0];
    } catch (dbError) {
      console.error('❌ Middleware - Database query failed:', dbError.code || dbError.message);
      return res.status(503).json({
        success: false,
        message: 'Layanan database tidak tersedia, coba lagi nanti'
      });
    }

    if (users.length === 0) {
      if (shouldLog) console.log('❌ Middleware - User not found in database');
      return res.status(401).json({ 
        success: false, 
        message: 'User tidak ditemukan atau tidak aktif' 
      });
    }

    req.user = users[0];
    if (shouldLog) console.log('✅ Middleware - User authenticated:', req.user.nama_lengkap);
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
