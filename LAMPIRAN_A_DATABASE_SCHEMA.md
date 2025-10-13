# LAMPIRAN A: DATABASE SCHEMA

## A.1 Tabel Spesialisasi

```sql
-- Tabel untuk menyimpan data spesialisasi medis
CREATE TABLE IF NOT EXISTS spesialisasi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_spesialisasi VARCHAR(100) NOT NULL UNIQUE,
    deskripsi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Penjelasan:**
- `id`: Primary key auto increment
- `nama_spesialisasi`: Nama spesialisasi medis (contoh: "Bedah Umum", "Kardiologi")
- `deskripsi`: Deskripsi singkat tentang spesialisasi
- `created_at`: Timestamp pembuatan record
- `updated_at`: Timestamp update terakhir

## A.2 Tabel Relasi Faskes-Spesialisasi

```sql
-- Tabel relasi many-to-many antara faskes dan spesialisasi
CREATE TABLE IF NOT EXISTS faskes_spesialisasi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    faskes_id INT NOT NULL,
    spesialisasi_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (faskes_id) REFERENCES faskes(id) ON DELETE CASCADE,
    FOREIGN KEY (spesialisasi_id) REFERENCES spesialisasi(id) ON DELETE CASCADE,
    UNIQUE KEY unique_faskes_spesialisasi (faskes_id, spesialisasi_id)
);
```

**Penjelasan:**
- `faskes_id`: Foreign key ke tabel faskes
- `spesialisasi_id`: Foreign key ke tabel spesialisasi
- `UNIQUE KEY`: Mencegah duplikasi relasi faskes-spesialisasi
- `ON DELETE CASCADE`: Jika faskes atau spesialisasi dihapus, relasi juga terhapus

## A.3 Data Sample Spesialisasi

```sql
-- Insert data spesialisasi medis
INSERT INTO spesialisasi (nama_spesialisasi, deskripsi) VALUES
('Bedah Umum', 'Layanan operasi bedah umum'),
('Bedah Jantung', 'Layanan operasi jantung dan pembuluh darah'),
('Bedah Saraf', 'Layanan operasi saraf dan otak'),
('Bedah Ortopedi', 'Layanan operasi tulang dan sendi'),
('Kardiologi', 'Layanan penyakit jantung dan pembuluh darah'),
('Neurologi', 'Layanan penyakit saraf dan otak'),
('Pulmonologi', 'Layanan penyakit paru-paru dan pernapasan'),
('Gastroenterologi', 'Layanan penyakit pencernaan'),
('Nefrologi', 'Layanan penyakit ginjal'),
('Endokrinologi', 'Layanan penyakit kelenjar dan hormon'),
('Dermatologi', 'Layanan penyakit kulit'),
('Oftalmologi', 'Layanan penyakit mata'),
('THT', 'Layanan penyakit telinga, hidung, dan tenggorokan'),
('Urologi', 'Layanan penyakit saluran kemih'),
('Ginekologi', 'Layanan kesehatan wanita'),
('Pediatri', 'Layanan kesehatan anak'),
('Psikiatri', 'Layanan kesehatan jiwa'),
('Anestesiologi', 'Layanan anestesi dan perawatan intensif'),
('Radiologi', 'Layanan pencitraan medis'),
('Patologi', 'Layanan pemeriksaan laboratorium'),
('Fisioterapi', 'Layanan rehabilitasi medis'),
('ICU', 'Layanan perawatan intensif'),
('NICU', 'Layanan perawatan intensif neonatus'),
('PICU', 'Layanan perawatan intensif pediatrik');
```

## A.4 Query untuk Assign Spesialisasi ke Faskes

```sql
-- Assign spesialisasi ke RSUD (memiliki banyak spesialisasi)
INSERT INTO faskes_spesialisasi (faskes_id, spesialisasi_id)
SELECT f.id, s.id 
FROM faskes f, spesialisasi s 
WHERE f.tipe = 'RSUD' 
AND s.nama_spesialisasi IN (
    'Bedah Umum', 'Kardiologi', 'Neurologi', 'Pulmonologi', 
    'Gastroenterologi', 'Nefrologi', 'Endokrinologi', 'Dermatologi',
    'Oftalmologi', 'THT', 'Urologi', 'Ginekologi', 'Pediatri',
    'Psikiatri', 'Anestesiologi', 'Radiologi', 'Patologi', 'ICU'
);

