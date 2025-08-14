const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

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

    // Insert user baru
    const [result] = await pool.execute(
      'INSERT INTO users (nama_lengkap, username, password, email, role_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      [nama_lengkap, username, hashedPassword, email, role]
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

    // Hapus password dari response
    delete user.password;

    res.json({
      success: true,
      message: 'Login berhasil',
      data: {
        user,
        token
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

// Get profile user yang sedang login
router.get('/profile', verifyToken, async (req, res) => {
  try {
    // User sudah ada di req.user dari middleware
    delete req.user.password;
    
    res.json({
      success: true,
      data: req.user
    });

  } catch (error) {
    console.error('Error get profile:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
});

// Create user baru (hanya untuk admin pusat)
router.post('/create-user', verifyToken, async (req, res) => {
  try {
    // Cek apakah user adalah admin pusat
    if (req.user.role !== 'admin_pusat') {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak. Hanya admin pusat yang dapat membuat akun baru.'
      });
    }

    const { username, password, email, nama_lengkap, role_id, faskes_id } = req.body;

    // Validasi input
    if (!username || !password || !email || !nama_lengkap || !role_id) {
      return res.status(400).json({
        success: false,
        message: 'Username, password, email, nama lengkap, dan role wajib diisi'
      });
    }

    // Cek apakah email sudah ada
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email atau username sudah terdaftar'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert user baru
    const [result] = await pool.execute(
      'INSERT INTO users (nama_lengkap, username, password, email, role_id, faskes_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [nama_lengkap, username, hashedPassword, email, role_id, faskes_id || null]
    );

    // Ambil data user yang baru dibuat
    const [newUser] = await pool.execute(
      `SELECT u.*, r.nama_role as role 
       FROM users u 
       LEFT JOIN roles r ON u.role_id = r.id 
       WHERE u.id = ?`,
      [result.insertId]
    );

    // Hapus password dari response
    delete newUser[0].password;

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

// Get all users (hanya untuk admin pusat)
router.get('/users', verifyToken, async (req, res) => {
  try {
    // Cek apakah user adalah admin pusat
    if (req.user.role !== 'admin_pusat') {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak. Hanya admin pusat yang dapat melihat semua user.'
      });
    }

    const [users] = await pool.execute(
      `SELECT u.id, u.nama_lengkap, u.username, u.email, u.faskes_id, u.created_at, u.updated_at, r.nama_role as role, f.nama_faskes
       FROM users u 
       LEFT JOIN roles r ON u.role_id = r.id 
       LEFT JOIN faskes f ON u.faskes_id = f.id
       ORDER BY u.created_at DESC`
    );

    res.json({
      success: true,
      data: users
    });

  } catch (error) {
    console.error('Error get users:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
});

// Get all roles (hanya untuk admin pusat)
router.get('/roles', verifyToken, async (req, res) => {
  try {
    // Cek apakah user adalah admin pusat
    if (req.user.role !== 'admin_pusat') {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak. Hanya admin pusat yang dapat melihat roles.'
      });
    }

    const [roles] = await pool.execute(
      'SELECT * FROM roles ORDER BY nama_role'
    );

    res.json({
      success: true,
      data: roles
    });

  } catch (error) {
    console.error('Error get roles:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
});

module.exports = router;
