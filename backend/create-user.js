require('dotenv').config();
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');

async function createUser() {
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

    // Insert user admin pusat
    const [result] = await connection.promise().execute(
      'INSERT INTO users (nama, password, email, role, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
      ['Administrator Pusat', hashedPassword, 'admin@pusat.com', 'admin']
    );

    console.log('User admin_pusat berhasil dibuat dengan ID:', result.insertId);

    // Insert user admin faskes
    const [result2] = await connection.promise().execute(
      'INSERT INTO users (nama, password, email, role, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
      ['Administrator Faskes', hashedPassword, 'admin@faskes.com', 'admin']
    );

    console.log('User admin_faskes berhasil dibuat dengan ID:', result2.insertId);

    await connection.promise().end();
    console.log('Pembuatan user selesai!');

  } catch (error) {
    console.error('Error membuat user:', error);
    process.exit(1);
  }
}

createUser();
