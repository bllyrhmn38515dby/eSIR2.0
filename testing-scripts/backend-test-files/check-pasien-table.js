const db = require('./config/db');

async function checkPasienTable() {
  try {
    console.log('🔍 Mengecek struktur tabel pasien...\n');

    // Cek struktur tabel pasien
    const [columns] = await db.execute('DESCRIBE pasien');
    console.log('📋 Struktur tabel pasien:');
    columns.forEach(col => {
      console.log(`  ${col.Field} - ${col.Type}`);
    });

    // Cek sample data
    const [rows] = await db.execute('SELECT * FROM pasien LIMIT 3');
    console.log('\n📊 Sample data pasien:');
    rows.forEach(row => {
      console.log(`  ID: ${row.id}, Nama: ${row.nama_pasien || 'N/A'}, NIK: ${row.nik}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

checkPasienTable();
