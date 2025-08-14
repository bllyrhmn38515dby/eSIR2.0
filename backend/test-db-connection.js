require('dotenv').config();
const mysql = require('mysql2/promise');

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...');
  console.log('📋 Configuration:');
  console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
  console.log(`   User: ${process.env.DB_USER || 'root'}`);
  console.log(`   Database: ${process.env.DB_DATABASE || 'esirv2'}`);
  console.log(`   Port: ${process.env.DB_PORT || 3306}`);
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'esirv2',
      port: process.env.DB_PORT || 3306
    });

    console.log('✅ Database connection successful!');
    
    // Test query untuk cek tabel
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📊 Tables found:', tables.length);
    
    if (tables.length > 0) {
      console.log('📋 Table names:');
      tables.forEach(table => {
        console.log(`   - ${Object.values(table)[0]}`);
      });
    }
    
    // Test query untuk cek data
    try {
      const [roles] = await connection.execute('SELECT COUNT(*) as count FROM roles');
      console.log(`👥 Roles count: ${roles[0].count}`);
    } catch (error) {
      console.log('⚠️  Roles table not found or empty');
    }
    
    try {
      const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
      console.log(`👤 Users count: ${users[0].count}`);
    } catch (error) {
      console.log('⚠️  Users table not found or empty');
    }
    
    try {
      const [faskes] = await connection.execute('SELECT COUNT(*) as count FROM faskes');
      console.log(`🏥 Faskes count: ${faskes[0].count}`);
    } catch (error) {
      console.log('⚠️  Faskes table not found or empty');
    }
    
    await connection.end();
    console.log('✅ Database test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('   Error:', error.message);
    console.error('   Code:', error.code);
    
    if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('💡 Solution: Database "esirv2" does not exist. Please create it first.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('💡 Solution: MySQL server is not running. Please start MySQL service.');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('💡 Solution: Check username and password in config.env');
    }
  }
}

testDatabaseConnection();
