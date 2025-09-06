-- Database schema untuk eSIR 2.0

-- Buat dan gunakan database prodsysesirv02
CREATE DATABASE IF NOT EXISTS prodsysesirv02;
USE prodsysesirv02;

-- Tabel faskes (fasilitas kesehatan)
CREATE TABLE IF NOT EXISTS faskes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_faskes VARCHAR(255) NOT NULL,
    alamat TEXT NOT NULL,
    tipe ENUM('RSUD', 'Puskesmas', 'Klinik') NOT NULL,
    telepon VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel roles
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_role VARCHAR(50) NOT NULL UNIQUE,
    deskripsi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_lengkap VARCHAR(255) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    faskes_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (faskes_id) REFERENCES faskes(id)
);

-- Tabel pasien
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

-- Tabel rujukan
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

-- Tabel tempat tidur
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

-- Tabel search_logs untuk analytics pencarian
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

-- Tabel tracking_data untuk real-time route tracking
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
);

-- Tabel tracking_sessions untuk mengelola sesi tracking
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
);

-- Insert data awal untuk roles
INSERT INTO roles (nama_role, deskripsi) VALUES
('admin_pusat', 'Administrator Pusat - Akses penuh ke semua fitur'),
('admin_faskes', 'Administrator Faskes - Akses terbatas sesuai faskes'),
('operator', 'Operator - Akses terbatas untuk input data');

-- Insert data awal untuk faskes dengan koordinat Surabaya
INSERT INTO faskes (nama_faskes, alamat, tipe, telepon, latitude, longitude) VALUES
('RSUD Kota Bogor', 'Jl. Dr. Semeru No.120, Tegallega, Kec. Bogor Tengah, Kota Bogor, Jawa Barat 16129', 'RSUD', '0251-8313084', -6.5971, 106.8060),
('RS Hermina Bogor', 'Jl. Ring Road I No.75, Pakuan, Kec. Bogor Selatan, Kota Bogor, Jawa Barat 16143', 'RS Swasta', '0251-7537777', -6.6011, 106.7990),
('RS Salak Bogor', 'Jl. Salak No.38, Babakan, Kec. Bogor Tengah, Kota Bogor, Jawa Barat 16128', 'RS Swasta', '0251-8313084', -6.5950, 106.8080),
('Puskesmas Bogor Tengah', 'Jl. Siliwangi No.45, Pabaton, Kec. Bogor Tengah, Kota Bogor, Jawa Barat 16121', 'Puskesmas', '0251-8321234', -6.5970, 106.8060),
('Puskesmas Bogor Utara', 'Jl. Raya Pakuan No.12, Pakuan, Kec. Bogor Utara, Kota Bogor, Jawa Barat 16143', 'Puskesmas', '0251-8325678', -6.6010, 106.7990),
('Puskesmas Bogor Selatan', 'Jl. Raya Pajajaran No.67, Bantarjati, Kec. Bogor Utara, Kota Bogor, Jawa Barat 16153', 'Puskesmas', '0251-8329012', -6.5950, 106.8080),
('Puskesmas Bogor Barat', 'Jl. Raya Dramaga No.89, Dramaga, Kec. Bogor Barat, Kota Bogor, Jawa Barat 16680', 'Puskesmas', '0251-8323456', -6.5900, 106.8000),
('Puskesmas Bogor Timur', 'Jl. Raya Tajur No.34, Tajur, Kec. Bogor Timur, Kota Bogor, Jawa Barat 16134', 'Puskesmas', '0251-8327890', -6.6050, 106.8100),
('Klinik Bogor Sehat', 'Jl. Suryakencana No.56, Suryakencana, Kec. Bogor Barat, Kota Bogor, Jawa Barat 16123', 'Klinik', '0251-8321111', -6.5920, 106.8020),
('Klinik Bogor Medika', 'Jl. Raya Pajajaran No.78, Bantarjati, Kec. Bogor Utara, Kota Bogor, Jawa Barat 16153', 'Klinik', '0251-8322222', -6.5980, 106.8040);

