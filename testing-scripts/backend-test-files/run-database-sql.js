require('dotenv').config();
const fs = require('fs');
const mysql = require('mysql2');

async function runDatabaseSQL() {
  try {
    // Koneksi ke database
    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT,
      multipleStatements: true // Untuk menjalankan multiple SQL statements
    });

    console.log('✅ Terhubung ke database');

    // Baca file database.sql
    const sqlContent = fs.readFileSync('database.sql', 'utf8');
    
    // Jalankan SQL
    await connection.promise().query(sqlContent);
    
    console.log('✅ Database.sql berhasil dijalankan');
    
    await connection.promise().end();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('❌ Stack:', error.stack);
    process.exit(1);
  }
}

// Jalankan jika file dijalankan langsung
if (require.main === module) {
  runDatabaseSQL();
}

module.exports = runDatabaseSQL;
