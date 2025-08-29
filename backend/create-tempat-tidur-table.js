const mysql = require('mysql2/promise');
require('dotenv').config();

async function createTempatTidurTable() {
  let connection;
  
  try {
    // Connect to database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'esir_db'
    });

    console.log('🔗 Connected to database');

    // Create tempat_tidur table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS tempat_tidur (
        id INT AUTO_INCREMENT PRIMARY KEY,
        faskes_id INT NOT NULL,
        nomor_kamar VARCHAR(20) NOT NULL,
        nomor_bed VARCHAR(20) NOT NULL,
        tipe_kamar ENUM('VIP', 'Kelas 1', 'Kelas 2', 'Kelas 3', 'ICU', 'NICU', 'PICU') NOT NULL,
        status ENUM('tersedia', 'terisi', 'maintenance', 'reserved') DEFAULT 'tersedia',
        pasien_id INT NULL,
        tanggal_masuk TIMESTAMP NULL,
        tanggal_keluar TIMESTAMP NULL,
        catatan TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (faskes_id) REFERENCES faskes(id),
        FOREIGN KEY (pasien_id) REFERENCES pasien(id),
        UNIQUE KEY unique_bed (faskes_id, nomor_kamar, nomor_bed)
      )
    `;

    await connection.query(createTableSQL);
    console.log('✅ Table tempat_tidur created successfully');

    // Check if table exists
    const [tables] = await connection.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = '${process.env.DB_NAME || 'esir_db'}' AND table_name = 'tempat_tidur'
    `);

    if (tables[0].count > 0) {
      console.log('✅ Table tempat_tidur exists');
    } else {
      console.log('❌ Table tempat_tidur not found');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the setup
createTempatTidurTable();
