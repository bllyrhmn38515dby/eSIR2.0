const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkUsersTable() {
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

    // Check if users table exists
    console.log('\n1️⃣ Checking users table...');
    const [tables] = await connection.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'prodsysesirv02' 
      AND table_name = 'users'
    `);

    if (tables.length === 0) {
      console.log('❌ Users table not found!');
      
      // Check all tables
      const [allTables] = await connection.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'prodsysesirv02'
        ORDER BY table_name
      `);
      
      console.log('\n📊 All tables in database:');
      allTables.forEach(table => {
        console.log(`  - ${table.table_name}`);
      });
      
    } else {
      console.log('✅ Users table exists');
      
      // Check users data
      const [users] = await connection.query('SELECT id, nama_lengkap, email, role FROM users LIMIT 5');
      
      console.log('\n👥 Users in database:');
      if (users.length === 0) {
        console.log('  No users found');
      } else {
        users.forEach(user => {
          console.log(`  - ${user.nama_lengkap} (${user.email}) - Role: ${user.role}`);
        });
      }
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

checkUsersTable();
