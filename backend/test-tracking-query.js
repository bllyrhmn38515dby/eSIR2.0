const db = require('./config/db');

async function testTrackingQuery() {
  console.log('🧪 Testing tracking query...\n');

  try {
    const rujukan_id = 1;

    // Test query yang sama dengan endpoint
    console.log('1. Testing tracking data query...');
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

    console.log('Tracking rows:', trackingRows);

    // Test rujukan query
    console.log('\n2. Testing rujukan query...');
    const [rujukanRows] = await db.execute(`
      SELECT r.*, p.nama_lengkap as nama_pasien, p.no_rm,
             fa.nama_faskes as faskes_asal_nama, fa.latitude as asal_lat, fa.longitude as asal_lng,
             ft.nama_faskes as faskes_tujuan_nama, ft.latitude as tujuan_lat, ft.longitude as tujuan_lng
      FROM rujukan r
      LEFT JOIN pasien p ON r.pasien_id = p.id
      LEFT JOIN faskes fa ON r.faskes_asal_id = fa.id
      LEFT JOIN faskes ft ON r.faskes_tujuan_id = ft.id
      WHERE r.id = ?
    `, [rujukan_id]);

    console.log('Rujukan rows:', rujukanRows);

    // Test faskes data
    console.log('\n3. Testing faskes data...');
    const [faskesRows] = await db.execute('SELECT * FROM faskes WHERE id IN (1, 2)');
    console.log('Faskes data:', faskesRows);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

testTrackingQuery();
