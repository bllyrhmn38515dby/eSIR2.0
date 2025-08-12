const express = require('express');
const { verifyToken, requireRole } = require('../middleware/auth');
const db = require('../config/db');

const router = express.Router();

// Get semua tempat tidur (dengan filter berdasarkan role)
router.get('/', verifyToken, async (req, res) => {
  try {
    let query = `
      SELECT tt.*, 
             f.nama_faskes,
             p.nama_pasien,
             p.no_rm
      FROM tempat_tidur tt
      LEFT JOIN faskes f ON tt.faskes_id = f.id
      LEFT JOIN pasien p ON tt.pasien_id = p.id
    `;

    const params = [];

    // Filter berdasarkan role
    if (req.user.role === 'puskesmas' || req.user.role === 'rs') {
      query += ' WHERE tt.faskes_id = ?';
      params.push(req.user.faskes_id || 0);
    }

    query += ' ORDER BY tt.faskes_id, tt.nomor_kamar, tt.nomor_bed';

    const [rows] = await db.execute(query, params);

    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error get tempat tidur:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data tempat tidur'
    });
  }
});

// Get tempat tidur berdasarkan faskes
router.get('/faskes/:faskesId', verifyToken, async (req, res) => {
  try {
    const { faskesId } = req.params;

    // Check permission
    if (req.user.role === 'puskesmas' || req.user.role === 'rs') {
      if (req.user.faskes_id != faskesId) {
        return res.status(403).json({
          success: false,
          message: 'Tidak memiliki izin untuk mengakses data faskes ini'
        });
      }
    }

    const [rows] = await db.execute(`
      SELECT tt.*, 
             f.nama_faskes,
             p.nama_pasien,
             p.no_rm
      FROM tempat_tidur tt
      LEFT JOIN faskes f ON tt.faskes_id = f.id
      LEFT JOIN pasien p ON tt.pasien_id = p.id
      WHERE tt.faskes_id = ?
      ORDER BY tt.nomor_kamar, tt.nomor_bed
    `, [faskesId]);

    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error get tempat tidur by faskes:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data tempat tidur'
    });
  }
});

// Get statistik tempat tidur
router.get('/statistik', verifyToken, async (req, res) => {
  try {
    let whereClause = '';
    const params = [];

    // Filter berdasarkan role
    if (req.user.role === 'puskesmas' || req.user.role === 'rs') {
      whereClause = 'WHERE tt.faskes_id = ?';
      params.push(req.user.faskes_id || 0);
    }

    const [rows] = await db.execute(`
      SELECT 
        f.nama_faskes,
        COUNT(*) as total_bed,
        SUM(CASE WHEN tt.status = 'tersedia' THEN 1 ELSE 0 END) as tersedia,
        SUM(CASE WHEN tt.status = 'terisi' THEN 1 ELSE 0 END) as terisi,
        SUM(CASE WHEN tt.status = 'maintenance' THEN 1 ELSE 0 END) as maintenance,
        SUM(CASE WHEN tt.status = 'reserved' THEN 1 ELSE 0 END) as reserved,
        ROUND((SUM(CASE WHEN tt.status = 'tersedia' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as persentase_tersedia
      FROM tempat_tidur tt
      LEFT JOIN faskes f ON tt.faskes_id = f.id
      ${whereClause}
      GROUP BY tt.faskes_id, f.nama_faskes
      ORDER BY f.nama_faskes
    `, params);

    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error get statistik tempat tidur:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil statistik tempat tidur'
    });
  }
});

// Create tempat tidur baru
router.post('/', verifyToken, requireRole(['admin_pusat']), async (req, res) => {
  try {
    const {
      faskes_id,
      nomor_kamar,
      nomor_bed,
      tipe_kamar,
      catatan
    } = req.body;

    // Validasi input
    if (!faskes_id || !nomor_kamar || !nomor_bed || !tipe_kamar) {
      return res.status(400).json({
        success: false,
        message: 'Semua field wajib diisi'
      });
    }

    // Check apakah bed sudah ada
    const [existing] = await db.execute(`
      SELECT id FROM tempat_tidur 
      WHERE faskes_id = ? AND nomor_kamar = ? AND nomor_bed = ?
    `, [faskes_id, nomor_kamar, nomor_bed]);

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Tempat tidur sudah ada'
      });
    }

    // Insert tempat tidur baru
    const [result] = await db.execute(`
      INSERT INTO tempat_tidur (
        faskes_id, nomor_kamar, nomor_bed, tipe_kamar, catatan
      ) VALUES (?, ?, ?, ?, ?)
    `, [faskes_id, nomor_kamar, nomor_bed, tipe_kamar, catatan]);

    // Get data yang baru dibuat
    const [newBed] = await db.execute(`
      SELECT tt.*, f.nama_faskes
      FROM tempat_tidur tt
      LEFT JOIN faskes f ON tt.faskes_id = f.id
      WHERE tt.id = ?
    `, [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Tempat tidur berhasil ditambahkan',
      data: newBed[0]
    });
  } catch (error) {
    console.error('Error create tempat tidur:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menambahkan tempat tidur'
    });
  }
});

