require('dotenv').config();
const mysql = require('mysql2');

async function checkTable() {
  try {
    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT
    });

    console.log('Mencoba koneksi ke database...');

    // Periksa struktur tabel users
    const [columns] = await connection.promise().query('DESCRIBE users');
    console.log('Struktur tabel users:');
    columns.forEach(col => {
      console.log(`${col.Field} - ${col.Type} - ${col.Null} - ${col.Key} - ${col.Default}`);
    });

    // Periksa data roles
    const [roles] = await connection.promise().query('SELECT * FROM roles');
    console.log('\nData roles:');
    roles.forEach(role => {
      console.log(`ID: ${role.id}, Role: ${role.nama_role}`);
    });

    await connection.promise().end();

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkTable();
