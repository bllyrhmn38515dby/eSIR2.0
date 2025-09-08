require('dotenv').config();
const mysql = require('mysql2');

async function listUsers() {
  try {
    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT
    });

    console.log('=== DAFTAR USER ===');
    
    const [users] = await connection.promise().execute('SELECT id, nama, email, role, created_at FROM users ORDER BY id');
    
    users.forEach(user => {
      console.log(`ID: ${user.id} | Nama: ${user.nama} | Email: ${user.email} | Role: ${user.role} | Created: ${user.created_at}`);
    });

    console.log(`\nTotal user: ${users.length}`);

    await connection.promise().end();

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

listUsers();
