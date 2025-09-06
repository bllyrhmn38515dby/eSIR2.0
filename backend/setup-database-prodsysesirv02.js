const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabaseComplete() {
  let connection;
  
  try {
    console.log('🚀 eSIR 2.0 - Complete Database Setup');
    console.log('Database: prodsysesirv02');
    console.log('=====================================\n');
    
    // Connect to MySQL without specifying database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    });

    console.log('✅ Connected to MySQL server');

    // Read SQL file
    const sqlFile = path.join(__dirname, 'create-database-prodsysesirv02-complete.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    console.log('📖 Reading SQL file...');
    
    // Execute SQL
    console.log('🔨 Creating database and tables...');
    await connection.execute(sqlContent);
    
    console.log('✅ Database prodsysesirv02 created successfully!');
    
    // Verify database
    console.log('\n📊 Verifying database...');
    
    // Connect to prodsysesirv02 database
    await connection.execute('USE prodsysesirv02');
    
    // Check tables
    const [tables] = await connection.execute('SHOW TABLES');
    console.log(`✅ Found ${tables.length} tables:`);
    tables.forEach(table => {
      console.log(`   - ${Object.values(table)[0]}`);
    });
    
    // Check record counts
    console.log('\n📈 Record counts:');
    const tableNames = [
      'roles', 'faskes', 'users', 'pasien', 'rujukan', 
      'tempat_tidur', 'ambulance_drivers', 'tracking_data',
      'tracking_sessions', 'search_logs', 'notifications',
      'dokumen', 'activity_logs', 'password_reset_tokens',
      'email_logs', 'system_config'
    ];
    
    for (const tableName of tableNames) {
      try {
        const [count] = await connection.execute(`SELECT COUNT(*) as count FROM ${tableName}`);
        console.log(`   - ${tableName}: ${count[0].count} records`);
      } catch (error) {
        console.log(`   - ${tableName}: Error - ${error.message}`);
      }
    }
    
    // Test login credentials
    console.log('\n🔐 Test Login Credentials:');
    console.log('   Email: admin@esir.com');
    console.log('   Password: admin123');
    console.log('   Role: Admin Pusat');
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Start backend server: npm start');
    console.log('   2. Start frontend server: cd ../frontend && npm start');
    console.log('   3. Open browser: http://localhost:3000');
    console.log('   4. Login with: admin@esir.com / admin123');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run setup
setupDatabaseComplete()
  .then(() => {
    console.log('\n✅ Setup completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  });
