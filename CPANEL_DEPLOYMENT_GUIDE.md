# 🚀 PANDUAN LENGKAP DEPLOYMENT eSIR 2.0 KE cPanel

## ⚠️ PERSYARATAN HOSTING

Pastikan hosting cPanel Anda mendukung:
- **Node.js** (versi 16+)
- **MySQL Database**
- **File Manager** atau **FTP Access**
- **SSL Certificate** (untuk HTTPS)
- **WebSocket Support** (untuk Socket.IO)

## 📋 LANGKAH 1: PERSIAPAN DATABASE

### 1.1 Buat Database di cPanel
1. Login ke cPanel
2. Masuk ke "MySQL Databases"
3. Buat database baru: `esirv2_db`
4. Buat user database baru
5. Assign user ke database dengan full privileges

### 1.2 Import Database Schema
1. Masuk ke "phpMyAdmin"
2. Pilih database yang baru dibuat
3. Import file `backend/database.sql`

## 📋 LANGKAH 2: UPLOAD BACKEND

### 2.1 Struktur Folder
```
public_html/
├── api/                    # Backend files
│   ├── app.js             # Production startup file
│   ├── package.json       # Dependencies
│   ├── .env.production    # Environment config
│   ├── config/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── uploads/
└── [frontend files]       # Frontend build files
```

### 2.2 Upload Backend Files
1. Upload semua file dari `backend/` ke `public_html/api/`
2. **JANGAN** upload folder `node_modules/`
3. Rename `production.env.example` menjadi `.env.production`
4. Edit `.env.production` dengan data hosting Anda:

```env
NODE_ENV=production
PORT=3001
DB_HOST=localhost
DB_USER=your_database_username
DB_PASSWORD=your_database_password
DB_DATABASE=your_database_name
JWT_SECRET=your_super_secret_jwt_key_here
FRONTEND_URL=https://yourdomain.com
```

## 📋 LANGKAH 3: SETUP NODE.JS

### 3.1 Konfigurasi Node.js
1. Masuk ke "Node.js Selector" di cPanel
2. Pilih versi Node.js (16+)
3. Set Application Root: `public_html/api`
4. Set Application URL: `https://yourdomain.com/api`
5. Set Application Startup File: `app.js`

### 3.2 Install Dependencies
1. Masuk ke Terminal cPanel
2. Jalankan:
```bash
cd public_html/api
npm install
```

### 3.3 Start Application
1. Klik "Start" di Node.js Selector
2. Pastikan status "Running"

## 📋 LANGKAH 4: BUILD DAN UPLOAD FRONTEND

### 4.1 Build Frontend di Local
```bash
cd frontend
npm run build:production
```

### 4.2 Upload Build Files
1. Upload semua file dari `frontend/build/` ke `public_html/`
2. Pastikan file `index.html` ada di root `public_html/`

## 📋 LANGKAH 5: KONFIGURASI DOMAIN

### 5.1 Setup Domain
1. Pastikan domain mengarah ke folder `public_html/`
2. Setup subdomain untuk API jika diperlukan

### 5.2 Enable SSL
1. Aktifkan SSL certificate di cPanel
2. Pastikan semua URL menggunakan HTTPS

## 📋 LANGKAH 6: TESTING

### 6.1 Test Backend API
```
https://yourdomain.com/api/test
```

### 6.2 Test Frontend
```
https://yourdomain.com
```

### 6.3 Test Database Connection
```
https://yourdomain.com/api/api/health
```

## 🔧 TROUBLESHOOTING

### Database Connection Error
- Pastikan kredensial database benar
- Pastikan database user memiliki privileges yang cukup
- Cek firewall hosting

### CORS Error
- Pastikan `FRONTEND_URL` di backend sesuai dengan domain Anda
- Cek konfigurasi CORS di `app.js`

### File Upload Error
- Pastikan folder `uploads/` memiliki permission write
- Cek konfigurasi multer di backend

### Socket.IO Error
- Pastikan hosting mendukung WebSocket
- Cek konfigurasi Socket.IO di `app.js`

## 🚀 OPTIMASI PRODUCTION

### Performance
- Enable Gzip compression di cPanel
- Setup caching untuk static files
- Optimize database queries

### Security
- Update semua dependencies
- Setup rate limiting
- Enable HTTPS only
- Setup backup database

### Monitoring
- Setup error logging
- Monitor server resources
- Setup uptime monitoring

## 📞 DUKUNGAN

Jika mengalami masalah:
1. Cek error logs di cPanel
2. Pastikan semua persyaratan hosting terpenuhi
3. Hubungi support hosting jika diperlukan

