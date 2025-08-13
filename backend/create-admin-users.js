require('dotenv').config();
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');

async function createAdminUsers() {
  try {
    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT
    });

    console.log('Mencoba koneksi ke database...');

    // Hash password untuk admin
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Insert admin users
    await connection.promise().query(`
      INSERT IGNORE INTO users (username, password, email, nama_lengkap, role_id, faskes_id) VALUES 
      ('admin_pusat', ?, 'admin@pusat.com', 'Admin Pusat', 1, NULL),
      ('admin_rsud', ?, 'admin@rsud.com', 'Admin RSUD', 2, 1)
    `, [hashedPassword, hashedPassword]);

    console.log('✅ Akun admin berhasil dibuat!');
    console.log('');
    console.log('🔑 Kredensial Login:');
    console.log('Admin Pusat:');
    console.log('  Email: admin@pusat.com');
    console.log('  Password: admin123');
    console.log('');
    console.log('Admin RSUD:');
    console.log('  Email: admin@rsud.com');
    console.log('  Password: admin123');

    await connection.promise().end();

  } catch (error) {
    console.error('❌ Error membuat akun admin:', error);
    process.exit(1);
  }
}

createAdminUsers();
