const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const pool = require('../config/db');
const { verifyToken } = require('../middleware/auth');
const { sendResetPasswordEmail } = require('../utils/emailService');

const router = express.Router();

// Get all users (hanya untuk admin)
router.get('/users', verifyToken, async (req, res) => {
  try {
    console.log('🔍 Users request from user:', req.user.nama_lengkap, 'Role:', req.user.role);
    
    // Cek apakah user adalah admin (pusat atau faskes)
    if (req.user.role !== 'admin_pusat' && req.user.role !== 'admin_faskes') {
      console.log('❌ Access denied for role:', req.user.role);
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak. Hanya admin yang dapat melihat data user.'
      });
    }

    // Build query dengan error handling yang lebih baik
    let query = `
      SELECT 
        u.id, 
        u.nama_lengkap, 
        u.username, 
        u.email, 
        u.faskes_id, 
        u.telepon, 
        u.created_at, 
        u.updated_at, 
        u.last_login, 
        COALESCE(r.nama_role, 'Unknown') as role, 
        COALESCE(f.nama_faskes, 'Unknown') as nama_faskes
      FROM users u 
      LEFT JOIN roles r ON u.role_id = r.id 
      LEFT JOIN faskes f ON u.faskes_id = f.id
    `;
    
    const params = [];

    // Filter berdasarkan role user
    if (req.user.role === 'admin_faskes' && req.user.faskes_id) {
      query += ' WHERE u.faskes_id = ?';
      params.push(req.user.faskes_id);
    }

    query += ' ORDER BY u.created_at DESC';

    console.log('🔍 Executing users query:', query);
    console.log('🔍 Query params:', params);

    // Execute query dengan error handling
    const [users] = await pool.execute(query, params);

    console.log('✅ Users query successful, found:', users.length, 'users');

    // Transform data untuk memastikan format yang konsisten
    const transformedUsers = users.map(user => ({
      id: user.id,
      nama_lengkap: user.nama_lengkap || '',
      username: user.username || '',
      email: user.email || '',
      faskes_id: user.faskes_id,
      telepon: user.telepon || '',
      created_at: user.created_at,
      updated_at: user.updated_at,
      last_login: user.last_login,
      role: user.role || 'Unknown',
      nama_faskes: user.nama_faskes || 'Unknown'
    }));

    res.json({
      success: true,
      data: transformedUsers
    });

  } catch (error) {
    console.error('❌ Error get users:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server saat mengambil data users',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get all roles (hanya untuk admin)
router.get('/roles', verifyToken, async (req, res) => {
  try {
    console.log('🔍 Roles request from user:', req.user.nama_lengkap, 'Role:', req.user.role);
    
    // Cek apakah user adalah admin (pusat atau faskes)
    if (req.user.role !== 'admin_pusat' && req.user.role !== 'admin_faskes') {
      console.log('❌ Access denied for role:', req.user.role);
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak. Hanya admin yang dapat melihat roles.'
      });
    }

    const [roles] = await pool.execute(
      'SELECT id, nama_role, deskripsi, created_at, updated_at FROM roles ORDER BY nama_role'
    );

    console.log('✅ Roles query successful, found:', roles.length, 'roles');

    res.json({
      success: true,
      data: roles
    });

  } catch (error) {
    console.error('❌ Error get roles:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server saat mengambil data roles',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Create user baru (hanya untuk admin pusat)
router.post('/users', verifyToken, async (req, res) => {
  try {
    // Cek apakah user adalah admin pusat
    if (req.user.role !== 'admin_pusat') {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak. Hanya admin pusat yang dapat membuat akun baru.'
      });
    }

    const { password, email, nama_lengkap, role, faskes_id, telepon } = req.body;

    // Validasi input
    if (!password || !email || !nama_lengkap || !role) {
      return res.status(400).json({
        success: false,
        message: 'Password, email, nama lengkap, dan role wajib diisi'
      });
    }

    // Cek apakah email sudah ada
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email sudah terdaftar'
      });
    }

    // Get role_id from role name
    const [roles] = await pool.execute(
      'SELECT id FROM roles WHERE nama_role = ?',
      [role]
    );

    if (roles.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Role tidak valid'
      });
    }

    const role_id = roles[0].id;

    // Generate username from email
    const username = email.split('@')[0];

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert user baru
    const [result] = await pool.execute(
      'INSERT INTO users (nama_lengkap, username, password, email, role_id, faskes_id, telepon, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [nama_lengkap, username, hashedPassword, email, role_id, faskes_id, telepon || null]
    );

    // Ambil data user yang baru dibuat
    const [newUser] = await pool.execute(
      `SELECT u.id, u.nama_lengkap, u.username, u.email, u.faskes_id, u.telepon, u.created_at, u.updated_at, r.nama_role as role, f.nama_faskes
       FROM users u 
       LEFT JOIN roles r ON u.role_id = r.id 
       LEFT JOIN faskes f ON u.faskes_id = f.id
       WHERE u.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'User berhasil dibuat',
      data: newUser[0]
    });

  } catch (error) {
    console.error('Error create user:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
});

// Update user (hanya untuk admin pusat)
router.put('/users/:id', verifyToken, async (req, res) => {
  try {
    // Cek apakah user adalah admin pusat
    if (req.user.role !== 'admin_pusat') {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak. Hanya admin pusat yang dapat mengupdate user.'
      });
    }

    const userId = req.params.id;
    const { nama_lengkap, email, password, role, faskes_id, telepon } = req.body;
    
    console.log('Update user request:', { userId, nama_lengkap, email, role, faskes_id, telepon });

    // Validasi input
    if (!nama_lengkap || !email || !role) {
      return res.status(400).json({
        success: false,
        message: 'Nama lengkap, email, dan role wajib diisi'
      });
    }

    // Cek apakah user exists
    const [existingUser] = await pool.execute(
      'SELECT id FROM users WHERE id = ?',
      [userId]
    );

    if (existingUser.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    // Cek apakah email sudah ada (kecuali untuk user yang sedang diupdate)
    const [existingEmail] = await pool.execute(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [email, userId]
    );

    if (existingEmail.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email sudah digunakan oleh user lain'
      });
    }

    // Get role_id from role name
    const [roles] = await pool.execute(
      'SELECT id FROM roles WHERE nama_role = ?',
      [role]
    );

    if (roles.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Role tidak valid'
      });
    }

    const role_id = roles[0].id;
    console.log('Update user - Using role_id:', role_id);

    // Update user
    let updateQuery = 'UPDATE users SET nama_lengkap = ?, email = ?, role_id = ?, faskes_id = ?, telepon = ?, updated_at = NOW()';
    let updateParams = [nama_lengkap, email, role_id, faskes_id, telepon || null];
    console.log('Update user - Query params:', updateParams);

    // Jika password diisi, update password juga
    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 12);
      updateQuery += ', password = ?';
      updateParams.push(hashedPassword);
    }

    updateQuery += ' WHERE id = ?';
    updateParams.push(userId);

    await pool.execute(updateQuery, updateParams);

    // Ambil data user yang diupdate
    const [updatedUser] = await pool.execute(
      `SELECT u.id, u.nama_lengkap, u.username, u.email, u.faskes_id, u.telepon, u.created_at, u.updated_at, r.nama_role as role, f.nama_faskes
       FROM users u 
       LEFT JOIN roles r ON u.role_id = r.id 
       LEFT JOIN faskes f ON u.faskes_id = f.id
       WHERE u.id = ?`,
      [userId]
    );

    res.json({
      success: true,
      message: 'User berhasil diupdate',
      data: updatedUser[0]
    });

  } catch (error) {
    console.error('Error update user:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
});

// Delete user (hanya untuk admin pusat)
router.delete('/users/:id', verifyToken, async (req, res) => {
  try {
    // Cek apakah user adalah admin pusat
    if (req.user.role !== 'admin_pusat') {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak. Hanya admin pusat yang dapat menghapus user.'
      });
    }

    const userId = req.params.id;

    // Cek apakah user exists
    const [existingUser] = await pool.execute(
      'SELECT id FROM users WHERE id = ?',
      [userId]
    );

    if (existingUser.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    // Cek apakah user yang akan dihapus adalah admin pusat
    const [userRole] = await pool.execute(
      `SELECT r.nama_role as role 
       FROM users u 
       LEFT JOIN roles r ON u.role_id = r.id 
       WHERE u.id = ?`,
      [userId]
    );

    if (userRole[0].role === 'admin_pusat') {
      return res.status(400).json({
        success: false,
        message: 'Tidak dapat menghapus admin pusat'
      });
    }

    // Delete user
    await pool.execute('DELETE FROM users WHERE id = ?', [userId]);

    res.json({
      success: true,
      message: 'User berhasil dihapus'
    });

  } catch (error) {
    console.error('Error delete user:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
});

// Register user baru (hanya untuk admin)
router.post('/register', verifyToken, async (req, res) => {
  try {
    // Cek apakah user adalah admin
    if (req.user.role !== 'admin_pusat') {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak. Hanya admin pusat yang dapat membuat akun baru.'
      });
    }

    const { username, password, email, nama_lengkap, role } = req.body;

    // Validasi input
    if (!username || !password || !email || !nama_lengkap || !role) {
      return res.status(400).json({
        success: false,
        message: 'Semua field wajib diisi'
      });
    }

    // Cek apakah email sudah ada
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email sudah terdaftar'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Get role_id from role name
    const [roles] = await pool.execute(
      'SELECT id FROM roles WHERE nama_role = ?',
      [role]
    );

    if (roles.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Role tidak valid'
      });
    }

    const role_id = roles[0].id;

    // Insert user baru
    const [result] = await pool.execute(
      'INSERT INTO users (nama_lengkap, username, password, email, role_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      [nama_lengkap, username, hashedPassword, email, role_id]
    );

    res.status(201).json({
      success: true,
      message: 'User berhasil didaftarkan',
      data: {
        id: result.insertId,
        nama: nama_lengkap,
        email,
        role
      }
    });

  } catch (error) {
    console.error('Error register:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password wajib diisi'
      });
    }

    // Cari user berdasarkan email dengan role
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

    // Verifikasi password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      message: 'Login berhasil',
      data: {
        token,
        user: {
          id: user.id,
          nama_lengkap: user.nama_lengkap,
          email: user.email,
          role: user.role
        }
      }
    });

  } catch (error) {
    console.error('Error login:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
});

// Request reset password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Validasi input
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email wajib diisi'
      });
    }

    // Cari user berdasarkan email
    const [users] = await pool.execute(
      'SELECT id, nama_lengkap, email FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      // Untuk keamanan, jangan beri tahu bahwa email tidak ada
      return res.json({
        success: true,
        message: 'Jika email terdaftar, link reset password akan dikirim ke email Anda'
      });
    }

    const user = users[0];

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 jam

    // Simpan token ke database
    await pool.execute(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [user.id, resetToken, expiresAt]
    );

    // Kirim email reset password
    try {
      await sendResetPasswordEmail(user.email, resetToken, user.nama_lengkap);
      
      // Log email success
      await pool.execute(
        'INSERT INTO email_logs (user_id, email, type, subject, status, message_id) VALUES (?, ?, ?, ?, ?, ?)',
        [user.id, user.email, 'reset_password', 'Reset Password - eSIR 2.0', 'sent', 'manual']
      );

      res.json({
        success: true,
        message: 'Link reset password telah dikirim ke email Anda'
      });
    } catch (emailError) {
      console.error('Error sending reset email:', emailError);
      
      // Log email failure
      await pool.execute(
        'INSERT INTO email_logs (user_id, email, type, subject, status, error_message) VALUES (?, ?, ?, ?, ?, ?)',
        [user.id, user.email, 'reset_password', 'Reset Password - eSIR 2.0', 'failed', emailError.message]
      );

      res.status(500).json({
        success: false,
        message: 'Gagal mengirim email reset password. Silakan coba lagi.'
      });
    }

  } catch (error) {
    console.error('Error forgot password:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
});

// Reset password dengan token
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Validasi input
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token dan password baru wajib diisi'
      });
    }

    // Validasi password (minimal 6 karakter)
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password minimal 6 karakter'
      });
    }

    // Cari token yang valid
    const [tokens] = await pool.execute(
      `SELECT prt.*, u.email, u.nama_lengkap 
       FROM password_reset_tokens prt
       JOIN users u ON prt.user_id = u.id
       WHERE prt.token = ? AND prt.expires_at > NOW() AND prt.used = FALSE`,
      [token]
    );

    if (tokens.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Token tidak valid atau sudah kadaluarsa'
      });
    }

    const resetToken = tokens[0];

    // Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password user
    await pool.execute(
      'UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?',
      [hashedPassword, resetToken.user_id]
    );

    // Mark token sebagai used
    await pool.execute(
      'UPDATE password_reset_tokens SET used = TRUE WHERE id = ?',
      [resetToken.id]
    );

    res.json({
      success: true,
      message: 'Password berhasil direset. Silakan login dengan password baru.'
    });

  } catch (error) {
    console.error('Error reset password:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
});

// Verify reset token
router.get('/verify-reset-token/:token', async (req, res) => {
  try {
    const { token } = req.params;

    // Cari token yang valid
    const [tokens] = await pool.execute(
      `SELECT prt.*, u.email, u.nama_lengkap 
       FROM password_reset_tokens prt
       JOIN users u ON prt.user_id = u.id
       WHERE prt.token = ? AND prt.expires_at > NOW() AND prt.used = FALSE`,
      [token]
    );

    if (tokens.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Token tidak valid atau sudah kadaluarsa'
      });
    }

    res.json({
      success: true,
      message: 'Token valid',
      data: {
        email: tokens[0].email,
        nama_lengkap: tokens[0].nama_lengkap
      }
    });

  } catch (error) {
    console.error('Error verify reset token:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
});

// Refresh token endpoint
router.post('/refresh', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token diperlukan'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Cek apakah user masih ada
    const [users] = await pool.execute(
      `SELECT u.id, u.nama_lengkap, u.email, u.username, r.nama_role as role
       FROM users u 
       LEFT JOIN roles r ON u.role_id = r.id 
       WHERE u.id = ?`,
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    // Generate token baru
    const newToken = jwt.sign(
      { 
        userId: users[0].id, 
        email: users[0].email,
        role: users[0].role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      data: {
        token: newToken,
        user: users[0]
      }
    });

  } catch (error) {
    console.error('Error refresh token:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token sudah kadaluarsa'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token tidak valid'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
});

// Get profile user yang login
router.get('/profile', verifyToken, async (req, res) => {
  try {
    // User data sudah tersedia dari middleware verifyToken
    const userData = {
      id: req.user.id,
      nama_lengkap: req.user.nama_lengkap,
      email: req.user.email,
      username: req.user.username,
      role: req.user.role
    };

    res.json({
      success: true,
      data: userData
    });

  } catch (error) {
    console.error('Error get profile:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
});

module.exports = router;
