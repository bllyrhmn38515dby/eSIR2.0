const db = require('./config/db');

async function fixTrackingTables() {
  try {
    console.log('🔧 Memperbaiki struktur tabel tracking...\n');

    // Drop tabel lama jika ada
    console.log('🗑️ Menghapus tabel tracking lama...');
    await db.execute('DROP TABLE IF EXISTS tracking_data');
    await db.execute('DROP TABLE IF EXISTS tracking_sessions');

    // Buat tabel tracking_data yang benar
    console.log('📋 Membuat tabel tracking_data...');
    await db.execute(`
      CREATE TABLE tracking_data (
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
    `);

    // Buat tabel tracking_sessions yang benar
    console.log('📋 Membuat tabel tracking_sessions...');
    await db.execute(`
      CREATE TABLE tracking_sessions (
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
    `);

    console.log('✅ Tabel tracking berhasil diperbaiki!');
    
    // Verifikasi struktur
    console.log('\n🔍 Verifikasi struktur tabel...');
    
    const [trackingDataColumns] = await db.execute('DESCRIBE tracking_data');
    console.log('📋 Struktur tracking_data:');
    trackingDataColumns.forEach(col => {
      console.log(`  ${col.Field} - ${col.Type}`);
    });
    
    const [trackingSessionsColumns] = await db.execute('DESCRIBE tracking_sessions');
    console.log('\n📋 Struktur tracking_sessions:');
    trackingSessionsColumns.forEach(col => {
      console.log(`  ${col.Field} - ${col.Type}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

fixTrackingTables();
