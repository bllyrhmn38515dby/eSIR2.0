# 🚀 PANDUAN LENGKAP DEPLOY BACKEND eSIR 2.0 KE CPANEL
## Step-by-Step Guide untuk Mengatasi Masalah Deployment

---

## ⚠️ **MASALAH YANG DITEMUKAN**

Berdasarkan analisis konfigurasi, masalah utama adalah:
1. **Backend belum di-deploy ke CPanel** - masih berjalan di localhost
2. **Database configuration salah** - masih menggunakan database local
3. **Frontend tidak bisa connect ke backend** - karena backend tidak ada di server

---

## 📋 **PERSYARATAN HOSTING**

Pastikan hosting CPanel Anda mendukung:
- ✅ **Node.js** (versi 16 atau lebih tinggi)
- ✅ **MySQL Database** 
- ✅ **Terminal Access** (untuk npm install)
- ✅ **File Manager** atau **FTP Access**
- ✅ **WebSocket Support** (untuk Socket.IO)

**Cara cek:** Login ke CPanel → cari menu "Node.js Selector"

---

## 🗂️ **LANGKAH 1: PERSIAPAN FILE BACKEND**

### **1.1 Buat File Environment Production**

Buat file `.env` di folder `backend/` dengan konfigurasi berikut:

```env
# Production Environment Configuration
NODE_ENV=production
PORT=3001

# Database Configuration (CPanel)
DB_HOST=localhost
DB_USER=rrpzeeja_esirv2_user
DB_PASSWORD=your_actual_database_password_here
DB_DATABASE=rrpzeeja_prodsysesirv02
DB_PORT=3306

# JWT Configuration
JWT_SECRET=936aa312b4c69844640842bfa497989b2581cbba0449f4c8b6984ab8c51dd2ceff2e97a8b1cd2e804276096687863082d8d2d833931b5f9d1251c64813da69da
JWT_EXPIRES_IN=24h

# Frontend URL
FRONTEND_URL=https://esirv02.my.id
CORS_ORIGIN=https://esirv02.my.id

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=climateboyd@gmail.com
EMAIL_PASS=jqbszwazeujtotpv

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Socket.IO Configuration
SOCKET_CORS_ORIGIN=https://esirv02.my.id
```

### **1.2 Update CORS Configuration**

Edit file `backend/index.js` untuk memastikan CORS mendukung domain production:

```javascript
// Pastikan CORS origin sudah include domain Anda
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const explicitOrigins = new Set([
      'http://localhost:3000',
      'https://esirv02.my.id',
      'https://www.esirv02.my.id'
    ]);

    if (explicitOrigins.has(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
};
```

### **1.3 Siapkan File untuk Upload**

Pastikan file-file berikut siap untuk diupload:
- ✅ `index.js` (main server file)
- ✅ `package.json` (dependencies)
- ✅ `.env` (environment config)
- ✅ `config/` folder (database config)
- ✅ `routes/` folder (API routes)
- ✅ `middleware/` folder (auth middleware)
- ✅ `utils/` folder (utilities)
- ✅ `uploads/` folder (file uploads)

**JANGAN upload:**
- ❌ `node_modules/` folder
- ❌ `config.env` (development config)
- ❌ `config.production.env` (sudah di-copy ke .env)

---

## 📋 **LANGKAH 2: UPLOAD FILE KE CPANEL**

### **2.1 Upload via File Manager**

1. **Login ke CPanel**
2. **Buka File Manager**
3. **Navigasi ke `public_html/`**
4. **Buat folder `api/`** (jika belum ada)
5. **Upload semua file backend** ke `public_html/api/`

**Struktur yang diharapkan:**
```
public_html/
├── api/                    # Backend files
│   ├── index.js
│   ├── package.json
│   ├── .env
│   ├── config/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── uploads/
└── [frontend files]       # Frontend build files
```

### **2.2 Set Permissions**

Set permission untuk folder `uploads/`:
1. **Right-click** pada folder `uploads/`
2. **Change Permissions**
3. **Set ke 755** atau **777**

---

## 📋 **LANGKAH 3: SETUP NODE.JS DI CPANEL**

### **3.1 Konfigurasi Node.js Application**

1. **Login ke CPanel**
2. **Buka "Node.js Selector"**
3. **Klik "Create Application"**
4. **Isi konfigurasi:**
   - **Node.js Version:** 16.x atau 18.x
   - **Application Mode:** Production
   - **Application Root:** `public_html/api`
   - **Application URL:** `https://esirv02.my.id/api`
   - **Application Startup File:** `index.js`
   - **Application Port:** `3001`

### **3.2 Install Dependencies**

1. **Buka Terminal** di CPanel
2. **Navigasi ke folder api:**
   ```bash
   cd public_html/api
   ```
3. **Install dependencies:**
   ```bash
   npm install --production
   ```

### **3.3 Start Application**

1. **Kembali ke Node.js Selector**
2. **Klik "Start"** pada aplikasi yang sudah dibuat
3. **Pastikan status "Running"**

