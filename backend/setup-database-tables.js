const mysql = require('mysql2/promise');

async function setupDatabaseTables() {
  try {
    console.log('🔧 Setup database tables...');
    
    // Konfigurasi database yang bekerja
    const config = {
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'esir_db',
      port: 3306
    };

    const connection = await mysql.createConnection(config);
    console.log('✅ Koneksi database berhasil');

    // Buat tabel roles jika belum ada
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama_role VARCHAR(50) NOT NULL UNIQUE,
        deskripsi TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabel roles siap');

    // Insert roles jika belum ada
    await connection.execute(`
      INSERT IGNORE INTO roles (id, nama_role, deskripsi) VALUES 
      (1, 'admin_pusat', 'Administrator Pusat - Akses penuh ke semua fitur'),
      (2, 'admin_faskes', 'Administrator Faskes - Akses terbatas sesuai faskes')
    `);
    console.log('✅ Data roles siap');

    // Buat tabel users jika belum ada
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
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (role_id) REFERENCES roles(id),
        FOREIGN KEY (faskes_id) REFERENCES faskes(id)
      )
    `);
    console.log('✅ Tabel users siap');

    // Buat tabel rujukan jika belum ada
    await connection.execute(`
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
        FOREIGN KEY (pasien_id) REFERENCES patients(id),
        FOREIGN KEY (faskes_asal_id) REFERENCES faskes(id),
        FOREIGN KEY (faskes_tujuan_id) REFERENCES faskes(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    console.log('✅ Tabel rujukan siap');

    // Insert admin user jika belum ada
    const hashedPassword = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'; // password: password
    await connection.execute(`
      INSERT IGNORE INTO users (id, username, password, email, nama_lengkap, role_id) VALUES 
      (1, 'admin', '${hashedPassword}', 'admin@pusat.com', 'Admin Pusat', 1)
    `);
    console.log('✅ Admin user siap');

    // Insert sample data untuk testing
    await connection.execute(`
      INSERT IGNORE INTO rujukan (nomor_rujukan, pasien_id, faskes_asal_id, faskes_tujuan_id, diagnosa, alasan_rujukan, user_id) VALUES 
      ('RJ20241214001', 1, 1, 2, 'Demam Berdarah', 'Perlu perawatan intensif', 1),
      ('RJ20241214002', 2, 1, 2, 'Pneumonia', 'Perlu rontgen dan perawatan', 1),
      ('RJ20241214003', 3, 2, 1, 'Diabetes', 'Kontrol gula darah', 1)
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

setupDatabaseTables();
