# 🚀 PANDUAN LENGKAP HOSTING eSIR 2.0 DI CPANEL

## 📋 **PERSYARATAN HOSTING**

Pastikan hosting cPanel Anda mendukung:
- ✅ **Node.js** (versi 16+)
- ✅ **MySQL Database** 
- ✅ **File Manager** atau **FTP Access**
- ✅ **SSL Certificate** (untuk HTTPS)
- ✅ **WebSocket Support** (untuk Socket.IO)
- ✅ **Terminal Access** (untuk npm install)

## 🗂️ **STRUKTUR FILE UNTUK UPLOAD**

### **Struktur yang akan diupload:**
```
public_html/
├── index.html              # Frontend build
├── favicon.ico
├── manifest.json
├── robots.txt
├── sw.js
├── static/                 # CSS & JS files
│   ├── css/
│   └── js/
├── api/                    # Backend files
│   ├── index.js
│   ├── package.json
│   ├── .env.production
│   ├── config/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── uploads/
└── .htaccess              # Apache config
```

## 📋 **LANGKAH 1: PERSIAPAN DATABASE**

### **1.1 Buat Database di cPanel**
1. Login ke cPanel
2. Masuk ke **"MySQL Databases"**
3. Gunakan database yang sudah ada: `rrpzeeja_prodsysesirv02`
4. Buat user database baru: `rrpzeeja_esirv2_user`
5. Assign user ke database dengan **full privileges**

### **1.2 Import Database Schema**
1. Masuk ke **"phpMyAdmin"**
2. Pilih database `rrpzeeja_prodsysesirv02`
3. Import file `backend/database.sql`

## 📋 **LANGKAH 2: PERSIAPAN FILE BACKEND**

### **2.1 Buat File Environment Production**
Buat file `.env.production` di folder `backend/`:

```env
NODE_ENV=production
PORT=3001
DB_HOST=localhost
DB_USER=rrpzeeja_esirv2_user
DB_PASSWORD=your_database_password
DB_DATABASE=rrpzeeja_prodsysesirv02
JWT_SECRET=936aa312b4c69844640842bfa497989b2581cbba0449f4c8b6984ab8c51dd2ceff2e97a8b1cd2e804276096687863082d8d2d833931b5f9d1251c64813da69da
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://esirv02.my.id
CORS_ORIGIN=http://esirv02.my.id
```

### **2.2 Update CORS di Backend**
Edit file `backend/index.js` untuk production:

```javascript
// Update CORS origin untuk production
app.use(cors({
  origin: ['http://esirv02.my.id', 'http://www.esirv02.my.id'],
  credentials: true
}));

// Update Socket.IO CORS
const io = socketIo(server, {
  cors: {
    origin: ['http://esirv02.my.id', 'http://www.esirv02.my.id'],
    methods: ["GET", "POST"]
  }
});
```

## 📋 **LANGKAH 3: BUILD FRONTEND**

### **3.1 Buat File Environment Frontend**
Buat file `.env.production` di folder `frontend/`:

```env
REACT_APP_API_URL=https://yourdomain.com/api
REACT_APP_SOCKET_URL=https://yourdomain.com
REACT_APP_ENVIRONMENT=production
GENERATE_SOURCEMAP=false
```

### **3.2 Build Frontend**
```bash
cd frontend
npm run build:production
```

## 📋 **LANGKAH 4: UPLOAD FILE KE CPANEL**

### **4.1 Upload Frontend**
1. Upload semua file dari `frontend/build/` ke `public_html/`
2. Pastikan file `index.html` ada di root `public_html/`

### **4.2 Upload Backend**
1. Upload semua file dari `backend/` ke `public_html/api/`
2. **JANGAN** upload folder `node_modules/`
3. Pastikan file `.env.production` terupload

### **4.3 Buat File .htaccess**
Buat file `.htaccess` di `public_html/`:

```apache
# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Enable caching
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/ico "access plus 1 year"
    ExpiresByType image/icon "access plus 1 year"
    ExpiresByType text/plain "access plus 1 month"
    ExpiresByType application/pdf "access plus 1 month"
    ExpiresByType text/html "access plus 1 day"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Redirect to HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Handle React Router
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

## 📋 **LANGKAH 5: SETUP NODE.JS DI CPANEL**

### **5.1 Konfigurasi Node.js**
1. Masuk ke **"Node.js Selector"** di cPanel
2. Pilih versi Node.js (16+)
3. Set **Application Root**: `public_html/api`
4. Set **Application URL**: `https://yourdomain.com/api`
5. Set **Application Startup File**: `index.js`

### **5.2 Install Dependencies**
1. Masuk ke **Terminal** cPanel
2. Jalankan:
```bash
cd public_html/api
npm install --production
```

### **5.3 Start Application**
1. Klik **"Start"** di Node.js Selector
2. Pastikan status **"Running"**

## 📋 **LANGKAH 6: KONFIGURASI DOMAIN**

### **6.1 Setup Domain**
1. Pastikan domain mengarah ke folder `public_html/`
2. Setup subdomain untuk API jika diperlukan

### **6.2 Enable SSL**
1. Aktifkan SSL certificate di cPanel
2. Pastikan semua URL menggunakan HTTPS

## 📋 **LANGKAH 7: TESTING**

### **7.1 Test Backend API**
```
http://esirv02.my.id/api/test
```

### **7.2 Test Frontend**
```
http://esirv02.my.id
```

### **7.3 Test Database Connection**
```
http://esirv02.my.id/api/api/health
```

### **7.4 Test Login**
Gunakan kredensial default:
- **Admin**: admin@esir.com / admin123
- **RSUD**: admin@rsud.com / admin123
- **Puskesmas**: admin@puskesmas.com / admin123

## 🔧 **TROUBLESHOOTING**

### **Database Connection Error**
- Pastikan kredensial database benar
- Pastikan database user memiliki privileges yang cukup
- Cek firewall hosting

### **CORS Error**
- Pastikan `FRONTEND_URL` di backend sesuai dengan domain Anda
- Cek konfigurasi CORS di `index.js`

### **File Upload Error**
- Pastikan folder `uploads/` memiliki permission write
- Cek konfigurasi multer di backend

### **Socket.IO Error**
- Pastikan hosting mendukung WebSocket
- Cek konfigurasi Socket.IO di `index.js`

### **Node.js Error**
- Pastikan versi Node.js kompatibel
- Cek error logs di cPanel
- Pastikan semua dependencies terinstall

## 🚀 **OPTIMASI PRODUCTION**

### **Performance**
- Enable Gzip compression di cPanel
- Setup caching untuk static files
- Optimize database queries

### **Security**
- Update semua dependencies
- Setup rate limiting
- Enable HTTPS only
- Setup backup database

### **Monitoring**
- Setup error logging
- Monitor server resources
- Setup uptime monitoring

## 📞 **DUKUNGAN**

Jika mengalami masalah:
1. Cek error logs di cPanel
2. Pastikan semua persyaratan hosting terpenuhi
3. Hubungi support hosting jika diperlukan

## 🎯 **CHECKLIST DEPLOYMENT**

- [ ] Database MySQL dibuat dan diimport
- [ ] File backend diupload ke `public_html/api/`
- [ ] File frontend diupload ke `public_html/`
- [ ] File `.env.production` dikonfigurasi
- [ ] Node.js diaktifkan dan dependencies diinstall
- [ ] SSL certificate aktif
- [ ] Aplikasi berjalan dan dapat diakses
- [ ] Login berfungsi dengan kredensial default
- [ ] Fitur utama (rujukan, tracking) berfungsi

---

**eSIR 2.0 siap untuk production!** 🚀✨
