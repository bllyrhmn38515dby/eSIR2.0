require('dotenv').config();
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

async function setupUploadDokumen() {
  try {
    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT
    });

    console.log('=== SETUP UPLOAD DOKUMEN ===');

    // Create uploads directory if not exists
    const uploadsDir = path.join(__dirname, 'uploads');
    const dokumenDir = path.join(uploadsDir, 'dokumen');
    
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('✅ Directory uploads berhasil dibuat');
    }
    
    if (!fs.existsSync(dokumenDir)) {
      fs.mkdirSync(dokumenDir, { recursive: true });
      console.log('✅ Directory uploads/dokumen berhasil dibuat');
    }

    // Check table structure first
    console.log('🔍 Checking existing table structure...');
    const [tables] = await connection.promise().query('SHOW TABLES LIKE "rujukan"');
    if (tables.length === 0) {
      console.log('❌ Tabel rujukan tidak ditemukan. Pastikan tabel rujukan sudah dibuat.');
      return;
    }

    const [rujukanColumns] = await connection.promise().query('DESCRIBE rujukan');
    console.log('📋 Struktur tabel rujukan:');
    rujukanColumns.forEach(col => {
      console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    const [usersColumns] = await connection.promise().query('DESCRIBE users');
    console.log('📋 Struktur tabel users:');
    usersColumns.forEach(col => {
      console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    // Create dokumen table with correct data types
    await connection.promise().query(`
      CREATE TABLE IF NOT EXISTS dokumen (
        id INT AUTO_INCREMENT PRIMARY KEY,
        rujukan_id INT(11) NOT NULL,
        nama_file VARCHAR(255) NOT NULL,
        nama_asli VARCHAR(255) NOT NULL,
        tipe_file VARCHAR(100) NOT NULL,
        ukuran_file BIGINT NOT NULL,
        path_file VARCHAR(500) NOT NULL,
        deskripsi TEXT NULL,
        kategori ENUM('hasil_lab', 'rontgen', 'resep', 'surat_rujukan', 'lainnya') DEFAULT 'lainnya',
        uploaded_by INT(11) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (rujukan_id) REFERENCES rujukan(id) ON DELETE CASCADE,
        FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_rujukan_id (rujukan_id),
        INDEX idx_kategori (kategori),
        INDEX idx_uploaded_by (uploaded_by),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB
    `);
    console.log('✅ Tabel dokumen berhasil dibuat');

    // Create dokumen_logs table
    await connection.promise().query(`
      CREATE TABLE IF NOT EXISTS dokumen_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        dokumen_id INT(11) NOT NULL,
        user_id INT(11) NOT NULL,
        aksi ENUM('upload', 'download', 'delete', 'view') NOT NULL,
        ip_address VARCHAR(45) NULL,
        user_agent TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (dokumen_id) REFERENCES dokumen(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_dokumen_id (dokumen_id),
        INDEX idx_user_id (user_id),
        INDEX idx_aksi (aksi),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB
    `);
    console.log('✅ Tabel dokumen_logs berhasil dibuat');

    // Insert sample data untuk testing (opsional)
    try {
      await connection.promise().query(`
        INSERT IGNORE INTO dokumen (id, rujukan_id, nama_file, nama_asli, tipe_file, ukuran_file, path_file, deskripsi, kategori, uploaded_by) VALUES 
        (1, 1, 'hasil_lab_001.pdf', 'Hasil Laboratorium Pasien.pdf', 'application/pdf', 1024000, 'uploads/dokumen/hasil_lab_001.pdf', 'Hasil pemeriksaan laboratorium darah lengkap', 'hasil_lab', 1),
        (2, 1, 'rontgen_001.jpg', 'Foto Rontgen Dada.jpg', 'image/jpeg', 2048000, 'uploads/dokumen/rontgen_001.jpg', 'Foto rontgen dada pasien', 'rontgen', 1)
      `);
      console.log('✅ Sample data dokumen berhasil ditambahkan');
    } catch (error) {
      console.log('ℹ️ Sample data sudah ada atau rujukan_id tidak ditemukan');
    }

    // Show table structure
    const [dokumenColumns] = await connection.promise().query('DESCRIBE dokumen');
    console.log('\n📋 Struktur tabel dokumen:');
    dokumenColumns.forEach(col => {
      console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    const [logsColumns] = await connection.promise().query('DESCRIBE dokumen_logs');
    console.log('\n📋 Struktur tabel dokumen_logs:');
    logsColumns.forEach(col => {
      console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    // Show sample data
    const [sampleData] = await connection.promise().query(`
      SELECT 
        d.id,
        d.nama_asli,
        d.kategori,
        d.tipe_file,
        d.ukuran_file,
        d.created_at,
        r.nomor_rujukan,
        u.nama_lengkap as uploaded_by_name
      FROM dokumen d
      LEFT JOIN rujukan r ON d.rujukan_id = r.id
      LEFT JOIN users u ON d.uploaded_by = u.id
      ORDER BY d.created_at DESC
      LIMIT 5
    `);
    
    console.log('\n📊 Sample data dokumen:');
    sampleData.forEach(row => {
      console.log(`  ID: ${row.id}, File: ${row.nama_asli}, Kategori: ${row.kategori}, Ukuran: ${(row.ukuran_file / 1024).toFixed(2)} KB`);
    });

    await connection.promise().end();
    console.log('\n=== SETUP UPLOAD DOKUMEN COMPLETE ===');

  } catch (error) {
    console.error('❌ Error setup upload dokumen:', error);
    process.exit(1);
  }
}

setupUploadDokumen();
