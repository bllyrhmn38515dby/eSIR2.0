-- =====================================================
-- eSIR 2.0 - MANUAL SETUP QUERY FOR PHPMYADMIN
-- Database: prodsysesirv02
-- Version: 2.0
-- Date: 2024-12-04
-- =====================================================

-- 1. CREATE DATABASE
CREATE DATABASE IF NOT EXISTS prodsysesirv02;
USE prodsysesirv02;

-- =====================================================
-- 2. CREATE TABLES
-- =====================================================

-- Tabel roles (Peran Pengguna)
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_role VARCHAR(50) NOT NULL UNIQUE,
    deskripsi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel faskes (Fasilitas Kesehatan)
CREATE TABLE IF NOT EXISTS faskes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_faskes VARCHAR(255) NOT NULL,
    alamat TEXT NOT NULL,
    tipe ENUM('RSUD', 'Puskesmas', 'Klinik', 'RS Swasta') NOT NULL,
    telepon VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel users (Pengguna Sistem)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_lengkap VARCHAR(255) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    faskes_id INT,
    telepon VARCHAR(20),
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (faskes_id) REFERENCES faskes(id)
);

-- Tabel pasien (Data Pasien)
CREATE TABLE IF NOT EXISTS pasien (
    id INT AUTO_INCREMENT PRIMARY KEY,
    no_rm VARCHAR(20) NOT NULL UNIQUE,
    nama_pasien VARCHAR(255) NOT NULL,
    nik VARCHAR(16) NOT NULL UNIQUE,
    tanggal_lahir DATE NOT NULL,
    jenis_kelamin ENUM('L', 'P') NOT NULL,
    alamat TEXT NOT NULL,
    telepon VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel rujukan (Data Rujukan Pasien)
CREATE TABLE IF NOT EXISTS rujukan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nomor_rujukan VARCHAR(50) NOT NULL UNIQUE,
    pasien_id INT NOT NULL,
    faskes_asal_id INT NOT NULL,
    faskes_tujuan_id INT NOT NULL,
    diagnosa TEXT NOT NULL,
    alasan_rujukan TEXT NOT NULL,
    catatan_asal TEXT,
    catatan_tujuan TEXT,
    status ENUM('pending', 'diterima', 'ditolak', 'selesai') DEFAULT 'pending',
    tanggal_rujukan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tanggal_respon TIMESTAMP NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (pasien_id) REFERENCES pasien(id),
    FOREIGN KEY (faskes_asal_id) REFERENCES faskes(id),
    FOREIGN KEY (faskes_tujuan_id) REFERENCES faskes(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabel tempat_tidur (Manajemen Tempat Tidur)
CREATE TABLE IF NOT EXISTS tempat_tidur (
    id INT AUTO_INCREMENT PRIMARY KEY,
    faskes_id INT NOT NULL,
    nomor_kamar VARCHAR(20) NOT NULL,
    nomor_bed VARCHAR(20) NOT NULL,
    tipe_kamar ENUM('VIP', 'Kelas 1', 'Kelas 2', 'Kelas 3', 'ICU', 'NICU', 'PICU') NOT NULL,
    status ENUM('tersedia', 'terisi', 'maintenance', 'reserved') DEFAULT 'tersedia',
    pasien_id INT NULL,
    tanggal_masuk TIMESTAMP NULL,
    tanggal_keluar TIMESTAMP NULL,
    catatan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (faskes_id) REFERENCES faskes(id),
    FOREIGN KEY (pasien_id) REFERENCES pasien(id),
    UNIQUE KEY unique_bed (faskes_id, nomor_kamar, nomor_bed)
);

-- Tabel tracking_data (Data Tracking Real-time)
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
);

-- Tabel tracking_sessions (Sesi Tracking)
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
);

