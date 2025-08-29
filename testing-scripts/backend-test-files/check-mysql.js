const mysql = require('mysql2/promise');

async function checkMySQL() {
  try {
    // Create connection without database
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: ''
    });

    console.log('✅ MySQL connection successful');
    
    // Check databases
    const [databases] = await connection.execute('SHOW DATABASES');
    console.log('Available databases:', databases.map(d => Object.values(d)[0]));
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ MySQL connection error:', error.message);
  }
}

checkMySQL();
