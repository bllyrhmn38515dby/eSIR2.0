const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'esirv2'
};

async function checkRujukanDatabase() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database esirv2');

    // Check if rujukan table exists
    console.log('\n1️⃣ Checking rujukan table structure...');
    const [tables] = await connection.execute(`
      SHOW TABLES LIKE 'rujukan'
    `);
    
    if (tables.length === 0) {
      console.log('❌ Table rujukan does not exist!');
      return;
    }
    
    console.log('✅ Table rujukan exists');

    // Check table structure
    const [columns] = await connection.execute(`
      DESCRIBE rujukan
    `);
    
    console.log('\n📋 Rujukan table columns:');
    columns.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    // Check if pasien table exists
    console.log('\n2️⃣ Checking pasien table...');
    const [pasienTables] = await connection.execute(`
      SHOW TABLES LIKE 'pasien'
    `);
    
    if (pasienTables.length === 0) {
      console.log('❌ Table pasien does not exist!');
    } else {
      console.log('✅ Table pasien exists');
      
      // Check pasien data
      const [pasienCount] = await connection.execute(`
        SELECT COUNT(*) as count FROM pasien
      `);
      console.log(`📊 Total pasien: ${pasienCount[0].count}`);
    }

    // Check if faskes table exists
    console.log('\n3️⃣ Checking faskes table...');
    const [faskesTables] = await connection.execute(`
      SHOW TABLES LIKE 'faskes'
    `);
    
    if (faskesTables.length === 0) {
      console.log('❌ Table faskes does not exist!');
    } else {
      console.log('✅ Table faskes exists');
      
      // Check faskes data
      const [faskesCount] = await connection.execute(`
        SELECT COUNT(*) as count FROM faskes
      `);
      console.log(`📊 Total faskes: ${faskesCount[0].count}`);
    }

    // Check rujukan data
    console.log('\n4️⃣ Checking rujukan data...');
    const [rujukanCount] = await connection.execute(`
      SELECT COUNT(*) as count FROM rujukan
    `);
    console.log(`📊 Total rujukan: ${rujukanCount[0].count}`);

    if (rujukanCount[0].count > 0) {
      // Show sample rujukan data
      const [rujukanData] = await connection.execute(`
        SELECT r.*, 
               p.nama_pasien, p.nik as nik_pasien,
               fa.nama_faskes as faskes_asal_nama,
               ft.nama_faskes as faskes_tujuan_nama,
               u.nama_lengkap as user_nama
        FROM rujukan r
        LEFT JOIN pasien p ON r.pasien_id = p.id
        LEFT JOIN faskes fa ON r.faskes_asal_id = fa.id
        LEFT JOIN faskes ft ON r.faskes_tujuan_id = ft.id
        LEFT JOIN users u ON r.user_id = u.id
        ORDER BY r.tanggal_rujukan DESC
        LIMIT 5
      `);
      
      console.log('\n📋 Sample rujukan data:');
      rujukanData.forEach((rujukan, index) => {
        console.log(`\n${index + 1}. Rujukan ID: ${rujukan.id}`);
        console.log(`   Nomor: ${rujukan.nomor_rujukan}`);
        console.log(`   Pasien: ${rujukan.nama_pasien} (${rujukan.nik_pasien})`);
        console.log(`   Asal: ${rujukan.faskes_asal_nama}`);
        console.log(`   Tujuan: ${rujukan.faskes_tujuan_nama}`);
        console.log(`   Status: ${rujukan.status}`);
        console.log(`   Tanggal: ${rujukan.tanggal_rujukan}`);
      });
    } else {
      console.log('⚠️ No rujukan data found');
    }

    // Test the exact query from the API
    console.log('\n5️⃣ Testing API query...');
    try {
      const [testQuery] = await connection.execute(`
        SELECT r.*, 
               p.nama_pasien, p.nik as nik_pasien,
               fa.nama_faskes as faskes_asal_nama,
               ft.nama_faskes as faskes_tujuan_nama,
               u.nama_lengkap as user_nama
        FROM rujukan r
        LEFT JOIN pasien p ON r.pasien_id = p.id
        LEFT JOIN faskes fa ON r.faskes_asal_id = fa.id
        LEFT JOIN faskes ft ON r.faskes_tujuan_id = ft.id
        LEFT JOIN users u ON r.user_id = u.id
        ORDER BY r.tanggal_rujukan DESC
      `);
      
      console.log(`✅ API query successful, returned ${testQuery.length} rows`);
      
      if (testQuery.length > 0) {
        console.log('📋 First row sample:');
        const firstRow = testQuery[0];
        console.log(`   ID: ${firstRow.id}`);
        console.log(`   Nomor: ${firstRow.nomor_rujukan}`);
        console.log(`   Pasien: ${firstRow.nama_pasien}`);
        console.log(`   Asal: ${firstRow.faskes_asal_nama}`);
        console.log(`   Tujuan: ${firstRow.faskes_tujuan_nama}`);
      }
    } catch (error) {
      console.error('❌ API query failed:', error.message);
    }

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkRujukanDatabase()
  .then(() => {
    console.log('\n✅ Rujukan database check completed!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Rujukan database check failed:', error);
    process.exit(1);
  });