-- Tabel search_logs (Log Pencarian)
CREATE TABLE IF NOT EXISTS search_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    search_term VARCHAR(255) NOT NULL,
    entity_type ENUM('pasien', 'rujukan', 'faskes', 'tempat_tidur', 'global') NOT NULL,
    results_count INT DEFAULT 0,
    response_time_ms INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabel notifications (Sistem Notifikasi)
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'warning', 'error', 'success') DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabel dokumen (Manajemen Dokumen)
CREATE TABLE IF NOT EXISTS dokumen (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rujukan_id INT NOT NULL,
    nama_file VARCHAR(255) NOT NULL,
    path_file VARCHAR(500) NOT NULL,
    tipe_file VARCHAR(100),
    ukuran_file INT,
    uploaded_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rujukan_id) REFERENCES rujukan(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

-- Tabel activity_logs (Log Aktivitas)
CREATE TABLE IF NOT EXISTS activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INT,
    details TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabel ambulance_drivers (Sopir Ambulans)
CREATE TABLE IF NOT EXISTS ambulance_drivers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_lengkap VARCHAR(255) NOT NULL,
    nik VARCHAR(16) NOT NULL UNIQUE,
    no_sim VARCHAR(20) NOT NULL UNIQUE,
    telepon VARCHAR(20) NOT NULL,
    alamat TEXT NOT NULL,
    faskes_id INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (faskes_id) REFERENCES faskes(id)
);

