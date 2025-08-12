const express = require('express');
const pool = require('../config/db');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get semua faskes
router.get('/', verifyToken, async (req, res) => {
  try {
    const [faskes] = await pool.execute(
      'SELECT * FROM faskes ORDER BY nama_faskes ASC'
    );

    res.json({
      success: true,
      data: faskes
    });

  } catch (error) {
    console.error('Error get faskes:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
});

// Get faskes by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [faskes] = await pool.execute(
      'SELECT * FROM faskes WHERE id = ?',
      [id]
    );

    if (faskes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Faskes tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: faskes[0]
    });

  } catch (error) {
    console.error('Error get faskes by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
});

// Create faskes baru (hanya admin_pusat)
router.post('/', verifyToken, requireRole(['admin_pusat']), async (req, res) => {
  try {
    const {
      nama_faskes,
      alamat,
      tipe,
      telepon,
      latitude,
      longitude
    } = req.body;

    // Validasi input
    if (!nama_faskes || !alamat || !tipe) {
      return res.status(400).json({
        success: false,
        message: 'Nama faskes, alamat, dan tipe wajib diisi'
      });
    }

    // Insert faskes baru
    const [result] = await pool.execute(
      `INSERT INTO faskes (nama_faskes, alamat, tipe, telepon, latitude, longitude) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nama_faskes, alamat, tipe, telepon, latitude, longitude]
    );

    // Ambil data faskes yang baru dibuat
    const [newFaskes] = await pool.execute(
      'SELECT * FROM faskes WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Faskes berhasil ditambahkan',
      data: newFaskes[0]
    });

  } catch (error) {
    console.error('Error create faskes:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
});

// Update faskes (hanya admin_pusat)
router.put('/:id', verifyToken, requireRole(['admin_pusat']), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nama_faskes,
      alamat,
      tipe,
      telepon,
      latitude,
      longitude
    } = req.body;

    // Validasi input
    if (!nama_faskes || !alamat || !tipe) {
      return res.status(400).json({
        success: false,
        message: 'Nama faskes, alamat, dan tipe wajib diisi'
      });
    }

    // Cek apakah faskes ada
    const [existingFaskes] = await pool.execute(
      'SELECT id FROM faskes WHERE id = ?',
      [id]
    );

    if (existingFaskes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Faskes tidak ditemukan'
      });
    }

    // Update faskes
    await pool.execute(
      `UPDATE faskes SET 
       nama_faskes = ?, alamat = ?, tipe = ?, telepon = ?, 
       latitude = ?, longitude = ? 
       WHERE id = ?`,
      [nama_faskes, alamat, tipe, telepon, latitude, longitude, id]
    );

    // Ambil data faskes yang diupdate
    const [updatedFaskes] = await pool.execute(
      'SELECT * FROM faskes WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Faskes berhasil diupdate',
      data: updatedFaskes[0]
    });

  } catch (error) {
    console.error('Error update faskes:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
});

// Delete faskes (hanya admin_pusat)
router.delete('/:id', verifyToken, requireRole(['admin_pusat']), async (req, res) => {
  try {
    const { id } = req.params;

    // Cek apakah faskes ada
    const [existingFaskes] = await pool.execute(
      'SELECT id FROM faskes WHERE id = ?',
      [id]
    );

    if (existingFaskes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Faskes tidak ditemukan'
      });
    }

    // Cek apakah faskes memiliki rujukan
    const [rujukan] = await pool.execute(
      'SELECT id FROM rujukan WHERE faskes_asal_id = ? OR faskes_tujuan_id = ?',
      [id, id]
    );

    if (rujukan.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Faskes tidak dapat dihapus karena memiliki data rujukan'
      });
    }

    // Cek apakah faskes memiliki user
    const [users] = await pool.execute(
      'SELECT id FROM users WHERE faskes_id = ?',
      [id]
    );

    if (users.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Faskes tidak dapat dihapus karena memiliki user yang terdaftar'
      });
    }

    // Delete faskes
    await pool.execute('DELETE FROM faskes WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Faskes berhasil dihapus'
    });

  } catch (error) {
    console.error('Error delete faskes:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
});

module.exports = router;
