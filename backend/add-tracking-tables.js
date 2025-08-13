const db = require('./config/db');

async function addTrackingTables() {
  try {
    console.log('🔧 Menambahkan tabel tracking...');

    // Buat tabel tracking_data
    const createTrackingDataTable = `
      CREATE TABLE IF NOT EXISTS tracking_data (
        id INT AUTO_INCREMENT PRIMARY KEY,
        rujukan_id INT NOT NULL,
        latitude DECIMAL(10,8) NOT NULL,
        longitude DECIMAL(11,8) NOT NULL,
        status ENUM('menunggu', 'dijemput', 'dalam_perjalanan', 'tiba') DEFAULT 'menunggu',
        estimated_time INT,
        estimated_distance DECIMAL(8,2),
        speed DECIMAL(5,2),
        heading INT,
        accuracy DECIMAL(5,2),
        battery_level INT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (rujukan_id) REFERENCES rujukan(id) ON DELETE CASCADE,
        INDEX idx_rujukan_status (rujukan_id, status),
        INDEX idx_updated_at (updated_at)
      )
    `;

    await db.execute(createTrackingDataTable);
    console.log('✅ Tabel tracking_data berhasil dibuat');

    // Buat tabel tracking_sessions
    const createTrackingSessionsTable = `
      CREATE TABLE IF NOT EXISTS tracking_sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        rujukan_id INT NOT NULL,
        user_id INT NOT NULL,
        device_id VARCHAR(255),
        session_token VARCHAR(255) UNIQUE,
        is_active BOOLEAN DEFAULT TRUE,
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ended_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (rujukan_id) REFERENCES rujukan(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id),
        INDEX idx_session_token (session_token),
        INDEX idx_active_sessions (is_active, rujukan_id)
      )
    `;

    await db.execute(createTrackingSessionsTable);
    console.log('✅ Tabel tracking_sessions berhasil dibuat');

    // Verifikasi tabel
    const [tables] = await db.execute("SHOW TABLES LIKE 'tracking_data'");
    if (tables.length > 0) {
      console.log('✅ Tabel tracking_data sudah ada di database');
    } else {
      console.log('❌ Tabel tracking_data tidak ditemukan');
    }

    const [sessionsTables] = await db.execute("SHOW TABLES LIKE 'tracking_sessions'");
    if (sessionsTables.length > 0) {
      console.log('✅ Tabel tracking_sessions sudah ada di database');
    } else {
      console.log('❌ Tabel tracking_sessions tidak ditemukan');
    }

    console.log('\n🎉 Setup tabel tracking selesai!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

addTrackingTables();
