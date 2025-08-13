const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const db = require('../config/db');
const crypto = require('crypto');

// Generate session token untuk tracking
const generateSessionToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Calculate distance antara dua koordinat (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius bumi dalam km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Start tracking session
router.post('/start-session', verifyToken, async (req, res) => {
  try {
    const { rujukan_id, device_id } = req.body;

    if (!rujukan_id) {
      return res.status(400).json({
        success: false,
        message: 'rujukan_id wajib diisi'
      });
    }

    // Cek apakah rujukan exists dan user punya akses
    const [rujukanRows] = await db.execute(`
      SELECT r.*, fa.nama_faskes as faskes_asal_nama, ft.nama_faskes as faskes_tujuan_nama
      FROM rujukan r
      LEFT JOIN faskes fa ON r.faskes_asal_id = fa.id
      LEFT JOIN faskes ft ON r.faskes_tujuan_id = ft.id
      WHERE r.id = ?
    `, [rujukan_id]);

    if (rujukanRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Rujukan tidak ditemukan'
      });
    }

    const rujukan = rujukanRows[0];

    // Cek apakah sudah ada session aktif untuk rujukan ini
    const [existingSession] = await db.execute(`
      SELECT * FROM tracking_sessions 
      WHERE rujukan_id = ? AND is_active = TRUE
    `, [rujukan_id]);

    if (existingSession.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Sudah ada session tracking aktif untuk rujukan ini'
      });
    }

    // Generate session token
    const sessionToken = generateSessionToken();

    // Create tracking session
    const [result] = await db.execute(`
      INSERT INTO tracking_sessions (rujukan_id, user_id, device_id, session_token, is_active)
      VALUES (?, ?, ?, ?, TRUE)
    `, [rujukan_id, req.user.id, device_id || null, sessionToken]);

    // Create initial tracking data
    await db.execute(`
      INSERT INTO tracking_data (rujukan_id, latitude, longitude, status, estimated_time, estimated_distance)
      VALUES (?, ?, ?, 'menunggu', NULL, NULL)
    `, [rujukan_id, 0, 0]);

    res.status(201).json({
      success: true,
      message: 'Session tracking berhasil dimulai',
      data: {
        session_id: result.insertId,
        session_token: sessionToken,
        rujukan: rujukan
      }
    });

  } catch (error) {
    console.error('Error starting tracking session:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal memulai session tracking'
    });
  }
});

// Update position (untuk petugas ambulans)
router.post('/update-position', async (req, res) => {
  try {
    const { 
      session_token, 
      latitude, 
      longitude, 
      status, 
      speed, 
      heading, 
      accuracy, 
      battery_level 
    } = req.body;

    if (!session_token || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'session_token, latitude, dan longitude wajib diisi'
      });
    }

    // Validasi koordinat (dalam area Kota Bogor)
    if (latitude < -6.7 || latitude > -6.5 || longitude < 106.7 || longitude > 106.9) {
      return res.status(400).json({
        success: false,
        message: 'Koordinat di luar area Kota Bogor'
      });
    }

    // Cek session token
    const [sessionRows] = await db.execute(`
      SELECT ts.*, r.faskes_tujuan_id, ft.latitude as dest_lat, ft.longitude as dest_lng
      FROM tracking_sessions ts
      LEFT JOIN rujukan r ON ts.rujukan_id = r.id
      LEFT JOIN faskes ft ON r.faskes_tujuan_id = ft.id
      WHERE ts.session_token = ? AND ts.is_active = TRUE
    `, [session_token]);

    if (sessionRows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Session token tidak valid atau sudah tidak aktif'
      });
    }

    const session = sessionRows[0];
    const rujukan_id = session.rujukan_id;

    // Calculate distance dan estimated time ke tujuan
    let estimated_distance = null;
    let estimated_time = null;

    if (session.dest_lat && session.dest_lng) {
      estimated_distance = calculateDistance(
        latitude, longitude, 
        session.dest_lat, session.dest_lng
      );
      
      // Estimate time berdasarkan speed (default 30 km/h jika tidak ada speed)
      const avgSpeed = speed || 30;
      estimated_time = Math.round((estimated_distance / avgSpeed) * 60); // dalam menit
    }

    // Update tracking data
    await db.execute(`
      UPDATE tracking_data 
      SET latitude = ?, longitude = ?, status = ?, estimated_time = ?, 
          estimated_distance = ?, speed = ?, heading = ?, accuracy = ?, battery_level = ?
      WHERE rujukan_id = ?
    `, [
      latitude, longitude, status || 'dalam_perjalanan', estimated_time,
      estimated_distance, speed || 0, heading || null, accuracy || 0, battery_level || null,
      rujukan_id
    ]);

    // Emit real-time update via Socket.IO
    if (global.io) {
      global.io.to(`tracking-${rujukan_id}`).emit('tracking-update', {
        rujukan_id,
        latitude,
        longitude,
        status: status || 'dalam_perjalanan',
        estimated_time,
        estimated_distance,
        speed,
        heading,
        accuracy,
        battery_level,
        updated_at: new Date()
      });
    }

    res.json({
      success: true,
      message: 'Posisi berhasil diupdate',
      data: {
        estimated_distance,
        estimated_time,
        status: status || 'dalam_perjalanan'
      }
    });

  } catch (error) {
    console.error('Error updating position:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate posisi'
    });
  }
});

