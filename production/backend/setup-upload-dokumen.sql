-- Setup Upload Dokumen untuk eSIR 2.0
-- Database: esirv2

-- Create dokumen table
CREATE TABLE IF NOT EXISTS dokumen (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rujukan_id INT NOT NULL,
    nama_file VARCHAR(255) NOT NULL,
    nama_asli VARCHAR(255) NOT NULL,
    tipe_file VARCHAR(100) NOT NULL,
    ukuran_file BIGINT NOT NULL,
    path_file VARCHAR(500) NOT NULL,
    deskripsi TEXT NULL,
    kategori ENUM('hasil_lab', 'rontgen', 'resep', 'surat_rujukan', 'lainnya') DEFAULT 'lainnya',
    uploaded_by INT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (rujukan_id) REFERENCES rujukan(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_rujukan_id (rujukan_id),
    INDEX idx_kategori (kategori),
    INDEX idx_uploaded_by (uploaded_by),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- Create dokumen_logs table untuk tracking upload/download
CREATE TABLE IF NOT EXISTS dokumen_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dokumen_id INT NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    aksi ENUM('upload', 'download', 'delete', 'view') NOT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dokumen_id) REFERENCES dokumen(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_dokumen_id (dokumen_id),
    INDEX idx_user_id (user_id),
    INDEX idx_aksi (aksi),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- Insert sample data untuk testing (opsional)
INSERT IGNORE INTO dokumen (id, rujukan_id, nama_file, nama_asli, tipe_file, ukuran_file, path_file, deskripsi, kategori, uploaded_by) VALUES 
(1, 1, 'hasil_lab_001.pdf', 'Hasil Laboratorium Pasien.pdf', 'application/pdf', 1024000, 'uploads/dokumen/hasil_lab_001.pdf', 'Hasil pemeriksaan laboratorium darah lengkap', 'hasil_lab', 1),
(2, 1, 'rontgen_001.jpg', 'Foto Rontgen Dada.jpg', 'image/jpeg', 2048000, 'uploads/dokumen/rontgen_001.jpg', 'Foto rontgen dada pasien', 'rontgen', 1);

-- Show tables yang berhasil dibuat
SHOW TABLES LIKE '%dokumen%';

-- Show table structure
DESCRIBE dokumen;
DESCRIBE dokumen_logs;

-- Show sample data
SELECT 
    d.id,
    d.nama_asli,
    d.kategori,
    d.tipe_file,
    d.ukuran_file,
    d.created_at,
    r.nomor_rujukan,
    u.nama_lengkap as uploaded_by_name
FROM dokumen d
LEFT JOIN rujukan r ON d.rujukan_id = r.id
LEFT JOIN users u ON d.uploaded_by = u.id
ORDER BY d.created_at DESC
LIMIT 5;
