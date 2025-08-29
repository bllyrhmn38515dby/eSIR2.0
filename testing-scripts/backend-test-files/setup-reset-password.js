require('dotenv').config();
const mysql = require('mysql2');

async function setupResetPassword() {
  try {
    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT
    });

    console.log('=== SETUP RESET PASSWORD TABLES ===');

    // Create password_reset_tokens table
    await connection.promise().query(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNSIGNED NOT NULL,
        token VARCHAR(255) NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_token (token),
        INDEX idx_user_id (user_id),
        INDEX idx_expires_at (expires_at)
      ) ENGINE=InnoDB
    `);
    console.log('✅ Tabel password_reset_tokens berhasil dibuat');

    // Create email_logs table untuk tracking email
    await connection.promise().query(`
      CREATE TABLE IF NOT EXISTS email_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNSIGNED,
        email VARCHAR(255) NOT NULL,
        type ENUM('reset_password', 'notification', 'welcome') NOT NULL,
        subject VARCHAR(255) NOT NULL,
        status ENUM('sent', 'failed', 'pending') DEFAULT 'pending',
        error_message TEXT,
        message_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_user_id (user_id),
        INDEX idx_type (type),
        INDEX idx_status (status),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB
    `);
    console.log('✅ Tabel email_logs berhasil dibuat');

    await connection.promise().end();
    console.log('=== SETUP RESET PASSWORD COMPLETE ===');

  } catch (error) {
    console.error('❌ Error setup reset password:', error);
    process.exit(1);
  }
}

setupResetPassword();