// Get tracking data untuk rujukan tertentu
router.get('/:rujukan_id', verifyToken, async (req, res) => {
  try {
    const { rujukan_id } = req.params;

    // Get tracking data
    const [trackingRows] = await db.execute(`
      SELECT td.*, ts.session_token, ts.device_id, ts.started_at,
             u.nama_lengkap as petugas_nama
      FROM tracking_data td
      LEFT JOIN tracking_sessions ts ON td.rujukan_id = ts.rujukan_id AND ts.is_active = TRUE
      LEFT JOIN users u ON ts.user_id = u.id
      WHERE td.rujukan_id = ?
      ORDER BY td.updated_at DESC
      LIMIT 1
    `, [rujukan_id]);

    if (trackingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Data tracking tidak ditemukan'
      });
    }

    // Get rujukan details
    const [rujukanRows] = await db.execute(`
      SELECT r.*, p.nama_pasien, p.no_rm,
             fa.nama_faskes as faskes_asal_nama, fa.latitude as asal_lat, fa.longitude as asal_lng,
             ft.nama_faskes as faskes_tujuan_nama, ft.latitude as tujuan_lat, ft.longitude as tujuan_lng
      FROM rujukan r
      LEFT JOIN pasien p ON r.pasien_id = p.id
      LEFT JOIN faskes fa ON r.faskes_asal_id = fa.id
      LEFT JOIN faskes ft ON r.faskes_tujuan_id = ft.id
      WHERE r.id = ?
    `, [rujukan_id]);

    if (rujukanRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Rujukan tidak ditemukan'
      });
    }

    const tracking = trackingRows[0];
    const rujukan = rujukanRows[0];

    res.json({
      success: true,
      data: {
        tracking,
        rujukan,
        route: {
          origin: {
            name: rujukan.faskes_asal_nama,
            lat: rujukan.asal_lat,
            lng: rujukan.asal_lng
          },
          destination: {
            name: rujukan.faskes_tujuan_nama,
            lat: rujukan.tujuan_lat,
            lng: rujukan.tujuan_lng
          },
          current: {
            lat: tracking.latitude,
            lng: tracking.longitude,
            status: tracking.status
          }
        }
      }
    });

  } catch (error) {
    console.error('Error getting tracking data:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data tracking'
    });
  }
});

// Get all active tracking sessions
router.get('/sessions/active', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT ts.*, td.latitude, td.longitude, td.status, td.estimated_time, td.estimated_distance,
             r.nomor_rujukan, p.nama_pasien,
             fa.nama_faskes as faskes_asal_nama,
             ft.nama_faskes as faskes_tujuan_nama,
             u.nama_lengkap as petugas_nama
      FROM tracking_sessions ts
      LEFT JOIN tracking_data td ON ts.rujukan_id = td.rujukan_id
      LEFT JOIN rujukan r ON ts.rujukan_id = r.id
      LEFT JOIN pasien p ON r.pasien_id = p.id
      LEFT JOIN faskes fa ON r.faskes_asal_id = fa.id
      LEFT JOIN faskes ft ON r.faskes_tujuan_id = ft.id
      LEFT JOIN users u ON ts.user_id = u.id
      WHERE ts.is_active = TRUE
      ORDER BY ts.started_at DESC
    `);

    res.json({
      success: true,
      data: rows
    });

  } catch (error) {
    console.error('Error getting active sessions:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data session aktif'
    });
  }
});

// End tracking session
router.post('/end-session/:session_id', verifyToken, async (req, res) => {
  try {
    const { session_id } = req.params;

    // Cek session exists dan user punya akses
    const [sessionRows] = await db.execute(`
      SELECT * FROM tracking_sessions WHERE id = ? AND is_active = TRUE
    `, [session_id]);

    if (sessionRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Session tidak ditemukan atau sudah tidak aktif'
      });
    }

    const session = sessionRows[0];

    // Update session status
    await db.execute(`
      UPDATE tracking_sessions 
      SET is_active = FALSE, ended_at = NOW()
      WHERE id = ?
    `, [session_id]);

    // Update tracking status menjadi 'tiba'
    await db.execute(`
      UPDATE tracking_data 
      SET status = 'tiba', estimated_time = 0, estimated_distance = 0
      WHERE rujukan_id = ?
    `, [session.rujukan_id]);

    res.json({
      success: true,
      message: 'Session tracking berhasil diakhiri'
    });

  } catch (error) {
    console.error('Error ending session:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengakhiri session tracking'
    });
  }
});

module.exports = router;
