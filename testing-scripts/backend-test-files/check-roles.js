const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkRoles() {
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

    // Show all roles
    const [roles] = await connection.execute('SELECT * FROM roles ORDER BY id');
    console.log('📋 All roles:');
    roles.forEach(role => {
      console.log(`  - ${role.nama_role} (ID: ${role.id}) - ${role.deskripsi}`);
    });

    // Check if operator role exists
    const [operatorRole] = await connection.execute(
      'SELECT * FROM roles WHERE nama_role = ?',
      ['operator']
    );

    if (operatorRole.length > 0) {
      console.log('✅ Operator role exists');
    } else {
      console.log('❌ Operator role does not exist');
      
      // Add operator role
      await connection.execute(
        'INSERT INTO roles (nama_role, deskripsi) VALUES (?, ?)',
        ['operator', 'Operator - Akses terbatas untuk input data']
      );
      console.log('✅ Operator role added successfully');
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

checkRoles();
