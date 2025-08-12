require('dotenv').config();
const mysql = require('mysql2');

async function checkDBSchema() {
  try {
    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT
    });

    console.log('=== CHECK DATABASE SCHEMA ===');

    // Periksa struktur tabel pasien
    console.log('\n1. Struktur tabel pasien:');
    const [pasienColumns] = await connection.promise().query('DESCRIBE pasien');
    pasienColumns.forEach(col => {
      console.log(`  ${col.Field} - ${col.Type} - ${col.Key}`);
    });

    // Periksa struktur tabel rujukan
    console.log('\n2. Struktur tabel rujukan:');
    const [rujukanColumns] = await connection.promise().query('DESCRIBE rujukan');
    rujukanColumns.forEach(col => {
      console.log(`  ${col.Field} - ${col.Type} - ${col.Key}`);
    });

    // Periksa struktur tabel users
    console.log('\n3. Struktur tabel users:');
    const [usersColumns] = await connection.promise().query('DESCRIBE users');
    usersColumns.forEach(col => {
      console.log(`  ${col.Field} - ${col.Type} - ${col.Key}`);
    });

    // Periksa struktur tabel faskes
    console.log('\n4. Struktur tabel faskes:');
    const [faskesColumns] = await connection.promise().query('DESCRIBE faskes');
    faskesColumns.forEach(col => {
      console.log(`  ${col.Field} - ${col.Type} - ${col.Key}`);
    });

    // Periksa sample data
    console.log('\n5. Sample data pasien:');
    const [pasienData] = await connection.promise().query('SELECT * FROM pasien LIMIT 1');
    if (pasienData.length > 0) {
      console.log('  Sample pasien:', pasienData[0]);
    }

    console.log('\n6. Sample data rujukan:');
    const [rujukanData] = await connection.promise().query('SELECT * FROM rujukan LIMIT 1');
    if (rujukanData.length > 0) {
      console.log('  Sample rujukan:', rujukanData[0]);
    }

    await connection.promise().end();

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkDBSchema();
