require('dotenv').config();
const mysql = require('mysql2');

async function stepByStep() {
  try {
    // Koneksi ke database
    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT
    });

    console.log('✅ Terhubung ke database');

    // Nonaktifkan foreign key checks
    await connection.promise().query('SET FOREIGN_KEY_CHECKS = 0');

    // Drop semua tabel yang ada
    console.log('🗑️ Menghapus semua tabel...');
    const tables = [
      'search_logs', 'tracking_data', 'tracking_sessions', 
      'tempat_tidur', 'rujukan', 'pasien', 'users', 'roles', 'faskes'
    ];
    
    for (const table of tables) {
      try {
        await connection.promise().query(`DROP TABLE IF EXISTS ${table}`);
        console.log(`✅ Tabel ${table} dihapus`);
      } catch (error) {
        console.log(`⚠️ Gagal hapus tabel ${table}:`, error.message);
      }
    }

    // Aktifkan kembali foreign key checks
    await connection.promise().query('SET FOREIGN_KEY_CHECKS = 1');

    // Buat tabel faskes
    console.log('🔨 Membuat tabel faskes...');
    await connection.promise().query(`
      CREATE TABLE faskes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama_faskes VARCHAR(255) NOT NULL,
        alamat TEXT NOT NULL,
        tipe ENUM('RSUD', 'Puskesmas', 'Klinik') NOT NULL,
        telepon VARCHAR(20),
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabel faskes berhasil dibuat');

    // Buat tabel roles
    console.log('🔨 Membuat tabel roles...');
    await connection.promise().query(`
      CREATE TABLE roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama_role VARCHAR(50) NOT NULL UNIQUE,
        deskripsi TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabel roles berhasil dibuat');

    // Buat tabel users
    console.log('🔨 Membuat tabel users...');
    await connection.promise().query(`
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama_lengkap VARCHAR(255) NOT NULL,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role_id INT NOT NULL,
        faskes_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabel users berhasil dibuat');

    // Buat tabel search_logs
    console.log('🔨 Membuat tabel search_logs...');
    await connection.promise().query(`
      CREATE TABLE search_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        search_term VARCHAR(255) NOT NULL,
        entity_type ENUM('pasien', 'rujukan', 'faskes', 'tempat_tidur', 'global') NOT NULL,
        results_count INT DEFAULT 0,
        response_time_ms INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabel search_logs berhasil dibuat');

    // Insert data awal
    console.log('📝 Menambahkan data awal...');
    
    // Insert roles
    await connection.promise().query(`
      INSERT INTO roles (nama_role, deskripsi) VALUES
      ('admin_pusat', 'Administrator Pusat'),
      ('admin_faskes', 'Administrator Faskes')
    `);
    console.log('✅ Data roles berhasil ditambahkan');

    // Insert faskes
    await connection.promise().query(`
      INSERT INTO faskes (nama_faskes, alamat, tipe, telepon) VALUES
      ('RSUD Kota Bogor', 'Jl. Dr. Semeru No.120, Bogor', 'RSUD', '0251-8313084'),
      ('Puskesmas Bogor Tengah', 'Jl. Siliwangi No.45, Bogor', 'Puskesmas', '0251-8321234')
    `);
    console.log('✅ Data faskes berhasil ditambahkan');

    // Insert users (password: admin123)
    await connection.promise().query(`
      INSERT INTO users (nama_lengkap, username, email, password, role_id, faskes_id) VALUES
      ('Admin Pusat', 'admin_pusat', 'admin@pusat.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, NULL),
      ('Admin RSUD', 'admin_rsud', 'admin@rsud.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2, 1)
    `);
    console.log('✅ Data users berhasil ditambahkan');

    console.log('✅ Tabel dasar berhasil dibuat!');
    console.log('✅ Tabel search_logs sudah terbuat!');
    
    await connection.promise().end();

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('❌ Stack:', error.stack);
    process.exit(1);
  }
}

// Jalankan jika file dijalankan langsung
if (require.main === module) {
  stepByStep();
}

module.exports = stepByStep;
