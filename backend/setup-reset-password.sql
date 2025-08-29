-- Setup Reset Password Tables untuk eSIR 2.0
-- Database: esirv2

-- Create password_reset_tokens table
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
) ENGINE=InnoDB;

-- Create email_logs table untuk tracking email
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
) ENGINE=InnoDB;

-- Insert sample data untuk testing (opsional)
INSERT IGNORE INTO email_logs (id, user_id, email, type, subject, status, message_id) VALUES 
(1, 1, 'admin@pusat.com', 'welcome', 'Selamat Datang di eSIR 2.0', 'sent', 'sample-1'),
(2, 2, 'admin@faskes.com', 'notification', 'Notifikasi Sistem', 'sent', 'sample-2');

-- Show tables yang berhasil dibuat
SHOW TABLES LIKE '%password%';
SHOW TABLES LIKE '%email%';
