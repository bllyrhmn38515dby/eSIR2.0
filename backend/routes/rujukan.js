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
  DIBATALKAN: 'dibatalkan', // Status baru untuk pembatalan
};

// Mock data untuk development
const mockRujukan = [
  {
    id: 1,
    nomor_rujukan: 'RJ20241201001',
    pasien_id: 1,
    faskes_asal_id: 1,
    faskes_tujuan_id: 2,
    diagnosa: 'Sakit jantung',
    alasan_rujukan: 'Perlu pemeriksaan lebih lanjut',
    catatan_asal: 'Pasien mengeluh nyeri dada',
    transport_type: 'pickup',
    status: 'pending',
    tanggal_rujukan: new Date().toISOString(),
    nama_pasien: 'Ahmad Susanto',
    nik_pasien: '1234567890123456',
    faskes_asal_nama: 'Puskesmas Jakarta',
    faskes_tujuan_nama: 'RS Jantung Harapan',
    user_nama: 'Admin',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    nomor_rujukan: 'RJ20241201002',
    pasien_id: 2,
    faskes_asal_id: 1,
    faskes_tujuan_id: 3,
    diagnosa: 'Demam tinggi',
    alasan_rujukan: 'Perlu rawat inap',
    catatan_asal: 'Pasien demam 3 hari',
    transport_type: 'delivery',
    status: 'diterima',
    tanggal_rujukan: new Date().toISOString(),
    nama_pasien: 'Siti Nurhaliza',
    nik_pasien: '9876543210987654',
    faskes_asal_nama: 'Puskesmas Jakarta',
    faskes_tujuan_nama: 'RS Umum Sehat',
    user_nama: 'Admin',
    created_at: new Date().toISOString()
  }
];

// Generate nomor rujukan otomatis
const generateNomorRujukan = async () => {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  let count = 1;
  let nomorRujukan;
  
  // Keep trying until we find a unique nomor
  do {
    nomorRujukan = `RJ${today}${count.toString().padStart(3, '0')}`;
    const [existing] = await db.execute(
      'SELECT id FROM rujukan WHERE nomor_rujukan = ?',
      [nomorRujukan]
    );
    
    if (existing.length === 0) {
      break; // Found unique nomor
    }
    count++;
  } while (count < 1000); // Safety limit
  
  return nomorRujukan;
};

