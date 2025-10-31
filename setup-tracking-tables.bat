@echo off
echo Creating tracking tables...

mysql -u root -p prodsysesirv02 -e "
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
);

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
);

SHOW TABLES LIKE 'tracking_%';
"

echo Tables created successfully!
pause
