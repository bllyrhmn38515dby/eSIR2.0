# 🚀 PANDUAN MEMBUAT NODE.JS APPLICATION DI CPANEL

## 📋 **LANGKAH 1: CREATE APPLICATION**

### **1.1 Klik Tombol Create**
1. Di halaman Node.js yang Anda lihat
2. Klik tombol **"+ CREATE APPLICATION"** (tombol biru di kanan atas)

### **1.2 Form Create Application**
Isi form dengan data berikut:

#### **Basic Settings:**
- **Node.js Version**: Pilih versi 16.x atau 18.x (yang tersedia)
- **Application Mode**: Production
- **Application Root**: `public_html/api`
- **Application URL**: `http://esirv02.my.id/api`
- **Application Startup File**: `index.js`

#### **Advanced Settings:**
- **Environment Variables**: 
  ```
  NODE_ENV=production
  PORT=3001
  DB_HOST=localhost
  DB_USER=rrpzeeja_esirv2_user
  DB_PASSWORD=your_database_password_here
  DB_DATABASE=rrpzeeja_prodsysesirv02
  JWT_SECRET=936aa312b4c69844640842bfa497989b2581cbba0449f4c8b6984ab8c51dd2ceff2e97a8b1cd2e804276096687863082d8d2d833931b5f9d1251c64813da69da
  FRONTEND_URL=http://esirv02.my.id
  CORS_ORIGIN=http://esirv02.my.id
  ```

## 📋 **LANGKAH 2: UPLOAD FILE BACKEND**

### **2.1 Upload File ke Folder API**
1. Masuk ke **"File Manager"** di cPanel
2. Buka folder `public_html/`
3. Buat folder `api` jika belum ada
4. Upload semua file dari `backend/` ke `public_html/api/`

### **2.2 File yang Harus Diupload:**
```
public_html/api/
├── index.js (rename dari index.production.js)
├── package.json
├── .env.production (rename dari config.production.env)
├── config/
├── routes/
├── middleware/
├── utils/
└── uploads/
```

### **2.3 Rename File:**
- `index.production.js` → `index.js`
- `config.production.env` → `.env.production`

## 📋 **LANGKAH 3: INSTALL DEPENDENCIES**

### **3.1 Masuk ke Terminal**
1. Di cPanel, masuk ke **"Terminal"**
2. Jalankan perintah:
```bash
cd public_html/api
npm install --production
```

### **3.2 Tunggu Installasi Selesai**
- Proses installasi akan memakan waktu beberapa menit
- Pastikan tidak ada error

## 📋 **LANGKAH 4: START APPLICATION**

### **4.1 Kembali ke Node.js Selector**
1. Kembali ke halaman Node.js
2. Aplikasi yang baru dibuat akan muncul di list
3. Klik tombol **"Start"** untuk menjalankan aplikasi

### **4.2 Verifikasi Status**
- Status harus berubah menjadi **"Running"**
- Jika ada error, cek logs

## 📋 **LANGKAH 5: TESTING**

### **5.1 Test Backend API**
Buka browser dan akses:
```
http://esirv02.my.id/api/test
```

**Expected Response:**
```json
{
  "message": "eSIR 2.0 Production Server is running!",
  "environment": "production",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### **5.2 Test Database Connection**
```
http://esirv02.my.id/api/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "status": "healthy",
  "environment": "production",
  "database": {
    "isConnected": true,
    "database": "rrpzeeja_prodsysesirv02"
  }
}
```

## 🔧 **TROUBLESHOOTING**

### **Error: "Application failed to start"**
1. Cek file `index.js` ada di root folder
2. Cek environment variables
3. Cek dependencies terinstall
4. Cek logs di cPanel

### **Error: "Database connection failed"**
1. Cek kredensial database di environment variables
2. Pastikan user database memiliki privileges
3. Cek database `rrpzeeja_prodsysesirv02` ada

### **Error: "Port already in use"**
1. Cek port 3001 tidak digunakan aplikasi lain
2. Restart aplikasi
3. Cek logs untuk detail error

### **Error: "Module not found"**
1. Jalankan `npm install --production` lagi
2. Cek file `package.json` ada
3. Cek semua dependencies terinstall

## 📋 **CHECKLIST DEPLOYMENT**

- [ ] Node.js application dibuat di cPanel
- [ ] File backend diupload ke `public_html/api/`
- [ ] File `index.js` dan `.env.production` ada
- [ ] Dependencies terinstall (`npm install --production`)
- [ ] Application status "Running"
- [ ] Backend API dapat diakses
- [ ] Database connection berfungsi
- [ ] Environment variables terkonfigurasi

## 🎯 **LANGKAH SELANJUTNYA**

Setelah Node.js application berjalan:

1. **Upload Frontend**: Upload file build React ke `public_html/`
2. **Test Frontend**: Akses `http://esirv02.my.id`
3. **Test Login**: Gunakan kredensial default
4. **Test Fitur**: Uji semua fitur utama aplikasi

## 📞 **DUKUNGAN**

Jika mengalami masalah:
1. Cek error logs di cPanel
2. Pastikan semua file terupload dengan benar
3. Verifikasi environment variables
4. Hubungi support hosting jika diperlukan

---

**Node.js Application siap untuk production!** 🚀✨
