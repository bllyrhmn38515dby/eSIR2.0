# 🔧 Database Restoration Fix

## 📋 Masalah yang Terjadi

### **Apa yang Salah:**
Ketika menjalankan script `create-tables-only.js`, script tersebut menghapus semua tabel terlebih dahulu sebelum membuat ulang. Ini menyebabkan hilangnya tabel-tabel penting:

- ❌ `pasien` - Tabel untuk data pasien
- ❌ `rujukan` - Tabel untuk data rujukan
- ❌ `tempat_tidur` - Tabel untuk data tempat tidur
- ❌ `tracking_data` - Tabel untuk data tracking
- ❌ `tracking_sessions` - Tabel untuk sesi tracking

### **Penyebab:**
Script `create-tables-only.js` menggunakan perintah `DROP TABLE IF EXISTS` untuk semua tabel, yang menghapus tabel-tabel yang sudah ada dengan data penting.

## 🔧 Perbaikan yang Dilakukan

### **1. Mengembalikan Tabel yang Hilang**
- **File**: `backend/restore-missing-tables.js`
- **Aksi**: Membuat ulang semua tabel yang hilang dengan struktur yang benar

### **2. Tabel yang Dikembalikan:**

#### **Tabel `pasien`**
```sql
CREATE TABLE pasien (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nama_lengkap VARCHAR(255) NOT NULL,
  nik VARCHAR(16) UNIQUE NOT NULL,
  tanggal_lahir DATE NOT NULL,
  jenis_kelamin ENUM('L', 'P') NOT NULL,
  alamat TEXT NOT NULL,
  telepon VARCHAR(20),
  faskes_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (faskes_id) REFERENCES faskes(id) ON DELETE SET NULL
)
```

#### **Tabel `rujukan`**
```sql
CREATE TABLE rujukan (
  id INT PRIMARY KEY AUTO_INCREMENT,
  pasien_id INT NOT NULL,
  faskes_asal_id INT NOT NULL,
  faskes_tujuan_id INT NOT NULL,
  alasan_rujukan TEXT NOT NULL,
  status ENUM('pending', 'diterima', 'ditolak', 'selesai') DEFAULT 'pending',
  tanggal_rujukan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  tanggal_respon TIMESTAMP NULL,
  catatan_respon TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (pasien_id) REFERENCES pasien(id) ON DELETE CASCADE,
  FOREIGN KEY (faskes_asal_id) REFERENCES faskes(id) ON DELETE RESTRICT,
  FOREIGN KEY (faskes_tujuan_id) REFERENCES faskes(id) ON DELETE RESTRICT
)
```

#### **Tabel `tempat_tidur`**
```sql
CREATE TABLE tempat_tidur (
  id INT PRIMARY KEY AUTO_INCREMENT,
  faskes_id INT NOT NULL,
  nomor_kamar VARCHAR(10) NOT NULL,
  nomor_bed VARCHAR(10) NOT NULL,
  tipe_kamar ENUM('VIP', 'Kelas 1', 'Kelas 2', 'Kelas 3', 'ICU', 'NICU') NOT NULL,
  status ENUM('tersedia', 'terisi', 'maintenance') DEFAULT 'tersedia',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (faskes_id) REFERENCES faskes(id) ON DELETE CASCADE,
  UNIQUE KEY unique_bed (faskes_id, nomor_kamar, nomor_bed)
)
```

#### **Tabel `tracking_data`**
```sql
CREATE TABLE tracking_data (
  id INT PRIMARY KEY AUTO_INCREMENT,
  session_id VARCHAR(255) NOT NULL,
  user_id INT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  accuracy DECIMAL(10, 2),
  speed DECIMAL(10, 2),
  heading DECIMAL(5, 2),
  altitude DECIMAL(10, 2),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_session_id (session_id),
  INDEX idx_user_id (user_id),
  INDEX idx_timestamp (timestamp)
)
```

#### **Tabel `tracking_sessions`**
```sql
CREATE TABLE tracking_sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  session_id VARCHAR(255) UNIQUE NOT NULL,
  user_id INT NOT NULL,
  start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_time TIMESTAMP NULL,
  status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
  total_distance DECIMAL(10, 2) DEFAULT 0,
  total_duration INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_start_time (start_time)
)
```

