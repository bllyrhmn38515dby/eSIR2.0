const mysql = require('mysql2');

async function checkDatabase() {
  try {
    const pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'prodsysesirv02'
    });

    console.log('🔍 Checking database connection...');
    
    // Check tables
    const [tables] = await pool.execute('SHOW TABLES');
    console.log('📋 Tables found:', tables.map(t => Object.values(t)[0]));
    
    // Check roles table
    const [roles] = await pool.execute('SELECT * FROM roles');
    console.log('👥 Roles:', roles);
    
    // Check faskes table
    const [faskes] = await pool.execute('SELECT * FROM faskes LIMIT 5');
    console.log('🏥 Faskes (first 5):', faskes);
    
    // Check users table
    const [users] = await pool.execute('SELECT COUNT(*) as count FROM users');
    console.log('👤 Users count:', users[0].count);
    
    await pool.end();
    console.log('✅ Database check completed');
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
    process.exit(1);
  }
}

checkDatabase();
