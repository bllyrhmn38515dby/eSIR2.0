const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkEsirv2DB() {
  let connection;
  
  try {
    // Connect to esirv2 database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: 'esirv2'
    });

    console.log('🔗 Connected to esirv2 database');

    // Check tables
    const [tables] = await connection.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'esirv2'
      ORDER BY table_name
    `);

    console.log('\n📊 Tables in esirv2:');
    if (tables.length === 0) {
      console.log('  No tables found');
    } else {
      tables.forEach(table => {
        console.log(`  - ${table.table_name}`);
      });
    }

    // Check users if table exists
    if (tables.some(t => t.table_name === 'users')) {
      const [users] = await connection.query(`
        SELECT u.id, u.nama_lengkap, u.username, u.email, r.nama_role as role
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.id
        ORDER BY u.id
      `);

      console.log('\n👥 Users in esirv2:');
      if (users.length === 0) {
        console.log('  No users found');
      } else {
        users.forEach(user => {
          console.log(`  - ${user.nama_lengkap} (${user.email}) - Role: ${user.role}`);
        });
      }
    }

    // Check tempat_tidur if table exists
    if (tables.some(t => t.table_name === 'tempat_tidur')) {
      const [tempatTidur] = await connection.query(`
        SELECT COUNT(*) as count FROM tempat_tidur
      `);

      console.log(`\n🛏️ Tempat tidur in esirv2: ${tempatTidur[0].count} records`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the check
checkEsirv2DB();
