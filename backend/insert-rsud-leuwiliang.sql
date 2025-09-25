-- =====================================================
-- eSIR 2.0 - INSERT DATA RSUD LEUWILIANG
-- Database: prodsysesirv02
-- Tanggal: 2025-09-25
-- =====================================================

-- Insert data RSUD Leuwiliang
INSERT INTO faskes (nama_faskes, alamat, tipe, telepon, latitude, longitude) VALUES
(
    'RSUD Leuwiliang',
    'Jl. Raya Cibeber No.I, Cibeber I, Kec. Leuwiliang, Kabupaten Bogor, Jawa Barat 16640',
    'RSUD',
    '0251-8643290',
    -6.574579,
    106.627721
);

-- Verifikasi data yang baru ditambahkan
SELECT 
    id,
    nama_faskes,
    alamat,
    tipe,
    telepon,
    latitude,
    longitude,
    created_at
FROM faskes 
WHERE nama_faskes = 'RSUD Leuwiliang';

-- Update data jika sudah ada (optional)
-- UPDATE faskes SET 
--     alamat = 'Jl. Raya Cibeber No.I, Cibeber I, Kec. Leuwiliang, Kabupaten Bogor, Jawa Barat 16640',
--     tipe = 'RSUD',
--     telepon = '0251-8643290',
--     latitude = -6.574579,
--     longitude = 106.627721
-- WHERE nama_faskes = 'RSUD Leuwiliang';

-- =====================================================
-- INFORMASI KOORDINAT RSUD LEUWILIANG
-- =====================================================
-- Latitude: -6.574579
-- Longitude: 106.627721
-- Google Maps: https://www.google.com/maps?q=-6.574579,106.627721
-- 
-- Alamat Lengkap:
-- Jl. Raya Cibeber No.I, Cibeber I, Kec. Leuwiliang, 
-- Kabupaten Bogor, Jawa Barat 16640
-- 
-- Kontak:
-- Telepon: 0251-8643290
-- Fax: 0251-8643290
-- Email: rsudleuwiliang@bogorkab.go.id
-- Website: https://rsudleuwiliang.id/
-- =====================================================
