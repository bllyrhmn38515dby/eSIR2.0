-- Database schema untuk eSIR 2.0

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

-- Insert data awal untuk roles
INSERT INTO roles (nama_role, deskripsi) VALUES
('admin_pusat', 'Administrator Pusat - Akses penuh ke semua fitur'),
('admin_faskes', 'Administrator Faskes - Akses terbatas sesuai faskes');

-- Insert data awal untuk faskes dengan koordinat Surabaya
INSERT INTO faskes (nama_faskes, alamat, tipe, telepon, latitude, longitude) VALUES
('RSUD Dr. Soetomo', 'Jl. Mayjen Prof. Dr. Moestopo No.6-8, Airlangga, Kec. Gubeng, Kota SBY, Jawa Timur 60286', 'RSUD', '031-5501078', -7.2575, 112.7521),
('Puskesmas Kenjeran', 'Jl. Kenjeran No.1, Kenjeran, Kec. Bulak, Kota SBY, Jawa Timur 60124', 'Puskesmas', '031-3290001', -7.2456, 112.7890),
('Puskesmas Gubeng', 'Jl. Gubeng Jaya No.1, Gubeng, Kec. Gubeng, Kota SBY, Jawa Timur 60281', 'Puskesmas', '031-5020001', -7.2654, 112.7456),
('Klinik Sejahtera', 'Jl. Ahmad Yani No.123, Gubeng, Kec. Gubeng, Kota SBY, Jawa Timur 60281', 'Klinik', '031-5021234', -7.2700, 112.7400),
('RSUD Haji', 'Jl. Manyar Kertoadi No.100, Manyar Sabrangan, Kec. Mulyorejo, Kota SBY, Jawa Timur 60116', 'RSUD', '031-5913591', -7.2800, 112.7800),
('Puskesmas Wonokromo', 'Jl. Wonokromo No.45, Wonokromo, Kec. Wonokromo, Kota SBY, Jawa Timur 60243', 'Puskesmas', '031-8290001', -7.2900, 112.7300),
('Klinik Medika', 'Jl. Basuki Rahmat No.67, Tunjungan, Kec. Genteng, Kota SBY, Jawa Timur 60275', 'Klinik', '031-5312345', -7.2600, 112.7350),
('Puskesmas Tambaksari', 'Jl. Tambaksari No.12, Tambaksari, Kec. Tambaksari, Kota SBY, Jawa Timur 60136', 'Puskesmas', '031-5010001', -7.2500, 112.7500);

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