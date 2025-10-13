# Fitur Pencarian Rumah Sakit Berdasarkan Spesialisasi

## 🎯 Overview
Fitur pencarian rumah sakit berdasarkan spesialisasi telah berhasil diimplementasikan di aplikasi eSIR2.0. Sekarang pengguna dapat mencari rumah sakit berdasarkan spesialisasi medis yang tersedia, seperti "Bedah", "Jantung", "Paru", dll.

## 🚀 Fitur yang Diimplementasikan

### 1. **Database Schema**
- ✅ Tabel `spesialisasi` - Menyimpan daftar spesialisasi medis
- ✅ Tabel `faskes_spesialisasi` - Relasi many-to-many antara faskes dan spesialisasi
- ✅ 24 spesialisasi medis telah diisi (Bedah Umum, Kardiologi, Neurologi, dll)
- ✅ 131 relasi faskes-spesialisasi telah dibuat

### 2. **Backend API**
- ✅ **Global Search**: `/api/search/global?query=Bedah&type=faskes`
- ✅ **Advanced Search**: `/api/search/faskes?spesialisasi=Bedah&tipe=RSUD`
- ✅ **Autocomplete**: `/api/search/autocomplete/spesialisasi?query=Bed`

### 3. **Frontend UI**
- ✅ Filter spesialisasi dengan autocomplete di halaman pencarian
- ✅ Tampilan spesialisasi dalam bentuk tags di hasil pencarian
- ✅ Responsive design untuk mobile dan desktop

## 📊 Data Spesialisasi yang Tersedia

| No | Spesialisasi | Deskripsi |
|----|-------------|-----------|
| 1 | Bedah Umum | Layanan operasi bedah umum |
| 2 | Bedah Jantung | Layanan operasi jantung dan pembuluh darah |
| 3 | Bedah Saraf | Layanan operasi saraf dan otak |
| 4 | Bedah Ortopedi | Layanan operasi tulang dan sendi |
| 5 | Kardiologi | Layanan penyakit jantung dan pembuluh darah |
| 6 | Neurologi | Layanan penyakit saraf dan otak |
| 7 | Pulmonologi | Layanan penyakit paru-paru dan pernapasan |
| 8 | Gastroenterologi | Layanan penyakit pencernaan |
| 9 | Nefrologi | Layanan penyakit ginjal |
| 10 | Endokrinologi | Layanan penyakit kelenjar dan hormon |
| 11 | Dermatologi | Layanan penyakit kulit |
| 12 | Oftalmologi | Layanan penyakit mata |
| 13 | THT | Layanan penyakit telinga, hidung, dan tenggorokan |
| 14 | Urologi | Layanan penyakit saluran kemih |
| 15 | Ginekologi | Layanan kesehatan wanita |
| 16 | Pediatri | Layanan kesehatan anak |
| 17 | Psikiatri | Layanan kesehatan jiwa |
| 18 | Anestesiologi | Layanan anestesi dan perawatan intensif |
| 19 | Radiologi | Layanan pencitraan medis |
| 20 | Patologi | Layanan pemeriksaan laboratorium |
| 21 | Fisioterapi | Layanan rehabilitasi medis |
| 22 | ICU | Layanan perawatan intensif |
| 23 | NICU | Layanan perawatan intensif neonatus |
| 24 | PICU | Layanan perawatan intensif pediatrik |

## 🔍 Cara Menggunakan

### 1. **Pencarian Global**
1. Buka halaman pencarian
2. Pilih tab "Global"
3. Ketik "Bedah" di kolom pencarian
4. Pilih "Faskes" di dropdown tipe
5. Klik "Cari"

### 2. **Pencarian Advanced**
1. Buka halaman pencarian
2. Pilih tab "Faskes"
3. Isi filter:
   - **Tipe Faskes**: Pilih RSUD, RS Swasta, Puskesmas, atau Klinik
   - **Spesialisasi**: Ketik "Jantung" (akan muncul autocomplete)
   - **Alamat**: Opsional
4. Klik "Cari"

