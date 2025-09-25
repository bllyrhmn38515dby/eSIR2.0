# Data RSUD Leuwiliang - eSIR 2.0

## Informasi Umum
- **Nama**: RSUD Leuwiliang
- **Tipe**: RSUD (Rumah Sakit Umum Daerah)
- **ID Database**: 26

## Alamat Lengkap
```
Jl. Raya Cibeber No.I, Cibeber I, Kec. Leuwiliang, 
Kabupaten Bogor, Jawa Barat 16640
```

## Kontak
- **Telepon**: 0251-8643290
- **Fax**: 0251-8643290
- **Email**: rsudleuwiliang@bogorkab.go.id
- **Website**: https://rsudleuwiliang.id/

## Koordinat Geografis
- **Latitude**: -6.574579
- **Longitude**: 106.627721
- **Google Maps**: https://www.google.com/maps?q=-6.574579,106.627721

## Informasi Tambahan
- **Luas Lahan**: 35.000 m²
- **Luas Bangunan**: 9.111,90 m²
- **Kapasitas Tempat Tidur**: 250 tempat tidur
- **Jumlah Layanan Spesialis**: 21 layanan
- **Status**: Rumah sakit milik pemerintah

## Cara Menambahkan ke Database

### 1. Menggunakan Script Node.js
```bash
cd backend
node add-rsud-leuwiliang.js
```

### 2. Menggunakan Query SQL Manual
```sql
INSERT INTO faskes (nama_faskes, alamat, tipe, telepon, latitude, longitude) VALUES
(
    'RSUD Leuwiliang',
    'Jl. Raya Cibeber No.I, Cibeber I, Kec. Leuwiliang, Kabupaten Bogor, Jawa Barat 16640',
    'RSUD',
    '0251-8643290',
    -6.574579,
    106.627721
);
```

### 3. Menggunakan API Endpoint
```bash
POST /api/faskes
Content-Type: application/json
Authorization: Bearer <token>

{
    "nama_faskes": "RSUD Leuwiliang",
    "alamat": "Jl. Raya Cibeber No.I, Cibeber I, Kec. Leuwiliang, Kabupaten Bogor, Jawa Barat 16640",
    "tipe": "RSUD",
    "telepon": "0251-8643290",
    "latitude": -6.574579,
    "longitude": 106.627721
}
```

## Verifikasi Data
Untuk memverifikasi bahwa data telah berhasil ditambahkan:

```sql
SELECT * FROM faskes WHERE nama_faskes = 'RSUD Leuwiliang';
```

## File yang Dibuat
1. `backend/add-rsud-leuwiliang.js` - Script Node.js untuk menambahkan data
2. `backend/insert-rsud-leuwiliang.sql` - Query SQL manual
3. `backend/rsud-leuwiliang-data.md` - Dokumentasi ini

## Status
✅ **Data berhasil ditambahkan ke database dengan ID: 26**
✅ **Koordinat geografis telah diverifikasi**
✅ **Script dan dokumentasi telah dibuat**
