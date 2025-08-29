const db = require('./config/db');

async function addSearchTable() {
  try {
    console.log('🔧 Menambahkan tabel search_logs...');
    
    // Buat tabel search_logs
    const createTableSQL = `
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
    
    await db.execute(createTableSQL);
    console.log('✅ Tabel search_logs berhasil dibuat');
    
    // Cek apakah tabel sudah ada
    const [tables] = await db.execute("SHOW TABLES LIKE 'search_logs'");
    if (tables.length > 0) {
      console.log('✅ Tabel search_logs sudah ada di database');
    } else {
      console.log('❌ Tabel search_logs tidak ditemukan');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

addSearchTable();