-- Tabel password_reset_tokens (Reset Password)
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabel email_logs (Log Email)
CREATE TABLE IF NOT EXISTS email_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    email VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    status ENUM('sent', 'failed', 'pending') DEFAULT 'pending',
    message_id VARCHAR(255),
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Tabel system_config (Konfigurasi Sistem)
CREATE TABLE IF NOT EXISTS system_config (
    id INT AUTO_INCREMENT PRIMARY KEY,
    config_key VARCHAR(100) NOT NULL UNIQUE,
    config_value TEXT,
    description TEXT,
    updated_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- =====================================================
-- 3. INSERT DATA AWAL
-- =====================================================

-- Insert Roles
INSERT INTO roles (id, nama_role, deskripsi) VALUES
(1, 'admin_pusat', 'Administrator Pusat - Akses penuh ke semua fitur'),
(2, 'admin_faskes', 'Administrator Faskes - Akses terbatas sesuai faskes'),
(3, 'operator', 'Operator - Akses terbatas untuk input data'),
(4, 'sopir_ambulans', 'Sopir Ambulans - Akses tracking dan navigasi');

-- Insert Faskes (Fasilitas Kesehatan)
INSERT INTO faskes (id, nama_faskes, alamat, tipe, telepon, latitude, longitude) VALUES
(1, 'RSUD Kota Bogor', 'Jl. Dr. Semeru No.120, Tegallega, Kec. Bogor Tengah, Kota Bogor, Jawa Barat 16129', 'RSUD', '0251-8313084', -6.5971, 106.8060),
(2, 'RS Hermina Bogor', 'Jl. Ring Road I No.75, Pakuan, Kec. Bogor Selatan, Kota Bogor, Jawa Barat 16143', 'RS Swasta', '0251-7537777', -6.6011, 106.7990),
(3, 'RS Salak Bogor', 'Jl. Salak No.38, Babakan, Kec. Bogor Tengah, Kota Bogor, Jawa Barat 16128', 'RS Swasta', '0251-8313084', -6.5950, 106.8080),
(4, 'Puskesmas Bogor Tengah', 'Jl. Siliwangi No.45, Pabaton, Kec. Bogor Tengah, Kota Bogor, Jawa Barat 16121', 'Puskesmas', '0251-8321234', -6.5970, 106.8060),
(5, 'Puskesmas Bogor Utara', 'Jl. Raya Pakuan No.12, Pakuan, Kec. Bogor Utara, Kota Bogor, Jawa Barat 16143', 'Puskesmas', '0251-8325678', -6.6010, 106.7990),
(6, 'Puskesmas Bogor Selatan', 'Jl. Raya Pajajaran No.67, Bantarjati, Kec. Bogor Utara, Kota Bogor, Jawa Barat 16153', 'Puskesmas', '0251-8329012', -6.5950, 106.8080),
(7, 'Puskesmas Bogor Barat', 'Jl. Raya Dramaga No.89, Dramaga, Kec. Bogor Barat, Kota Bogor, Jawa Barat 16680', 'Puskesmas', '0251-8323456', -6.5900, 106.8000),
(8, 'Puskesmas Bogor Timur', 'Jl. Raya Tajur No.34, Tajur, Kec. Bogor Timur, Kota Bogor, Jawa Barat 16134', 'Puskesmas', '0251-8327890', -6.6050, 106.8100),
(9, 'Klinik Bogor Sehat', 'Jl. Suryakencana No.56, Suryakencana, Kec. Bogor Barat, Kota Bogor, Jawa Barat 16123', 'Klinik', '0251-8321111', -6.5920, 106.8020),
(10, 'Klinik Bogor Medika', 'Jl. Raya Pajajaran No.78, Bantarjati, Kec. Bogor Utara, Kota Bogor, Jawa Barat 16153', 'Klinik', '0251-8322222', -6.5980, 106.8040);

-- Insert Users (Password: admin123)
INSERT INTO users (id, nama_lengkap, username, email, password, role_id, faskes_id) VALUES
(1, 'Admin Pusat', 'admin', 'admin@esir.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Kz8KzK', 1, NULL),
(2, 'Admin RSUD Bogor', 'admin_rsud', 'admin@rsud.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Kz8KzK', 2, 1),
(3, 'Admin Puskesmas Tengah', 'admin_puskesmas', 'admin@puskesmas.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Kz8KzK', 2, 4),
(4, 'Operator RSUD', 'operator_rsud', 'operator@rsud.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Kz8KzK', 3, 1);

-- Insert Pasien (Sample Data)
INSERT INTO pasien (id, no_rm, nama_pasien, nik, tanggal_lahir, jenis_kelamin, alamat, telepon) VALUES
(1, 'RM001', 'Ahmad Santoso', '3573010101990001', '1999-01-01', 'L', 'Jl. Ahmad Yani No.10, Bogor', '081234567890'),
(2, 'RM002', 'Siti Nurhaliza', '3573010202990002', '1999-02-02', 'P', 'Jl. Gubeng Jaya No.15, Bogor', '081234567891'),
(3, 'RM003', 'Budi Prasetyo', '3573010303990003', '1999-03-03', 'L', 'Jl. Kenjeran No.20, Bogor', '081234567892'),
(4, 'RM004', 'Dewi Sartika', '3573010404990004', '1999-04-04', 'P', 'Jl. Wonokromo No.25, Bogor', '081234567893'),
(5, 'RM005', 'Eko Prasetyo', '3573010505990005', '1999-05-05', 'L', 'Jl. Tambaksari No.30, Bogor', '081234567894');

-- Insert Rujukan (Sample Data)
INSERT INTO rujukan (id, nomor_rujukan, pasien_id, faskes_asal_id, faskes_tujuan_id, diagnosa, alasan_rujukan, catatan_asal, status, user_id) VALUES
(1, 'RJ20241201001', 1, 4, 1, 'Demam Berdarah Dengue', 'Memerlukan perawatan intensif', 'Pasien dengan gejala DBD berat', 'diterima', 3),
(2, 'RJ20241201002', 2, 5, 1, 'Pneumonia', 'Memerlukan pemeriksaan spesialis paru', 'Pasien dengan gejala pneumonia', 'pending', 3),
(3, 'RJ20241201003', 3, 4, 5, 'Diabetes Melitus', 'Kontrol gula darah rutin', 'Pasien DM tipe 2', 'selesai', 3),
(4, 'RJ20241201004', 4, 6, 1, 'Hipertensi', 'Pemeriksaan jantung', 'Pasien dengan tekanan darah tinggi', 'diterima', 3),
(5, 'RJ20241201005', 5, 8, 5, 'Asma', 'Pemeriksaan paru-paru', 'Pasien dengan gejala asma', 'ditolak', 3);

-- Insert Tempat Tidur (Sample Data)
INSERT INTO tempat_tidur (id, faskes_id, nomor_kamar, nomor_bed, tipe_kamar, status, pasien_id, tanggal_masuk, catatan) VALUES
-- RSUD Kota Bogor
(1, 1, 'VIP-01', 'A', 'VIP', 'tersedia', NULL, NULL, 'Kamar VIP dengan AC dan TV'),
(2, 1, 'VIP-01', 'B', 'VIP', 'terisi', 1, '2024-12-01 08:00:00', 'Pasien DBD'),
(3, 1, 'K1-01', 'A', 'Kelas 1', 'tersedia', NULL, NULL, 'Kamar Kelas 1'),
(4, 1, 'K1-01', 'B', 'Kelas 1', 'maintenance', NULL, NULL, 'Sedang diperbaiki'),
(5, 1, 'K2-01', 'A', 'Kelas 2', 'tersedia', NULL, NULL, 'Kamar Kelas 2'),
(6, 1, 'K2-01', 'B', 'Kelas 2', 'reserved', NULL, NULL, 'Dipesan untuk operasi'),
(7, 1, 'ICU-01', 'A', 'ICU', 'tersedia', NULL, NULL, 'ICU dengan ventilator'),
(8, 1, 'ICU-01', 'B', 'ICU', 'terisi', 2, '2024-12-01 10:00:00', 'Pasien kritis'),
-- Puskesmas Bogor Utara
(9, 5, 'VIP-01', 'A', 'VIP', 'tersedia', NULL, NULL, 'Kamar VIP'),
(10, 5, 'K1-01', 'A', 'Kelas 1', 'tersedia', NULL, NULL, 'Kamar Kelas 1'),
(11, 5, 'K1-01', 'B', 'Kelas 1', 'terisi', 3, '2024-12-01 09:00:00', 'Pasien diabetes'),
(12, 5, 'K2-01', 'A', 'Kelas 2', 'tersedia', NULL, NULL, 'Kamar Kelas 2'),
(13, 5, 'ICU-01', 'A', 'ICU', 'tersedia', NULL, NULL, 'ICU');

-- Insert Ambulance Drivers (Sample Data)
INSERT INTO ambulance_drivers (id, nama_lengkap, nik, no_sim, telepon, alamat, faskes_id) VALUES
(1, 'Budi Santoso', '3573010101990001', 'SIM123456789', '081234567890', 'Jl. Ahmad Yani No.10, Bogor', 1),
(2, 'Siti Rahayu', '3573010202990002', 'SIM123456790', '081234567891', 'Jl. Gubeng Jaya No.15, Bogor', 1),
(3, 'Ahmad Wijaya', '3573010303990003', 'SIM123456791', '081234567892', 'Jl. Kenjeran No.20, Bogor', 4),
(4, 'Dewi Kartika', '3573010404990004', 'SIM123456792', '081234567893', 'Jl. Wonokromo No.25, Bogor', 5),
(5, 'Eko Prasetyo', '3573010505990005', 'SIM123456793', '081234567894', 'Jl. Tambaksari No.30, Bogor', 1);

-- Insert System Config
INSERT INTO system_config (config_key, config_value, description) VALUES
('app_name', 'eSIR 2.0', 'Nama aplikasi'),
('app_version', '2.0.0', 'Versi aplikasi'),
('maintenance_mode', 'false', 'Mode maintenance'),
('max_file_size', '10485760', 'Ukuran maksimal file upload (bytes)');

-- =====================================================
-- 4. VERIFIKASI
-- =====================================================

-- Show all tables
SHOW TABLES;

-- Show table counts
SELECT 
    'roles' as table_name, COUNT(*) as record_count FROM roles
UNION ALL
SELECT 'faskes', COUNT(*) FROM faskes
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'pasien', COUNT(*) FROM pasien
UNION ALL
SELECT 'rujukan', COUNT(*) FROM rujukan
UNION ALL
SELECT 'tempat_tidur', COUNT(*) FROM tempat_tidur
UNION ALL
SELECT 'ambulance_drivers', COUNT(*) FROM ambulance_drivers
UNION ALL
SELECT 'tracking_data', COUNT(*) FROM tracking_data
UNION ALL
SELECT 'tracking_sessions', COUNT(*) FROM tracking_sessions
UNION ALL
SELECT 'search_logs', COUNT(*) FROM search_logs
UNION ALL
SELECT 'notifications', COUNT(*) FROM notifications
UNION ALL
SELECT 'dokumen', COUNT(*) FROM dokumen
UNION ALL
SELECT 'activity_logs', COUNT(*) FROM activity_logs
UNION ALL
SELECT 'password_reset_tokens', COUNT(*) FROM password_reset_tokens
UNION ALL
SELECT 'email_logs', COUNT(*) FROM email_logs
UNION ALL
SELECT 'system_config', COUNT(*) FROM system_config;

-- =====================================================
-- SELESAI
-- =====================================================
SELECT 'Database prodsysesirv02 berhasil dibuat dengan lengkap!' as status;
