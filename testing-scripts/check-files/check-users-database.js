require('dotenv').config();
const mysql = require('mysql2');

async function checkUsers() {
  try {
    // Koneksi ke database
    const connection = mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: 'esirv2',
      port: process.env.DB_PORT || 3306
    });

    console.log('🔍 Mengecek koneksi ke database esirv2...');

    // Test koneksi
    await connection.promise().query('SELECT 1');
    console.log('✅ Berhasil terhubung ke database esirv2');

    // Cek tabel users
    console.log('\n📋 Mengecek struktur tabel users...');
    const [userTable] = await connection.promise().query('DESCRIBE users');
    console.log('✅ Tabel users ditemukan dengan struktur:');
    userTable.forEach(column => {
      console.log(`  - ${column.Field}: ${column.Type} ${column.Null === 'YES' ? '(NULL)' : '(NOT NULL)'}`);
    });

    // Cek jumlah user
    console.log('\n👥 Mengecek jumlah user...');
    const [userCount] = await connection.promise().query('SELECT COUNT(*) as total FROM users');
    console.log(`📊 Total user: ${userCount[0].total}`);

    if (userCount[0].total > 0) {
      // Ambil semua user
      console.log('\n📝 Daftar semua user:');
      const [users] = await connection.promise().query(`
        SELECT 
          u.id,
          u.nama_lengkap,
          u.username,
          u.email,
          u.role_id,
          r.nama_role,
          u.faskes_id,
          f.nama_faskes,
          u.created_at
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.id
        LEFT JOIN faskes f ON u.faskes_id = f.id
        ORDER BY u.id
      `);

      console.log('\n' + '='.repeat(80));
      console.log('ID | NAMA LENGKAP | USERNAME | EMAIL | ROLE | FASKES | CREATED AT');
      console.log('='.repeat(80));
      
      users.forEach(user => {
        console.log(
          `${user.id.toString().padEnd(2)} | ` +
          `${(user.nama_lengkap || '').padEnd(12)} | ` +
          `${(user.username || '').padEnd(8)} | ` +
          `${(user.email || '').padEnd(20)} | ` +
          `${(user.nama_role || '').padEnd(8)} | ` +
          `${(user.nama_faskes || 'N/A').padEnd(15)} | ` +
          `${user.created_at ? user.created_at.toISOString().split('T')[0] : 'N/A'}`
        );
      });
      console.log('='.repeat(80));

      // Cek roles yang tersedia
      console.log('\n🎭 Mengecek roles yang tersedia...');
      const [roles] = await connection.promise().query('SELECT * FROM roles ORDER BY id');
      console.log('📋 Daftar roles:');
      roles.forEach(role => {
        console.log(`  - ID ${role.id}: ${role.nama_role} (${role.deskripsi || 'No description'})`);
      });

      // Cek faskes yang tersedia
      console.log('\n🏥 Mengecek faskes yang tersedia...');
      const [faskes] = await connection.promise().query('SELECT * FROM faskes ORDER BY id');
      console.log('📋 Daftar faskes:');
      faskes.forEach(f => {
        console.log(`  - ID ${f.id}: ${f.nama_faskes} (${f.tipe})`);
      });

    } else {
      console.log('⚠️ Tidak ada user di database');
    }

    await connection.promise().end();
    console.log('\n✅ Pengecekan selesai!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('💡 Database "esirv2" tidak ditemukan. Coba buat database terlebih dahulu:');
      console.log('   CREATE DATABASE esirv2;');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('💡 Tidak dapat terhubung ke MySQL. Pastikan MySQL server berjalan.');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('💡 Akses ditolak. Periksa username dan password MySQL.');
    }
  }
}

// Jalankan pengecekan
checkUsers();
