require('dotenv').config();
const mysql = require('mysql2');

async function setupCancelRujukan() {
  try {
    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT
    });

    console.log('=== SETUP CANCEL RUJUKAN ===');

    // Update tabel rujukan untuk menambahkan status 'dibatalkan'
    await connection.promise().query(`
      ALTER TABLE rujukan 
      MODIFY COLUMN status ENUM('pending', 'diterima', 'ditolak', 'selesai', 'dibatalkan') DEFAULT 'pending'
    `);
    console.log('✅ Status enum berhasil diupdate');

    // Tambahkan kolom alasan_pembatalan jika belum ada
    try {
      await connection.promise().query(`
        ALTER TABLE rujukan 
        ADD COLUMN alasan_pembatalan TEXT NULL AFTER catatan_tujuan
      `);
      console.log('✅ Kolom alasan_pembatalan berhasil ditambahkan');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️ Kolom alasan_pembatalan sudah ada');
      } else {
        throw error;
      }
    }

    // Tambahkan kolom tanggal_pembatalan jika belum ada
    try {
      await connection.promise().query(`
        ALTER TABLE rujukan 
        ADD COLUMN tanggal_pembatalan TIMESTAMP NULL AFTER tanggal_respon
      `);
      console.log('✅ Kolom tanggal_pembatalan berhasil ditambahkan');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️ Kolom tanggal_pembatalan sudah ada');
      } else {
        throw error;
      }
    }

    // Show updated table structure
    const [columns] = await connection.promise().query('DESCRIBE rujukan');
    console.log('\n📋 Struktur tabel rujukan:');
    columns.forEach(col => {
      console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    // Show sample data dengan status baru
    const [sampleData] = await connection.promise().query(`
      SELECT id, nomor_rujukan, status, tanggal_rujukan, tanggal_respon, tanggal_pembatalan 
      FROM rujukan 
      ORDER BY tanggal_rujukan DESC 
      LIMIT 5
    `);
    
    console.log('\n📊 Sample data rujukan:');
    sampleData.forEach(row => {
      console.log(`  ID: ${row.id}, No: ${row.nomor_rujukan}, Status: ${row.status}, Tanggal: ${row.tanggal_rujukan}`);
    });

    await connection.promise().end();
    console.log('\n=== SETUP CANCEL RUJUKAN COMPLETE ===');

  } catch (error) {
    console.error('❌ Error setup cancel rujukan:', error);
    process.exit(1);
  }
}

setupCancelRujukan();