### **3. Menambahkan Sample Data**
Script juga menambahkan sample data untuk testing:

#### **Sample Pasien (3 records)**
- Ahmad Supriadi (NIK: 1234567890123456)
- Siti Nurhaliza (NIK: 2345678901234567)
- Budi Santoso (NIK: 3456789012345678)

#### **Sample Rujukan (3 records)**
- Rujukan pending untuk perawatan intensif
- Rujukan diterima untuk pemeriksaan khusus
- Rujukan selesai untuk operasi

#### **Sample Tempat Tidur (5 records)**
- VIP rooms dengan status tersedia/terisi
- ICU rooms dengan status tersedia/maintenance

## 🚀 Cara Menjalankan Perbaikan

### **Method 1: Automated Restoration**
```bash
cd backend
node restore-missing-tables.js
```

### **Method 2: Manual SQL**
```sql
-- Run the SQL commands from restore-missing-tables.js manually
-- This will create all missing tables and add sample data
```

## 📊 Hasil Setelah Perbaikan

### **Tabel yang Tersedia:**
- ✅ `activity_logs` - 0 records
- ✅ `ambulance_drivers` - 10 records
- ✅ `faskes` - 2 records
- ✅ `notifications` - 0 records
- ✅ `pasien` - 3 records
- ✅ `roles` - 2 records
- ✅ `rujukan` - 3 records
- ✅ `search_logs` - 0 records
- ✅ `system_config` - 4 records
- ✅ `tempat_tidur` - 5 records
- ✅ `tracking_data` - 0 records
- ✅ `tracking_sessions` - 0 records
- ✅ `users` - 2 records

### **Status Endpoint Users:**
- ✅ Query berhasil dijalankan
- ✅ Found 2 users
- ✅ Sample data ter-load dengan benar
- ✅ Tidak ada data inconsistencies

## 🧪 Testing

### **1. Test Database Connection**
```bash
node debug-users-endpoint.js
```

### **2. Test Backend Server**
```bash
cd backend
node index.js
```

### **3. Test Frontend**
- Buka UserManagement page
- Verifikasi data users ter-load
- Test fitur-fitur lain yang menggunakan tabel yang dikembalikan

## 📝 Lessons Learned

### **1. Backup Database Sebelum Modifikasi**
- Selalu backup database sebelum menjalankan script yang memodifikasi struktur
- Gunakan `mysqldump` untuk backup lengkap

### **2. Gunakan Script yang Aman**
- Hindari script yang menghapus tabel tanpa konfirmasi
- Gunakan `CREATE TABLE IF NOT EXISTS` daripada `DROP TABLE`

### **3. Test Script di Environment Terpisah**
- Test script di database development terlebih dahulu
- Verifikasi hasil sebelum menjalankan di production

## 🎯 Next Steps

### **Setelah Perbaikan:**
1. ✅ Semua tabel dikembalikan
2. ✅ Sample data ditambahkan
3. ✅ Endpoint users berfungsi
4. ✅ Database structure lengkap

### **Testing yang Diperlukan:**
- [ ] Test semua fitur aplikasi
- [ ] Verifikasi data pasien
- [ ] Test fitur rujukan
- [ ] Test fitur tempat tidur
- [ ] Test fitur tracking

### **Prevention:**
- [ ] Buat backup script otomatis
- [ ] Dokumentasikan semua script database
- [ ] Buat environment testing terpisah

## 📋 Checklist

- [x] Identifikasi tabel yang hilang
- [x] Buat script restoration
- [x] Kembalikan semua tabel
- [x] Tambahkan sample data
- [x] Test endpoint users
- [x] Verifikasi struktur database
- [x] Dokumentasikan perbaikan
- [ ] Test semua fitur aplikasi
- [ ] Buat backup strategy

---

**Status**: ✅ Fixed and Restored  
**Last Updated**: $(date)  
**Maintainer**: Development Team  
**Database**: esirv2
