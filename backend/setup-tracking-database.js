const db = require('./config/db');
require('dotenv').config();

async function setupTrackingDatabase() {
  try {
    console.log('🚀 Memulai setup database tracking...');

    // Buat tabel tracking_data
    const createTrackingDataTable = `
      CREATE TABLE IF NOT EXISTS tracking_data (
        id INT AUTO_INCREMENT PRIMARY KEY,
        rujukan_id INT NOT NULL,
        latitude DECIMAL(10,8) NOT NULL,
        longitude DECIMAL(11,8) NOT NULL,
        status ENUM('menunggu', 'dijemput', 'dalam_perjalanan', 'tiba') DEFAULT 'menunggu',
        estimated_time INT, -- dalam menit
        estimated_distance DECIMAL(8,2), -- dalam km
        speed DECIMAL(5,2), -- dalam km/h
        heading INT, -- arah dalam derajat (0-360)
        accuracy DECIMAL(5,2), -- akurasi GPS dalam meter
        battery_level INT, -- level baterai device (0-100)
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
        user_id INT NOT NULL, -- petugas yang melakukan tracking
        device_id VARCHAR(255), -- ID device yang digunakan
        session_token VARCHAR(255) UNIQUE, -- token untuk autentikasi tracking
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

    // Insert sample tracking data untuk testing
    try {
      const insertSampleData = `
        INSERT IGNORE INTO tracking_data (rujukan_id, latitude, longitude, status, estimated_time, estimated_distance, speed, heading, accuracy, battery_level) VALUES
        (1, -6.5971, 106.8060, 'dalam_perjalanan', 15, 8.5, 35.0, 45, 5.0, 85),
        (2, -6.6011, 106.7990, 'menunggu', NULL, NULL, 0.0, NULL, 3.0, 90),
        (3, -6.5950, 106.8080, 'tiba', 0, 0.0, 0.0, NULL, 2.0, 75)
      `;

      await db.execute(insertSampleData);
      console.log('✅ Data sample tracking berhasil ditambahkan');
    } catch (error) {
      console.log('ℹ️ Data sample sudah ada atau rujukan belum tersedia');
    }

    // Verifikasi tabel
    const [trackingDataColumns] = await db.execute('DESCRIBE tracking_data');
    console.log('\n📋 Struktur tabel tracking_data:');
    trackingDataColumns.forEach(col => {
      console.log(`  ${col.Field} - ${col.Type} - ${col.Key}`);
    });

    const [trackingSessionsColumns] = await db.execute('DESCRIBE tracking_sessions');
    console.log('\n📋 Struktur tabel tracking_sessions:');
    trackingSessionsColumns.forEach(col => {
      console.log(`  ${col.Field} - ${col.Type} - ${col.Key}`);
    });

    // Cek jumlah data
    const [trackingDataCount] = await db.execute('SELECT COUNT(*) as total FROM tracking_data');
    console.log(`\n📊 Total data tracking_data: ${trackingDataCount[0].total}`);

    const [trackingSessionsCount] = await db.execute('SELECT COUNT(*) as total FROM tracking_sessions');
    console.log(`📊 Total data tracking_sessions: ${trackingSessionsCount[0].total}`);

    console.log('\n🎉 Setup database tracking selesai!');
    console.log('\n📝 Catatan:');
    console.log('- Tabel tracking_data untuk menyimpan posisi real-time');
    console.log('- Tabel tracking_sessions untuk mengelola sesi tracking');
    console.log('- Data sample sudah ditambahkan untuk testing');

  } catch (error) {
    console.error('❌ Error setup database tracking:', error.message);
    console.error('❌ Stack:', error.stack);
    process.exit(1);
  }
}

if (require.main === module) {
  setupTrackingDatabase();
}

module.exports = { setupTrackingDatabase };
