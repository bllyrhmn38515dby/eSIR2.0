const db = require('./config/db');

async function checkTrackingTables() {
  try {
    console.log('🔍 Mengecek tabel tracking...\n');

    // Cek tabel tracking_data
    const [trackingDataTables] = await db.execute("SHOW TABLES LIKE 'tracking_data'");
    if (trackingDataTables.length > 0) {
      console.log('✅ Tabel tracking_data ditemukan');
      
      // Cek struktur
      const [columns] = await db.execute('DESCRIBE tracking_data');
      console.log('📋 Struktur tabel tracking_data:');
      columns.forEach(col => {
        console.log(`  ${col.Field} - ${col.Type}`);
      });
      
      // Cek jumlah data
      const [count] = await db.execute('SELECT COUNT(*) as total FROM tracking_data');
      console.log(`📊 Total data: ${count[0].total}\n`);
    } else {
      console.log('❌ Tabel tracking_data tidak ditemukan\n');
    }

    // Cek tabel tracking_sessions
    const [trackingSessionsTables] = await db.execute("SHOW TABLES LIKE 'tracking_sessions'");
    if (trackingSessionsTables.length > 0) {
      console.log('✅ Tabel tracking_sessions ditemukan');
      
      // Cek struktur
      const [columns] = await db.execute('DESCRIBE tracking_sessions');
      console.log('📋 Struktur tabel tracking_sessions:');
      columns.forEach(col => {
        console.log(`  ${col.Field} - ${col.Type}`);
      });
      
      // Cek jumlah data
      const [count] = await db.execute('SELECT COUNT(*) as total FROM tracking_sessions');
      console.log(`📊 Total data: ${count[0].total}\n`);
    } else {
      console.log('❌ Tabel tracking_sessions tidak ditemukan\n');
    }

    console.log('🎉 Pengecekan selesai!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

checkTrackingTables();
