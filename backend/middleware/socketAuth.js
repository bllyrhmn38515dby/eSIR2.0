const jwt = require('jsonwebtoken');
const db = require('../config/db');

const socketAuth = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return next(new Error('Authentication error: Token not provided'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user data from database with role
    const [users] = await db.execute(
      `SELECT u.id, u.nama_lengkap as nama, u.email, r.nama_role as role, u.faskes_id 
       FROM users u 
       LEFT JOIN roles r ON u.role_id = r.id 
       WHERE u.id = ?`,
      [decoded.userId]
    );

    if (users.length === 0) {
      return next(new Error('Authentication error: User not found'));
    }

    socket.user = users[0];
    next();
  } catch (error) {
    console.error('Socket authentication error:', error.message);
    next(new Error('Authentication error: Invalid token'));
  }
};

module.exports = socketAuth;
