const express = require('express');
const { verifyToken } = require('../middleware/auth');
const db = require('../config/db');

const router = express.Router();

// Global search across multiple entities
router.get('/global', verifyToken, async (req, res) => {
  try {
    const { query, type, limit = 10 } = req.query;
    
    if (!query || query.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Query minimal 2 karakter'
      });
    }

    let results = {};
    const searchQuery = `%${query}%`;

    // Search patients
    if (!type || type === 'pasien') {
      const [patients] = await db.execute(`
        SELECT 
          p.id,
          p.no_rm,
          p.nama_pasien,
          p.nik,
          p.tanggal_lahir,
          p.jenis_kelamin,
          p.alamat,
          'pasien' as entity_type
        FROM pasien p
        WHERE p.nama_pasien LIKE ? 
           OR p.no_rm LIKE ? 
           OR p.nik LIKE ?
           OR p.alamat LIKE ?
        ORDER BY p.nama_pasien
        LIMIT ?
      `, [searchQuery, searchQuery, searchQuery, searchQuery, parseInt(limit)]);
      
      results.pasien = patients;
    }

    // Search referrals
    if (!type || type === 'rujukan') {
      const [referrals] = await db.execute(`
        SELECT 
          r.id,
          r.nomor_rujukan,
          r.diagnosa,
          r.alasan_rujukan,
          r.status,
          r.tanggal_rujukan,
          p.nama_pasien,
          fa.nama_faskes as faskes_asal,
          ft.nama_faskes as faskes_tujuan,
          'rujukan' as entity_type
        FROM rujukan r
        LEFT JOIN pasien p ON r.pasien_id = p.id
        LEFT JOIN faskes fa ON r.faskes_asal_id = fa.id
        LEFT JOIN faskes ft ON r.faskes_tujuan_id = ft.id
        WHERE r.nomor_rujukan LIKE ? 
           OR r.diagnosa LIKE ? 
           OR r.alasan_rujukan LIKE ?
           OR p.nama_pasien LIKE ?
        ORDER BY r.tanggal_rujukan DESC
        LIMIT ?
      `, [searchQuery, searchQuery, searchQuery, searchQuery, parseInt(limit)]);
      
      results.rujukan = referrals;
    }

    // Search healthcare facilities
    if (!type || type === 'faskes') {
      const [facilities] = await db.execute(`
        SELECT 
          f.id,
          f.nama_faskes,
          f.tipe as tipe_faskes,
          f.alamat,
          f.telepon,
          'faskes' as entity_type
        FROM faskes f
        WHERE f.nama_faskes LIKE ? 
           OR f.alamat LIKE ? 
           OR f.telepon LIKE ?
        ORDER BY f.nama_faskes
        LIMIT ?
      `, [searchQuery, searchQuery, searchQuery, parseInt(limit)]);
      
      results.faskes = facilities;
    }

    // Search beds
    if (!type || type === 'tempat-tidur') {
      const [beds] = await db.execute(`
        SELECT 
          tt.id,
          tt.nomor_kamar,
          tt.nomor_bed,
          tt.tipe_kamar,
          tt.status,
          f.nama_faskes,
          p.nama_pasien,
          'tempat_tidur' as entity_type
        FROM tempat_tidur tt
        LEFT JOIN faskes f ON tt.faskes_id = f.id
        LEFT JOIN pasien p ON tt.pasien_id = p.id
        WHERE tt.nomor_kamar LIKE ? 
           OR tt.nomor_bed LIKE ? 
           OR tt.tipe_kamar LIKE ?
           OR f.nama_faskes LIKE ?
           OR p.nama_pasien LIKE ?
        ORDER BY f.nama_faskes, tt.nomor_kamar, tt.nomor_bed
        LIMIT ?
      `, [searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, parseInt(limit)]);
      
      results.tempat_tidur = beds;
    }

    res.json({
      success: true,
      data: results,
      total_results: Object.values(results).reduce((sum, arr) => sum + arr.length, 0)
    });
  } catch (error) {
    console.error('Error global search:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal melakukan pencarian'
    });
  }
});

