const express = require('express');
const { verifyToken, requireRole } = require('../middleware/auth');
const db = require('../config/db');

const router = express.Router();

// Get dashboard overview statistics
router.get('/dashboard-overview', verifyToken, async (req, res) => {
  try {
    let whereClause = '';
    const params = [];

    // Filter berdasarkan role
    if (req.user.role === 'puskesmas' || req.user.role === 'rs') {
      whereClause = 'WHERE r.faskes_asal_id = ? OR r.faskes_tujuan_id = ?';
      params.push(req.user.faskes_id || 0, req.user.faskes_id || 0);
    }

    const [overview] = await db.execute(`
      SELECT 
        COUNT(*) as total_rujukan,
        SUM(CASE WHEN r.status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN r.status = 'diterima' THEN 1 ELSE 0 END) as diterima,
        SUM(CASE WHEN r.status = 'ditolak' THEN 1 ELSE 0 END) as ditolak,
        SUM(CASE WHEN r.status = 'selesai' THEN 1 ELSE 0 END) as selesai,
        ROUND((SUM(CASE WHEN r.status = 'diterima' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as acceptance_rate,
        ROUND((SUM(CASE WHEN r.status = 'selesai' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as completion_rate
      FROM rujukan r
      ${whereClause}
    `, params);

    // Get monthly trends
    const [monthlyTrends] = await db.execute(`
      SELECT 
        DATE_FORMAT(r.tanggal_rujukan, '%Y-%m') as bulan,
        COUNT(*) as total,
        SUM(CASE WHEN r.status = 'diterima' THEN 1 ELSE 0 END) as diterima,
        SUM(CASE WHEN r.status = 'ditolak' THEN 1 ELSE 0 END) as ditolak
      FROM rujukan r
      ${whereClause}
      GROUP BY DATE_FORMAT(r.tanggal_rujukan, '%Y-%m')
      ORDER BY bulan DESC
      LIMIT 6
    `, params);

    // Get top faskes
    const [topFaskes] = await db.execute(`
      SELECT 
        f.nama_faskes,
        COUNT(*) as total_rujukan,
        SUM(CASE WHEN r.status = 'diterima' THEN 1 ELSE 0 END) as diterima,
        SUM(CASE WHEN r.status = 'ditolak' THEN 1 ELSE 0 END) as ditolak
      FROM rujukan r
      LEFT JOIN faskes f ON r.faskes_asal_id = f.id
      ${whereClause}
      GROUP BY r.faskes_asal_id, f.nama_faskes
      ORDER BY total_rujukan DESC
      LIMIT 5
    `, params);

    // Get bed utilization
    const [bedUtilization] = await db.execute(`
      SELECT 
        f.nama_faskes,
        COUNT(tt.id) as total_bed,
        SUM(CASE WHEN tt.status = 'tersedia' THEN 1 ELSE 0 END) as tersedia,
        SUM(CASE WHEN tt.status = 'terisi' THEN 1 ELSE 0 END) as terisi,
        ROUND((SUM(CASE WHEN tt.status = 'terisi' THEN 1 ELSE 0 END) / COUNT(tt.id)) * 100, 2) as utilization_rate
      FROM tempat_tidur tt
      LEFT JOIN faskes f ON tt.faskes_id = f.id
      ${req.user.role === 'puskesmas' || req.user.role === 'rs' ? 'WHERE tt.faskes_id = ?' : ''}
      GROUP BY tt.faskes_id, f.nama_faskes
      ORDER BY utilization_rate DESC
    `, req.user.role === 'puskesmas' || req.user.role === 'rs' ? [req.user.faskes_id || 0] : []);

    res.json({
      success: true,
      data: {
        overview: overview[0],
        monthlyTrends,
        topFaskes,
        bedUtilization
      }
    });
  } catch (error) {
    console.error('Error get dashboard overview:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data dashboard'
    });
  }
});

