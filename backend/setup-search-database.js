const db = require('./config/db');
require('dotenv').config();

async function setupSearchDatabase() {
  try {
    console.log('✅ Terhubung ke database');

    console.log('✅ Terhubung ke database');

    // Buat tabel search_logs jika belum ada
    const createSearchLogsTable = `
      CREATE TABLE IF NOT EXISTS search_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        search_term VARCHAR(255) NOT NULL,
        entity_type ENUM('pasien', 'rujukan', 'faskes', 'tempat_tidur', 'global') NOT NULL,
        results_count INT DEFAULT 0,
        response_time_ms INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `;

    await db.execute(createSearchLogsTable);
    console.log('✅ Tabel search_logs berhasil dibuat');

    // Tambahkan beberapa data contoh untuk testing
    const insertSampleData = `
      INSERT INTO search_logs (user_id, search_term, entity_type, results_count, response_time_ms) VALUES
      (1, 'Ahmad', 'pasien', 1, 150),
      (1, 'RSUD', 'faskes', 2, 200),
      (2, 'DBD', 'rujukan', 1, 180),
      (2, 'VIP', 'tempat_tidur', 3, 120),
      (3, 'Surabaya', 'global', 5, 300)
    `;

    try {
      await db.execute(insertSampleData);
      console.log('✅ Data contoh search_logs berhasil ditambahkan');
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log('ℹ️ Data contoh sudah ada, melewati...');
      } else {
        console.log('⚠️ Gagal menambahkan data contoh:', error.message);
      }
    }

    // Verifikasi tabel
    const [rows] = await db.execute('DESCRIBE search_logs');
    console.log('\n📋 Struktur tabel search_logs:');
    rows.forEach(row => {
      console.log(`  - ${row.Field}: ${row.Type} ${row.Null === 'NO' ? '(NOT NULL)' : ''} ${row.Key === 'PRI' ? '(PRIMARY KEY)' : ''}`);
    });

    // Cek jumlah data
    const [countResult] = await db.execute('SELECT COUNT(*) as total FROM search_logs');
    console.log(`\n📊 Total data search_logs: ${countResult[0].total}`);

    console.log('\n🎉 Setup database search berhasil selesai!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('❌ Stack:', error.stack);
    process.exit(1);
  }
}

// Jalankan setup jika file dijalankan langsung
if (require.main === module) {
  setupSearchDatabase();
}

module.exports = setupSearchDatabase;
