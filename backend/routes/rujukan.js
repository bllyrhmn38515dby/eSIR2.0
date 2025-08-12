const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const db = require('../config/db');
const { sendRujukanNotification, sendStatusUpdateNotification } = require('../utils/notificationHelper');

// Generate nomor rujukan otomatis
const generateNomorRujukan = async () => {
  const [rows] = await db.execute(
    'SELECT COUNT(*) as count FROM rujukan WHERE DATE(tanggal_rujukan) = CURDATE()'
  );
  const count = rows[0].count + 1;
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `RJ${today}${count.toString().padStart(3, '0')}`;
};

// Get all rujukan (with role-based filtering)
router.get('/', verifyToken, async (req, res) => {
  try {
    let query = `
      SELECT r.*, 
             p.nama as nama_pasien, p.nik as nik_pasien,
             fa.nama_faskes as faskes_asal_nama,
             ft.nama_faskes as faskes_tujuan_nama,
             u.nama as user_nama
      FROM rujukan r
      LEFT JOIN pasien p ON r.pasien_id = p.id
      LEFT JOIN faskes fa ON r.faskes_asal_id = fa.id
      LEFT JOIN faskes ft ON r.faskes_tujuan_id = ft.id
      LEFT JOIN users u ON r.created_by = u.id
    `;

    const params = [];

    // Filter berdasarkan role
    if (req.user.role === 'puskesmas') {
      query += ' WHERE r.faskes_asal_id = ?';
      params.push(req.user.faskes_id || 0);
    } else if (req.user.role === 'rs') {
      query += ' WHERE r.faskes_tujuan_id = ?';
      params.push(req.user.faskes_id || 0);
    }

    query += ' ORDER BY r.tanggal_rujukan DESC';

    const [rows] = await db.execute(query, params);

    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching rujukan:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data rujukan'
    });
  }
});