// Get detailed referral statistics
router.get('/rujukan-statistik', verifyToken, async (req, res) => {
  try {
    const { startDate, endDate, faskesId, status } = req.query;
    
    let whereClause = 'WHERE 1=1';
    const params = [];

    // Filter berdasarkan role
    if (req.user.role === 'puskesmas' || req.user.role === 'rs') {
      whereClause += ' AND (r.faskes_asal_id = ? OR r.faskes_tujuan_id = ?)';
      params.push(req.user.faskes_id || 0, req.user.faskes_id || 0);
    }

    // Filter tanggal
    if (startDate) {
      whereClause += ' AND DATE(r.tanggal_rujukan) >= ?';
      params.push(startDate);
    }
    if (endDate) {
      whereClause += ' AND DATE(r.tanggal_rujukan) <= ?';
      params.push(endDate);
    }

    // Filter faskes
    if (faskesId) {
      whereClause += ' AND (r.faskes_asal_id = ? OR r.faskes_tujuan_id = ?)';
      params.push(faskesId, faskesId);
    }

    // Filter status
    if (status) {
      whereClause += ' AND r.status = ?';
      params.push(status);
    }

    const [statistik] = await db.execute(`
      SELECT 
        COUNT(*) as total_rujukan,
        SUM(CASE WHEN r.status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN r.status = 'diterima' THEN 1 ELSE 0 END) as diterima,
        SUM(CASE WHEN r.status = 'ditolak' THEN 1 ELSE 0 END) as ditolak,
        SUM(CASE WHEN r.status = 'selesai' THEN 1 ELSE 0 END) as selesai,
        ROUND((SUM(CASE WHEN r.status = 'diterima' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as acceptance_rate,
        ROUND((SUM(CASE WHEN r.status = 'selesai' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as completion_rate,
        AVG(CASE WHEN r.tanggal_respon IS NOT NULL 
          THEN TIMESTAMPDIFF(HOUR, r.tanggal_rujukan, r.tanggal_respon) 
          ELSE NULL END) as avg_response_time_hours
      FROM rujukan r
      ${whereClause}
    `, params);

    // Get daily trends
    const [dailyTrends] = await db.execute(`
      SELECT 
        DATE(r.tanggal_rujukan) as tanggal,
        COUNT(*) as total,
        SUM(CASE WHEN r.status = 'diterima' THEN 1 ELSE 0 END) as diterima,
        SUM(CASE WHEN r.status = 'ditolak' THEN 1 ELSE 0 END) as ditolak
      FROM rujukan r
      ${whereClause}
      GROUP BY DATE(r.tanggal_rujukan)
      ORDER BY tanggal DESC
      LIMIT 30
    `, params);

    // Get faskes performance
    const [faskesPerformance] = await db.execute(`
      SELECT 
        f.nama_faskes,
        COUNT(*) as total_rujukan,
        SUM(CASE WHEN r.status = 'diterima' THEN 1 ELSE 0 END) as diterima,
        SUM(CASE WHEN r.status = 'ditolak' THEN 1 ELSE 0 END) as ditolak,
        SUM(CASE WHEN r.status = 'selesai' THEN 1 ELSE 0 END) as selesai,
        ROUND((SUM(CASE WHEN r.status = 'diterima' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as acceptance_rate,
        AVG(CASE WHEN r.tanggal_respon IS NOT NULL 
          THEN TIMESTAMPDIFF(HOUR, r.tanggal_rujukan, r.tanggal_respon) 
          ELSE NULL END) as avg_response_time_hours
      FROM rujukan r
      LEFT JOIN faskes f ON r.faskes_asal_id = f.id
      ${whereClause}
      GROUP BY r.faskes_asal_id, f.nama_faskes
      ORDER BY total_rujukan DESC
    `, params);

    res.json({
      success: true,
      data: {
        statistik: statistik[0],
        dailyTrends,
        faskesPerformance
      }
    });
  } catch (error) {
    console.error('Error get rujukan statistik:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil statistik rujukan'
    });
  }
});