---

## 📋 **LANGKAH 4: KONFIGURASI DATABASE**

### **4.1 Verifikasi Database**

1. **Buka phpMyAdmin** di CPanel
2. **Pastikan database `rrpzeeja_prodsysesirv02` ada**
3. **Pastikan user `rrpzeeja_esirv2_user` ada**
4. **Pastikan user memiliki privileges pada database**

### **4.2 Update Database Password**

1. **Buka File Manager**
2. **Edit file `public_html/api/.env`**
3. **Update `DB_PASSWORD`** dengan password database yang benar
4. **Save file**

---

## 📋 **LANGKAH 5: TESTING DEPLOYMENT**

### **5.1 Test Backend API**

Buka browser dan test endpoint berikut:

```
https://esirv02.my.id/api/test
```

**Expected response:**
```json
{
  "message": "Server is running!"
}
```

### **5.2 Test Database Connection**

```
https://esirv02.my.id/api/health
```

**Expected response:**
```json
{
  "success": true,
  "status": "healthy",
  "database": {
    "isConnected": true
  }
}
```

### **5.3 Test Login Endpoint**

```
https://esirv02.my.id/api/auth/login
```

**Test dengan kredensial default:**
- **Admin:** admin@esir.com / admin123
- **RSUD:** admin@rsud.com / admin123
- **Puskesmas:** admin@puskesmas.com / admin123

---

## 📋 **LANGKAH 6: UPDATE FRONTEND CONFIGURATION**

### **6.1 Build Frontend dengan Production Config**

1. **Edit file `frontend/.env.production`:**
   ```env
   REACT_APP_API_URL=https://esirv02.my.id/api
   REACT_APP_SOCKET_URL=https://esirv02.my.id
   REACT_APP_ENVIRONMENT=production
   GENERATE_SOURCEMAP=false
   ```

2. **Build frontend:**
   ```bash
   cd frontend
   npm run build:production
   ```

### **6.2 Upload Frontend Build**

1. **Upload semua file** dari `frontend/build/` ke `public_html/`
2. **Pastikan `index.html`** ada di root `public_html/`

---

## 🔧 **TROUBLESHOOTING**

### **❌ Backend API Tidak Bisa Diakses**

**Solusi:**
1. Cek status Node.js application di CPanel
2. Cek error logs di Node.js Selector
3. Pastikan port 3001 tidak conflict
4. Restart application

### **❌ Database Connection Error**

**Solusi:**
1. Cek kredensial database di file `.env`
2. Pastikan database user memiliki privileges
3. Test koneksi database di phpMyAdmin
4. Cek firewall hosting

### **❌ CORS Error**

**Solusi:**
1. Pastikan domain sudah ditambahkan di CORS origin
2. Cek konfigurasi CORS di `index.js`
3. Pastikan menggunakan HTTPS

### **❌ Socket.IO Error**

**Solusi:**
1. Pastikan hosting mendukung WebSocket
2. Cek konfigurasi Socket.IO di `index.js`
3. Test WebSocket connection

### **❌ File Upload Error**

**Solusi:**
1. Set permission folder `uploads/` ke 755 atau 777
2. Cek konfigurasi multer di backend
3. Pastikan `MAX_FILE_SIZE` sesuai

---

## 🎯 **CHECKLIST DEPLOYMENT**

- [ ] File backend diupload ke `public_html/api/`
- [ ] File `.env` dikonfigurasi dengan database CPanel
- [ ] Node.js application dibuat dan diaktifkan
- [ ] Dependencies diinstall via Terminal
- [ ] Application status "Running"
- [ ] Database connection berhasil
- [ ] API endpoint `/test` bisa diakses
- [ ] API endpoint `/health` menunjukkan database connected
- [ ] Login endpoint berfungsi
- [ ] Frontend di-build ulang dengan production config
- [ ] Frontend diupload ke `public_html/`
- [ ] Aplikasi bisa login dan berfungsi normal

---

## 🚀 **SETELAH DEPLOYMENT BERHASIL**

### **Yang Harus Bisa Dilakukan:**
1. ✅ Akses `https://esirv02.my.id` → tampil halaman login
2. ✅ Login dengan kredensial default → masuk dashboard
3. ✅ CRUD operations tersimpan di database CPanel
4. ✅ Real-time features (Socket.IO) berfungsi
5. ✅ File upload berfungsi
6. ✅ GPS tracking berfungsi

### **Yang Tidak Perlu Lagi:**
- ❌ Menjalankan `npm start` di local
- ❌ Database local MySQL
- ❌ Backend local di port 3001

---

## 📞 **DUKUNGAN**

Jika mengalami masalah:
1. **Cek error logs** di Node.js Selector
2. **Cek database logs** di phpMyAdmin
3. **Test endpoint** satu per satu
4. **Hubungi support hosting** jika diperlukan

---

**🎉 Setelah mengikuti panduan ini, aplikasi eSIR 2.0 akan berjalan sepenuhnya di CPanel tanpa perlu backend local!**
