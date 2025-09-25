const mysql = require('mysql2');

async function checkUsers() {
  let connection;
  try {
    connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'prodsysesirv02'
    });

    console.log('🔍 Checking users...');
    
    const [users] = await connection.promise().query(`
      SELECT u.id, u.nama_lengkap, u.username, u.email, u.password, r.nama_role as role
      FROM users u 
      LEFT JOIN roles r ON u.role_id = r.id
    `);
    
    console.log('👤 Users found:');
    users.forEach(user => {
      console.log(`- ID: ${user.id}, Name: ${user.nama_lengkap}, Username: ${user.username}, Email: ${user.email}, Role: ${user.role}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      connection.end();
    }
  }
}

checkUsers();