// Update status tempat tidur
router.put('/:id/status', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, pasien_id, tanggal_masuk, catatan } = req.body;

    // Validasi input
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status wajib diisi'
      });
    }

    // Get tempat tidur
    const [bed] = await db.execute(`
      SELECT * FROM tempat_tidur WHERE id = ?
    `, [id]);

    if (bed.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tempat tidur tidak ditemukan'
      });
    }

    // Check permission
    if (req.user.role === 'puskesmas' || req.user.role === 'rs') {
      if (bed[0].faskes_id != req.user.faskes_id) {
        return res.status(403).json({
          success: false,
          message: 'Tidak memiliki izin untuk mengupdate tempat tidur ini'
        });
      }
    }

    // Update status
    const updateData = {
      status,
      catatan: catatan || bed[0].catatan
    };

    // Jika status terisi, update pasien_id dan tanggal_masuk
    if (status === 'terisi' && pasien_id) {
      updateData.pasien_id = pasien_id;
      updateData.tanggal_masuk = tanggal_masuk || new Date();
    } else if (status === 'tersedia') {
      updateData.pasien_id = null;
      updateData.tanggal_masuk = null;
      updateData.tanggal_keluar = new Date();
    }

    await db.execute(`
      UPDATE tempat_tidur 
      SET status = ?, pasien_id = ?, tanggal_masuk = ?, tanggal_keluar = ?, catatan = ?
      WHERE id = ?
    `, [
      updateData.status,
      updateData.pasien_id,
      updateData.tanggal_masuk,
      updateData.tanggal_keluar,
      updateData.catatan,
      id
    ]);

    // Get updated data
    const [updatedBed] = await db.execute(`
      SELECT tt.*, f.nama_faskes, p.nama_pasien, p.no_rm
      FROM tempat_tidur tt
      LEFT JOIN faskes f ON tt.faskes_id = f.id
      LEFT JOIN pasien p ON tt.pasien_id = p.id
      WHERE tt.id = ?
    `, [id]);

    res.json({
      success: true,
      message: 'Status tempat tidur berhasil diupdate',
      data: updatedBed[0]
    });
  } catch (error) {
    console.error('Error update status tempat tidur:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate status tempat tidur'
    });
  }
});

// Update tempat tidur
router.put('/:id', verifyToken, requireRole(['admin_pusat']), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nomor_kamar,
      nomor_bed,
      tipe_kamar,
      catatan
    } = req.body;

    // Validasi input
    if (!nomor_kamar || !nomor_bed || !tipe_kamar) {
      return res.status(400).json({
        success: false,
        message: 'Semua field wajib diisi'
      });
    }

    // Get tempat tidur
    const [bed] = await db.execute(`
      SELECT * FROM tempat_tidur WHERE id = ?
    `, [id]);

    if (bed.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tempat tidur tidak ditemukan'
      });
    }

    // Check apakah bed sudah ada (kecuali bed yang sedang diupdate)
    const [existing] = await db.execute(`
      SELECT id FROM tempat_tidur 
      WHERE faskes_id = ? AND nomor_kamar = ? AND nomor_bed = ? AND id != ?
    `, [bed[0].faskes_id, nomor_kamar, nomor_bed, id]);

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Tempat tidur sudah ada'
      });
    }

    // Update tempat tidur
    await db.execute(`
      UPDATE tempat_tidur 
      SET nomor_kamar = ?, nomor_bed = ?, tipe_kamar = ?, catatan = ?
      WHERE id = ?
    `, [nomor_kamar, nomor_bed, tipe_kamar, catatan, id]);

    // Get updated data
    const [updatedBed] = await db.execute(`
      SELECT tt.*, f.nama_faskes
      FROM tempat_tidur tt
      LEFT JOIN faskes f ON tt.faskes_id = f.id
      WHERE tt.id = ?
    `, [id]);

    res.json({
      success: true,
      message: 'Tempat tidur berhasil diupdate',
      data: updatedBed[0]
    });
  } catch (error) {
    console.error('Error update tempat tidur:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate tempat tidur'
    });
  }
});

// Delete tempat tidur
router.delete('/:id', verifyToken, requireRole(['admin_pusat']), async (req, res) => {
  try {
    const { id } = req.params;

    // Get tempat tidur
    const [bed] = await db.execute(`
      SELECT * FROM tempat_tidur WHERE id = ?
    `, [id]);

    if (bed.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tempat tidur tidak ditemukan'
      });
    }

    // Check apakah bed sedang terisi
    if (bed[0].status === 'terisi') {
      return res.status(400).json({
        success: false,
        message: 'Tidak dapat menghapus tempat tidur yang sedang terisi'
      });
    }

    // Delete tempat tidur
    await db.execute(`
      DELETE FROM tempat_tidur WHERE id = ?
    `, [id]);

    res.json({
      success: true,
      message: 'Tempat tidur berhasil dihapus'
    });
  } catch (error) {
    console.error('Error delete tempat tidur:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus tempat tidur'
    });
  }
});

module.exports = router;
