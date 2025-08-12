require('dotenv').config();
const mysql = require('mysql2');

async function setupNotifications() {
  try {
    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT
    });

    console.log('=== SETUP NOTIFICATIONS TABLE ===');

    // Create notifications table
    await connection.promise().query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type ENUM('rujukan-baru', 'status-update', 'system', 'info') NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        recipient_id INT UNSIGNED,
        sender_id INT UNSIGNED,
        faskes_id INT,
        rujukan_id INT,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (faskes_id) REFERENCES faskes(id) ON DELETE CASCADE,
        FOREIGN KEY (rujukan_id) REFERENCES rujukan(id) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);
    console.log('✅ Tabel notifications berhasil dibuat');

    // Insert sample notifications
    await connection.promise().query(`
      INSERT IGNORE INTO notifications (id, type, title, message, recipient_id, sender_id, faskes_id, rujukan_id) VALUES 
      (1, 'system', 'Selamat Datang', 'Selamat datang di sistem eSIR 2.0!', 1, NULL, NULL, NULL),
      (2, 'rujukan-baru', 'Rujukan Baru', 'Rujukan baru dari Puskesmas Kenjeran', 1, 4, 1, 1),
      (3, 'status-update', 'Status Diperbarui', 'Status rujukan RJK-2024-001 telah diperbarui', 4, 1, 3, 1)
    `);
    console.log('✅ Data sample notifications berhasil diinsert');

    await connection.promise().end();
    console.log('\n=== SETUP NOTIFICATIONS SELESAI ===');

  } catch (error) {
    console.error('Error setup notifications:', error);
    process.exit(1);
  }
}

setupNotifications();
