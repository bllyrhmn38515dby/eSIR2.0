require('dotenv').config();
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');

async function debugLogin() {
  try {
    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT
    });

    console.log('=== DEBUG LOGIN ===');
    
    // Test koneksi database
    console.log('1. Testing database connection...');
    await connection.promise().ping();
    console.log('✓ Database connection OK');

    // Cari user
    console.log('\n2. Searching for user...');
    const [users] = await connection.promise().execute(
      'SELECT * FROM users WHERE email = ?',
      ['test@example.com']
    );

    if (users.length === 0) {
      console.log('✗ User not found');
      return;
    }

    const user = users[0];
    console.log('✓ User found:', {
      id: user.id,
      nama: user.nama,
      email: user.email,
      role: user.role
    });

    // Test password
    console.log('\n3. Testing password...');
    const isValidPassword = await bcrypt.compare('password123', user.password);
    console.log('✓ Password valid:', isValidPassword);

    // Test JWT secret
    console.log('\n4. Testing JWT secret...');
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');
    console.log('JWT_EXPIRES_IN:', process.env.JWT_EXPIRES_IN || 'Not set');

    await connection.promise().end();
    console.log('\n=== DEBUG COMPLETE ===');

  } catch (error) {
    console.error('✗ Error:', error);
    process.exit(1);
  }
}

debugLogin();
