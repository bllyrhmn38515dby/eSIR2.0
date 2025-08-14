const mysql = require('mysql2/promise');

async function simpleDatabaseSetup() {
  try {
    console.log('🔧 Setup database sederhana...');
    
    const config = {
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'esir_db',
      port: 3306
    };

    const connection = await mysql.createConnection(config);
    console.log('✅ Koneksi database berhasil');

    // Insert data faskes jika kosong
    await connection.execute(`
      INSERT IGNORE INTO faskes (id, nama_faskes, alamat, tipe, telepon, latitude, longitude) VALUES 
      (1, 'RSUD Dr. Soetomo', 'Jl. Mayjen Prof. Dr. Moestopo No.6-8, Surabaya', 'RSUD', '031-5501078', -7.2575, 112.7521),
      (2, 'RS Bhayangkara', 'Jl. Ahmad Yani No.116, Surabaya', 'RSUD', '031-8280001', -7.2458, 112.7378),
      (3, 'Puskesmas Kenjeran', 'Jl. Kenjeran No.123, Surabaya', 'Puskesmas', '031-1234567', -7.2400, 112.7500)
    `);
    console.log('✅ Data faskes siap');

    // Insert data patients jika kosong
    await connection.execute(`
      INSERT IGNORE INTO patients (id, nama, nik, tgl_lahir, alamat, no_telp) VALUES 
      (1, 'Ahmad Susanto', '3573010101990001', '1990-01-01', 'Jl. Sudirman No.1, Surabaya', '081234567890'),
      (2, 'Siti Nurhaliza', '3573010201990002', '1990-02-02', 'Jl. Thamrin No.2, Surabaya', '081234567891'),
      (3, 'Budi Santoso', '3573010301990003', '1990-03-03', 'Jl. Gatot Subroto No.3, Surabaya', '081234567892')
    `);
    console.log('✅ Data patients siap');

    // Buat tabel users tanpa foreign key
    await connection.execute(`
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
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabel users siap');

    // Buat tabel rujukan tanpa foreign key
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS rujukan (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nomor_rujukan VARCHAR(50) NOT NULL UNIQUE,
        pasien_id INT UNSIGNED NOT NULL,
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
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabel rujukan siap');

    // Insert admin user
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await connection.execute(`
      INSERT IGNORE INTO users (id, username, password, email, nama_lengkap, role_id) VALUES 
      (1, 'admin', '${hashedPassword}', 'admin@pusat.com', 'Admin Pusat', 1)
    `);
    console.log('✅ Admin user siap');

    // Insert sample data rujukan
    await connection.execute(`
      INSERT IGNORE INTO rujukan (nomor_rujukan, pasien_id, faskes_asal_id, faskes_tujuan_id, diagnosa, alasan_rujukan, user_id) VALUES 
      ('RJ20241214001', 1, 3, 1, 'Demam Berdarah', 'Perlu perawatan intensif', 1),
      ('RJ20241214002', 2, 3, 1, 'Pneumonia', 'Perlu rontgen dan perawatan', 1),
      ('RJ20241214003', 3, 3, 2, 'Diabetes', 'Kontrol gula darah', 1)
    `);
    console.log('✅ Sample data rujukan siap');

    // Test stats query
    const [stats] = await connection.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'diterima' THEN 1 ELSE 0 END) as diterima,
        SUM(CASE WHEN status = 'ditolak' THEN 1 ELSE 0 END) as ditolak,
        SUM(CASE WHEN status = 'selesai' THEN 1 ELSE 0 END) as selesai
      FROM rujukan
    `);
    console.log('✅ Stats query berhasil:', stats[0]);

    await connection.end();
    
    console.log('\n🎉 Database setup selesai!');
    console.log('💡 Sekarang Anda bisa menjalankan server dengan database yang benar');
    console.log('🚀 Jalankan: node index.js');
    
  } catch (error) {
    console.error('❌ Error setup database:', error.message);
  }
}

simpleDatabaseSetup();
