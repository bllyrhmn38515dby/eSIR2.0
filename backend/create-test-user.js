require('dotenv').config();
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');

async function createTestUser() {
  try {
    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT
    });

    console.log('Mencoba koneksi ke database...');

    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 12);
    console.log('Password berhasil di-hash');

    // Insert user test
    const [result] = await connection.promise().execute(
      'INSERT INTO users (nama, password, email, role, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
      ['Test User', hashedPassword, 'test@example.com', 'admin']
    );

    console.log('User test berhasil dibuat dengan ID:', result.insertId);

    await connection.promise().end();
    console.log('Pembuatan user test selesai!');

  } catch (error) {
    console.error('Error membuat user:', error);
    process.exit(1);
  }
}

createTestUser();
