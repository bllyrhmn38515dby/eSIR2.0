const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function fixUserPassword() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'prodsysesirv02'
    });

    console.log('🔗 Connected to prodsysesirv02 database');

    // Hash password 'admin123' dengan bcrypt
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    console.log('🔐 Original password:', password);
    console.log('🔐 Hashed password:', hashedPassword);

    // Update password untuk user admin@esir.com
    const updateSQL = 'UPDATE users SET password = ? WHERE email = ?';
    const [result] = await connection.execute(updateSQL, [hashedPassword, 'admin@esir.com']);
    
    console.log('✅ Password updated for admin@esir.com');
    console.log('📊 Rows affected:', result.affectedRows);

    // Verify user exists
    const [users] = await connection.query('SELECT id, nama_lengkap, email, password FROM users WHERE email = ?', ['admin@esir.com']);
    
    if (users.length > 0) {
      console.log('\n👤 User found:');
      console.log('  - ID:', users[0].id);
      console.log('  - Name:', users[0].nama_lengkap);
      console.log('  - Email:', users[0].email);
      console.log('  - Password hash:', users[0].password.substring(0, 20) + '...');
    } else {
      console.log('❌ User not found');
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

fixUserPassword();
