const mysql = require('mysql2/promise');
require('dotenv').config();

async function createAllTables() {
  let connection;
  
  try {
    // Connect to database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'esirv2'
    });

    console.log('🔗 Connected to database');

    // Create faskes table
    const createFaskesSQL = `
      CREATE TABLE IF NOT EXISTS faskes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama_faskes VARCHAR(255) NOT NULL,
        alamat TEXT NOT NULL,
        tipe ENUM('RSUD', 'Puskesmas', 'Klinik', 'RS Swasta') NOT NULL,
        telepon VARCHAR(20),
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    await connection.query(createFaskesSQL);
    console.log('✅ Table faskes created');

    // Create roles table
    const createRolesSQL = `
      CREATE TABLE IF NOT EXISTS roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama_role VARCHAR(50) NOT NULL UNIQUE,
        deskripsi TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await connection.query(createRolesSQL);
    console.log('✅ Table roles created');

    // Create users table
    const createUsersSQL = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama_lengkap VARCHAR(255) NOT NULL,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role_id INT NOT NULL,
        faskes_id INT,
        telepon VARCHAR(20),
        last_login TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (role_id) REFERENCES roles(id),
        FOREIGN KEY (faskes_id) REFERENCES faskes(id)
      )
    `;
    await connection.query(createUsersSQL);
    console.log('✅ Table users created');

    // Create pasien table
    const createPasienSQL = `
      CREATE TABLE IF NOT EXISTS pasien (
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
    `;
    await connection.query(createPasienSQL);
    console.log('✅ Table pasien created');

    // Create rujukan table
    const createRujukanSQL = `
      CREATE TABLE IF NOT EXISTS rujukan (
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
    `;
    await connection.query(createRujukanSQL);
    console.log('✅ Table rujukan created');

    // Create tempat_tidur table
    const createTempatTidurSQL = `
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
    await connection.query(createTempatTidurSQL);
    console.log('✅ Table tempat_tidur created');

    // Insert sample data
    await insertSampleData(connection);

    console.log('✅ All tables created successfully');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

async function insertSampleData(connection) {
  try {
    // Insert roles
    await connection.query(`
      INSERT IGNORE INTO roles (nama_role, deskripsi) VALUES
      ('admin_pusat', 'Administrator Pusat - Akses penuh ke semua fitur'),
      ('admin_faskes', 'Administrator Faskes - Akses terbatas sesuai faskes'),
      ('operator', 'Operator - Akses terbatas untuk input data')
    `);
    console.log('✅ Sample roles inserted');

    // Insert faskes
    await connection.query(`
      INSERT IGNORE INTO faskes (nama_faskes, alamat, tipe, telepon, latitude, longitude) VALUES
      ('RSUD Kota Bogor', 'Jl. Dr. Semeru No.120, Tegallega, Kec. Bogor Tengah, Kota Bogor, Jawa Barat 16129', 'RSUD', '0251-8313084', -6.5971, 106.8060),
      ('RS Hermina Bogor', 'Jl. Ring Road I No.75, Pakuan, Kec. Bogor Selatan, Kota Bogor, Jawa Barat 16143', 'RS Swasta', '0251-7537777', -6.6011, 106.7990),
      ('Puskesmas Bogor Tengah', 'Jl. Siliwangi No.45, Pabaton, Kec. Bogor Tengah, Kota Bogor, Jawa Barat 16121', 'Puskesmas', '0251-8321234', -6.5970, 106.8060)
    `);
    console.log('✅ Sample faskes inserted');

    // Insert users
    await connection.query(`
      INSERT IGNORE INTO users (nama_lengkap, username, email, password, role_id, faskes_id) VALUES
      ('Admin Pusat', 'admin_pusat', 'admin@pusat.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, NULL),
      ('Admin RSUD', 'admin_rsud', 'admin@rsud.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2, 1)
    `);
    console.log('✅ Sample users inserted');

    // Insert pasien
    await connection.query(`
      INSERT IGNORE INTO pasien (no_rm, nama_pasien, nik, tanggal_lahir, jenis_kelamin, alamat, telepon) VALUES
      ('RM001', 'Ahmad Santoso', '3573010101990001', '1999-01-01', 'L', 'Jl. Ahmad Yani No.10, Bogor', '081234567890'),
      ('RM002', 'Siti Nurhaliza', '3573010202990002', '1999-02-02', 'P', 'Jl. Gubeng Jaya No.15, Bogor', '081234567891')
    `);
    console.log('✅ Sample pasien inserted');

    // Insert tempat tidur
    await connection.query(`
      INSERT IGNORE INTO tempat_tidur (faskes_id, nomor_kamar, nomor_bed, tipe_kamar, status, catatan) VALUES
      (1, 'VIP-01', 'A', 'VIP', 'tersedia', 'Kamar VIP dengan AC dan TV'),
      (1, 'VIP-01', 'B', 'VIP', 'tersedia', 'Kamar VIP dengan AC dan TV'),
      (1, 'K1-01', 'A', 'Kelas 1', 'tersedia', 'Kamar Kelas 1'),
      (1, 'K1-01', 'B', 'Kelas 1', 'maintenance', 'Sedang diperbaiki'),
      (1, 'K2-01', 'A', 'Kelas 2', 'tersedia', 'Kamar Kelas 2'),
      (1, 'K2-01', 'B', 'Kelas 2', 'reserved', 'Dipesan untuk operasi'),
      (1, 'ICU-01', 'A', 'ICU', 'tersedia', 'ICU dengan ventilator'),
      (1, 'ICU-01', 'B', 'ICU', 'tersedia', 'ICU dengan ventilator')
    `);
    console.log('✅ Sample tempat tidur inserted');

  } catch (error) {
    console.error('❌ Error inserting sample data:', error.message);
  }
}

// Run the setup
createAllTables();
