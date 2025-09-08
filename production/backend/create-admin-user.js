const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createAdminUser() {
  let connection;
  
  try {
    console.log('🔗 Connecting to esirv2 database...');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: 'esirv2'
    });

    console.log('✅ Connected to esirv2 database\n');

    // Hash password
    const hashedPassword = await bcrypt.hash('password', 10);
    console.log('🔐 Password hashed successfully');

    // Get admin_pusat role ID
    const [roles] = await connection.execute('SELECT id FROM roles WHERE nama_role = ?', ['admin_pusat']);
    
    if (roles.length === 0) {
      console.error('❌ Role admin_pusat tidak ditemukan');
      return;
    }

    const roleId = roles[0].id;
    console.log('✅ Role admin_pusat found, ID:', roleId);

    // Check if user already exists
    const [existingUsers] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      ['admin@esirv2.com']
    );

    if (existingUsers.length > 0) {
      console.log('🔄 User admin@esirv2.com already exists, updating password...');
      
      await connection.execute(
        'UPDATE users SET password = ?, updated_at = NOW() WHERE email = ?',
        [hashedPassword, 'admin@esirv2.com']
      );
      
      console.log('✅ Password updated successfully');
    } else {
      console.log('🆕 Creating new admin user...');
      
      await connection.execute(
        `INSERT INTO users (nama_lengkap, username, email, password, role_id, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        ['Admin eSIR v2', 'admin_esirv2', 'admin@esirv2.com', hashedPassword, roleId]
      );
      
      console.log('✅ Admin user created successfully');
    }

    // Verify the user
    const [users] = await connection.execute(
      'SELECT id, nama_lengkap, email, role_id FROM users WHERE email = ?',
      ['admin@esirv2.com']
    );

    if (users.length > 0) {
      const user = users[0];
      console.log('\n✅ User verified:');
      console.log(`  ID: ${user.id}`);
      console.log(`  Nama: ${user.nama_lengkap}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Role ID: ${user.role_id}`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

createAdminUser();
