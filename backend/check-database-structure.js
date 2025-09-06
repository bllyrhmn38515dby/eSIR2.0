const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDatabaseStructure() {
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
    console.log('\n📊 All tables in database:');
    const [tables] = await connection.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'prodsysesirv02'
      ORDER BY table_name
    `);
    
    tables.forEach(table => {
      console.log(`  - ${table.table_name}`);
    });

    // Check if users table exists
    const usersTableExists = tables.some(t => t.table_name === 'users');
    
    if (usersTableExists) {
      console.log('\n✅ Users table exists');
      
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
    } else {
      console.log('\n❌ Users table NOT found!');
      console.log('This is the problem - users table is missing!');
    }

    // Check roles table
    const rolesTableExists = tables.some(t => t.table_name === 'roles');
    
    if (rolesTableExists) {
      console.log('\n✅ Roles table exists');
      
      const [roles] = await connection.query('SELECT * FROM roles');
      console.log('\n🎭 Roles in database:');
      roles.forEach(role => {
        console.log(`  - ${role.nama_role} (${role.deskripsi})`);
      });
    } else {
      console.log('\n❌ Roles table NOT found!');
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

checkDatabaseStructure();
