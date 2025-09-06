const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../backend/config.env' });

async function testTempatTidurFix() {
  console.log('🧪 Testing Tempat Tidur Fix...\n');
  
  let connection;
  
  try {
    // Connect to database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'esirv2'
    });

    console.log('✅ Connected to database:', process.env.DB_DATABASE || 'esirv2');

    // Test the main query
    console.log('\n🧪 Testing main tempat tidur query...');
    try {
      const [testResult] = await connection.execute(`
        SELECT tt.*, 
               f.nama_faskes,
               p.nama_lengkap as nama_pasien
        FROM tempat_tidur tt
        LEFT JOIN faskes f ON tt.faskes_id = f.id
        LEFT JOIN pasien p ON tt.pasien_id = p.id
        LIMIT 5
      `);
      
      console.log('✅ Main query executed successfully!');
      console.log(`Found ${testResult.length} records`);
      
      if (testResult.length > 0) {
        console.log('Sample record:');
        console.log('  - ID:', testResult[0].id);
        console.log('  - Kamar:', testResult[0].nomor_kamar);
        console.log('  - Bed:', testResult[0].nomor_bed);
        console.log('  - Status:', testResult[0].status);
        console.log('  - Faskes:', testResult[0].nama_faskes);
        console.log('  - Pasien:', testResult[0].nama_pasien || 'Tidak ada pasien');
      }
      
    } catch (queryError) {
      console.log('❌ Main query failed:', queryError.message);
      console.log('Error code:', queryError.code);
      console.log('SQL State:', queryError.sqlState);
    }

    // Test the faskes-specific query
    console.log('\n🧪 Testing faskes-specific query...');
    try {
      const [faskesResult] = await connection.execute(`
        SELECT tt.*, 
               f.nama_faskes,
               p.nama_lengkap as nama_pasien
        FROM tempat_tidur tt
        LEFT JOIN faskes f ON tt.faskes_id = f.id
        LEFT JOIN pasien p ON tt.pasien_id = p.id
        WHERE tt.faskes_id = 1
        ORDER BY tt.nomor_kamar, tt.nomor_bed
        LIMIT 3
      `);
      
      console.log('✅ Faskes-specific query executed successfully!');
      console.log(`Found ${faskesResult.length} records for faskes_id = 1`);
      
    } catch (queryError) {
      console.log('❌ Faskes-specific query failed:', queryError.message);
    }

    // Test the update query
    console.log('\n🧪 Testing update query...');
    try {
      const [updateResult] = await connection.execute(`
        SELECT tt.*, f.nama_faskes, p.nama_lengkap as nama_pasien
        FROM tempat_tidur tt
        LEFT JOIN faskes f ON tt.faskes_id = f.id
        LEFT JOIN pasien p ON tt.pasien_id = p.id
        WHERE tt.id = 1
      `);
      
      console.log('✅ Update query executed successfully!');
      console.log(`Found ${updateResult.length} records for update test`);
      
    } catch (queryError) {
      console.log('❌ Update query failed:', queryError.message);
    }

    console.log('\n🎉 All tempat tidur queries tested successfully!');

  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run the test
testTempatTidurFix();
