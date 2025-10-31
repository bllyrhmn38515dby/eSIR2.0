const mysql = require('mysql2/promise');
require('dotenv').config();

async function createTrackingTables() {
  let connection;
  
  try {
    console.log('🔌 Connecting to database...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'prodsysesirv02'
    });

    console.log('✅ Connected to database');

    // Create tracking_sessions table
    console.log('📋 Creating tracking_sessions table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS tracking_sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        rujukan_id INT NOT NULL,
        user_id INT NOT NULL,
        device_id VARCHAR(255),
        session_token VARCHAR(64) UNIQUE NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ended_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (rujukan_id) REFERENCES rujukan(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_rujukan_id (rujukan_id),
        INDEX idx_session_token (session_token),
        INDEX idx_is_active (is_active)
      )
    `);

    // Create tracking_data table
    console.log('📋 Creating tracking_data table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS tracking_data (
        id INT AUTO_INCREMENT PRIMARY KEY,
        rujukan_id INT NOT NULL,
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        status ENUM('menunggu', 'dijemput', 'dalam_perjalanan', 'tiba') DEFAULT 'menunggu',
        estimated_time INT NULL COMMENT 'Estimated time in minutes',
        estimated_distance DECIMAL(8, 2) NULL COMMENT 'Distance in kilometers',
        speed DECIMAL(5, 2) NULL COMMENT 'Speed in km/h',
        heading DECIMAL(5, 2) NULL COMMENT 'Heading in degrees',
        accuracy DECIMAL(8, 2) NULL COMMENT 'Accuracy in meters',
        battery_level INT NULL COMMENT 'Battery level percentage',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (rujukan_id) REFERENCES rujukan(id) ON DELETE CASCADE,
        INDEX idx_rujukan_id (rujukan_id),
        INDEX idx_status (status),
        INDEX idx_updated_at (updated_at)
      )
    `);

    // Check if tables were created
    console.log('🔍 Checking created tables...');
    const [tables] = await connection.execute("SHOW TABLES LIKE 'tracking_%'");
    console.log('✅ Tracking tables created:', tables.map(t => Object.values(t)[0]));

    console.log('🎉 Tracking tables setup completed successfully!');

  } catch (error) {
    console.error('❌ Error creating tracking tables:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage
    });
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

createTrackingTables();
