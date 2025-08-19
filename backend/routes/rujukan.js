const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const db = require('../config/db');
const { sendRujukanNotification, sendStatusUpdateNotification } = require('../utils/notificationHelper');

// Constants for status
const STATUSES = {
  PENDING: 'pending',
  DITERIMA: 'diterima',
  DITOLAK: 'ditolak',
  SELESAI: 'selesai',
};

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
             p.nama_lengkap as nama_pasien, p.nik as nik_pasien,
             fa.nama_faskes as faskes_asal_nama,
             ft.nama_faskes as faskes_tujuan_nama,
             u.nama_lengkap as user_nama
      FROM rujukan r
      LEFT JOIN pasien p ON r.pasien_id = p.id
      LEFT JOIN faskes fa ON r.faskes_asal_id = fa.id
      LEFT JOIN faskes ft ON r.faskes_tujuan_id = ft.id
      LEFT JOIN users u ON r.user_id = u.id
    `;

    const params = [];

    // Filter berdasarkan role
    if (req.user.role === 'admin_faskes' && req.user.faskes_id) {
      query += ' WHERE (r.faskes_asal_id = ? OR r.faskes_tujuan_id = ?)';
      params.push(req.user.faskes_id, req.user.faskes_id);
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
             p.nama_lengkap as nama_pasien, p.nik as nik_pasien,
             fa.nama_faskes as faskes_asal_nama,
             ft.nama_faskes as faskes_tujuan_nama,
             u.nama_lengkap as user_nama
      FROM rujukan r
      LEFT JOIN pasien p ON r.pasien_id = p.id
      LEFT JOIN faskes fa ON r.faskes_asal_id = fa.id
      LEFT JOIN faskes ft ON r.faskes_tujuan_id = ft.id
      LEFT JOIN users u ON r.user_id = u.id
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

// Create new rujukan with pasien data
router.post('/with-pasien', verifyToken, async (req, res) => {
  try {
    const {
      nik,
      nama_pasien,
      tanggal_lahir,
      jenis_kelamin,
      alamat,
      telepon,
      faskes_asal_id,
      faskes_tujuan_id,
      diagnosa,
      alasan_rujukan,
      catatan_asal
    } = req.body;

    // Validate input
    if (!nik || !nama_pasien || !tanggal_lahir || !jenis_kelamin || !alamat ||
        !faskes_asal_id || !faskes_tujuan_id || !diagnosa || !alasan_rujukan) {
      return res.status(400).json({
        success: false,
        message: 'Semua field wajib diisi'
      });
    }

    // Validate NIK (16 digit)
    if (nik.length !== 16 || !/^\d+$/.test(nik)) {
      return res.status(400).json({
        success: false,
        message: 'NIK harus 16 digit angka'
      });
    }

    let pasienId;

    // Check if pasien already exists
    const [existingPasien] = await db.execute(
      'SELECT id FROM pasien WHERE nik = ?',
      [nik]
    );

    if (existingPasien.length > 0) {
      // Update existing pasien
      pasienId = existingPasien[0].id;
      await db.execute(`
        UPDATE pasien 
        SET nama_lengkap = ?, tanggal_lahir = ?, jenis_kelamin = ?, 
            alamat = ?, telepon = ?, updated_at = NOW()
        WHERE id = ?
      `, [nama_pasien, tanggal_lahir, jenis_kelamin, alamat, telepon, pasienId]);
    } else {
      // Create new pasien
      const [pasienResult] = await db.execute(`
        INSERT INTO pasien (nik, nama_lengkap, tanggal_lahir, jenis_kelamin, alamat, telepon)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [nik, nama_pasien, tanggal_lahir, jenis_kelamin, alamat, telepon]);
      
      pasienId = pasienResult.insertId;
    }

    // Generate nomor rujukan
    const nomorRujukan = await generateNomorRujukan();

    // Insert rujukan
    const [result] = await db.execute(`
      INSERT INTO rujukan (
        nomor_rujukan, pasien_id, faskes_asal_id, faskes_tujuan_id,
        diagnosa, alasan_rujukan, catatan_asal, status, tanggal_rujukan, user_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)
    `, [
      nomorRujukan, pasienId, faskes_asal_id, faskes_tujuan_id,
      diagnosa, alasan_rujukan, catatan_asal || '', STATUSES.PENDING, req.user.id
    ]);

    // Get the created rujukan with details
    const [rujukanData] = await db.execute(`
      SELECT r.*, 
             p.nama_lengkap as nama_pasien, p.nik as nik_pasien,
             fa.nama_faskes as faskes_asal_nama,
             ft.nama_faskes as faskes_tujuan_nama
      FROM rujukan r
      LEFT JOIN pasien p ON r.pasien_id = p.id
      LEFT JOIN faskes fa ON r.faskes_asal_id = fa.id
      LEFT JOIN faskes ft ON r.faskes_tujuan_id = ft.id
      WHERE r.id = ?
    `, [result.insertId]);

    const message = existingPasien.length > 0 
      ? 'Pasien berhasil diupdate dan rujukan berhasil dibuat'
      : 'Pasien baru berhasil dibuat dan rujukan berhasil dibuat';

    res.status(201).json({
      success: true,
      message: message,
      data: rujukanData[0]
    });
  } catch (error) {
    console.error('Error creating rujukan with pasien:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal membuat rujukan'
    });
  }
});

