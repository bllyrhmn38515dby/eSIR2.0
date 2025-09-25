const mysql = require('mysql2');

async function checkUserPassword() {
  let connection;
  try {
    connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'prodsysesirv02'
    });

    console.log('🔍 Checking user password...');
    
    const [users] = await connection.promise().query(`
      SELECT u.id, u.nama_lengkap, u.username, u.email, u.password, r.nama_role as role
      FROM users u 
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.username = 'admin'
    `);
    
    if (users.length > 0) {
      const user = users[0];
      console.log(`👤 User found: ${user.nama_lengkap}`);
      console.log(`📧 Email: ${user.email}`);
      console.log(`🔑 Password hash: ${user.password}`);
      console.log(`👥 Role: ${user.role}`);
    } else {
      console.log('❌ User not found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      connection.end();
    }
  }
}

checkUserPassword();
