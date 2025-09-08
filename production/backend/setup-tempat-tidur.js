const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupTempatTidur() {
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

    // Check if tempat_tidur table exists
    const [tables] = await connection.execute(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = ? AND table_name = 'tempat_tidur'
    `, [process.env.DB_NAME || 'esir_db']);

    if (tables[0].count === 0) {
      console.log('❌ Table tempat_tidur tidak ditemukan');
      console.log('📋 Jalankan database.sql terlebih dahulu');
      return;
    }

    // Check if there's already data
    const [existingData] = await connection.execute('SELECT COUNT(*) as count FROM tempat_tidur');
    
    if (existingData[0].count > 0) {
      console.log(`✅ Data tempat tidur sudah ada (${existingData[0].count} records)`);
      return;
    }

    // Get faskes data
    const [faskes] = await connection.execute('SELECT id, nama_faskes FROM faskes WHERE tipe IN ("RSUD", "RS Swasta")');
    
    if (faskes.length === 0) {
      console.log('❌ Tidak ada faskes RSUD/RS Swasta untuk tempat tidur');
      return;
    }

    console.log(`🏥 Found ${faskes.length} faskes untuk tempat tidur`);

    // Insert sample data
    const sampleData = [
      // RSUD Kota Bogor
      { faskes_id: faskes[0].id, nomor_kamar: 'VIP-01', nomor_bed: 'A', tipe_kamar: 'VIP', status: 'tersedia', catatan: 'Kamar VIP dengan AC dan TV' },
      { faskes_id: faskes[0].id, nomor_kamar: 'VIP-01', nomor_bed: 'B', tipe_kamar: 'VIP', status: 'tersedia', catatan: 'Kamar VIP dengan AC dan TV' },
      { faskes_id: faskes[0].id, nomor_kamar: 'K1-01', nomor_bed: 'A', tipe_kamar: 'Kelas 1', status: 'tersedia', catatan: 'Kamar Kelas 1' },
      { faskes_id: faskes[0].id, nomor_kamar: 'K1-01', nomor_bed: 'B', tipe_kamar: 'Kelas 1', status: 'maintenance', catatan: 'Sedang diperbaiki' },
      { faskes_id: faskes[0].id, nomor_kamar: 'K2-01', nomor_bed: 'A', tipe_kamar: 'Kelas 2', status: 'tersedia', catatan: 'Kamar Kelas 2' },
      { faskes_id: faskes[0].id, nomor_kamar: 'K2-01', nomor_bed: 'B', tipe_kamar: 'Kelas 2', status: 'reserved', catatan: 'Dipesan untuk operasi' },
      { faskes_id: faskes[0].id, nomor_kamar: 'ICU-01', nomor_bed: 'A', tipe_kamar: 'ICU', status: 'tersedia', catatan: 'ICU dengan ventilator' },
      { faskes_id: faskes[0].id, nomor_kamar: 'ICU-01', nomor_bed: 'B', tipe_kamar: 'ICU', status: 'tersedia', catatan: 'ICU dengan ventilator' },
    ];

    // Add data for other RSUD/RS if available
    if (faskes.length > 1) {
      sampleData.push(
        { faskes_id: faskes[1].id, nomor_kamar: 'VIP-01', nomor_bed: 'A', tipe_kamar: 'VIP', status: 'tersedia', catatan: 'Kamar VIP' },
        { faskes_id: faskes[1].id, nomor_kamar: 'K1-01', nomor_bed: 'A', tipe_kamar: 'Kelas 1', status: 'tersedia', catatan: 'Kamar Kelas 1' },
        { faskes_id: faskes[1].id, nomor_kamar: 'K1-01', nomor_bed: 'B', tipe_kamar: 'Kelas 1', status: 'tersedia', catatan: 'Kamar Kelas 1' },
        { faskes_id: faskes[1].id, nomor_kamar: 'K2-01', nomor_bed: 'A', tipe_kamar: 'Kelas 2', status: 'tersedia', catatan: 'Kamar Kelas 2' },
        { faskes_id: faskes[1].id, nomor_kamar: 'ICU-01', nomor_bed: 'A', tipe_kamar: 'ICU', status: 'tersedia', catatan: 'ICU' }
      );
    }

    // Insert data
    for (const data of sampleData) {
      await connection.execute(`
        INSERT INTO tempat_tidur (faskes_id, nomor_kamar, nomor_bed, tipe_kamar, status, catatan)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [data.faskes_id, data.nomor_kamar, data.nomor_bed, data.tipe_kamar, data.status, data.catatan]);
    }

    console.log(`✅ Berhasil menambahkan ${sampleData.length} data tempat tidur`);

    // Show summary
    const [summary] = await connection.execute(`
      SELECT 
        f.nama_faskes,
        COUNT(*) as total_bed,
        SUM(CASE WHEN tt.status = 'tersedia' THEN 1 ELSE 0 END) as tersedia,
        SUM(CASE WHEN tt.status = 'terisi' THEN 1 ELSE 0 END) as terisi,
        SUM(CASE WHEN tt.status = 'maintenance' THEN 1 ELSE 0 END) as maintenance,
        SUM(CASE WHEN tt.status = 'reserved' THEN 1 ELSE 0 END) as reserved
      FROM tempat_tidur tt
      LEFT JOIN faskes f ON tt.faskes_id = f.id
      GROUP BY tt.faskes_id, f.nama_faskes
      ORDER BY f.nama_faskes
    `);

    console.log('\n📊 Summary Tempat Tidur:');
    summary.forEach(stat => {
      console.log(`  ${stat.nama_faskes}:`);
      console.log(`    Total: ${stat.total_bed}`);
      console.log(`    Tersedia: ${stat.tersedia}`);
      console.log(`    Terisi: ${stat.terisi}`);
      console.log(`    Maintenance: ${stat.maintenance}`);
      console.log(`    Reserved: ${stat.reserved}`);
    });

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
setupTempatTidur();