// Get all rujukan (with role-based filtering)
router.get('/', verifyToken, async (req, res) => {
  try {
    let query = `
      SELECT r.*, 
             p.nama_pasien as nama_pasien, p.nik as nik_pasien,
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
    // Fallback ke mock data
    res.json({
      success: true,
      data: mockRujukan
    });
  }
});

// Get rujukan by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT r.*, 
             p.nama_pasien as nama_pasien, p.nik as nik_pasien,
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
    console.log('🔍 Creating rujukan with pasien data...');
    console.log('📋 Request body:', req.body);
    console.log('👤 User:', req.user);
    
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
      catatan_asal,
      transport_type
    } = req.body;

    // Validate input - faskes_asal_id akan diambil dari user yang login
    if (!nik || !nik.toString().trim() || 
        !nama_pasien || !nama_pasien.toString().trim() || 
        !tanggal_lahir || !tanggal_lahir.toString().trim() || 
        !jenis_kelamin || !jenis_kelamin.toString().trim() || 
        !alamat || !alamat.toString().trim() ||
        !faskes_tujuan_id || !faskes_tujuan_id.toString().trim() || 
        !diagnosa || !diagnosa.toString().trim() || 
        !alasan_rujukan || !alasan_rujukan.toString().trim()) {
      return res.status(400).json({
        success: false,
        message: 'Semua field wajib diisi'
      });
    }

    // Validate transport_type
    const validTransportTypes = ['pickup', 'delivery'];
    const selectedTransportType = transport_type || 'pickup';
    if (!validTransportTypes.includes(selectedTransportType)) {
      return res.status(400).json({
        success: false,
        message: 'Jenis transportasi tidak valid. Pilih: pickup atau delivery'
      });
    }

    // Get faskes_asal_id from logged in user
    let userFaskesId = req.user.faskes_id;
    
    // Jika user adalah admin pusat, gunakan faskes_asal_id dari request body
    if (req.user.role === 'admin_pusat') {
      if (!faskes_asal_id || !faskes_asal_id.toString().trim()) {
        return res.status(400).json({
          success: false,
          message: 'Faskes asal harus dipilih untuk admin pusat'
        });
      }
      userFaskesId = faskes_asal_id;
    } else if (!userFaskesId) {
      return res.status(400).json({
        success: false,
        message: 'User tidak terhubung dengan faskes manapun'
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
        SET nama_pasien = ?, tanggal_lahir = ?, jenis_kelamin = ?, 
            alamat = ?, telepon = ?, updated_at = NOW()
        WHERE id = ?
      `, [nama_pasien, tanggal_lahir, jenis_kelamin, alamat, telepon, pasienId]);
    } else {
      // Generate no_rm (nomor rekam medis)
      const no_rm = `RM${Date.now().toString().slice(-8)}`;
      
      // Create new pasien
      const [pasienResult] = await db.execute(`
        INSERT INTO pasien (no_rm, nik, nama_pasien, tanggal_lahir, jenis_kelamin, alamat, telepon)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [no_rm, nik, nama_pasien, tanggal_lahir, jenis_kelamin, alamat, telepon]);
      
      pasienId = pasienResult.insertId;
    }

    // Generate nomor rujukan
    const nomorRujukan = await generateNomorRujukan();

    console.log('🔍 Inserting rujukan with data:', {
      nomorRujukan,
      pasienId,
      userFaskesId,
      faskes_tujuan_id,
      diagnosa,
      alasan_rujukan,
      catatan_asal: catatan_asal || '',
      status: STATUSES.PENDING,
      transport_type: selectedTransportType,
      user_id: req.user.id
    });

    // Insert rujukan
    let result;
    try {
      [result] = await db.execute(`
        INSERT INTO rujukan (
          nomor_rujukan, pasien_id, faskes_asal_id, faskes_tujuan_id,
          diagnosa, alasan_rujukan, catatan_asal, status, transport_type, user_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        nomorRujukan, pasienId, userFaskesId, faskes_tujuan_id,
        diagnosa, alasan_rujukan, catatan_asal || '', STATUSES.PENDING, selectedTransportType, req.user.id
      ]);
      
      console.log('✅ Rujukan inserted successfully:', result.insertId);
    } catch (insertError) {
      console.error('❌ Error inserting rujukan:', insertError);
      throw insertError;
    }

    // Get the created rujukan with details
    const [rujukanData] = await db.execute(`
      SELECT r.*, 
             p.nama_pasien as nama_pasien, p.nik as nik_pasien,
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
    console.error('❌ Error creating rujukan with pasien:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error code:', error.code);
    console.error('❌ Error sqlState:', error.sqlState);
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
             p.nama_pasien as nama_pasien, p.nik as nik_pasien,
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

// Update status rujukan
router.put('/:id/status', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, catatan_tujuan } = req.body;

    // Validate input
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status wajib diisi'
      });
    }

    // Validate status
    const validStatuses = Object.values(STATUSES);
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status tidak valid'
      });
    }

    // Get rujukan
    const [rujukanRows] = await db.execute(`
      SELECT r.*, 
             p.nama_pasien as nama_pasien, p.nik as nik_pasien,
             fa.nama_faskes as faskes_asal_nama,
             ft.nama_faskes as faskes_tujuan_nama
      FROM rujukan r
      LEFT JOIN pasien p ON r.pasien_id = p.id
      LEFT JOIN faskes fa ON r.faskes_asal_id = fa.id
      LEFT JOIN faskes ft ON r.faskes_tujuan_id = ft.id
      WHERE r.id = ?
    `, [id]);

    if (rujukanRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Rujukan tidak ditemukan'
      });
    }

    const rujukan = rujukanRows[0];
    const oldStatus = rujukan.status;

    // Check permission - hanya faskes tujuan yang bisa update status
    if (req.user.role === 'admin_faskes' && req.user.faskes_id) {
      if (rujukan.faskes_tujuan_id != req.user.faskes_id) {
        return res.status(403).json({
          success: false,
          message: 'Tidak memiliki izin untuk mengupdate status rujukan ini'
        });
      }
    }

    // Update status
    await db.execute(`
      UPDATE rujukan 
      SET status = ?, catatan_tujuan = ?, tanggal_respon = NOW()
      WHERE id = ?
    `, [status, catatan_tujuan || null, id]);

    // Get updated rujukan
    const [updatedRujukan] = await db.execute(`
      SELECT r.*, 
             p.nama_pasien as nama_pasien, p.nik as nik_pasien,
             fa.nama_faskes as faskes_asal_nama,
             ft.nama_faskes as faskes_tujuan_nama
      FROM rujukan r
      LEFT JOIN pasien p ON r.pasien_id = p.id
      LEFT JOIN faskes fa ON r.faskes_asal_id = fa.id
      LEFT JOIN faskes ft ON r.faskes_tujuan_id = ft.id
      WHERE r.id = ?
    `, [id]);

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

// Cancel rujukan (pembatalan)
router.put('/:id/cancel', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { alasan_pembatalan } = req.body;

    // Validate input
    if (!alasan_pembatalan) {
      return res.status(400).json({
        success: false,
        message: 'Alasan pembatalan wajib diisi'
      });
    }

    // Get rujukan
    const [rujukanRows] = await db.execute(`
      SELECT r.*, 
             p.nama_pasien as nama_pasien, p.nik as nik_pasien,
             fa.nama_faskes as faskes_asal_nama,
             ft.nama_faskes as faskes_tujuan_nama
      FROM rujukan r
      LEFT JOIN pasien p ON r.pasien_id = p.id
      LEFT JOIN faskes fa ON r.faskes_asal_id = fa.id
      LEFT JOIN faskes ft ON r.faskes_tujuan_id = ft.id
      WHERE r.id = ?
    `, [id]);

    if (rujukanRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Rujukan tidak ditemukan'
      });
    }

    const rujukan = rujukanRows[0];

    // Check if rujukan can be cancelled
    if (rujukan.status === STATUSES.SELESAI) {
      return res.status(400).json({
        success: false,
        message: 'Rujukan yang sudah selesai tidak dapat dibatalkan'
      });
    }

    if (rujukan.status === STATUSES.DIBATALKAN) {
      return res.status(400).json({
        success: false,
        message: 'Rujukan sudah dibatalkan sebelumnya'
      });
    }

    // Check permission - hanya faskes asal yang bisa membatalkan
    if (req.user.role === 'admin_faskes' && req.user.faskes_id) {
      if (rujukan.faskes_asal_id != req.user.faskes_id) {
        return res.status(403).json({
          success: false,
          message: 'Tidak memiliki izin untuk membatalkan rujukan ini'
        });
      }
    }

    const oldStatus = rujukan.status;

    // Update status menjadi dibatalkan
    await db.execute(`
      UPDATE rujukan 
      SET status = ?, catatan_tujuan = ?, tanggal_respon = NOW()
      WHERE id = ?
    `, [STATUSES.DIBATALKAN, `DIBATALKAN: ${alasan_pembatalan}`, id]);

    // Get updated rujukan
    const [updatedRujukan] = await db.execute(`
      SELECT r.*, 
             p.nama_pasien as nama_pasien, p.nik as nik_pasien,
             fa.nama_faskes as faskes_asal_nama,
             ft.nama_faskes as faskes_tujuan_nama
      FROM rujukan r
      LEFT JOIN pasien p ON r.pasien_id = p.id
      LEFT JOIN faskes fa ON r.faskes_asal_id = fa.id
      LEFT JOIN faskes ft ON r.faskes_tujuan_id = ft.id
      WHERE r.id = ?
    `, [id]);

    res.json({
      success: true,
      message: 'Rujukan berhasil dibatalkan',
      data: updatedRujukan[0]
    });

  } catch (error) {
    console.error('Error cancelling rujukan:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal membatalkan rujukan'
    });
  }
});

// Get rujukan statistics
router.get('/stats/overview', verifyToken, async (req, res) => {
  try {
    let query = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'diterima' THEN 1 ELSE 0 END) as diterima,
        SUM(CASE WHEN status = 'ditolak' THEN 1 ELSE 0 END) as ditolak,
        SUM(CASE WHEN status = 'selesai' THEN 1 ELSE 0 END) as selesai,
        SUM(CASE WHEN status = 'dibatalkan' THEN 1 ELSE 0 END) as dibatalkan
      FROM rujukan
    `;

    const params = [];

    // Filter berdasarkan role
    if (req.user.role === 'admin_faskes' && req.user.faskes_id) {
      query += ' WHERE faskes_asal_id = ? OR faskes_tujuan_id = ?';
      params.push(req.user.faskes_id, req.user.faskes_id);
    }

    const [rows] = await db.execute(query, params);

    res.json({
      success: true,
      data: rows[0]
    });

  } catch (error) {
    console.error('Error getting rujukan stats:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil statistik rujukan'
    });
  }
});

module.exports = router;