// Get bed management statistics
router.get('/bed-statistik', verifyToken, async (req, res) => {
  try {
    const { faskesId } = req.query;
    
    let whereClause = 'WHERE 1=1';
    const params = [];

    // Filter berdasarkan role
    if (req.user.role === 'puskesmas' || req.user.role === 'rs') {
      whereClause += ' AND tt.faskes_id = ?';
      params.push(req.user.faskes_id || 0);
    }

    // Filter faskes
    if (faskesId) {
      whereClause += ' AND tt.faskes_id = ?';
      params.push(faskesId);
    }

    const [overview] = await db.execute(`
      SELECT 
        COUNT(*) as total_bed,
        SUM(CASE WHEN tt.status = 'tersedia' THEN 1 ELSE 0 END) as tersedia,
        SUM(CASE WHEN tt.status = 'terisi' THEN 1 ELSE 0 END) as terisi,
        SUM(CASE WHEN tt.status = 'maintenance' THEN 1 ELSE 0 END) as maintenance,
        SUM(CASE WHEN tt.status = 'reserved' THEN 1 ELSE 0 END) as reserved,
        ROUND((SUM(CASE WHEN tt.status = 'tersedia' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as availability_rate,
        ROUND((SUM(CASE WHEN tt.status = 'terisi' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as utilization_rate
      FROM tempat_tidur tt
      ${whereClause}
    `, params);

    // Get bed utilization by type
    const [bedByType] = await db.execute(`
      SELECT 
        tt.tipe_kamar,
        COUNT(*) as total,
        SUM(CASE WHEN tt.status = 'tersedia' THEN 1 ELSE 0 END) as tersedia,
        SUM(CASE WHEN tt.status = 'terisi' THEN 1 ELSE 0 END) as terisi,
        SUM(CASE WHEN tt.status = 'maintenance' THEN 1 ELSE 0 END) as maintenance,
        SUM(CASE WHEN tt.status = 'reserved' THEN 1 ELSE 0 END) as reserved,
        ROUND((SUM(CASE WHEN tt.status = 'terisi' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as utilization_rate
      FROM tempat_tidur tt
      ${whereClause}
      GROUP BY tt.tipe_kamar
      ORDER BY total DESC
    `, params);

    // Get faskes bed summary
    const [faskesBedSummary] = await db.execute(`
      SELECT 
        f.nama_faskes,
        COUNT(tt.id) as total_bed,
        SUM(CASE WHEN tt.status = 'tersedia' THEN 1 ELSE 0 END) as tersedia,
        SUM(CASE WHEN tt.status = 'terisi' THEN 1 ELSE 0 END) as terisi,
        SUM(CASE WHEN tt.status = 'maintenance' THEN 1 ELSE 0 END) as maintenance,
        SUM(CASE WHEN tt.status = 'reserved' THEN 1 ELSE 0 END) as reserved,
        ROUND((SUM(CASE WHEN tt.status = 'tersedia' THEN 1 ELSE 0 END) / COUNT(tt.id)) * 100, 2) as availability_rate,
        ROUND((SUM(CASE WHEN tt.status = 'terisi' THEN 1 ELSE 0 END) / COUNT(tt.id)) * 100, 2) as utilization_rate
      FROM tempat_tidur tt
      LEFT JOIN faskes f ON tt.faskes_id = f.id
      ${whereClause}
      GROUP BY tt.faskes_id, f.nama_faskes
      ORDER BY total_bed DESC
    `, params);

    res.json({
      success: true,
      data: {
        overview: overview[0],
        bedByType,
        faskesBedSummary
      }
    });
  } catch (error) {
    console.error('Error get bed statistik:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil statistik tempat tidur'
    });
  }
});

// Get patient statistics
router.get('/pasien-statistik', verifyToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let whereClause = 'WHERE 1=1';
    const params = [];

    // Filter tanggal
    if (startDate) {
      whereClause += ' AND DATE(p.created_at) >= ?';
      params.push(startDate);
    }
    if (endDate) {
      whereClause += ' AND DATE(p.created_at) <= ?';
      params.push(endDate);
    }

    const [overview] = await db.execute(`
      SELECT 
        COUNT(*) as total_pasien,
        SUM(CASE WHEN p.jenis_kelamin = 'L' THEN 1 ELSE 0 END) as laki_laki,
        SUM(CASE WHEN p.jenis_kelamin = 'P' THEN 1 ELSE 0 END) as perempuan,
        AVG(TIMESTAMPDIFF(YEAR, p.tanggal_lahir, CURDATE())) as avg_age
      FROM pasien p
      ${whereClause}
    `, params);

    // Get age distribution
    const [ageDistribution] = await db.execute(`
      SELECT 
        CASE 
          WHEN TIMESTAMPDIFF(YEAR, p.tanggal_lahir, CURDATE()) < 18 THEN 'Anak-anak (< 18)'
          WHEN TIMESTAMPDIFF(YEAR, p.tanggal_lahir, CURDATE()) < 30 THEN 'Dewasa Muda (18-29)'
          WHEN TIMESTAMPDIFF(YEAR, p.tanggal_lahir, CURDATE()) < 50 THEN 'Dewasa (30-49)'
          WHEN TIMESTAMPDIFF(YEAR, p.tanggal_lahir, CURDATE()) < 65 THEN 'Pra-Lansia (50-64)'
          ELSE 'Lansia (65+)'
        END as age_group,
        COUNT(*) as total
      FROM pasien p
      ${whereClause}
      GROUP BY age_group
      ORDER BY total DESC
    `, params);

    // Get monthly patient registration
    const [monthlyRegistration] = await db.execute(`
      SELECT 
        DATE_FORMAT(p.created_at, '%Y-%m') as bulan,
        COUNT(*) as total_pasien
      FROM pasien p
      ${whereClause}
      GROUP BY DATE_FORMAT(p.created_at, '%Y-%m')
      ORDER BY bulan DESC
      LIMIT 12
    `, params);

    // Get patients with most referrals
    const [topPatients] = await db.execute(`
      SELECT 
        p.nama_pasien,
        p.no_rm,
        COUNT(r.id) as total_rujukan,
        SUM(CASE WHEN r.status = 'diterima' THEN 1 ELSE 0 END) as diterima,
        SUM(CASE WHEN r.status = 'ditolak' THEN 1 ELSE 0 END) as ditolak
      FROM pasien p
      LEFT JOIN rujukan r ON p.id = r.pasien_id
      ${whereClause}
      GROUP BY p.id, p.nama_pasien, p.no_rm
      HAVING total_rujukan > 0
      ORDER BY total_rujukan DESC
      LIMIT 10
    `, params);

    res.json({
      success: true,
      data: {
        overview: overview[0],
        ageDistribution,
        monthlyRegistration,
        topPatients
      }
    });
  } catch (error) {
    console.error('Error get pasien statistik:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil statistik pasien'
    });
  }
});

