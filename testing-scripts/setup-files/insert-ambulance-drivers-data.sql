-- =====================================================
-- INSERT AMBULANCE DRIVERS DATA
-- =====================================================

-- 1. First, add the role if not exists
INSERT INTO roles (nama_role, deskripsi, created_at, updated_at) 
VALUES ('sopir_ambulans', 'Sopir ambulans yang bertugas mengantar pasien', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- 2. Get the role ID
SET @role_id = (SELECT id FROM roles WHERE nama_role = 'sopir_ambulans');

-- 3. Create ambulance_drivers table if not exists
CREATE TABLE IF NOT EXISTS ambulance_drivers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  nomor_sim VARCHAR(20) NOT NULL,
  nomor_ambulans VARCHAR(20) NOT NULL,
  status ENUM('aktif', 'nonaktif', 'cuti', 'sakit') DEFAULT 'aktif',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_nomor_sim (nomor_sim),
  UNIQUE KEY unique_nomor_ambulans (nomor_ambulans),
  UNIQUE KEY unique_user_driver (user_id)
);

-- 4. Insert ambulance driver users with hashed passwords
-- Password: sopir123 (hashed with bcrypt, salt rounds: 12)
INSERT INTO users (nama_lengkap, username, password, email, role_id, faskes_id, telepon, created_at, updated_at) VALUES
('Ahmad Supriadi', 'ahmad.supriadi', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/5J5K5K5K', 'ahmad.supriadi@ambulans.com', @role_id, 1, '081234567890', NOW(), NOW()),
('Budi Santoso', 'budi.santoso', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/5J5K5K5K', 'budi.santoso@ambulans.com', @role_id, 1, '081234567891', NOW(), NOW()),
('Candra Wijaya', 'candra.wijaya', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/5J5K5K5K', 'candra.wijaya@ambulans.com', @role_id, 2, '081234567892', NOW(), NOW()),
('Dedi Kurniawan', 'dedi.kurniawan', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/5J5K5K5K', 'dedi.kurniawan@ambulans.com', @role_id, 2, '081234567893', NOW(), NOW()),
('Eko Prasetyo', 'eko.prasetyo', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/5J5K5K5K', 'eko.prasetyo@ambulans.com', @role_id, 3, '081234567894', NOW(), NOW()),
('Fajar Ramadhan', 'fajar.ramadhan', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/5J5K5K5K', 'fajar.ramadhan@ambulans.com', @role_id, 3, '081234567895', NOW(), NOW()),
('Gunawan Setiawan', 'gunawan.setiawan', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/5J5K5K5K', 'gunawan.setiawan@ambulans.com', @role_id, 4, '081234567896', NOW(), NOW()),
('Hendra Kusuma', 'hendra.kusuma', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/5J5K5K5K', 'hendra.kusuma@ambulans.com', @role_id, 4, '081234567897', NOW(), NOW()),
('Indra Permana', 'indra.permana', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/5J5K5K5K', 'indra.permana@ambulans.com', @role_id, 5, '081234567898', NOW(), NOW()),
('Joko Widodo', 'joko.widodo', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/5J5K5K5K', 'joko.widodo@ambulans.com', @role_id, 5, '081234567899', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
  nama_lengkap = VALUES(nama_lengkap),
  username = VALUES(username),
  role_id = VALUES(role_id),
  faskes_id = VALUES(faskes_id),
  telepon = VALUES(telepon),
  updated_at = NOW();

-- 5. Insert ambulance driver details
INSERT INTO ambulance_drivers (user_id, nomor_sim, nomor_ambulans, status, created_at, updated_at) VALUES
((SELECT id FROM users WHERE email = 'ahmad.supriadi@ambulans.com'), 'B1234567', 'AMB-001', 'aktif', NOW(), NOW()),
((SELECT id FROM users WHERE email = 'budi.santoso@ambulans.com'), 'B1234568', 'AMB-002', 'aktif', NOW(), NOW()),
((SELECT id FROM users WHERE email = 'candra.wijaya@ambulans.com'), 'B1234569', 'AMB-003', 'aktif', NOW(), NOW()),
((SELECT id FROM users WHERE email = 'dedi.kurniawan@ambulans.com'), 'B1234570', 'AMB-004', 'aktif', NOW(), NOW()),
((SELECT id FROM users WHERE email = 'eko.prasetyo@ambulans.com'), 'B1234571', 'AMB-005', 'aktif', NOW(), NOW()),
((SELECT id FROM users WHERE email = 'fajar.ramadhan@ambulans.com'), 'B1234572', 'AMB-006', 'aktif', NOW(), NOW()),
((SELECT id FROM users WHERE email = 'gunawan.setiawan@ambulans.com'), 'B1234573', 'AMB-007', 'aktif', NOW(), NOW()),
((SELECT id FROM users WHERE email = 'hendra.kusuma@ambulans.com'), 'B1234574', 'AMB-008', 'aktif', NOW(), NOW()),
((SELECT id FROM users WHERE email = 'indra.permana@ambulans.com'), 'B1234575', 'AMB-009', 'aktif', NOW(), NOW()),
((SELECT id FROM users WHERE email = 'joko.widodo@ambulans.com'), 'B1234576', 'AMB-010', 'aktif', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
  nomor_sim = VALUES(nomor_sim),
  nomor_ambulans = VALUES(nomor_ambulans),
  status = VALUES(status),
  updated_at = NOW();

-- 6. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ambulance_drivers_status ON ambulance_drivers(status);
CREATE INDEX IF NOT EXISTS idx_ambulance_drivers_faskes ON ambulance_drivers(user_id);

-- 7. Verify the data
SELECT 
    u.id,
    u.nama_lengkap,
    u.email,
    u.telepon,
    r.nama_role,
    f.nama_faskes,
    ad.nomor_sim,
    ad.nomor_ambulans,
    ad.status,
    u.created_at
FROM users u
LEFT JOIN roles r ON u.role_id = r.id
LEFT JOIN faskes f ON u.faskes_id = f.id
LEFT JOIN ambulance_drivers ad ON u.id = ad.user_id
WHERE r.nama_role = 'sopir_ambulans'
ORDER BY u.nama_lengkap;

-- 8. Show summary
SELECT 
    COUNT(*) as total_drivers,
    COUNT(CASE WHEN ad.status = 'aktif' THEN 1 END) as aktif_drivers,
    COUNT(CASE WHEN ad.status = 'nonaktif' THEN 1 END) as nonaktif_drivers,
    COUNT(CASE WHEN ad.status = 'cuti' THEN 1 END) as cuti_drivers,
    COUNT(CASE WHEN ad.status = 'sakit' THEN 1 END) as sakit_drivers
FROM users u
LEFT JOIN roles r ON u.role_id = r.id
LEFT JOIN ambulance_drivers ad ON u.id = ad.user_id
WHERE r.nama_role = 'sopir_ambulans';

-- 9. Show drivers by faskes
SELECT 
    f.nama_faskes,
    COUNT(*) as total_drivers,
    GROUP_CONCAT(u.nama_lengkap SEPARATOR ', ') as drivers
FROM users u
LEFT JOIN roles r ON u.role_id = r.id
LEFT JOIN faskes f ON u.faskes_id = f.id
LEFT JOIN ambulance_drivers ad ON u.id = ad.user_id
WHERE r.nama_role = 'sopir_ambulans'
GROUP BY f.id, f.nama_faskes
ORDER BY f.nama_faskes;
