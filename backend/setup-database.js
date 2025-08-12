require('dotenv').config();
const mysql = require('mysql2');

async function setupDatabase() {
  try {
    // Koneksi tanpa database terlebih dahulu
    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT
    });

    console.log('Mencoba koneksi ke MySQL...');

    // Buat database jika belum ada
    await connection.promise().query('CREATE DATABASE IF NOT EXISTS esir_db');
    console.log('Database esir_db berhasil dibuat/ditemukan');

    // Gunakan database esir_db
    await connection.promise().query('USE esir_db');
    console.log('Menggunakan database esir_db');

    // Buat tabel faskes
    await connection.promise().query(`
      CREATE TABLE IF NOT EXISTS faskes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama_faskes VARCHAR(255) NOT NULL,
        alamat TEXT,
        tipe VARCHAR(50),
        telepon VARCHAR(20),
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB
    `);
    console.log('Tabel faskes berhasil dibuat');

    // Buat tabel roles
    await connection.promise().query(`
      CREATE TABLE IF NOT EXISTS roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama_role VARCHAR(50) NOT NULL UNIQUE,
        deskripsi TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB
    `);
    console.log('Tabel roles berhasil dibuat');

    // Buat tabel users
    await connection.promise().query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        nama_lengkap VARCHAR(100) NOT NULL,
        role_id INT NOT NULL,
        faskes_id INT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (role_id) REFERENCES roles(id),
        FOREIGN KEY (faskes_id) REFERENCES faskes(id)
      ) ENGINE=InnoDB
    `);
    console.log('Tabel users berhasil dibuat');

    // Insert data awal untuk roles
    await connection.promise().query(`
      INSERT IGNORE INTO roles (id, nama_role, deskripsi) VALUES 
      (1, 'admin_pusat', 'Administrator Pusat - Dapat melihat semua rujukan dan memantau dashboard'),
      (2, 'admin_faskes', 'Administrator Faskes - Dapat mengelola rujukan untuk faskes tertentu')
    `);
    console.log('Data roles berhasil diinsert');

    // Insert data awal untuk faskes (contoh)
    await connection.promise().query(`
      INSERT IGNORE INTO faskes (id, nama_faskes, alamat, tipe, telepon) VALUES 
      (1, 'RSUD Dr. Soetomo', 'Jl. Mayjen Prof. Dr. Moestopo No.6-8, Surabaya', 'RSUD', '031-5501078'),
      (2, 'RS Bhayangkara', 'Jl. Ahmad Yani No.116, Surabaya', 'RS Polri', '031-8280001')
    `);
    console.log('Data faskes berhasil diinsert');

    await connection.promise().end();
    console.log('Setup database selesai!');

  } catch (error) {
    console.error('Error setup database:', error);
    process.exit(1);
  }
}

setupDatabase();
