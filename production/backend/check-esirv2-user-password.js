const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function checkUserPassword() {
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

    // Get all users
    const [users] = await connection.execute(`
      SELECT u.id, u.nama_lengkap, u.email, u.password, r.nama_role as role
      FROM users u 
      LEFT JOIN roles r ON u.role_id = r.id 
      ORDER BY u.id
    `);

    console.log('👥 Users in esirv2 database:');
    users.forEach(user => {
      console.log(`  ID: ${user.id}`);
      console.log(`  Nama: ${user.nama_lengkap}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Role: ${user.role}`);
      console.log(`  Password hash: ${user.password ? user.password.substring(0, 20) + '...' : 'NULL'}`);
      console.log('');
    });

    // Test password "password" for each user
    console.log('🔍 Testing password: "password"');
    for (const user of users) {
      if (user.password) {
        const isValid = await bcrypt.compare('password', user.password);
        console.log(`  ${user.email}: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
      } else {
        console.log(`  ${user.email}: ❌ No password hash`);
      }
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

checkUserPassword();
