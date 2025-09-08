const mysql = require('mysql2/promise');
require('dotenv').config();

async function createUsersSimple() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'prodsysesirv02'
    });

    console.log('🔗 Connected to prodsysesirv02 database');

    // Insert users with simple password hash
    console.log('\n1️⃣ Inserting users...');
    
    const insertUsersSQL = `
      INSERT IGNORE INTO users (nama_lengkap, username, email, password, role_id, faskes_id) VALUES
      ('Admin Pusat', 'admin_pusat', 'admin@esir.com', '$2b$10$rQZ8K9vX7wE2nF1sA3bC4e', 1, NULL),
      ('Admin RSUD Bogor', 'admin_rsud', 'admin@rsud.com', '$2b$10$rQZ8K9vX7wE2nF1sA3bC4e', 2, 1),
      ('Admin Puskesmas Tengah', 'admin_puskesmas', 'admin@puskesmas.com', '$2b$10$rQZ8K9vX7wE2nF1sA3bC4e', 2, 2),
      ('Operator RSUD', 'operator_rsud', 'operator@rsud.com', '$2b$10$rQZ8K9vX7wE2nF1sA3bC4e', 3, 1)
    `;

    await connection.execute(insertUsersSQL);
    console.log('✅ Users inserted successfully');

    // Verify users
    const [users] = await connection.query('SELECT id, nama_lengkap, email, role_id FROM users');
    
    console.log('\n👥 Users in database:');
    users.forEach(user => {
      console.log(`  - ${user.nama_lengkap} (${user.email}) - Role ID: ${user.role_id}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

createUsersSimple();
