const mysql = require('mysql2/promise');
require('dotenv').config();

async function updatePasswordsToPlain() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'prodsysesirv02'
    });

    console.log('🔗 Connected to prodsysesirv02 database');

    // Update semua password menjadi plain text untuk development
    const updateSQL = 'UPDATE users SET password = ? WHERE email = ?';
    
    // Update admin@esir.com
    await connection.execute(updateSQL, ['admin123', 'admin@esir.com']);
    console.log('✅ Updated admin@esir.com password to plain text: admin123');
    
    // Update admin@rsud.com
    await connection.execute(updateSQL, ['admin123', 'admin@rsud.com']);
    console.log('✅ Updated admin@rsud.com password to plain text: admin123');
    
    // Update admin@puskesmas.com
    await connection.execute(updateSQL, ['admin123', 'admin@puskesmas.com']);
    console.log('✅ Updated admin@puskesmas.com password to plain text: admin123');
    
    // Update operator@rsud.com
    await connection.execute(updateSQL, ['admin123', 'operator@rsud.com']);
    console.log('✅ Updated operator@rsud.com password to plain text: admin123');

    // Verify users
    const [users] = await connection.query('SELECT id, nama_lengkap, email, password FROM users');
    
    console.log('\n👥 Users with plain text passwords:');
    users.forEach(user => {
      console.log(`  - ${user.nama_lengkap} (${user.email}) - Password: ${user.password}`);
    });

    console.log('\n🔧 DEVELOPMENT MODE: All passwords are now plain text for easy testing!');
    console.log('⚠️  Remember to enable hash password in production!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

updatePasswordsToPlain();
