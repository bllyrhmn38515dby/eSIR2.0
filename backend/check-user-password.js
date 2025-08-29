const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function checkUserPassword() {
  let connection;
  
  try {
    // Connect to database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'esir_db'
    });

    console.log('🔗 Connected to database');

    // Check users
    const [users] = await connection.query(`
      SELECT u.id, u.nama_lengkap, u.username, u.email, u.password, r.nama_role as role
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      ORDER BY u.id
    `);

    console.log('\n👥 Users in database:');
    users.forEach(user => {
      console.log(`  ID: ${user.id}`);
      console.log(`  Nama: ${user.nama_lengkap}`);
      console.log(`  Username: ${user.username}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Role: ${user.role}`);
      console.log(`  Password hash: ${user.password.substring(0, 20)}...`);
      console.log('');
    });

    // Test password 'password'
    const testPassword = 'password';
    console.log(`\n🔍 Testing password: "${testPassword}"`);
    
    for (const user of users) {
      const isValid = await bcrypt.compare(testPassword, user.password);
      console.log(`  ${user.email}: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the check
checkUserPassword();