// Get rujukan by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT r.*, 
             p.nama as nama_pasien, p.nik as nik_pasien,
             fa.nama_faskes as faskes_asal_nama,
             ft.nama_faskes as faskes_tujuan_nama,
             u.nama as user_nama
      FROM rujukan r
      LEFT JOIN pasien p ON r.pasien_id = p.id
      LEFT JOIN faskes fa ON r.faskes_asal_id = fa.id
      LEFT JOIN faskes ft ON r.faskes_tujuan_id = ft.id
      LEFT JOIN users u ON r.created_by = u.id
      WHERE r.id = ?
    `, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Rujukan tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching rujukan:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data rujukan'
    });
  }
});

// Create new rujukan
router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      pasien_id,
      faskes_tujuan_id,
      diagnosa,
      alasan_rujukan,
      catatan_asal
    } = req.body;

    // Validasi input
    if (!pasien_id || !faskes_tujuan_id || !diagnosa || !alasan_rujukan) {
      return res.status(400).json({
        success: false,
        message: 'Semua field wajib diisi'
      });
    }

    // Generate nomor rujukan
    const nomorRujukan = await generateNomorRujukan();

    // Insert rujukan
    const [result] = await db.execute(`
      INSERT INTO rujukan (
        nomor_rujukan, pasien_id, faskes_asal_id, faskes_tujuan_id,
        diagnosa, alasan_rujukan, catatan_dokter, status, tanggal_rujukan, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', NOW(), ?)
    `, [
      nomorRujukan, pasien_id, req.user.faskes_id, faskes_tujuan_id,
      diagnosa, alasan_rujukan, catatan_asal || '', req.user.id
    ]);

    // Get the created rujukan with details
    const [rujukanData] = await db.execute(`
      SELECT r.*, 
             p.nama as nama_pasien, p.nik as nik_pasien,
             fa.nama_faskes as faskes_asal_nama,
             ft.nama_faskes as faskes_tujuan_nama
      FROM rujukan r
      LEFT JOIN pasien p ON r.pasien_id = p.id
      LEFT JOIN faskes fa ON r.faskes_asal_id = fa.id
      LEFT JOIN faskes ft ON r.faskes_tujuan_id = ft.id
      WHERE r.id = ?
    `, [result.insertId]);

    // Send notification
    if (global.io) {
      try {
        await sendRujukanNotification(global.io, rujukanData[0], req.user.id);
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Rujukan berhasil dibuat',
      data: rujukanData[0]
    });
  } catch (error) {
    console.error('Error creating rujukan:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal membuat rujukan'
    });
  }
});

// Update rujukan status
router.put('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status, catatan_tujuan } = req.body;
    const rujukanId = req.params.id;

    // Validasi status
    const validStatuses = ['pending', 'diterima', 'ditolak', 'selesai'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status tidak valid'
      });
    }

    // Get current rujukan data
    const [currentRujukan] = await db.execute(`
      SELECT r.*, 
             p.nama_pasien, p.no_rm,
             fa.nama_faskes as faskes_asal_nama,
             ft.nama_faskes as faskes_tujuan_nama
      FROM rujukan r
      LEFT JOIN pasien p ON r.pasien_id = p.id
      LEFT JOIN faskes fa ON r.faskes_asal_id = fa.id
      LEFT JOIN faskes ft ON r.faskes_tujuan_id = ft.id
      WHERE r.id = ?
    `, [rujukanId]);

    if (currentRujukan.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Rujukan tidak ditemukan'
      });
    }

    const rujukan = currentRujukan[0];

    // Check if user has permission to update this rujukan
    if (req.user.role === 'puskesmas' && 
        rujukan.faskes_asal_id !== req.user.faskes_id) {
      return res.status(403).json({
        success: false,
        message: 'Tidak memiliki izin untuk mengupdate rujukan ini'
      });
    } else if (req.user.role === 'rs' && 
        rujukan.faskes_tujuan_id !== req.user.faskes_id) {
      return res.status(403).json({
        success: false,
        message: 'Tidak memiliki izin untuk mengupdate rujukan ini'
      });
    }

    // Update status
    await db.execute(`
      UPDATE rujukan 
      SET status = ?, catatan_tujuan = ?, tanggal_respon = NOW()
      WHERE id = ?
    `, [status, catatan_tujuan || '', rujukanId]);

    // Get updated rujukan
    const [updatedRujukan] = await db.execute(`
      SELECT r.*, 
             p.nama as nama_pasien, p.nik as nik_pasien,
             fa.nama_faskes as faskes_asal_nama,
             ft.nama_faskes as faskes_tujuan_nama
      FROM rujukan r
      LEFT JOIN pasien p ON r.pasien_id = p.id
      LEFT JOIN faskes fa ON r.faskes_asal_id = fa.id
      LEFT JOIN faskes ft ON r.faskes_tujuan_id = ft.id
      WHERE r.id = ?
    `, [rujukanId]);

    // Send notification
    if (global.io) {
      try {
        await sendStatusUpdateNotification(global.io, updatedRujukan[0], rujukan.status, status, req.user.id);
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    }

    res.json({
      success: true,
      message: 'Status rujukan berhasil diupdate',
      data: updatedRujukan[0]
    });
  } catch (error) {
    console.error('Error updating rujukan status:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate status rujukan'
    });
  }
});

// Get rujukan statistics
router.get('/stats/overview', verifyToken, async (req, res) => {
  try {
    let whereClause = '';
    const params = [];

    // Filter berdasarkan role
    if (req.user.role === 'puskesmas') {
      whereClause = 'WHERE faskes_asal_id = ?';
      params.push(req.user.faskes_id || 0);
    } else if (req.user.role === 'rs') {
      whereClause = 'WHERE faskes_tujuan_id = ?';
      params.push(req.user.faskes_id || 0);
    }

    const [rows] = await db.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'diterima' THEN 1 ELSE 0 END) as diterima,
        SUM(CASE WHEN status = 'ditolak' THEN 1 ELSE 0 END) as ditolak,
        SUM(CASE WHEN status = 'selesai' THEN 1 ELSE 0 END) as selesai
      FROM rujukan
      ${whereClause}
    `, params);

    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching rujukan stats:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil statistik rujukan'
    });
  }
});

module.exports = router;
