const express = require('express');
const pool = require('../config/db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Get semua pasien
router.get('/', verifyToken, async (req, res) => {
  try {
    const [pasien] = await pool.execute(
      'SELECT * FROM pasien ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      data: pasien
    });

  } catch (error) {
    console.error('Error get pasien:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
});

// Get all pasien
router.get('/', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM pasien ORDER BY nama_pasien');
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching pasien:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
});

// Search pasien by NIK
router.get('/search', verifyToken, async (req, res) => {
  try {
    const { nik } = req.query;

    if (!nik) {
      return res.status(400).json({
        success: false,
        message: 'NIK harus disediakan'
      });
    }

    const [pasien] = await pool.execute(
      'SELECT * FROM pasien WHERE nik = ?',
      [nik]
    );

    if (pasien.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pasien tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: pasien[0]
    });

  } catch (error) {
    console.error('Error search pasien by NIK:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
});

// Get pasien by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [pasien] = await pool.execute(
      'SELECT * FROM pasien WHERE id = ?',
      [id]
    );

    if (pasien.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pasien tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: pasien[0]
    });

  } catch (error) {
    console.error('Error get pasien by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
});

// Create pasien baru
router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      nama_pasien,
      nik,
      tanggal_lahir,
      jenis_kelamin,
      alamat,
      telepon,
      golongan_darah,
      alergi,
      riwayat_penyakit,
      no_rm
    } = req.body;

    // Validasi input
    if (!nama_pasien || !nik || !tanggal_lahir || !jenis_kelamin || !alamat) {
      return res.status(400).json({
        success: false,
        message: 'Nama, NIK, tanggal lahir, jenis kelamin, dan alamat wajib diisi'
      });
    }

    // Validasi NIK (16 digit)
    if (nik.length !== 16 || !/^\d+$/.test(nik)) {
      return res.status(400).json({
        success: false,
        message: 'NIK harus 16 digit angka'
      });
    }

    // Cek apakah NIK sudah ada
    const [existingPasien] = await pool.execute(
      'SELECT id FROM pasien WHERE nik = ?',
      [nik]
    );

    if (existingPasien.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'NIK sudah terdaftar'
      });
    }

    // Cek apakah No RM sudah ada
    if (no_rm) {
      const [existingRM] = await pool.execute(
        'SELECT id FROM pasien WHERE no_rm = ?',
        [no_rm]
      );

      if (existingRM.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'No RM sudah terdaftar'
        });
      }
    }

    // Insert pasien baru
    const [result] = await pool.execute(
      `INSERT INTO pasien (nama_pasien, nik, tanggal_lahir, jenis_kelamin, alamat, telepon, golongan_darah, alergi, riwayat_penyakit, no_rm) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nama_pasien, nik, tanggal_lahir, jenis_kelamin, alamat, telepon, golongan_darah, alergi, riwayat_penyakit, no_rm]
    );

    // Ambil data pasien yang baru dibuat
    const [newPasien] = await pool.execute(
      'SELECT * FROM pasien WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Pasien berhasil ditambahkan',
      data: newPasien[0]
    });

  } catch (error) {
    console.error('Error create pasien:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
});

// Update pasien
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nama_pasien,
      nik,
      tanggal_lahir,
      jenis_kelamin,
      alamat,
      telepon,
      golongan_darah,
      alergi,
      riwayat_penyakit,
      no_rm
    } = req.body;

    // Validasi input
    if (!nama_pasien || !nik || !tanggal_lahir || !jenis_kelamin || !alamat) {
      return res.status(400).json({
        success: false,
        message: 'Nama, NIK, tanggal lahir, jenis kelamin, dan alamat wajib diisi'
      });
    }

    // Validasi NIK (16 digit)
    if (nik.length !== 16 || !/^\d+$/.test(nik)) {
      return res.status(400).json({
        success: false,
        message: 'NIK harus 16 digit angka'
      });
    }

    // Cek apakah pasien ada
    const [existingPasien] = await pool.execute(
      'SELECT id FROM pasien WHERE id = ?',
      [id]
    );

    if (existingPasien.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pasien tidak ditemukan'
      });
    }

    // Cek apakah NIK sudah digunakan oleh pasien lain
    const [nikCheck] = await pool.execute(
      'SELECT id FROM pasien WHERE nik = ? AND id != ?',
      [nik, id]
    );

    if (nikCheck.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'NIK sudah digunakan oleh pasien lain'
      });
    }

    // Cek apakah No RM sudah digunakan oleh pasien lain
    if (no_rm) {
      const [rmCheck] = await pool.execute(
        'SELECT id FROM pasien WHERE no_rm = ? AND id != ?',
        [no_rm, id]
      );

      if (rmCheck.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'No RM sudah digunakan oleh pasien lain'
        });
      }
    }

    // Update pasien
    await pool.execute(
      `UPDATE pasien 
       SET nama_pasien = ?, nik = ?, tanggal_lahir = ?, jenis_kelamin = ?, alamat = ?, 
           telepon = ?, golongan_darah = ?, alergi = ?, riwayat_penyakit = ?, no_rm = ?
       WHERE id = ?`,
      [nama_pasien, nik, tanggal_lahir, jenis_kelamin, alamat, telepon, golongan_darah, alergi, riwayat_penyakit, no_rm, id]
    );

    // Ambil data pasien yang diupdate
    const [updatedPasien] = await pool.execute(
      'SELECT * FROM pasien WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Pasien berhasil diupdate',
      data: updatedPasien[0]
    });

  } catch (error) {
    console.error('Error update pasien:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
});

// Delete pasien
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Cek apakah pasien ada
    const [existingPasien] = await pool.execute(
      'SELECT id FROM pasien WHERE id = ?',
      [id]
    );

    if (existingPasien.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pasien tidak ditemukan'
      });
    }

    // Cek apakah pasien memiliki rujukan
    const [rujukan] = await pool.execute(
      'SELECT id FROM rujukan WHERE pasien_id = ?',
      [id]
    );

    if (rujukan.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Pasien tidak dapat dihapus karena memiliki data rujukan'
      });
    }

    // Delete pasien
    await pool.execute('DELETE FROM pasien WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Pasien berhasil dihapus'
    });

  } catch (error) {
    console.error('Error delete pasien:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
});

module.exports = router;
