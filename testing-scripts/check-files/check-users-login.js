const mysql = require('mysql2/promise');
require('dotenv').config();
const bcrypt = require('bcryptjs');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'esirv2'
};

async function checkAndFixUsers() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database esirv2');

    // Check current users
    console.log('\n1️⃣ Checking current users...');
    const [users] = await connection.execute(`
      SELECT u.id, u.username, u.email, u.password, u.role_id, r.nama_role 
      FROM users u 
      LEFT JOIN roles r ON u.role_id = r.id
    `);
    
    console.log('Current users:');
    users.forEach(user => {
      console.log(`  - ID: ${user.id}, Username: ${user.username}, Email: ${user.email}, Role: ${user.nama_role}`);
      console.log(`    Password hash: ${user.password ? user.password.substring(0, 20) + '...' : 'NULL'}`);
    });

    // Create admin user if not exists
    console.log('\n2️⃣ Creating/updating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    await connection.execute(`
      INSERT INTO users (username, email, password, role_id, created_at, updated_at) 
      VALUES ('admin', 'admin@esirv2.com', ?, 1, NOW(), NOW())
      ON DUPLICATE KEY UPDATE 
        email = VALUES(email),
        password = VALUES(password),
        role_id = VALUES(role_id),
        updated_at = NOW()
    `, [hashedPassword]);

    console.log('✅ Admin user created/updated with password: admin123');

    // Create operator user if not exists
    console.log('\n3️⃣ Creating/updating operator user...');
    await connection.execute(`
      INSERT INTO users (username, email, password, role_id, faskes_id, created_at, updated_at) 
      VALUES ('operator', 'operator@esirv2.com', ?, 2, 1, NOW(), NOW())
      ON DUPLICATE KEY UPDATE 
        email = VALUES(email),
        password = VALUES(password),
        role_id = VALUES(role_id),
        faskes_id = VALUES(faskes_id),
        updated_at = NOW()
    `, [hashedPassword]);

    console.log('✅ Operator user created/updated with password: admin123');

    // Show final users
    console.log('\n4️⃣ Final users list:');
    const [finalUsers] = await connection.execute(`
      SELECT u.id, u.username, u.email, u.role_id, r.nama_role 
      FROM users u 
      LEFT JOIN roles r ON u.role_id = r.id
    `);
    
    finalUsers.forEach(user => {
      console.log(`  - ${user.username} (${user.email}) - Role: ${user.nama_role}`);
    });

    console.log('\n🎉 Users check and fix completed!');
    console.log('\n📋 Login credentials:');
    console.log('  Admin: admin / admin123');
    console.log('  Operator: operator / admin123');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkAndFixUsers()
  .then(() => {
    console.log('\n✅ Users setup completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Users setup failed:', error);
    process.exit(1);
  });
