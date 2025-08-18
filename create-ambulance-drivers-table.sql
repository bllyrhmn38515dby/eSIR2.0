-- Create ambulance_drivers table
CREATE TABLE IF NOT EXISTS ambulance_drivers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  nomor_sim VARCHAR(20) NOT NULL,
  nomor_ambulans VARCHAR(20) NOT NULL,
  status ENUM('aktif', 'nonaktif', 'cuti', 'sakit') DEFAULT 'aktif',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign key constraint
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  
  -- Unique constraints
  UNIQUE KEY unique_nomor_sim (nomor_sim),
  UNIQUE KEY unique_nomor_ambulans (nomor_ambulans),
  UNIQUE KEY unique_user_driver (user_id)
);

-- Create index for better performance
CREATE INDEX idx_ambulance_drivers_status ON ambulance_drivers(status);
CREATE INDEX idx_ambulance_drivers_faskes ON ambulance_drivers(user_id);

-- Insert sample data (optional)
-- INSERT INTO ambulance_drivers (user_id, nomor_sim, nomor_ambulans, status) VALUES
-- (1, 'B1234567', 'AMB-001', 'aktif'),
-- (2, 'B1234568', 'AMB-002', 'aktif'),
-- (3, 'B1234569', 'AMB-003', 'aktif');

-- Show table structure
DESCRIBE ambulance_drivers;
