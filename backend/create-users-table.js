const mysql = require('mysql2/promise');
require('dotenv').config();

async function createUsersTable() {
  let connection;
  
  try {
    // Connect to database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'prodsysesirv02'
    });

    console.log('🔗 Connected to prodsysesirv02 database');

    // Create users table
    console.log('\n1️⃣ Creating users table...');
    
    const createUsersTableSQL = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama_lengkap VARCHAR(255) NOT NULL,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role_id INT NOT NULL,
        faskes_id INT,
        is_active BOOLEAN DEFAULT TRUE,
        last_login TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (role_id) REFERENCES roles(id),
        FOREIGN KEY (faskes_id) REFERENCES faskes(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await connection.execute(createUsersTableSQL);
    console.log('✅ Users table created successfully');

    // Insert sample users
    console.log('\n2️⃣ Inserting sample users...');
    
    // Hash password for 'admin123'
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const insertUsersSQL = `
      INSERT IGNORE INTO users (nama_lengkap, username, email, password, role_id, faskes_id) VALUES
      ('Admin Pusat', 'admin_pusat', 'admin@esir.com', ?, 1, NULL),
      ('Admin RSUD Bogor', 'admin_rsud', 'admin@rsud.com', ?, 2, 1),
      ('Admin Puskesmas Tengah', 'admin_puskesmas', 'admin@puskesmas.com', ?, 2, 2),
      ('Operator RSUD', 'operator_rsud', 'operator@rsud.com', ?, 3, 1)
    `;

    await connection.execute(insertUsersSQL, [hashedPassword, hashedPassword, hashedPassword, hashedPassword]);
    console.log('✅ Sample users inserted successfully');

    // Verify users
    console.log('\n3️⃣ Verifying users...');
    const [users] = await connection.query('SELECT id, nama_lengkap, email, role_id FROM users');
    
    console.log('\n👥 Users in database:');
    users.forEach(user => {
      console.log(`  - ${user.nama_lengkap} (${user.email}) - Role ID: ${user.role_id}`);
    });

    console.log('\n✅ Users table setup completed successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

createUsersTable();