### 3. **Autocomplete Spesialisasi**
- Ketik minimal 2 karakter di field spesialisasi
- Pilih dari daftar saran yang muncul
- Menampilkan jumlah faskes yang tersedia untuk setiap spesialisasi

## 📱 Tampilan Hasil

### Desktop
- Tabel dengan kolom: Nama Faskes, Tipe, Alamat, Telepon, Spesialisasi, Jumlah Spesialisasi
- Spesialisasi ditampilkan dalam bentuk tags berwarna biru
- Maksimal 3 spesialisasi ditampilkan, sisanya ditampilkan sebagai "+X lainnya"

### Mobile
- Layout responsive dengan ukuran font dan padding yang disesuaikan
- Spesialisasi tags dengan ukuran yang lebih kecil
- Autocomplete dengan tinggi maksimal 150px

## 🧪 Testing

### Test Results
```
✅ Total spesialisasi: 24
✅ Total relasi faskes-spesialisasi: 131
✅ Pencarian "Bedah": 5 faskes ditemukan
✅ Autocomplete "Bed": 4 suggestions
✅ Global search "Bedah": 3 results
```

### Test Commands
```bash
# Test database dan fitur
cd backend
node test-spesialisasi-search.js

# Test API endpoints
curl -H "Authorization: Bearer <token>" \
  "http://localhost:5000/api/search/global?query=Bedah&type=faskes"

curl -H "Authorization: Bearer <token>" \
  "http://localhost:5000/api/search/faskes?spesialisasi=Bedah"

curl -H "Authorization: Bearer <token>" \
  "http://localhost:5000/api/search/autocomplete/spesialisasi?query=Bed"
```

## 🔧 Technical Details

### Database Queries
```sql
-- Pencarian faskes berdasarkan spesialisasi
SELECT DISTINCT
  f.id, f.nama_faskes, f.tipe, f.alamat, f.telepon,
  GROUP_CONCAT(s.nama_spesialisasi SEPARATOR ', ') as spesialisasi,
  COUNT(DISTINCT s.id) as jumlah_spesialisasi
FROM faskes f
LEFT JOIN faskes_spesialisasi fs ON f.id = fs.faskes_id
LEFT JOIN spesialisasi s ON fs.spesialisasi_id = s.id
WHERE s.nama_spesialisasi LIKE '%Bedah%'
GROUP BY f.id, f.nama_faskes, f.tipe, f.alamat, f.telepon
ORDER BY f.nama_faskes;
```

### API Response Format
```json
{
  "success": true,
  "data": {
    "facilities": [
      {
        "id": 1,
        "nama_faskes": "RSUD Kota Bogor",
        "tipe_faskes": "RSUD",
        "alamat": "Jl. Dr. Semeru No.120...",
        "telepon": "0251-8313084",
        "spesialisasi": "Bedah Umum, Kardiologi, Neurologi, ...",
        "jumlah_spesialisasi": 18
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "total_pages": 1
    }
  }
}
```

## 🎉 Kesimpulan

Fitur pencarian rumah sakit berdasarkan spesialisasi telah berhasil diimplementasikan dengan lengkap:

1. **Database**: Tabel dan relasi sudah dibuat dengan data sample
2. **Backend**: API endpoints sudah berfungsi dengan baik
3. **Frontend**: UI sudah responsive dan user-friendly
4. **Testing**: Semua fitur sudah ditest dan berfungsi

Pengguna sekarang dapat dengan mudah mencari rumah sakit berdasarkan spesialisasi medis yang dibutuhkan, seperti mencari "Rumah sakit dengan layanan bedah jantung" atau "Puskesmas dengan layanan pediatri".

## 📝 Next Steps (Opsional)

1. **Analytics**: Tambahkan tracking pencarian spesialisasi
2. **Rating**: Tambahkan rating untuk setiap spesialisasi di faskes
3. **Booking**: Integrasi dengan sistem booking berdasarkan spesialisasi
4. **Notification**: Notifikasi jika ada faskes baru dengan spesialisasi tertentu
