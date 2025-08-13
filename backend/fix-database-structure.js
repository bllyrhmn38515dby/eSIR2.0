require('dotenv').config();
const mysql = require('mysql2');

async function fixDatabaseStructure() {
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
    console.log('🔧 Menonaktifkan foreign key checks...');
    await connection.promise().query('SET FOREIGN_KEY_CHECKS = 0');

    // Drop tabel yang bermasalah
    console.log('🗑️ Menghapus tabel yang bermasalah...');
    await connection.promise().query('DROP TABLE IF EXISTS search_logs');
    await connection.promise().query('DROP TABLE IF EXISTS tracking_data');
    await connection.promise().query('DROP TABLE IF EXISTS tracking_sessions');
    await connection.promise().query('DROP TABLE IF EXISTS tempat_tidur');
    await connection.promise().query('DROP TABLE IF EXISTS rujukan');
    await connection.promise().query('DROP TABLE IF EXISTS pasien');
    await connection.promise().query('DROP TABLE IF EXISTS users');
    await connection.promise().query('DROP TABLE IF EXISTS roles');
    await connection.promise().query('DROP TABLE IF EXISTS faskes');

    // Aktifkan kembali foreign key checks
    await connection.promise().query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('✅ Tabel lama berhasil dihapus');

    // Buat ulang tabel dengan struktur yang benar
    console.log('🔨 Membuat tabel baru...');

    // Tabel faskes
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

    // Tabel roles
    await connection.promise().query(`
      CREATE TABLE roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama_role VARCHAR(50) NOT NULL UNIQUE,
        deskripsi TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabel users (tanpa foreign key dulu)
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

    // Tambahkan foreign key setelah tabel dibuat
    await connection.promise().query(`
      ALTER TABLE users 
      ADD CONSTRAINT fk_users_role_id FOREIGN KEY (role_id) REFERENCES roles(id),
      ADD CONSTRAINT fk_users_faskes_id FOREIGN KEY (faskes_id) REFERENCES faskes(id)
    `);

    // Tabel pasien
    await connection.promise().query(`
      CREATE TABLE pasien (
        id INT AUTO_INCREMENT PRIMARY KEY,
        no_rm VARCHAR(20) NOT NULL UNIQUE,
        nama_pasien VARCHAR(255) NOT NULL,
        nik VARCHAR(16) NOT NULL UNIQUE,
        tanggal_lahir DATE NOT NULL,
        jenis_kelamin ENUM('L', 'P') NOT NULL,
        alamat TEXT NOT NULL,
        telepon VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Tabel rujukan
    await connection.promise().query(`
      CREATE TABLE rujukan (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nomor_rujukan VARCHAR(50) NOT NULL UNIQUE,
        pasien_id INT NOT NULL,
        faskes_asal_id INT NOT NULL,
        faskes_tujuan_id INT NOT NULL,
        diagnosa TEXT NOT NULL,
        alasan_rujukan TEXT NOT NULL,
        catatan_asal TEXT,
        catatan_tujuan TEXT,
        status ENUM('pending', 'diterima', 'ditolak', 'selesai') DEFAULT 'pending',
        tanggal_rujukan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        tanggal_respon TIMESTAMP NULL,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (pasien_id) REFERENCES pasien(id),
        FOREIGN KEY (faskes_asal_id) REFERENCES faskes(id),
        FOREIGN KEY (faskes_tujuan_id) REFERENCES faskes(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Tabel tempat tidur
    await connection.promise().query(`
      CREATE TABLE tempat_tidur (
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
    `);

    // Tabel search_logs
    await connection.promise().query(`
      CREATE TABLE search_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        search_term VARCHAR(255) NOT NULL,
        entity_type ENUM('pasien', 'rujukan', 'faskes', 'tempat_tidur', 'global') NOT NULL,
        results_count INT DEFAULT 0,
        response_time_ms INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Tabel tracking_data
    await connection.promise().query(`
      CREATE TABLE tracking_data (
        id INT AUTO_INCREMENT PRIMARY KEY,
        rujukan_id INT NOT NULL,
        latitude DECIMAL(10,8) NOT NULL,
        longitude DECIMAL(11,8) NOT NULL,
        status ENUM('menunggu', 'dijemput', 'dalam_perjalanan', 'tiba') DEFAULT 'menunggu',
        estimated_time INT,
        estimated_distance DECIMAL(8,2),
        speed DECIMAL(5,2),
        heading INT,
        accuracy DECIMAL(5,2),
        battery_level INT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (rujukan_id) REFERENCES rujukan(id) ON DELETE CASCADE,
        INDEX idx_rujukan_status (rujukan_id, status),
        INDEX idx_updated_at (updated_at)
      )
    `);

    // Tabel tracking_sessions
    await connection.promise().query(`
      CREATE TABLE tracking_sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        rujukan_id INT NOT NULL,
        user_id INT NOT NULL,
        device_id VARCHAR(255),
        session_token VARCHAR(255) UNIQUE,
        is_active BOOLEAN DEFAULT TRUE,
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ended_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (rujukan_id) REFERENCES rujukan(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id),
        INDEX idx_session_token (session_token),
        INDEX idx_active_sessions (is_active, rujukan_id)
      )
    `);

    console.log('✅ Semua tabel berhasil dibuat');

    // Insert data awal
    console.log('📝 Menambahkan data awal...');

    // Insert roles
    await connection.promise().query(`
      INSERT INTO roles (nama_role, deskripsi) VALUES
      ('admin_pusat', 'Administrator Pusat - Akses penuh ke semua fitur'),
      ('admin_faskes', 'Administrator Faskes - Akses terbatas sesuai faskes')
    `);

    // Insert faskes
    await connection.promise().query(`
      INSERT INTO faskes (nama_faskes, alamat, tipe, telepon, latitude, longitude) VALUES
      ('RSUD Kota Bogor', 'Jl. Dr. Semeru No.120, Tegallega, Kec. Bogor Tengah, Kota Bogor, Jawa Barat 16129', 'RSUD', '0251-8313084', -6.5971, 106.8060),
      ('RS Hermina Bogor', 'Jl. Ring Road I No.75, Pakuan, Kec. Bogor Selatan, Kota Bogor, Jawa Barat 16143', 'RSUD', '0251-7537777', -6.6011, 106.7990),
      ('Puskesmas Bogor Tengah', 'Jl. Siliwangi No.45, Pabaton, Kec. Bogor Tengah, Kota Bogor, Jawa Barat 16121', 'Puskesmas', '0251-8321234', -6.5970, 106.8060)
    `);

    // Insert users (password: admin123)
    await connection.promise().query(`
      INSERT INTO users (nama_lengkap, username, email, password, role_id, faskes_id) VALUES
      ('Admin Pusat', 'admin_pusat', 'admin@pusat.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, NULL),
      ('Admin RSUD', 'admin_rsud', 'admin@rsud.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2, 1)
    `);

    console.log('✅ Data awal berhasil ditambahkan');
    
    await connection.promise().end();
    console.log('🎉 Perbaikan struktur database selesai!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('❌ Stack:', error.stack);
    process.exit(1);
  }
}

// Jalankan jika file dijalankan langsung
if (require.main === module) {
  fixDatabaseStructure();
}

module.exports = fixDatabaseStructure;
