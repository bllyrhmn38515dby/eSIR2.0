# 🗄️ eSIR 2.0 - Database Setup Guide

## 📋 Overview

Panduan lengkap untuk membuat database `prodsysesirv02` yang baru dengan struktur lengkap untuk sistem eSIR 2.0.

## 🚀 Quick Setup (Recommended)

### **Method 1: Automated Setup (Windows)**
```bash
# Jalankan script batch
setup-database-esirv2.bat
```

### **Method 2: Manual Setup**
```bash
# 1. Masuk ke direktori backend
cd backend

# 2. Jalankan script setup
node setup-database-complete.js
```

### **Method 3: SQL Manual**
```bash
# Import SQL file langsung ke MySQL
mysql -u root -p < backend/create-database-esirv2-complete.sql
```

## 📊 Database Structure

### **Core Tables (16 tables):**

1. **`roles`** - Peran pengguna (admin_pusat, admin_faskes, operator, sopir_ambulans)
2. **`faskes`** - Fasilitas kesehatan (RSUD, Puskesmas, Klinik, RS Swasta)
3. **`users`** - Pengguna sistem dengan autentikasi
4. **`pasien`** - Data pasien dengan NIK dan No. RM
5. **`rujukan`** - Data rujukan pasien antar faskes
6. **`tempat_tidur`** - Manajemen tempat tidur per faskes
7. **`tracking_data`** - Data tracking real-time GPS
8. **`tracking_sessions`** - Sesi tracking untuk monitoring
9. **`search_logs`** - Log pencarian untuk analytics
10. **`notifications`** - Sistem notifikasi
11. **`dokumen`** - Manajemen dokumen rujukan
12. **`activity_logs`** - Log aktivitas pengguna
13. **`ambulance_drivers`** - Data sopir ambulans
14. **`password_reset_tokens`** - Token reset password
15. **`email_logs`** - Log pengiriman email
16. **`system_config`** - Konfigurasi sistem

## 🔐 Default Login Credentials

| Role | Email | Password | Access |
|------|-------|----------|---------|
| **Admin Pusat** | admin@esir.com | admin123 | Full access |
| **Admin RSUD** | admin@rsud.com | admin123 | RSUD access |
| **Admin Puskesmas** | admin@puskesmas.com | admin123 | Puskesmas access |
| **Operator** | operator@rsud.com | admin123 | Limited access |

## 📈 Sample Data Included

### **Faskes (10 records):**
- RSUD Kota Bogor
- RS Hermina Bogor
- RS Salak Bogor
- 5 Puskesmas di Bogor
- 2 Klinik di Bogor

### **Pasien (5 records):**
- Sample pasien dengan data lengkap
- NIK dan No. RM yang valid

### **Rujukan (5 records):**
- Rujukan dengan status berbeda
- Data diagnosa dan alasan rujukan

### **Tempat Tidur (13 records):**
- Kamar VIP, Kelas 1, Kelas 2, ICU
- Status: tersedia, terisi, maintenance, reserved

### **Sopir Ambulans (5 records):**
- Data sopir dengan SIM dan kontak

## ⚙️ Environment Configuration

### **Backend (`backend/config.env`):**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_DATABASE=prodsysesirv02
DB_PORT=3306
JWT_SECRET=esir_secret_key_2024_development
JWT_EXPIRES_IN=24h
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 🔧 Troubleshooting

### **Error: Database already exists**
```sql
-- Drop existing database (HATI-HATI: Menghapus semua data!)
DROP DATABASE IF EXISTS prodsysesirv02;
```

### **Error: Access denied**
- Pastikan MySQL service berjalan
- Cek username/password di `config.env`
- Pastikan user memiliki privilege CREATE DATABASE

### **Error: Tablespace exists**
```bash
# Restart MySQL service
# Atau gunakan database dengan nama berbeda
```

### **Error: Foreign key constraint**
- Pastikan tabel dibuat dalam urutan yang benar
- Cek data referensi sudah ada

## 📋 Verification Steps

### **1. Check Database Connection**
```bash
cd backend
node check-esirv2-db.js
```

### **2. Check Tables**
```bash
node check-tables.js
```

### **3. Test Login**
```bash
node test-login-only.js
```

### **4. Start Application**
```bash
# Backend
npm start

# Frontend (terminal baru)
cd ../frontend
npm start
```

## 🎯 Post-Setup Checklist

- [ ] Database `prodsysesirv02` created
- [ ] 16 tables created successfully
- [ ] Sample data inserted
- [ ] Default users created
- [ ] Login credentials working
- [ ] Backend server starting
- [ ] Frontend server starting
- [ ] Application accessible at http://localhost:3000

## 📞 Support

Jika mengalami masalah:

1. **Check MySQL Status**: Pastikan MySQL service berjalan
2. **Check Logs**: Lihat error message di terminal
3. **Check Config**: Verifikasi `config.env` settings
4. **Check Dependencies**: Pastikan `npm install` sudah dijalankan

## 🔄 Reset Database

Jika ingin reset database:

```bash
# 1. Drop database
mysql -u root -p -e "DROP DATABASE IF EXISTS prodsysesirv02;"

# 2. Re-run setup
setup-database-esirv2.bat
```

---

**Status**: ✅ Ready for Production  
**Last Updated**: 2024-12-04  
**Version**: 2.0.0
