const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkProdsysesirv02DB() {
  let connection;
  
  try {
    // Connect to database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'prodsysesirv02'
    });

    console.log('🔗 Connected to prodsysesirv02 database');

    // Check all tables
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('\n📊 Tables in prodsysesirv02:');
    if (tables.length === 0) {
      console.log('  No tables found');
    } else {
      tables.forEach(table => {
        console.log(`  - ${Object.values(table)[0]}`);
      });
    }

    // Check table counts
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
        console.log(`  - ${tableName}: ${count[0].count} records`);
      } catch (error) {
        console.log(`  - ${tableName}: Error - ${error.message}`);
      }
    }

    // Test users table
    console.log('\n👥 Users in database:');
    try {
      const [users] = await connection.execute(`
        SELECT u.id, u.nama_lengkap, u.email, u.username, r.nama_role as role
        FROM users u 
        LEFT JOIN roles r ON u.role_id = r.id 
        ORDER BY u.id
      `);
      
      users.forEach(user => {
        console.log(`  - ${user.nama_lengkap} (${user.email}) - Role: ${user.role}`);
      });
    } catch (error) {
      console.log(`  ❌ Error checking users: ${error.message}`);
    }

    // Test faskes table
    console.log('\n🏥 Faskes in database:');
    try {
      const [faskes] = await connection.execute(`
        SELECT id, nama_faskes, tipe, telepon
        FROM faskes 
        ORDER BY id
      `);
      
      faskes.forEach(faskes => {
        console.log(`  - ${faskes.nama_faskes} (${faskes.tipe}) - ${faskes.telepon}`);
      });
    } catch (error) {
      console.log(`  ❌ Error checking faskes: ${error.message}`);
    }

    console.log('\n✅ Database connection test completed successfully!');

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the check
checkProdsysesirv02DB();
