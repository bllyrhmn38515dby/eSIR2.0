-- =====================================================
-- MANUAL QUERIES FOR ADDING AMBULANCE DRIVERS
-- =====================================================

-- 1. First, add the role if not exists
INSERT INTO roles (nama_role, deskripsi, created_at, updated_at) 
VALUES ('sopir_ambulans', 'Sopir ambulans yang bertugas mengantar pasien', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- 2. Get the role ID
SET @role_id = (SELECT id FROM roles WHERE nama_role = 'sopir_ambulans');

-- 3. Add ambulance driver users (adjust faskes_id according to your data)
INSERT INTO users (nama_lengkap, username, password, email, role_id, faskes_id, telepon, created_at, updated_at) VALUES
('Ahmad Supriadi', 'ahmad.supriadi', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/5J5K5K5K', 'ahmad.supriadi@ambulans.com', @role_id, 1, '081234567890', NOW(), NOW()),
('Budi Santoso', 'budi.santoso', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/5J5K5K5K', 'budi.santoso@ambulans.com', @role_id, 1, '081234567891', NOW(), NOW()),
('Candra Wijaya', 'candra.wijaya', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/5J5K5K5K', 'candra.wijaya@ambulans.com', @role_id, 2, '081234567892', NOW(), NOW()),
('Dedi Kurniawan', 'dedi.kurniawan', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/5J5K5K5K', 'dedi.kurniawan@ambulans.com', @role_id, 2, '081234567893', NOW(), NOW()),
('Eko Prasetyo', 'eko.prasetyo', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/5J5K5K5K', 'eko.prasetyo@ambulans.com', @role_id, 3, '081234567894', NOW(), NOW());

-- 4. Add ambulance driver details
INSERT INTO ambulance_drivers (user_id, nomor_sim, nomor_ambulans, status, created_at, updated_at) VALUES
((SELECT id FROM users WHERE email = 'ahmad.supriadi@ambulans.com'), 'B1234567', 'AMB-001', 'aktif', NOW(), NOW()),
((SELECT id FROM users WHERE email = 'budi.santoso@ambulans.com'), 'B1234568', 'AMB-002', 'aktif', NOW(), NOW()),
((SELECT id FROM users WHERE email = 'candra.wijaya@ambulans.com'), 'B1234569', 'AMB-003', 'aktif', NOW(), NOW()),
((SELECT id FROM users WHERE email = 'dedi.kurniawan@ambulans.com'), 'B1234570', 'AMB-004', 'aktif', NOW(), NOW()),
((SELECT id FROM users WHERE email = 'eko.prasetyo@ambulans.com'), 'B1234571', 'AMB-005', 'aktif', NOW(), NOW());

-- 5. Verify the data
SELECT 
    u.id,
    u.nama_lengkap,
    u.email,
    u.telepon,
    r.nama_role,
    f.nama_faskes,
    ad.nomor_sim,
    ad.nomor_ambulans,
    ad.status
FROM users u
LEFT JOIN roles r ON u.role_id = r.id
LEFT JOIN faskes f ON u.faskes_id = f.id
LEFT JOIN ambulance_drivers ad ON u.id = ad.user_id
WHERE r.nama_role = 'sopir_ambulans'
ORDER BY u.nama_lengkap;

-- =====================================================
-- QUERY TO ADD SINGLE AMBULANCE DRIVER
-- =====================================================

-- Replace the values below with actual data
-- SET @nama_lengkap = 'Nama Sopir Baru';
-- SET @username = 'username.baru';
-- SET @email = 'email@ambulans.com';
-- SET @password = '$2a$12$hashedpasswordhere'; -- Use bcrypt to hash
-- SET @telepon = '081234567890';
-- SET @faskes_id = 1; -- Adjust according to your faskes
-- SET @nomor_sim = 'B1234572';
-- SET @nomor_ambulans = 'AMB-006';

-- INSERT INTO users (nama_lengkap, username, password, email, role_id, faskes_id, telepon, created_at, updated_at) 
-- VALUES (@nama_lengkap, @username, @password, @email, @role_id, @faskes_id, @telepon, NOW(), NOW());

-- SET @user_id = LAST_INSERT_ID();

-- INSERT INTO ambulance_drivers (user_id, nomor_sim, nomor_ambulans, status, created_at, updated_at) 
-- VALUES (@user_id, @nomor_sim, @nomor_ambulans, 'aktif', NOW(), NOW());

-- =====================================================
-- QUERY TO UPDATE AMBULANCE DRIVER STATUS
-- =====================================================

-- UPDATE ambulance_drivers 
-- SET status = 'nonaktif', updated_at = NOW() 
-- WHERE user_id = (SELECT id FROM users WHERE email = 'email@ambulans.com');

-- =====================================================
-- QUERY TO DELETE AMBULANCE DRIVER
-- =====================================================

-- DELETE FROM users WHERE email = 'email@ambulans.com';
-- (ambulance_drivers will be deleted automatically due to CASCADE)
