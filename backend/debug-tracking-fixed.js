const db = require('./config/db');

async function debugTrackingFixed() {
  try {
    console.log('🔍 Testing query yang sudah diperbaiki...\n');

    // Test query yang sudah diperbaiki
    console.log('1. Testing active sessions query...');
    const [rows] = await db.execute(`
      SELECT ts.*, td.latitude, td.longitude, td.status as tracking_status, td.estimated_time, td.estimated_distance,
             r.nomor_rujukan, r.status as rujukan_status, p.nama_lengkap as nama_pasien,
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

    console.log('✅ Query berhasil, data:', rows);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('SQL State:', error.sqlState);
    console.error('SQL Message:', error.sqlMessage);
  } finally {
    process.exit(0);
  }
}

debugTrackingFixed();