-- Insert data awal untuk users (password: admin123)
INSERT INTO users (nama_lengkap, username, email, password, role_id, faskes_id) VALUES
('Admin Pusat', 'admin_pusat', 'admin@pusat.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, NULL),
('Admin RSUD Soetomo', 'admin_soetomo', 'admin@soetomo.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2, 1),
('Admin Puskesmas Kenjeran', 'admin_kenjeran', 'admin@kenjeran.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2, 2),
('Admin Puskesmas Gubeng', 'admin_gubeng', 'admin@gubeng.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2, 3);

-- Insert data awal untuk pasien
INSERT INTO pasien (no_rm, nama_pasien, nik, tanggal_lahir, jenis_kelamin, alamat, telepon) VALUES
('RM001', 'Ahmad Santoso', '3573010101990001', '1999-01-01', 'L', 'Jl. Ahmad Yani No.10, Surabaya', '081234567890'),
('RM002', 'Siti Nurhaliza', '3573010202990002', '1999-02-02', 'P', 'Jl. Gubeng Jaya No.15, Surabaya', '081234567891'),
('RM003', 'Budi Prasetyo', '3573010303990003', '1999-03-03', 'L', 'Jl. Kenjeran No.20, Surabaya', '081234567892'),
('RM004', 'Dewi Sartika', '3573010404990004', '1999-04-04', 'P', 'Jl. Wonokromo No.25, Surabaya', '081234567893'),
('RM005', 'Eko Prasetyo', '3573010505990005', '1999-05-05', 'L', 'Jl. Tambaksari No.30, Surabaya', '081234567894');

-- Insert data awal untuk rujukan
INSERT INTO rujukan (nomor_rujukan, pasien_id, faskes_asal_id, faskes_tujuan_id, diagnosa, alasan_rujukan, catatan_asal, status, user_id) VALUES
('RJ20241201001', 1, 2, 1, 'Demam Berdarah Dengue', 'Memerlukan perawatan intensif', 'Pasien dengan gejala DBD berat', 'diterima', 2),
('RJ20241201002', 2, 3, 1, 'Pneumonia', 'Memerlukan pemeriksaan spesialis paru', 'Pasien dengan gejala pneumonia', 'pending', 3),
('RJ20241201003', 3, 2, 5, 'Diabetes Melitus', 'Kontrol gula darah rutin', 'Pasien DM tipe 2', 'selesai', 2),
('RJ20241201004', 4, 6, 1, 'Hipertensi', 'Pemeriksaan jantung', 'Pasien dengan tekanan darah tinggi', 'diterima', 3),
('RJ20241201005', 5, 8, 5, 'Asma', 'Pemeriksaan paru-paru', 'Pasien dengan gejala asma', 'ditolak', 3);

-- Insert data awal untuk tempat tidur (hanya untuk RSUD)
INSERT INTO tempat_tidur (faskes_id, nomor_kamar, nomor_bed, tipe_kamar, status, pasien_id, tanggal_masuk, catatan) VALUES
-- RSUD Dr. Soetomo
(1, 'VIP-01', 'A', 'VIP', 'tersedia', NULL, NULL, 'Kamar VIP dengan AC dan TV'),
(1, 'VIP-01', 'B', 'VIP', 'terisi', 1, '2024-12-01 08:00:00', 'Pasien DBD'),
(1, 'K1-01', 'A', 'Kelas 1', 'tersedia', NULL, NULL, 'Kamar Kelas 1'),
(1, 'K1-01', 'B', 'Kelas 1', 'maintenance', NULL, NULL, 'Sedang diperbaiki'),
(1, 'K2-01', 'A', 'Kelas 2', 'tersedia', NULL, NULL, 'Kamar Kelas 2'),
(1, 'K2-01', 'B', 'Kelas 2', 'reserved', NULL, NULL, 'Dipesan untuk operasi'),
(1, 'ICU-01', 'A', 'ICU', 'tersedia', NULL, NULL, 'ICU dengan ventilator'),
(1, 'ICU-01', 'B', 'ICU', 'terisi', 2, '2024-12-01 10:00:00', 'Pasien kritis'),

-- RSUD Haji
(5, 'VIP-01', 'A', 'VIP', 'tersedia', NULL, NULL, 'Kamar VIP'),
(5, 'K1-01', 'A', 'Kelas 1', 'tersedia', NULL, NULL, 'Kamar Kelas 1'),
(5, 'K1-01', 'B', 'Kelas 1', 'terisi', 3, '2024-12-01 09:00:00', 'Pasien diabetes'),
(5, 'K2-01', 'A', 'Kelas 2', 'tersedia', NULL, NULL, 'Kamar Kelas 2'),
(5, 'ICU-01', 'A', 'ICU', 'tersedia', NULL, NULL, 'ICU');