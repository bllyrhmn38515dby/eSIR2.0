require('dotenv').config();
const mysql = require('mysql2');

async function checkAdminUser() {
  try {
    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT
    });

    console.log('🔗 Terhubung ke database...');

    // Cek user admin
    const [adminUsers] = await connection.promise().execute(
      'SELECT id, nama_lengkap, username, email, role_id, faskes_id FROM users WHERE email = ?',
      ['admin@esir.com']
    );

    if (adminUsers.length === 0) {
      console.log('❌ User admin@esir.com tidak ditemukan');
      return;
    }

    const admin = adminUsers[0];
    console.log('👤 Data Admin:');
    console.log(`   ID: ${admin.id}`);
    console.log(`   Nama: ${admin.nama_lengkap}`);
    console.log(`   Username: ${admin.username}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role ID: ${admin.role_id}`);
    console.log(`   Faskes ID: ${admin.faskes_id}`);

    // Cek role
    const [roles] = await connection.promise().execute(
      'SELECT id, nama_role FROM roles WHERE id = ?',
      [admin.role_id]
    );

    if (roles.length > 0) {
      console.log(`   Role: ${roles[0].nama_role}`);
    }

    // Cek faskes
    if (admin.faskes_id) {
      const [faskes] = await connection.promise().execute(
        'SELECT id, nama_faskes FROM faskes WHERE id = ?',
        [admin.faskes_id]
      );

      if (faskes.length > 0) {
        console.log(`   Faskes: ${faskes[0].nama_faskes}`);
      }
    } else {
      console.log('   Faskes: Tidak ada (NULL)');
    }

    await connection.promise().end();

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkAdminUser();
