# 🚀 LANGKAH DEMI LANGKAH HOSTING eSIR 2.0 DI CPANEL

## 📋 **PERSIARATAN HOSTING**

Pastikan hosting cPanel Anda memiliki:
- ✅ **Node.js** (versi 16+)
- ✅ **MySQL Database**
- ✅ **File Manager** atau **FTP Access**
- ✅ **SSL Certificate**
- ✅ **Terminal Access**

## 🗂️ **LANGKAH 1: PERSIAPAN FILE LOKAL**

### **1.1 Build Frontend**
```bash
cd frontend
npm run build:production
```

### **1.2 Jalankan Script Build Production**
```bash
# Di Windows
build-production.bat

# Atau manual copy file
```

### **1.3 File yang Siap Upload**
Setelah build, Anda akan memiliki folder `production-build/` dengan struktur:
```
production-build/
├── frontend/           # File build React
├── backend/           # File backend Node.js
├── .htaccess         # Konfigurasi Apache
└── upload-instructions.txt
```

## 🗄️ **LANGKAH 2: SETUP DATABASE DI CPANEL**

### **2.1 Buat Database**
1. Login ke cPanel
2. Masuk ke **"MySQL Databases"**
3. Gunakan database yang sudah ada: `rrpzeeja_prodsysesirv02`
4. Buat user baru: `rrpzeeja_esirv2_user`
5. Berikan password yang kuat
6. Assign user ke database dengan **full privileges**

### **2.2 Import Database Schema**
1. Masuk ke **"phpMyAdmin"**
2. Pilih database `rrpzeeja_prodsysesirv02`
3. Klik tab **"Import"**
4. Upload file `backend/database.sql`
5. Klik **"Go"** untuk import

### **2.3 Verifikasi Database**
Pastikan tabel berikut sudah dibuat:
- `users`, `roles`, `faskes`, `pasien`, `rujukan`
- `tracking_data`, `tracking_sessions`, `notifications`
- `tempat_tidur`, `dokumen`, `activity_logs`

## 📤 **LANGKAH 3: UPLOAD FILE KE CPANEL**

### **3.1 Upload Frontend**
1. Masuk ke **"File Manager"** di cPanel
2. Buka folder `public_html/`
3. Upload semua file dari `production-build/frontend/` ke `public_html/`
4. Pastikan file `index.html` ada di root `public_html/`

### **3.2 Upload Backend**
1. Buat folder `api` di `public_html/`
2. Upload semua file dari `production-build/backend/` ke `public_html/api/`
3. **JANGAN** upload folder `node_modules/`

### **3.3 Upload Konfigurasi**
1. Upload file `.htaccess` ke `public_html/`
2. Pastikan file `.env.production` ada di `public_html/api/`

## ⚙️ **LANGKAH 4: KONFIGURASI ENVIRONMENT**

### **4.1 Edit File Environment Backend**
Edit file `public_html/api/.env.production`:
```env
NODE_ENV=production
PORT=3001
DB_HOST=localhost
DB_USER=rrpzeeja_esirv2_user
DB_PASSWORD=your_actual_password
DB_DATABASE=rrpzeeja_prodsysesirv02
JWT_SECRET=936aa312b4c69844640842bfa497989b2581cbba0449f4c8b6984ab8c51dd2ceff2e97a8b1cd2e804276096687863082d8d2d833931b5f9d1251c64813da69da
FRONTEND_URL=http://esirv02.my.id
CORS_ORIGIN=http://esirv02.my.id
```

### **4.2 Ganti Placeholder**
- `your_actual_password` → Password database yang dibuat
- JWT secret sudah digenerate otomatis
- `esirv02.my.id` → Domain Anda

## 🟢 **LANGKAH 5: SETUP NODE.JS DI CPANEL**

### **5.1 Konfigurasi Node.js**
1. Masuk ke **"Node.js Selector"** di cPanel
2. Pilih versi Node.js (16+)
3. Set **Application Root**: `public_html/api`
4. Set **Application URL**: `http://esirv02.my.id/api`
5. Set **Application Startup File**: `index.js`

### **5.2 Install Dependencies**
1. Masuk ke **"Terminal"** di cPanel
2. Jalankan:
```bash
cd public_html/api
npm install --production
```

### **5.3 Start Application**
1. Kembali ke **"Node.js Selector"**
2. Klik **"Start"** untuk menjalankan aplikasi
3. Pastikan status menunjukkan **"Running"**

## 🔒 **LANGKAH 6: KONFIGURASI SSL**

### **6.1 Aktifkan SSL**
1. Masuk ke **"SSL/TLS"** di cPanel
2. Aktifkan **"Force HTTPS Redirect"**
3. Pastikan SSL certificate aktif

### **6.2 Update URL**
Pastikan semua URL menggunakan HTTPS:
- Frontend: `http://esirv02.my.id`
- Backend: `http://esirv02.my.id/api`

## 🧪 **LANGKAH 7: TESTING**

### **7.1 Test Backend API**
Buka browser dan akses:
```
http://esirv02.my.id/api/test
```
Harus menampilkan: `{"message": "eSIR 2.0 Production Server is running!"}`

### **7.2 Test Frontend**
Akses:
```
http://esirv02.my.id
```
Harus menampilkan halaman login eSIR 2.0

### **7.3 Test Database Connection**
Akses:
```
http://esirv02.my.id/api/api/health
```
Harus menampilkan status database

### **7.4 Test Login**
Gunakan kredensial default:
- **Admin**: admin@esir.com / admin123
- **RSUD**: admin@rsud.com / admin123
- **Puskesmas**: admin@puskesmas.com / admin123

## 🔧 **TROUBLESHOOTING**

### **Database Connection Error**
```bash
# Cek kredensial database
# Pastikan user memiliki privileges
# Cek firewall hosting
```

### **CORS Error**
```bash
# Update CORS_ORIGIN di .env.production
# Pastikan domain benar
```

### **Node.js Error**
```bash
# Cek error logs di cPanel
# Pastikan dependencies terinstall
# Cek versi Node.js
```

### **File Permission Error**
```bash
# Set permission 644 untuk files
# Set permission 755 untuk folders
```

## 📋 **CHECKLIST DEPLOYMENT**

- [ ] Database MySQL dibuat dan diimport
- [ ] File frontend diupload ke `public_html/`
- [ ] File backend diupload ke `public_html/api/`
- [ ] File `.env.production` dikonfigurasi
- [ ] Node.js diaktifkan dan dependencies diinstall
- [ ] SSL certificate aktif
- [ ] Aplikasi berjalan dan dapat diakses
- [ ] Login berfungsi dengan kredensial default
- [ ] Fitur utama (rujukan, tracking) berfungsi

## 🎯 **KREDENSIAL DEFAULT**

| Role | Email | Password | Akses |
|------|-------|----------|-------|
| Admin Pusat | admin@esir.com | admin123 | Full access |
| Admin RSUD | admin@rsud.com | admin123 | RSUD access |
| Admin Puskesmas | admin@puskesmas.com | admin123 | Puskesmas access |
| Operator | operator@rsud.com | admin123 | Limited access |

## 🚀 **SETELAH DEPLOYMENT**

### **Keamanan**
1. Ganti password default semua user
2. Update JWT secret yang lebih kuat
3. Setup backup database otomatis
4. Monitor error logs

### **Optimasi**
1. Enable caching di cPanel
2. Setup CDN jika diperlukan
3. Monitor performance
4. Update dependencies secara berkala

---

**eSIR 2.0 berhasil dihosting di cPanel!** 🎉✨
