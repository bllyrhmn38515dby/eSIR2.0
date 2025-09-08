const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixUsersTable() {
  let connection;
  
  try {
    // Connect to database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'esirv2'
    });

    console.log('🔗 Connected to database');

    // Create roles table first
    const createRolesSQL = `
      CREATE TABLE IF NOT EXISTS roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama_role VARCHAR(50) NOT NULL UNIQUE,
        deskripsi TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await connection.query(createRolesSQL);
    console.log('✅ Table roles created');

    // Create users table
    const createUsersSQL = `
      CREATE TABLE IF NOT EXISTS users (
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
    `;
    await connection.query(createUsersSQL);
    console.log('✅ Table users created');

    // Insert default roles
    await connection.query(`
      INSERT IGNORE INTO roles (nama_role, deskripsi) VALUES
      ('admin_pusat', 'Administrator Pusat - Akses penuh ke semua fitur'),
      ('admin_faskes', 'Administrator Faskes - Akses terbatas sesuai faskes'),
      ('operator', 'Operator - Akses terbatas untuk input data')
    `);
    console.log('✅ Default roles inserted');

    // Insert default admin user (password: password123)
    await connection.query(`
      INSERT IGNORE INTO users (nama_lengkap, username, email, password, role_id) VALUES
      ('Admin Pusat', 'admin', 'admin@esir.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Kz8KzK', 1)
    `);
    console.log('✅ Default admin user inserted');

    // Check if tables exist
    const [tables] = await connection.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = '${process.env.DB_DATABASE || 'esirv2'}'
      AND table_name IN ('users', 'roles')
      ORDER BY table_name
    `);

    console.log('\n📊 Created tables:');
    tables.forEach(table => {
      console.log(`  - ${table.table_name}`);
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

// Run the setup
fixUsersTable();
