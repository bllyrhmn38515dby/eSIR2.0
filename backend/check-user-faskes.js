require('dotenv').config();
const mysql = require('mysql2');

async function checkUserFaskes() {
  try {
    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT
    });

    console.log('=== CHECK USER DAN FASKES ===');

    // Periksa user admin@pusat.com
    console.log('\n1. Data user admin@pusat.com:');
    const [users] = await connection.promise().execute(
      'SELECT id, nama, email, role, faskes_id FROM users WHERE email = ?',
      ['admin@pusat.com']
    );
    
    if (users.length > 0) {
      const user = users[0];
      console.log('  ID:', user.id);
      console.log('  Nama:', user.nama);
      console.log('  Email:', user.email);
      console.log('  Role:', user.role);
      console.log('  Faskes ID:', user.faskes_id);
    } else {
      console.log('  User tidak ditemukan');
    }

    // Periksa semua faskes
    console.log('\n2. Data faskes:');
    const [faskes] = await connection.promise().execute('SELECT * FROM faskes');
    faskes.forEach(f => {
      console.log(`  ID: ${f.id}, Nama: ${f.nama_faskes}, Tipe: ${f.tipe}`);
    });

    // Update user admin@pusat.com dengan faskes_id
    console.log('\n3. Update user admin@pusat.com dengan faskes_id...');
    await connection.promise().execute(
      'UPDATE users SET faskes_id = ? WHERE email = ?',
      [1, 'admin@pusat.com']
    );
    console.log('  ✅ User berhasil diupdate dengan faskes_id = 1');

    // Periksa lagi user setelah update
    console.log('\n4. Data user setelah update:');
    const [updatedUsers] = await connection.promise().execute(
      'SELECT id, nama, email, role, faskes_id FROM users WHERE email = ?',
      ['admin@pusat.com']
    );
    
    if (updatedUsers.length > 0) {
      const user = updatedUsers[0];
      console.log('  ID:', user.id);
      console.log('  Nama:', user.nama);
      console.log('  Email:', user.email);
      console.log('  Role:', user.role);
      console.log('  Faskes ID:', user.faskes_id);
    }

    await connection.promise().end();

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkUserFaskes();