// Advanced patient search with multiple filters
router.get('/pasien', verifyToken, async (req, res) => {
  try {
    const {
      query = '',
      jenis_kelamin = '',
      usia_min = '',
      usia_max = '',
      alamat = '',
      sort_by = 'nama_pasien',
      sort_order = 'ASC',
      page = 1,
      limit = 20
    } = req.query;

    let whereClause = 'WHERE 1=1';
    const params = [];

    // Text search
    if (query) {
      whereClause += ' AND (p.nama_pasien LIKE ? OR p.no_rm LIKE ? OR p.nik LIKE ?)';
      const searchQuery = `%${query}%`;
      params.push(searchQuery, searchQuery, searchQuery);
    }

    // Gender filter
    if (jenis_kelamin) {
      whereClause += ' AND p.jenis_kelamin = ?';
      params.push(jenis_kelamin);
    }

    // Age range filter
    if (usia_min || usia_max) {
      if (usia_min && usia_max) {
        whereClause += ' AND TIMESTAMPDIFF(YEAR, p.tanggal_lahir, CURDATE()) BETWEEN ? AND ?';
        params.push(parseInt(usia_min), parseInt(usia_max));
      } else if (usia_min) {
        whereClause += ' AND TIMESTAMPDIFF(YEAR, p.tanggal_lahir, CURDATE()) >= ?';
        params.push(parseInt(usia_min));
      } else if (usia_max) {
        whereClause += ' AND TIMESTAMPDIFF(YEAR, p.tanggal_lahir, CURDATE()) <= ?';
        params.push(parseInt(usia_max));
      }
    }

    // Address filter
    if (alamat) {
      whereClause += ' AND p.alamat LIKE ?';
      params.push(`%${alamat}%`);
    }

    // Count total results
    const [countResult] = await db.execute(`
      SELECT COUNT(*) as total
      FROM pasien p
      ${whereClause}
    `, params);

    const total = countResult[0].total;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Get paginated results
    const [patients] = await db.execute(`
      SELECT 
        p.*,
        TIMESTAMPDIFF(YEAR, p.tanggal_lahir, CURDATE()) as usia,
        COUNT(r.id) as total_rujukan,
        SUM(CASE WHEN r.status = 'diterima' THEN 1 ELSE 0 END) as rujukan_diterima,
        SUM(CASE WHEN r.status = 'ditolak' THEN 1 ELSE 0 END) as rujukan_ditolak
      FROM pasien p
      LEFT JOIN rujukan r ON p.id = r.pasien_id
      ${whereClause}
      GROUP BY p.id, p.no_rm, p.nama_pasien, p.nik, p.tanggal_lahir, p.jenis_kelamin, p.alamat, p.telepon, p.nama_wali, p.telepon_wali
      ORDER BY ${sort_by} ${sort_order}
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), offset]);

    res.json({
      success: true,
      data: {
        patients,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          total_pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error advanced patient search:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal melakukan pencarian pasien'
    });
  }
});

// Advanced referral search with multiple filters
router.get('/rujukan', verifyToken, async (req, res) => {
  try {
    const {
      query = '',
      status = '',
      faskes_asal = '',
      faskes_tujuan = '',
      tanggal_mulai = '',
      tanggal_akhir = '',
      diagnosa = '',
      sort_by = 'tanggal_rujukan',
      sort_order = 'DESC',
      page = 1,
      limit = 20
    } = req.query;

    let whereClause = 'WHERE 1=1';
    const params = [];

    // Role-based filtering
    if (req.user.role === 'admin_faskes') {
      whereClause += ' AND (r.faskes_asal_id = ? OR r.faskes_tujuan_id = ?)';
      params.push(req.user.faskes_id || 0, req.user.faskes_id || 0);
    }

    // Text search
    if (query) {
      whereClause += ' AND (r.nomor_rujukan LIKE ? OR r.diagnosa LIKE ? OR r.alasan_rujukan LIKE ? OR p.nama_pasien LIKE ?)';
      const searchQuery = `%${query}%`;
      params.push(searchQuery, searchQuery, searchQuery, searchQuery);
    }

    // Status filter
    if (status) {
      whereClause += ' AND r.status = ?';
      params.push(status);
    }

    // Source facility filter
    if (faskes_asal) {
      whereClause += ' AND fa.nama_faskes LIKE ?';
      params.push(`%${faskes_asal}%`);
    }

    // Destination facility filter
    if (faskes_tujuan) {
      whereClause += ' AND ft.nama_faskes LIKE ?';
      params.push(`%${faskes_tujuan}%`);
    }

    // Date range filter
    if (tanggal_mulai) {
      whereClause += ' AND DATE(r.tanggal_rujukan) >= ?';
      params.push(tanggal_mulai);
    }
    if (tanggal_akhir) {
      whereClause += ' AND DATE(r.tanggal_rujukan) <= ?';
      params.push(tanggal_akhir);
    }

    // Diagnosis filter
    if (diagnosa) {
      whereClause += ' AND r.diagnosa LIKE ?';
      params.push(`%${diagnosa}%`);
    }

    // Count total results
    const [countResult] = await db.execute(`
      SELECT COUNT(*) as total
      FROM rujukan r
      LEFT JOIN pasien p ON r.pasien_id = p.id
      LEFT JOIN faskes fa ON r.faskes_asal_id = fa.id
      LEFT JOIN faskes ft ON r.faskes_tujuan_id = ft.id
      ${whereClause}
    `, params);

    const total = countResult[0].total;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Get paginated results
    const [referrals] = await db.execute(`
      SELECT 
        r.*,
        p.nama_pasien,
        p.no_rm,
        p.nik,
        fa.nama_faskes as faskes_asal,
        ft.nama_faskes as faskes_tujuan,
        u.nama_lengkap as created_by,
        TIMESTAMPDIFF(HOUR, r.tanggal_rujukan, COALESCE(r.tanggal_respon, NOW())) as waktu_tunggu_jam
      FROM rujukan r
      LEFT JOIN pasien p ON r.pasien_id = p.id
      LEFT JOIN faskes fa ON r.faskes_asal_id = fa.id
      LEFT JOIN faskes ft ON r.faskes_tujuan_id = ft.id
      LEFT JOIN users u ON r.user_id = u.id
      ${whereClause}
      ORDER BY ${sort_by} ${sort_order}
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), offset]);

    res.json({
      success: true,
      data: {
        referrals,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          total_pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error advanced referral search:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal melakukan pencarian rujukan'
    });
  }
});

