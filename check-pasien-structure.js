const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'esirv2'
};

async function checkPasienStructure() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database esirv2');

    // Check pasien table structure
    console.log('\n1️⃣ Checking pasien table structure...');
    const [columns] = await connection.execute(`
      DESCRIBE pasien
    `);
    
    console.log('\n📋 Pasien table columns:');
    columns.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    // Check sample pasien data
    console.log('\n2️⃣ Checking sample pasien data...');
    const [pasienData] = await connection.execute(`
      SELECT * FROM pasien LIMIT 3
    `);
    
    console.log('\n📋 Sample pasien data:');
    pasienData.forEach((pasien, index) => {
      console.log(`\n${index + 1}. Pasien ID: ${pasien.id}`);
      Object.keys(pasien).forEach(key => {
        console.log(`   ${key}: ${pasien[key]}`);
      });
    });

    // Check rujukan table structure
    console.log('\n3️⃣ Checking rujukan table structure...');
    const [rujukanColumns] = await connection.execute(`
      DESCRIBE rujukan
    `);
    
    console.log('\n📋 Rujukan table columns:');
    rujukanColumns.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    // Check if there are any rujukan records
    console.log('\n4️⃣ Checking rujukan data...');
    const [rujukanCount] = await connection.execute(`
      SELECT COUNT(*) as count FROM rujukan
    `);
    console.log(`📊 Total rujukan: ${rujukanCount[0].count}`);

    if (rujukanCount[0].count > 0) {
      const [rujukanData] = await connection.execute(`
        SELECT * FROM rujukan LIMIT 3
      `);
      
      console.log('\n📋 Sample rujukan data:');
      rujukanData.forEach((rujukan, index) => {
        console.log(`\n${index + 1}. Rujukan ID: ${rujukan.id}`);
        Object.keys(rujukan).forEach(key => {
          console.log(`   ${key}: ${rujukan[key]}`);
        });
      });
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

checkPasienStructure()
  .then(() => {
    console.log('\n✅ Pasien structure check completed!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Pasien structure check failed:', error);
    process.exit(1);
  });
