require('dotenv').config();
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');

async function createTestAdmin() {
  try {
    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT
    });

    console.log('🔗 Terhubung ke database...');

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 12);
    console.log('🔐 Password berhasil di-hash');

    // Cek apakah user sudah ada
    const [existingUsers] = await connection.promise().execute(
      'SELECT id FROM users WHERE email = ?',
      ['admin@esir.com']
    );

    if (existingUsers.length > 0) {
      console.log('⚠️ User admin@esir.com sudah ada');
      await connection.promise().end();
      return;
    }

    // Insert user admin test
    const [result] = await connection.promise().execute(
      'INSERT INTO users (nama_lengkap, username, email, password, role_id, faskes_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
      ['Admin Test', 'admin_test', 'admin@esir.com', hashedPassword, 1, null]
    );

    console.log('✅ User admin test berhasil dibuat dengan ID:', result.insertId);
    console.log('📧 Email: admin@esir.com');
    console.log('🔑 Password: admin123');

    await connection.promise().end();
    console.log('🎉 Pembuatan user admin test selesai!');

  } catch (error) {
    console.error('❌ Error membuat user admin:', error);
    process.exit(1);
  }
}

createTestAdmin();