// Advanced bed search with multiple filters
router.get('/tempat-tidur', verifyToken, async (req, res) => {
  try {
    const {
      query = '',
      faskes = '',
      status = '',
      tipe_kamar = '',
      tersedia = '',
      sort_by = 'faskes_id',
      sort_order = 'ASC',
      page = 1,
      limit = 20
    } = req.query;

    let whereClause = 'WHERE 1=1';
    const params = [];

    // Role-based filtering
    if (req.user.role === 'admin_faskes') {
      whereClause += ' AND tt.faskes_id = ?';
      params.push(req.user.faskes_id || 0);
    }

    // Text search
    if (query) {
      whereClause += ' AND (tt.nomor_kamar LIKE ? OR tt.nomor_bed LIKE ? OR f.nama_faskes LIKE ? OR p.nama_pasien LIKE ?)';
      const searchQuery = `%${query}%`;
      params.push(searchQuery, searchQuery, searchQuery, searchQuery);
    }

    // Facility filter
    if (faskes) {
      whereClause += ' AND f.nama_faskes LIKE ?';
      params.push(`%${faskes}%`);
    }

    // Status filter
    if (status) {
      whereClause += ' AND tt.status = ?';
      params.push(status);
    }

    // Room type filter
    if (tipe_kamar) {
      whereClause += ' AND tt.tipe_kamar = ?';
      params.push(tipe_kamar);
    }

    // Availability filter
    if (tersedia === 'true') {
      whereClause += ' AND tt.status = "tersedia"';
    } else if (tersedia === 'false') {
      whereClause += ' AND tt.status != "tersedia"';
    }

    // Count total results
    const [countResult] = await db.execute(`
      SELECT COUNT(*) as total
      FROM tempat_tidur tt
      LEFT JOIN faskes f ON tt.faskes_id = f.id
      LEFT JOIN pasien p ON tt.pasien_id = p.id
      ${whereClause}
    `, params);

    const total = countResult[0].total;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Get paginated results
    const [beds] = await db.execute(`
      SELECT 
        tt.*,
        f.nama_faskes,
        p.nama_pasien,
        p.no_rm,
        TIMESTAMPDIFF(DAY, tt.tanggal_masuk, COALESCE(tt.tanggal_keluar, NOW())) as lama_terisi_hari
      FROM tempat_tidur tt
      LEFT JOIN faskes f ON tt.faskes_id = f.id
      LEFT JOIN pasien p ON tt.pasien_id = p.id
      ${whereClause}
      ORDER BY ${sort_by} ${sort_order}
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), offset]);

    res.json({
      success: true,
      data: {
        beds,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          total_pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error advanced bed search:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal melakukan pencarian tempat tidur'
    });
  }
});

// Autocomplete suggestions
router.get('/autocomplete/:type', verifyToken, async (req, res) => {
  try {
    const { type } = req.params;
    const { query, limit = 10 } = req.query;
    
    if (!query || query.length < 2) {
      return res.json({
        success: true,
        data: []
      });
    }

    const searchQuery = `%${query}%`;
    let suggestions = [];

    switch (type) {
      case 'pasien':
        const [patients] = await db.execute(`
          SELECT 
            p.id,
            p.nama_pasien as label,
            p.no_rm as subtitle,
            CONCAT(p.nama_pasien, ' (', p.no_rm, ')') as display_text
          FROM pasien p
          WHERE p.nama_pasien LIKE ? OR p.no_rm LIKE ?
          ORDER BY p.nama_pasien
          LIMIT ?
        `, [searchQuery, searchQuery, parseInt(limit)]);
        suggestions = patients;
        break;

      case 'faskes':
        const [facilities] = await db.execute(`
          SELECT 
            f.id,
            f.nama_faskes as label,
            f.tipe as subtitle,
            CONCAT(f.nama_faskes, ' (', f.tipe, ')') as display_text
          FROM faskes f
          WHERE f.nama_faskes LIKE ? OR f.alamat LIKE ?
          ORDER BY f.nama_faskes
          LIMIT ?
        `, [searchQuery, searchQuery, parseInt(limit)]);
        suggestions = facilities;
        break;

      case 'diagnosa':
        const [diagnoses] = await db.execute(`
          SELECT DISTINCT
            r.diagnosa as label,
            COUNT(*) as frequency
          FROM rujukan r
          WHERE r.diagnosa LIKE ?
          GROUP BY r.diagnosa
          ORDER BY frequency DESC, r.diagnosa
          LIMIT ?
        `, [searchQuery, parseInt(limit)]);
        suggestions = diagnoses.map(d => ({
          ...d,
          subtitle: `${d.frequency} rujukan`,
          display_text: d.label
        }));
        break;

      case 'rujukan':
        const [referrals] = await db.execute(`
          SELECT 
            r.id,
            r.nomor_rujukan as label,
            CONCAT(p.nama_pasien, ' - ', r.diagnosa) as subtitle,
            CONCAT(r.nomor_rujukan, ' - ', p.nama_pasien) as display_text
          FROM rujukan r
          LEFT JOIN pasien p ON r.pasien_id = p.id
          WHERE r.nomor_rujukan LIKE ? OR p.nama_pasien LIKE ?
          ORDER BY r.tanggal_rujukan DESC
          LIMIT ?
        `, [searchQuery, searchQuery, parseInt(limit)]);
        suggestions = referrals;
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Tipe autocomplete tidak valid'
        });
    }

    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    console.error('Error autocomplete:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil saran autocomplete'
    });
  }
});

// Search analytics and insights
router.get('/analytics', verifyToken, async (req, res) => {
  try {
    const { date_range = '30' } = req.query;
    
    // Get search trends
    const [searchTrends] = await db.execute(`
      SELECT 
        DATE(created_at) as tanggal,
        COUNT(*) as total_searches,
        COUNT(DISTINCT user_id) as unique_users
      FROM search_logs
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY DATE(created_at)
      ORDER BY tanggal DESC
    `, [parseInt(date_range)]);

    // Get popular search terms
    const [popularTerms] = await db.execute(`
      SELECT 
        search_term,
        COUNT(*) as frequency,
        COUNT(DISTINCT user_id) as unique_users
      FROM search_logs
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY search_term
      ORDER BY frequency DESC
      LIMIT 10
    `, [parseInt(date_range)]);

    // Get search performance by entity type
    const [entityPerformance] = await db.execute(`
      SELECT 
        entity_type,
        COUNT(*) as total_searches,
        AVG(response_time_ms) as avg_response_time,
        COUNT(CASE WHEN results_count > 0 THEN 1 END) as successful_searches
      FROM search_logs
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY entity_type
      ORDER BY total_searches DESC
    `, [parseInt(date_range)]);

    res.json({
      success: true,
      data: {
        searchTrends,
        popularTerms,
        entityPerformance,
        date_range: parseInt(date_range)
      }
    });
  } catch (error) {
    console.error('Error search analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil analisis pencarian'
    });
  }
});

module.exports = router;