// Get export data for reports
router.get('/export/:type', verifyToken, async (req, res) => {
  try {
    const { type } = req.params;
    const { startDate, endDate, faskesId, status } = req.query;
    
    let whereClause = 'WHERE 1=1';
    const params = [];

    // Filter berdasarkan role
    if (req.user.role === 'puskesmas' || req.user.role === 'rs') {
      whereClause += ' AND (r.faskes_asal_id = ? OR r.faskes_tujuan_id = ?)';
      params.push(req.user.faskes_id || 0, req.user.faskes_id || 0);
    }

    // Filter tanggal
    if (startDate) {
      whereClause += ' AND DATE(r.tanggal_rujukan) >= ?';
      params.push(startDate);
    }
    if (endDate) {
      whereClause += ' AND DATE(r.tanggal_rujukan) <= ?';
      params.push(endDate);
    }

    // Filter faskes
    if (faskesId) {
      whereClause += ' AND (r.faskes_asal_id = ? OR r.faskes_tujuan_id = ?)';
      params.push(faskesId, faskesId);
    }

    // Filter status
    if (status) {
      whereClause += ' AND r.status = ?';
      params.push(status);
    }

    let query = '';
    let filename = '';

    switch (type) {
      case 'rujukan':
        query = `
          SELECT 
            r.nomor_rujukan,
            p.nama_pasien,
            p.no_rm,
            p.nik,
            fa.nama_faskes as faskes_asal,
            ft.nama_faskes as faskes_tujuan,
            r.diagnosa,
            r.alasan_rujukan,
            r.status,
            r.tanggal_rujukan,
            r.tanggal_respon,
            u.nama_lengkap as created_by
          FROM rujukan r
          LEFT JOIN pasien p ON r.pasien_id = p.id
          LEFT JOIN faskes fa ON r.faskes_asal_id = fa.id
          LEFT JOIN faskes ft ON r.faskes_tujuan_id = ft.id
          LEFT JOIN users u ON r.user_id = u.id
          ${whereClause}
          ORDER BY r.tanggal_rujukan DESC
        `;
        filename = 'laporan_rujukan';
        break;

      case 'pasien':
        query = `
          SELECT 
            p.no_rm,
            p.nama_pasien,
            p.nik,
            p.tanggal_lahir,
            p.jenis_kelamin,
            p.alamat,
            p.telepon,
            p.created_at,
            COUNT(r.id) as total_rujukan
          FROM pasien p
          LEFT JOIN rujukan r ON p.id = r.pasien_id
          ${whereClause}
          GROUP BY p.id, p.no_rm, p.nama_pasien, p.nik, p.tanggal_lahir, p.jenis_kelamin, p.alamat, p.telepon, p.created_at
          ORDER BY p.created_at DESC
        `;
        filename = 'laporan_pasien';
        break;

      case 'tempat-tidur':
        query = `
          SELECT 
            f.nama_faskes,
            tt.nomor_kamar,
            tt.nomor_bed,
            tt.tipe_kamar,
            tt.status,
            p.nama_pasien,
            p.no_rm,
            tt.tanggal_masuk,
            tt.tanggal_keluar,
            tt.catatan
          FROM tempat_tidur tt
          LEFT JOIN faskes f ON tt.faskes_id = f.id
          LEFT JOIN pasien p ON tt.pasien_id = p.id
          ${whereClause}
          ORDER BY f.nama_faskes, tt.nomor_kamar, tt.nomor_bed
        `;
        filename = 'laporan_tempat_tidur';
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Tipe laporan tidak valid'
        });
    }

    const [data] = await db.execute(query, params);

    res.json({
      success: true,
      data: {
        filename: `${filename}_${new Date().toISOString().split('T')[0]}.json`,
        records: data.length,
        data: data
      }
    });
  } catch (error) {
    console.error('Error export data:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengekspor data'
    });
  }
});

module.exports = router;
