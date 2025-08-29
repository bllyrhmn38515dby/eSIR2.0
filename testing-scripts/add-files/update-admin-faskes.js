require('dotenv').config();
const mysql = require('mysql2');

async function updateAdminFaskes() {
  try {
    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT
    });

    console.log('🔗 Terhubung ke database...');

    // Ambil faskes pertama
    const [faskes] = await connection.promise().execute(
      'SELECT id, nama_faskes FROM faskes LIMIT 1'
    );

    if (faskes.length === 0) {
      console.log('❌ Tidak ada faskes tersedia');
      return;
    }

    const faskesId = faskes[0].id;
    console.log(`🏥 Menggunakan faskes: ${faskes[0].nama_faskes} (ID: ${faskesId})`);

    // Update user admin
    await connection.promise().execute(
      'UPDATE users SET faskes_id = ? WHERE email = ?',
      [faskesId, 'admin@esir.com']
    );

    console.log('✅ User admin berhasil diupdate dengan faskes_id');

    // Verifikasi update
    const [adminUsers] = await connection.promise().execute(
      'SELECT id, nama_lengkap, email, faskes_id FROM users WHERE email = ?',
      ['admin@esir.com']
    );

    if (adminUsers.length > 0) {
      const admin = adminUsers[0];
      console.log('👤 Data Admin setelah update:');
      console.log(`   ID: ${admin.id}`);
      console.log(`   Nama: ${admin.nama_lengkap}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Faskes ID: ${admin.faskes_id}`);
    }

    await connection.promise().end();
    console.log('🎉 Update selesai!');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateAdminFaskes();
