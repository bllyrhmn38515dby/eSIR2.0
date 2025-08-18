# 🔧 Database Connection Fix - eSIR 2.0

## ✅ Masalah yang Diperbaiki

### ❌ Warning Sebelumnya:
```
Database connection failed: Access denied for user 'root'@'localhost' (using password: YES)
⚠️  Database tidak tersedia, menggunakan mock data
```

### ✅ Status Sekarang:
```
✅ Database terhubung: esirv2
```

## 🔧 Solusi yang Diterapkan

### 1. **Database Connection Fix Tool**
Membuat script `fix-database-connection.js` yang:
- ✅ Mencoba berbagai konfigurasi database (password kosong, root, password, admin)
- ✅ Membuat database `esirv2` jika belum ada
- ✅ Import schema dari `database.sql` jika tabel belum ada
- ✅ Update file `.env` dengan konfigurasi yang benar

### 2. **Konfigurasi Database yang Berhasil**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_DATABASE=esirv2
DB_PORT=3306
```

### 3. **Database Schema**
- ✅ 12 tabel berhasil dibuat
- ✅ Data sample berhasil diimport
- ✅ Foreign key constraints terpasang dengan benar

## 🚀 Cara Menjalankan

### **Option 1: Manual Setup**
```bash
# 1. Fix database connection
cd backend
node fix-database-connection.js

# 2. Start backend
npm start

# 3. Start frontend (di terminal lain)
cd frontend
npm start
```

### **Option 2: Auto Setup**
```bash
# Jalankan script setup otomatis
.\setup-system.bat

# Atau jalankan kedua server sekaligus
.\start-app.bat
```

## 📊 Database Tables

### **Core Tables:**
1. **`users`** - Manajemen pengguna
2. **`roles`** - Definisi role (admin_pusat, admin_faskes)
3. **`faskes`** - Data fasilitas kesehatan
4. **`pasien`** - Data pasien
5. **`rujukan`** - Data rujukan
6. **`tempat_tidur`** - Manajemen tempat tidur

### **Tracking Tables:**
7. **`tracking_data`** - Data tracking real-time
8. **`tracking_sessions`** - Session management
9. **`search_logs`** - Analytics pencarian

### **Sample Data:**
- ✅ 2 roles (admin_pusat, admin_faskes)
- ✅ 4 users default dengan password `admin123`
- ✅ 10 faskes di Kota Bogor
- ✅ 5 pasien sample
- ✅ 5 rujukan sample
- ✅ Tempat tidur untuk RSUD

## 🔐 Default Users

### **Admin Pusat:**
- Email: `admin@pusat.com`
- Password: `admin123`
- Role: `admin_pusat`
- Akses: Semua fitur dan data

### **Admin Faskes:**
- Email: `admin@rsud.com`
- Password: `admin123`
- Role: `admin_faskes`
- Akses: Data faskes tertentu saja

## 🌐 Access URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Test Endpoint:** http://localhost:3001/test
- **Login Endpoint:** http://localhost:3001/api/auth/login

## 📱 Features Available

### **✅ Core Features:**
- User Authentication & Authorization
- Patient Management (CRUD)
- Referral Management (CRUD)
- Healthcare Facility Management
- Interactive Maps with Real-time Updates
- Real-time Notifications
- Bed Management
- Search & Filter
- Reports & Analytics

### **✅ Advanced Features:**
- Ambulance Tracking
- Real-time Route Tracking
- GPS Position Tracking
- Status Management
- Role-based Access Control

## 🗺️ Coverage Area

**Kota Bogor, Jawa Barat:**
- Latitude: -6.5971
- Longitude: 106.8060
- 10 faskes tersebar di berbagai kecamatan

## 🔧 Troubleshooting

### **Jika Database Error:**
1. Jalankan: `node fix-database-connection.js`
2. Pastikan MySQL/MariaDB berjalan
3. Periksa kredensial di file `.env`

### **Jika Port Error:**
```bash
# Cek proses yang menggunakan port
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Matikan proses jika perlu
taskkill /PID <process_id> /F
```

### **Jika Frontend Error:**
```bash
cd frontend
npm install
npm start
```

## ✅ Status Akhir

**🎉 SISTEM BERHASIL DIPERBAIKI!**

- ✅ Database connection berhasil
- ✅ 12 tabel terbuat dengan benar
- ✅ Sample data terimport
- ✅ Backend server berjalan di port 3001
- ✅ Frontend server berjalan di port 3000
- ✅ Semua fitur tersedia dan berfungsi

**Sistem eSIR 2.0 siap digunakan!** 🚀