// Create new rujukan (original endpoint - keep for backward compatibility)
router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      pasien_id,
      faskes_tujuan_id,
      diagnosa,
      alasan_rujukan,
      catatan_asal
    } = req.body;

    // Validate input
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
        diagnosa, alasan_rujukan, catatan_asal, status, tanggal_rujukan, user_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)
    `, [
      nomorRujukan, pasien_id, req.user.faskes_id, faskes_tujuan_id,
      diagnosa, alasan_rujukan, catatan_asal || '', STATUSES.PENDING, req.user.id
    ]);

    // Get the created rujukan with details
    const [rujukanData] = await db.execute(`
      SELECT r.*, 
             p.nama_lengkap as nama_pasien, p.nik as nik_pasien,
             fa.nama_faskes as faskes_asal_nama,
             ft.nama_faskes as faskes_tujuan_nama
      FROM rujukan r
      LEFT JOIN pasien p ON r.pasien_id = p.id
      LEFT JOIN faskes fa ON r.faskes_asal_id = fa.id
      LEFT JOIN faskes ft ON r.faskes_tujuan_id = ft.id
      WHERE r.id = ?
    `, [result.insertId]);

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

    // Validate status
    if (!Object.values(STATUSES).includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status tidak valid'
      });
    }

    // Get current rujukan data
    const [currentRujukan] = await db.execute(`
      SELECT r.*, 
             p.nama_lengkap as nama_pasien, p.nik as nik_pasien,
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
    if (req.user.role === 'admin_faskes' && 
        rujukan.faskes_asal_id !== req.user.faskes_id && 
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
             p.nama_lengkap as nama_pasien, p.nik as nik_pasien,
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
    let query = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as diterima,
        SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as ditolak,
        SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as selesai
      FROM rujukan
    `;
    
    const params = [STATUSES.PENDING, STATUSES.DITERIMA, STATUSES.DITOLAK, STATUSES.SELESAI];

    // Filter berdasarkan role user
    if (req.user.role === 'admin_faskes' && req.user.faskes_id) {
      query += ' WHERE (faskes_asal_id = ? OR faskes_tujuan_id = ?)';
      params.push(req.user.faskes_id, req.user.faskes_id);
    }

    const [rows] = await db.execute(query, params);
    
    const stats = rows.length > 0 ? rows[0] : {
      total: 0,
      pending: 0,
      diterima: 0,
      ditolak: 0,
      selesai: 0
    };

    res.json({
      success: true,
      data: {
        total: parseInt(stats.total) || 0,
        pending: parseInt(stats.pending) || 0,
        diterima: parseInt(stats.diterima) || 0,
        ditolak: parseInt(stats.ditolak) || 0,
        selesai: parseInt(stats.selesai) || 0
      }
    });
  } catch (error) {
    console.error('Error fetching rujukan stats:', error);
    
    // Return default stats if there's an error
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
  }
});

module.exports = router;
