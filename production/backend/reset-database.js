const mysql = require('mysql2/promise');
require('dotenv').config();

async function resetDatabase() {
  let connection;
  
  try {
    // Connect to MySQL without specifying database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    console.log('🔗 Connected to MySQL');

    // Drop and recreate database
    await connection.query('DROP DATABASE IF EXISTS esirv2');
    console.log('✅ Dropped database esirv2');
    
    await connection.query('CREATE DATABASE esirv2');
    console.log('✅ Created database esirv2');
    
    await connection.query('USE esirv2');
    console.log('✅ Using database esirv2');

    // Create roles table
    await connection.query(`
      CREATE TABLE roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama_role VARCHAR(50) NOT NULL UNIQUE,
        deskripsi TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table roles created');

    // Create users table
    await connection.query(`
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama_lengkap VARCHAR(255) NOT NULL,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role_id INT NOT NULL,
        faskes_id INT,
        telepon VARCHAR(20),
        last_login TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (role_id) REFERENCES roles(id)
      )
    `);
    console.log('✅ Table users created');

    // Insert roles
    await connection.query(`
      INSERT INTO roles (id, nama_role, deskripsi) VALUES
      (1, 'admin_pusat', 'Administrator Pusat'),
      (2, 'admin_faskes', 'Administrator Faskes'),
      (3, 'operator', 'Operator')
    `);
    console.log('✅ Roles inserted');

    // Insert admin user (password: admin123)
    await connection.query(`
      INSERT INTO users (id, nama_lengkap, username, email, password, role_id) VALUES
      (1, 'Admin Pusat', 'admin', 'admin@esir.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Kz8KzK', 1)
    `);
    console.log('✅ Admin user inserted');

    // Verify tables
    const [tables] = await connection.query('SHOW TABLES');
    console.log('\n📊 All tables:');
    tables.forEach(table => {
      console.log(`  - ${Object.values(table)[0]}`);
    });

    // Check users table
    const [users] = await connection.query('SELECT * FROM users');
    console.log('\n👥 Users:');
    users.forEach(user => {
      console.log(`  - ${user.nama_lengkap} (${user.email})`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

resetDatabase();
