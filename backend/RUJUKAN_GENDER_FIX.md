# Perbaikan Jenis Kelamin pada Halaman Rujukan Enhanced

## Masalah yang Ditemukan
Pada halaman rujukan enhanced, jenis kelamin yang ditampilkan pada tabel rujukan tidak sesuai karena field `jenis_kelamin` tidak diambil dari database pada query API.

## Analisis Masalah
1. **Frontend**: Logika penampilan jenis kelamin sudah benar di `EnhancedRujukanPage.js` baris 393:
   ```javascript
   {item.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
   ```

2. **Backend**: Query API di `backend/routes/rujukan.js` tidak mengambil field `jenis_kelamin` dari tabel pasien:
   ```sql
   SELECT r.*, 
          p.nama_pasien as nama_pasien, p.nik as nik_pasien,
          -- Field jenis_kelamin tidak diambil
   ```

## Solusi yang Diterapkan

### 1. **Memperbaiki Query API**
Menambahkan field `jenis_kelamin` pada semua query yang mengambil data rujukan:

**Sebelum:**
```sql
SELECT r.*, 
       p.nama_pasien as nama_pasien, p.nik as nik_pasien,
       fa.nama_faskes as faskes_asal_nama,
       ft.nama_faskes as faskes_tujuan_nama,
       u.nama_lengkap as user_nama
```

**Sesudah:**
```sql
SELECT r.*, 
       p.nama_pasien as nama_pasien, p.nik as nik_pasien, p.jenis_kelamin as jenis_kelamin,
       fa.nama_faskes as faskes_asal_nama,
       ft.nama_faskes as faskes_tujuan_nama,
       u.nama_lengkap as user_nama
```

### 2. **Endpoint yang Diperbaiki**
- `GET /api/rujukan` - Mengambil semua rujukan
- `GET /api/rujukan/:id` - Mengambil rujukan berdasarkan ID
- `POST /api/rujukan/with-pasien` - Membuat rujukan baru dengan data pasien
- `POST /api/rujukan` - Membuat rujukan baru (backward compatibility)
- `PUT /api/rujukan/:id/status` - Update status rujukan
- `PUT /api/rujukan/:id/cancel` - Membatalkan rujukan

### 3. **Struktur Data yang Dikembalikan**
Sekarang API mengembalikan data dengan struktur:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nomor_rujukan": "RJ20241201001",
      "nama_pasien": "Ahmad Susanto",
      "nik_pasien": "1234567890123456",
      "jenis_kelamin": "L",  // Field baru yang ditambahkan
      "faskes_asal_nama": "Puskesmas Jakarta",
      "faskes_tujuan_nama": "RS Jantung Harapan",
      "diagnosa": "Sakit jantung",
      "status": "pending",
      "tanggal_rujukan": "2024-12-01T10:00:00.000Z"
    }
  ]
}
```

## File yang Dimodifikasi
- `backend/routes/rujukan.js` - Menambahkan field `jenis_kelamin` pada semua query

## Cara Menguji
1. Restart server backend
2. Buka halaman Enhanced Rujukan di frontend
3. Periksa tabel rujukan - jenis kelamin sekarang harus menampilkan "Laki-laki" atau "Perempuan" dengan benar

## Status
✅ **Masalah telah diperbaiki**
✅ **Semua endpoint API telah diupdate**
✅ **Server backend telah di-restart**

## Catatan Teknis
- Perubahan ini backward compatible
- Tidak ada perubahan pada struktur database
- Frontend tidak memerlukan perubahan karena logika sudah benar
- Field `jenis_kelamin` menggunakan format 'L' untuk Laki-laki dan 'P' untuk Perempuan
