# 🚑 Panduan Testing GPS Tracking Performance eSIR 2.0

## 📋 Overview

Dokumen ini menjelaskan cara menguji performa GPS tracking pada aplikasi eSIR 2.0 berdasarkan tiga kriteria utama:

1. **GPS Akurat (< 20 meter)**
2. **Update Lokasi Cepat (< 5 detik)**
3. **Estimasi Waktu (ETA) Mendekati Waktu Nyata (> 80% akurasi)**

## 🛠️ Persiapan Testing

### 1. Prerequisites
- Node.js terinstall
- Aplikasi backend eSIR 2.0 berjalan di `http://localhost:3001`
- Database MySQL terisi dengan data sample
- Akses internet untuk testing GPS

### 2. Install Dependencies
```bash
npm install axios
```

### 3. Pastikan Server Berjalan
```bash
cd backend
npm start
```

## 🧪 Jenis Testing

### 1. Quick Test (Cepat)
**File:** `test-gps-quick.js`
**Durasi:** ~2-3 menit
**Kegunaan:** Testing dasar untuk memastikan sistem berfungsi

**Cara Menjalankan:**
```bash
node test-gps-quick.js
```

**Atau menggunakan batch file:**
```bash
run-gps-test.bat
# Pilih opsi 3
```

### 2. Manual Test (Interaktif)
**File:** `test-gps-manual.js`
**Durasi:** ~10-15 menit
**Kegunaan:** Testing dengan input manual koordinat GPS

**Cara Menjalankan:**
```bash
node test-gps-manual.js
```

**Atau menggunakan batch file:**
```bash
run-gps-test.bat
# Pilih opsi 2
```

### 3. Automated Test (Otomatis)
**File:** `test-gps-tracking-performance.js`
**Durasi:** ~8-10 menit
**Kegunaan:** Testing komprehensif dengan simulasi perjalanan

**Cara Menjalankan:**
```bash
node test-gps-tracking-performance.js
```

**Atau menggunakan batch file:**
```bash
run-gps-test.bat
# Pilih opsi 1
```

## 📊 Kriteria Testing

### 1. GPS Accuracy (< 20 meter)
**Target:** ≥ 80% akurasi dalam 5 meter
**Metode Testing:**
- Simulasi koordinat GPS dengan akurasi 5-20 meter
- Validasi response dari API tracking
- Perhitungan persentase akurasi

**Contoh Output:**
```
📍 GPS ACCURACY (< 20m)
   Akurasi: 85.0% (17/20)
   Status: ✅ PASS
```

### 2. Update Speed (< 5 detik)
**Target:** ≥ 90% update dalam 5 detik
**Metode Testing:**
- Pengukuran waktu response API
- Multiple update berturut-turut
- Perhitungan rata-rata waktu update

**Contoh Output:**
```
⚡ UPDATE SPEED (< 5 detik)
   Kecepatan: 95.0% (19/20)
   Rata-rata: 1200ms
   Status: ✅ PASS
```

### 3. ETA Accuracy (> 80%)
**Target:** ≥ 80% akurasi estimasi waktu
**Metode Testing:**
- Simulasi perjalanan dengan koordinat berubah
- Perbandingan ETA vs waktu nyata
- Perhitungan akurasi estimasi

**Contoh Output:**
```
⏰ ETA ACCURACY (> 80%)
   Akurasi: 85.0% (17/20)
   Rata-rata: 87.5%
   Status: ✅ PASS
```

## 🔧 Konfigurasi Testing

### File Konfigurasi
Setiap script testing memiliki konfigurasi yang dapat disesuaikan:

```javascript
const TEST_CONFIG = {
  baseURL: 'http://localhost:3001',
  testDuration: 300000, // 5 menit
  updateInterval: 5000, // 5 detik
  accuracyThreshold: 20, // meter
  updateTimeThreshold: 5000, // 5 detik
  etaAccuracyThreshold: 0.8, // 80% akurasi
  testCoordinates: [
    { lat: -6.5971, lng: 106.8060, name: 'Bogor' },
    { lat: -6.2088, lng: 106.8456, name: 'Jakarta' },
    { lat: -6.9175, lng: 107.6191, name: 'Bandung' },
    { lat: -7.7971, lng: 110.3708, name: 'Yogyakarta' }
  ]
};
```

### Koordinat Testing
Koordinat yang digunakan untuk testing berada di area Jawa Barat:
- **Bogor:** -6.5971, 106.8060
- **Jakarta:** -6.2088, 106.8456
- **Bandung:** -6.9175, 107.6191
- **Yogyakarta:** -7.7971, 110.3708

