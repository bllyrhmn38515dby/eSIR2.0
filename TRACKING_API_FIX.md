# 🔧 Perbaikan Tracking API - Error 500 & 404

## 🎯 Masalah yang Ditemukan

### **Error 500 Internal Server Error**
- **Endpoint**: `/api/tracking/start-session`
- **Penyebab**: Tabel `tracking_sessions` dan `tracking_data` tidak ada di database
- **Dampak**: Tidak bisa memulai tracking session

### **Error 404 Not Found**
- **Endpoint**: `/api/tracking/session/19`
- **Penyebab**: Tabel tracking tidak ada, sehingga query gagal
- **Dampak**: Tidak bisa cek session tracking yang ada

## ✅ Solusi yang Diterapkan

### 1. **📋 Membuat Tabel Tracking**
```sql
-- Tabel tracking_sessions
CREATE TABLE tracking_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rujukan_id INT NOT NULL,
  user_id INT NOT NULL,
  device_id VARCHAR(255),
  session_token VARCHAR(64) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (rujukan_id) REFERENCES rujukan(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabel tracking_data
CREATE TABLE tracking_data (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rujukan_id INT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  status ENUM('menunggu', 'dijemput', 'dalam_perjalanan', 'tiba') DEFAULT 'menunggu',
  estimated_time INT NULL,
  estimated_distance DECIMAL(8, 2) NULL,
  speed DECIMAL(5, 2) NULL,
  heading DECIMAL(5, 2) NULL,
  accuracy DECIMAL(8, 2) NULL,
  battery_level INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (rujukan_id) REFERENCES rujukan(id) ON DELETE CASCADE
);
```

### 2. **🔧 Script Setup Otomatis**
- **File**: `setup-tracking.js`
- **Fungsi**: Membuat tabel tracking secara otomatis
- **Fitur**: Error handling dan logging yang detail

### 3. **📊 Indexing untuk Performance**
```sql
-- Index untuk tracking_sessions
INDEX idx_rujukan_id (rujukan_id)
INDEX idx_session_token (session_token)
INDEX idx_is_active (is_active)

-- Index untuk tracking_data
INDEX idx_rujukan_id (rujukan_id)
INDEX idx_status (status)
INDEX idx_updated_at (updated_at)
```

## 🚀 API Endpoints yang Diperbaiki

### **1. POST /api/tracking/start-session**
- **Fungsi**: Memulai tracking session untuk rujukan
- **Input**: `rujukan_id`, `device_id`
- **Output**: `session_token`, `rujukan_data`
- **Status**: ✅ Fixed

### **2. GET /api/tracking/session/:rujukan_id**
- **Fungsi**: Cek session tracking yang aktif
- **Input**: `rujukan_id`
- **Output**: `session_data`, `tracking_data`
- **Status**: ✅ Fixed

### **3. POST /api/tracking/update-position**
- **Fungsi**: Update posisi GPS real-time
- **Input**: `session_token`, `latitude`, `longitude`, `status`
- **Output**: `estimated_distance`, `estimated_time`
- **Status**: ✅ Working

### **4. GET /api/tracking/sessions/active**
- **Fungsi**: Dapatkan semua session tracking aktif
- **Input**: Token authentication
- **Output**: Array of active sessions
- **Status**: ✅ Working

## 🔍 Testing Results

### **Before Fix:**
```
❌ POST /api/tracking/start-session → 500 Internal Server Error
❌ GET /api/tracking/session/19 → 404 Not Found
❌ Error: Table 'prodsysesirv02.tracking_sessions' doesn't exist
```

### **After Fix:**
```
✅ POST /api/tracking/start-session → 201 Created
✅ GET /api/tracking/session/19 → 200 OK
✅ Tables created successfully
✅ Backend server running properly
```

## 📝 File yang Dibuat/Dimodifikasi

### **1. Database Setup**
- `setup-tracking.js` - Script untuk membuat tabel tracking
- `create_tracking_tables.sql` - SQL script untuk tabel tracking

### **2. Backend API**
- `backend/routes/tracking.js` - API endpoints tracking (sudah ada)
- `backend/index.js` - Server configuration (sudah ada)

## 🎯 Cara Menggunakan

### **1. Setup Database (One-time)**
```bash
# Jalankan script setup
node setup-tracking.js
```

### **2. Start Backend Server**
```bash
cd backend
node index.js
```

### **3. Test Tracking API**
```bash
# Test start session
curl -X POST http://localhost:3001/api/tracking/start-session \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"rujukan_id": 19, "device_id": "test-device"}'
```

## 🎉 Hasil

- ✅ **Error 500 Fixed**: Tabel tracking sudah dibuat
- ✅ **Error 404 Fixed**: API endpoints berfungsi normal
- ✅ **Tracking Working**: GPS tracking bisa digunakan
- ✅ **Database Ready**: Semua tabel tracking tersedia
- ✅ **API Stable**: Backend server berjalan stabil

---

**🎉 HASIL:** Tracking API sekarang berfungsi normal! Error 500 dan 404 sudah diperbaiki dengan membuat tabel tracking yang diperlukan di database.
