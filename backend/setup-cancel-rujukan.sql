-- Setup Cancel Rujukan untuk eSIR 2.0
-- Database: esirv2

-- Update tabel rujukan untuk menambahkan status 'dibatalkan'
ALTER TABLE rujukan 
MODIFY COLUMN status ENUM('pending', 'diterima', 'ditolak', 'selesai', 'dibatalkan') DEFAULT 'pending';

-- Tambahkan kolom alasan_pembatalan jika belum ada
ALTER TABLE rujukan 
ADD COLUMN IF NOT EXISTS alasan_pembatalan TEXT NULL AFTER catatan_tujuan;

-- Tambahkan kolom tanggal_pembatalan jika belum ada
ALTER TABLE rujukan 
ADD COLUMN IF NOT EXISTS tanggal_pembatalan TIMESTAMP NULL AFTER tanggal_respon;

-- Tambahkan index untuk status dibatalkan
CREATE INDEX IF NOT EXISTS idx_status_dibatalkan ON rujukan(status) WHERE status = 'dibatalkan';

-- Show updated table structure
DESCRIBE rujukan;

-- Show sample data dengan status baru
SELECT id, nomor_rujukan, status, tanggal_rujukan, tanggal_respon, tanggal_pembatalan 
FROM rujukan 
ORDER BY tanggal_rujukan DESC 
LIMIT 5;
