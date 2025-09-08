const mysql = require('mysql2/promise');
require('dotenv').config();

async function testTempatTidurAPI() {
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

    // Test query tempat tidur
    const [tempatTidur] = await connection.query(`
      SELECT tt.*, 
             f.nama_faskes,
             p.nama_pasien,
             p.no_rm
      FROM tempat_tidur tt
      LEFT JOIN faskes f ON tt.faskes_id = f.id
      LEFT JOIN pasien p ON tt.pasien_id = p.id
      ORDER BY tt.faskes_id, tt.nomor_kamar, tt.nomor_bed
    `);

    console.log(`✅ Found ${tempatTidur.length} tempat tidur records`);
    
    if (tempatTidur.length > 0) {
      console.log('\n📋 Sample data:');
      tempatTidur.slice(0, 3).forEach((bed, index) => {
        console.log(`  ${index + 1}. ${bed.nama_faskes} - ${bed.nomor_kamar} Bed ${bed.nomor_bed} (${bed.tipe_kamar}) - ${bed.status}`);
      });
    }

    // Test statistik query
    const [statistik] = await connection.query(`
      SELECT 
        f.nama_faskes,
        COUNT(*) as total_bed,
        SUM(CASE WHEN tt.status = 'tersedia' THEN 1 ELSE 0 END) as tersedia,
        SUM(CASE WHEN tt.status = 'terisi' THEN 1 ELSE 0 END) as terisi,
        SUM(CASE WHEN tt.status = 'maintenance' THEN 1 ELSE 0 END) as maintenance,
        SUM(CASE WHEN tt.status = 'reserved' THEN 1 ELSE 0 END) as reserved,
        ROUND((SUM(CASE WHEN tt.status = 'tersedia' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as persentase_tersedia
      FROM tempat_tidur tt
      LEFT JOIN faskes f ON tt.faskes_id = f.id
      GROUP BY tt.faskes_id, f.nama_faskes
      ORDER BY f.nama_faskes
    `);

    console.log('\n📊 Statistik:');
    statistik.forEach(stat => {
      console.log(`  ${stat.nama_faskes}:`);
      console.log(`    Total: ${stat.total_bed}`);
      console.log(`    Tersedia: ${stat.tersedia}`);
      console.log(`    Terisi: ${stat.terisi}`);
      console.log(`    Maintenance: ${stat.maintenance}`);
      console.log(`    Reserved: ${stat.reserved}`);
      console.log(`    Persentase Tersedia: ${stat.persentase_tersedia}%`);
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

// Run the test
testTempatTidurAPI();
