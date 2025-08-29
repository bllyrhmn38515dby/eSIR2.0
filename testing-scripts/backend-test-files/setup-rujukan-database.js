require('dotenv').config();
const mysql = require('mysql2');

async function setupRujukanDatabase() {
  try {
    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT
    });

    console.log('=== SETUP DATABASE RUJUKAN ===');

    // Buat tabel pasien
    await connection.promise().query(`
      CREATE TABLE IF NOT EXISTS pasien (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama VARCHAR(100) NOT NULL,
        nik VARCHAR(16) UNIQUE NOT NULL,
        tanggal_lahir DATE NOT NULL,
        jenis_kelamin ENUM('L', 'P') NOT NULL,
        alamat TEXT NOT NULL,
        telepon VARCHAR(15),
        golongan_darah ENUM('A', 'B', 'AB', 'O'),
        alergi TEXT,
        riwayat_penyakit TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB
    `);
    console.log('✓ Tabel pasien berhasil dibuat');

    // Buat tabel rujukan
    await connection.promise().query(`
      CREATE TABLE IF NOT EXISTS rujukan (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nomor_rujukan VARCHAR(20) UNIQUE NOT NULL,
        pasien_id INT NOT NULL,
        faskes_asal_id INT NOT NULL,
        faskes_tujuan_id INT NOT NULL,
        diagnosa TEXT NOT NULL,
        alasan_rujukan TEXT NOT NULL,
        status ENUM('pending', 'diterima', 'ditolak', 'selesai') DEFAULT 'pending',
        catatan_dokter TEXT,
        tanggal_rujukan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        tanggal_diterima TIMESTAMP NULL,
        tanggal_selesai TIMESTAMP NULL,
        created_by INT UNSIGNED NOT NULL,
        updated_by INT UNSIGNED,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (pasien_id) REFERENCES pasien(id) ON DELETE CASCADE,
        FOREIGN KEY (faskes_asal_id) REFERENCES faskes(id),
        FOREIGN KEY (faskes_tujuan_id) REFERENCES faskes(id),
        FOREIGN KEY (created_by) REFERENCES users(id),
        FOREIGN KEY (updated_by) REFERENCES users(id)
      ) ENGINE=InnoDB
    `);
    console.log('✓ Tabel rujukan berhasil dibuat');

    // Insert data awal untuk faskes (jika belum ada)
    await connection.promise().query(`
      INSERT IGNORE INTO faskes (id, nama_faskes, alamat, tipe, telepon) VALUES 
      (1, 'RSUD Dr. Soetomo', 'Jl. Mayjen Prof. Dr. Moestopo No.6-8, Surabaya', 'RSUD', '031-5501078'),
      (2, 'RS Bhayangkara', 'Jl. Ahmad Yani No.116, Surabaya', 'RS Polri', '031-8280001'),
      (3, 'Puskesmas Kenjeran', 'Jl. Kenjeran No.123, Surabaya', 'Puskesmas', '031-1234567'),
      (4, 'Puskesmas Gubeng', 'Jl. Gubeng No.456, Surabaya', 'Puskesmas', '031-2345678')
    `);
    console.log('✓ Data faskes berhasil diinsert');

    // Insert data contoh pasien
    await connection.promise().query(`
      INSERT IGNORE INTO pasien (id, nama, nik, tanggal_lahir, jenis_kelamin, alamat, telepon, golongan_darah) VALUES 
      (1, 'Ahmad Susanto', '3573010101990001', '1999-01-01', 'L', 'Jl. Kenjeran No.10, Surabaya', '081234567890', 'O'),
      (2, 'Siti Nurhaliza', '3573010202990002', '1999-02-02', 'P', 'Jl. Gubeng No.20, Surabaya', '081234567891', 'A'),
      (3, 'Budi Santoso', '3573010303990003', '1999-03-03', 'L', 'Jl. Ahmad Yani No.30, Surabaya', '081234567892', 'B')
    `);
    console.log('✓ Data contoh pasien berhasil diinsert');

    // Insert data contoh rujukan
    await connection.promise().query(`
      INSERT IGNORE INTO rujukan (id, nomor_rujukan, pasien_id, faskes_asal_id, faskes_tujuan_id, diagnosa, alasan_rujukan, status, created_by) VALUES 
      (1, 'RJK-2024-001', 1, 3, 1, 'Hipertensi Grade 2', 'Memerlukan pemeriksaan lebih lanjut di rumah sakit', 'pending', 4),
      (2, 'RJK-2024-002', 2, 4, 2, 'Diabetes Melitus Tipe 2', 'Kontrol gula darah dan konsultasi spesialis', 'diterima', 4),
      (3, 'RJK-2024-003', 3, 3, 1, 'Gagal Jantung', 'Memerlukan perawatan intensif', 'selesai', 4)
    `);
    console.log('✓ Data contoh rujukan berhasil diinsert');

    await connection.promise().end();
    console.log('\n=== SETUP DATABASE RUJUKAN SELESAI ===');

  } catch (error) {
    console.error('Error setup database rujukan:', error);
    process.exit(1);
  }
}

setupRujukanDatabase();
