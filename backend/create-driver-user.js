const mysql = require('mysql2/promise');
require('dotenv').config();

async function createDriverUser() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'prodsysesirv02',
      port: process.env.DB_PORT || 3306
    });

    console.log('🔗 Connected to database');

    // Check if driver role exists
    const [roleRows] = await connection.execute(
      'SELECT id FROM roles WHERE nama_role = ?',
      ['sopir_ambulans']
    );

    if (roleRows.length === 0) {
      console.log('❌ Role sopir_ambulans tidak ditemukan');
      console.log('📝 Membuat role sopir_ambulans...');
      
      await connection.execute(
        'INSERT INTO roles (nama_role, deskripsi) VALUES (?, ?)',
        ['sopir_ambulans', 'Sopir Ambulans - Akses tracking dan navigasi']
      );
      
      console.log('✅ Role sopir_ambulans berhasil dibuat');
    } else {
      console.log('✅ Role sopir_ambulans sudah ada (ID:', roleRows[0].id, ')');
    }

    // Get role ID
    const [roleResult] = await connection.execute(
      'SELECT id FROM roles WHERE nama_role = ?',
      ['sopir_ambulans']
    );
    const roleId = roleResult[0].id;

    // Check if driver user already exists
    const [existingUser] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      ['driver@esir.com']
    );

    if (existingUser.length > 0) {
      console.log('⚠️ User driver sudah ada, mengupdate...');
      
      await connection.execute(
        'UPDATE users SET nama_lengkap = ?, username = ?, password = ?, role_id = ? WHERE email = ?',
        ['Sopir Ambulans Test', 'driver', 'driver123', roleId, 'driver@esir.com']
      );
      
      console.log('✅ User driver berhasil diupdate');
    } else {
      console.log('📝 Membuat user sopir ambulans...');
      
      await connection.execute(
        'INSERT INTO users (nama_lengkap, username, email, password, role_id) VALUES (?, ?, ?, ?, ?)',
        ['Sopir Ambulans Test', 'driver', 'driver@esir.com', 'driver123', roleId]
      );
      
      console.log('✅ User sopir ambulans berhasil dibuat');
    }

    // Display created user info
    const [userResult] = await connection.execute(
      'SELECT u.*, r.nama_role FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.email = ?',
      ['driver@esir.com']
    );

    if (userResult.length > 0) {
      const user = userResult[0];
      console.log('\n🎉 User Sopir Ambulans berhasil dibuat/diupdate:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📧 Email:', user.email);
      console.log('👤 Username:', user.username);
      console.log('🔑 Password:', 'driver123');
      console.log('👨‍💼 Nama:', user.nama_lengkap);
      console.log('🎭 Role:', user.nama_role);
      console.log('🆔 User ID:', user.id);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\n🌐 Login URL: http://localhost:3000/login');
      console.log('🚗 Driver Dashboard: http://localhost:3000/driver');
      console.log('\n💡 Tips:');
      console.log('   - Gunakan email: driver@esir.com');
      console.log('   - Password: driver123');
      console.log('   - Setelah login, akses /driver untuk dashboard sopir');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run the function
createDriverUser();