-- Assign spesialisasi ke RS Swasta (spesialisasi terbatas)
INSERT INTO faskes_spesialisasi (faskes_id, spesialisasi_id)
SELECT f.id, s.id 
FROM faskes f, spesialisasi s 
WHERE f.tipe = 'RS Swasta' 
AND s.nama_spesialisasi IN (
    'Bedah Umum', 'Kardiologi', 'Pulmonologi', 'Ginekologi', 
    'Pediatri', 'Radiologi', 'ICU'
);

-- Assign spesialisasi ke Puskesmas (layanan dasar)
INSERT INTO faskes_spesialisasi (faskes_id, spesialisasi_id)
SELECT f.id, s.id 
FROM faskes f, spesialisasi s 
WHERE f.tipe = 'Puskesmas' 
AND s.nama_spesialisasi IN (
    'Bedah Umum', 'Pediatri', 'Fisioterapi'
);

-- Assign spesialisasi ke Klinik (layanan terbatas)
INSERT INTO faskes_spesialisasi (faskes_id, spesialisasi_id)
SELECT f.id, s.id 
FROM faskes f, spesialisasi s 
WHERE f.tipe = 'Klinik' 
AND s.nama_spesialisasi IN (
    'Bedah Umum', 'Pediatri'
);
```

## A.5 Query untuk Pencarian Spesialisasi

```sql
-- Query untuk pencarian faskes berdasarkan spesialisasi
SELECT DISTINCT
    f.id,
    f.nama_faskes,
    f.tipe as tipe_faskes,
    f.alamat,
    f.telepon,
    f.latitude,
    f.longitude,
    GROUP_CONCAT(s.nama_spesialisasi SEPARATOR ', ') as spesialisasi,
    COUNT(DISTINCT s.id) as jumlah_spesialisasi
FROM faskes f
LEFT JOIN faskes_spesialisasi fs ON f.id = fs.faskes_id
LEFT JOIN spesialisasi s ON fs.spesialisasi_id = s.id
WHERE s.nama_spesialisasi LIKE '%Bedah%'
GROUP BY f.id, f.nama_faskes, f.tipe, f.alamat, f.telepon, f.latitude, f.longitude
ORDER BY f.nama_faskes
LIMIT 20;
```

## A.6 Query untuk Autocomplete Spesialisasi

```sql
-- Query untuk autocomplete spesialisasi
SELECT 
    s.id,
    s.nama_spesialisasi as label,
    s.deskripsi as subtitle,
    s.nama_spesialisasi as display_text,
    COUNT(fs.faskes_id) as jumlah_faskes
FROM spesialisasi s
LEFT JOIN faskes_spesialisasi fs ON s.id = fs.spesialisasi_id
WHERE s.nama_spesialisasi LIKE '%Bed%'
GROUP BY s.id, s.nama_spesialisasi, s.deskripsi
ORDER BY jumlah_faskes DESC, s.nama_spesialisasi
LIMIT 10;
```

## A.7 Verifikasi Data

```sql
-- Cek total spesialisasi
SELECT COUNT(*) as total_spesialisasi FROM spesialisasi;

-- Cek total relasi faskes-spesialisasi
SELECT COUNT(*) as total_relasi FROM faskes_spesialisasi;

-- Cek distribusi spesialisasi per tipe faskes
SELECT 
    f.tipe,
    COUNT(DISTINCT fs.spesialisasi_id) as jumlah_spesialisasi
FROM faskes f
LEFT JOIN faskes_spesialisasi fs ON f.id = fs.faskes_id
GROUP BY f.tipe
ORDER BY jumlah_spesialisasi DESC;
```

## A.8 Indeks untuk Optimasi

```sql
-- Indeks untuk optimasi pencarian
CREATE INDEX idx_spesialisasi_nama ON spesialisasi(nama_spesialisasi);
CREATE INDEX idx_faskes_spesialisasi_faskes ON faskes_spesialisasi(faskes_id);
CREATE INDEX idx_faskes_spesialisasi_spesialisasi ON faskes_spesialisasi(spesialisasi_id);
CREATE INDEX idx_faskes_tipe ON faskes(tipe);
```

**Hasil Verifikasi:**
- Total spesialisasi: 24
- Total relasi faskes-spesialisasi: 131
- RSUD memiliki 18 spesialisasi
- RS Swasta memiliki 7 spesialisasi
- Puskesmas memiliki 3 spesialisasi
- Klinik memiliki 2 spesialisasi
