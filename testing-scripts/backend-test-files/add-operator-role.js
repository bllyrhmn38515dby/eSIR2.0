const mysql = require('mysql2/promise');
require('dotenv').config();

async function addOperatorRole() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'esirv2'
    });

    console.log('✅ Connected to database');

    // Check if operator role already exists
    const [existingRoles] = await connection.execute(
      'SELECT * FROM roles WHERE nama_role = ?',
      ['operator']
    );

    if (existingRoles.length > 0) {
      console.log('⚠️ Operator role already exists');
      return;
    }

    // Add operator role
    await connection.execute(
      'INSERT INTO roles (nama_role, deskripsi) VALUES (?, ?)',
      ['operator', 'Operator - Akses terbatas untuk input data']
    );

    console.log('✅ Operator role added successfully');

    // Show all roles
    const [roles] = await connection.execute('SELECT * FROM roles');
    console.log('📋 All roles:');
    roles.forEach(role => {
      console.log(`  - ${role.nama_role} (ID: ${role.id})`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

addOperatorRole();
