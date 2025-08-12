require('dotenv').config();
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');

async function testLogin() {
  try {
    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT
    });

    console.log('Mencoba koneksi ke database...');

    // Cari user berdasarkan email
    const [users] = await connection.promise().execute(
      'SELECT * FROM users WHERE email = ?',
      ['admin@pusat.com']
    );

    if (users.length === 0) {
      console.log('User tidak ditemukan');
      return;
    }

    const user = users[0];
    console.log('User ditemukan:', {
      id: user.id,
      nama: user.nama,
      email: user.email,
      role: user.role
    });

    // Test password
    const isValidPassword = await bcrypt.compare('password123', user.password);
    console.log('Password valid:', isValidPassword);

    await connection.promise().end();

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testLogin();
