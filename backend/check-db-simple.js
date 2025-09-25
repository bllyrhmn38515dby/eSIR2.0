const mysql = require('mysql2');

async function checkDatabase() {
  let connection;
  try {
    connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'prodsysesirv02'
    });

    console.log('🔍 Checking database connection...');
    
    // Check if database exists
    const [databases] = await connection.promise().query('SHOW DATABASES LIKE "prodsysesirv02"');
    if (databases.length === 0) {
      console.log('❌ Database prodsysesirv02 does not exist');
      return;
    }
    console.log('✅ Database prodsysesirv02 exists');
    
    // Check tables
    const [tables] = await connection.promise().query('SHOW TABLES');
    console.log('📋 Tables found:', tables.map(t => Object.values(t)[0]));
    
    // Check if roles table exists and has data
    try {
      const [roles] = await connection.promise().query('SELECT * FROM roles');
      console.log('👥 Roles:', roles);
    } catch (error) {
      console.log('❌ Roles table error:', error.message);
    }
    
    // Check if faskes table exists and has data
    try {
      const [faskes] = await connection.promise().query('SELECT COUNT(*) as count FROM faskes');
      console.log('🏥 Faskes count:', faskes[0].count);
    } catch (error) {
      console.log('❌ Faskes table error:', error.message);
    }
    
    // Check if users table exists and has data
    try {
      const [users] = await connection.promise().query('SELECT COUNT(*) as count FROM users');
      console.log('👤 Users count:', users[0].count);
    } catch (error) {
      console.log('❌ Users table error:', error.message);
    }
    
    console.log('✅ Database check completed');
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    if (connection) {
      connection.end();
    }
  }
}

checkDatabase();
