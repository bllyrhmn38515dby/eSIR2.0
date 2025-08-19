const db = require('./config/db');

async function debugStartSession() {
  try {
    console.log('🔍 Debugging start-session error...\n');

    // Test dengan rujukan_id = 1
    const rujukan_id = 1;
    const user_id = 20; // willin user
    const device_id = 'test-device';

    console.log('1. Checking rujukan exists...');
    const [rujukanRows] = await db.execute(`
      SELECT r.*, fa.nama_faskes as faskes_asal_nama, ft.nama_faskes as faskes_tujuan_nama
      FROM rujukan r
      LEFT JOIN faskes fa ON r.faskes_asal_id = fa.id
      LEFT JOIN faskes ft ON r.faskes_tujuan_id = ft.id
      WHERE r.id = ?
    `, [rujukan_id]);

    if (rujukanRows.length === 0) {
      console.log('❌ Rujukan tidak ditemukan');
      return;
    }

    console.log('✅ Rujukan ditemukan:', rujukanRows[0]);

    console.log('\n2. Checking existing active session...');
    const [existingSession] = await db.execute(`
      SELECT * FROM tracking_sessions 
      WHERE rujukan_id = ? AND is_active = TRUE
    `, [rujukan_id]);

    if (existingSession.length > 0) {
      console.log('❌ Sudah ada session aktif:', existingSession[0]);
      return;
    }

    console.log('✅ Tidak ada session aktif');

    console.log('\n3. Checking user exists...');
    const [userRows] = await db.execute(`
      SELECT * FROM users WHERE id = ?
    `, [user_id]);

    if (userRows.length === 0) {
      console.log('❌ User tidak ditemukan');
      return;
    }

    console.log('✅ User ditemukan:', userRows[0]);

    console.log('\n4. Testing insert tracking_sessions...');
    const sessionToken = require('crypto').randomBytes(32).toString('hex');
    
    const [result] = await db.execute(`
      INSERT INTO tracking_sessions (rujukan_id, user_id, device_id, session_token, is_active)
      VALUES (?, ?, ?, ?, TRUE)
    `, [rujukan_id, user_id, device_id, sessionToken]);

    console.log('✅ Session berhasil dibuat, ID:', result.insertId);

    console.log('\n5. Testing insert tracking_data...');
    await db.execute(`
      INSERT INTO tracking_data (rujukan_id, latitude, longitude, status, estimated_time, estimated_distance)
      VALUES (?, ?, ?, 'menunggu', NULL, NULL)
    `, [rujukan_id, 0, 0]);

    console.log('✅ Tracking data berhasil dibuat');

    console.log('\n6. Verifying data...');
    const [sessionCheck] = await db.execute(`
      SELECT * FROM tracking_sessions WHERE id = ?
    `, [result.insertId]);

    const [dataCheck] = await db.execute(`
      SELECT * FROM tracking_data WHERE rujukan_id = ?
    `, [rujukan_id]);

    console.log('✅ Session data:', sessionCheck[0]);
    console.log('✅ Tracking data:', dataCheck[0]);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('SQL State:', error.sqlState);
    console.error('SQL Message:', error.sqlMessage);
  } finally {
    process.exit(0);
  }
}

debugStartSession();