## 📈 Interpretasi Hasil

### Status PASS/FAIL
- **PASS:** Memenuhi kriteria minimum
- **FAIL:** Tidak memenuhi kriteria minimum

### Kriteria Overall PASS
Aplikasi dianggap PASS jika memenuhi semua kriteria:
- GPS Accuracy ≥ 80%
- Update Speed ≥ 90%
- ETA Accuracy ≥ 80%

### Contoh Hasil Lengkap
```
============================================================
📊 HASIL TESTING GPS TRACKING PERFORMANCE
============================================================

📍 GPS ACCURACY (< 20m)
   Akurasi: 85.0% (17/20)
   Status: ✅ PASS

⚡ UPDATE SPEED (< 5 detik)
   Kecepatan: 95.0% (19/20)
   Rata-rata: 1200ms
   Status: ✅ PASS

⏰ ETA ACCURACY (> 80%)
   Akurasi: 85.0% (17/20)
   Rata-rata: 87.5%
   Status: ✅ PASS

🎯 OVERALL RESULT
   Status: ✅ PASS
   Errors: 0
   Duration: 300 detik
```

## 🐛 Troubleshooting

### Error Umum

#### 1. Login Gagal
```
❌ Login gagal: Invalid credentials
```
**Solusi:**
- Pastikan server backend berjalan
- Cek kredensial admin (username: admin, password: admin123)
- Pastikan database terisi dengan data user

#### 2. Rujukan Tidak Ditemukan
```
❌ Gagal membuat rujukan: Data pasien atau faskes tidak cukup
```
**Solusi:**
- Jalankan script setup database
- Pastikan ada data pasien dan faskes minimal 2
- Cek koneksi database

#### 3. Session Tracking Gagal
```
❌ Gagal memulai session: Session token tidak valid
```
**Solusi:**
- Pastikan rujukan status 'pending' atau 'diterima'
- Cek permission user untuk tracking
- Restart server jika diperlukan

#### 4. GPS Coordinates Invalid
```
❌ Koordinat di luar area Jawa Barat
```
**Solusi:**
- Gunakan koordinat dalam range yang valid
- Update konfigurasi koordinat jika diperlukan

### Debug Mode
Untuk debugging lebih detail, tambahkan log di script:

```javascript
console.log('Debug info:', {
  sessionToken,
  rujukanId,
  coordinates: { lat, lng },
  response: response.data
});
```

## 📝 Log dan Reporting

### File Output
Hasil testing otomatis disimpan dalam file JSON:
```
gps-test-results-2024-01-15T10-30-45-123Z.json
```

### Format Log
```json
{
  "gpsAccuracy": [...],
  "updateSpeed": [...],
  "etaAccuracy": [...],
  "errors": [...],
  "summary": {
    "gpsAccuracy": { "rate": 85.0, "accurate": 17, "total": 20 },
    "updateSpeed": { "rate": 95.0, "fast": 19, "total": 20, "averageTime": 1200 },
    "etaAccuracy": { "rate": 85.0, "accurate": 17, "total": 20, "averageAccuracy": 0.875 },
    "errors": 0,
    "testDuration": 300,
    "timestamp": "2024-01-15T10:30:45.123Z"
  }
}
```

## 🔄 Continuous Testing

### Automated Testing
Untuk testing berkelanjutan, gunakan cron job atau CI/CD:

```bash
# Setiap jam
0 * * * * cd /path/to/esir2.0 && node test-gps-quick.js >> logs/gps-test.log 2>&1

# Setiap hari jam 2 pagi
0 2 * * * cd /path/to/esir2.0 && node test-gps-tracking-performance.js >> logs/gps-full-test.log 2>&1
```

### Monitoring Dashboard
Hasil testing dapat diintegrasikan dengan monitoring dashboard untuk tracking performa secara real-time.

## 📞 Support

Jika mengalami masalah dalam testing:

1. **Cek Log Server:** `backend/logs/`
2. **Cek Database:** Pastikan semua tabel terisi
3. **Cek Network:** Pastikan koneksi internet stabil
4. **Restart Services:** Restart backend dan database jika diperlukan

## 🎯 Kesimpulan

Testing GPS tracking performance sangat penting untuk memastikan aplikasi eSIR 2.0 berfungsi dengan baik dalam kondisi nyata. Gunakan panduan ini untuk melakukan testing yang komprehensif dan mendapatkan hasil yang akurat.
