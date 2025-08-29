require('dotenv').config();
const mysql = require('mysql2');

async function checkTables() {
  try {
    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT
    });

    console.log('=== CHECK TABLES STRUCTURE ===');

    // Periksa tabel faskes
    console.log('\n1. Struktur tabel faskes:');
    const [faskesColumns] = await connection.promise().query('DESCRIBE faskes');
    faskesColumns.forEach(col => {
      console.log(`  ${col.Field} - ${col.Type} - ${col.Key}`);
    });

    // Periksa tabel users
    console.log('\n2. Struktur tabel users:');
    const [usersColumns] = await connection.promise().query('DESCRIBE users');
    usersColumns.forEach(col => {
      console.log(`  ${col.Field} - ${col.Type} - ${col.Key}`);
    });

    // Periksa tabel pasien
    console.log('\n3. Struktur tabel pasien:');
    const [pasienColumns] = await connection.promise().query('DESCRIBE pasien');
    pasienColumns.forEach(col => {
      console.log(`  ${col.Field} - ${col.Type} - ${col.Key}`);
    });

    // Periksa data faskes
    console.log('\n4. Data faskes:');
    const [faskes] = await connection.promise().query('SELECT * FROM faskes');
    faskes.forEach(f => {
      console.log(`  ID: ${f.id}, Nama: ${f.nama_faskes}`);
    });

    // Periksa data users
    console.log('\n5. Data users:');
    const [users] = await connection.promise().query('SELECT id, nama, email FROM users LIMIT 5');
    users.forEach(u => {
      console.log(`  ID: ${u.id}, Nama: ${u.nama}, Email: ${u.email}`);
    });

    await connection.promise().end();

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkTables();
