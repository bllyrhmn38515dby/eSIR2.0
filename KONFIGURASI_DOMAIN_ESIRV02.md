# 🌐 KONFIGURASI DOMAIN eSIR 2.0

## 📋 **INFORMASI DOMAIN**

Domain yang akan digunakan untuk hosting eSIR 2.0:
- **Domain**: `esirv02.my.id`
- **Protocol**: HTTP (bukan HTTPS)
- **Frontend URL**: `http://esirv02.my.id`
- **Backend API URL**: `http://esirv02.my.id/api`

## ⚙️ **KONFIGURASI YANG SUDAH DIPERBARUI**

### **1. File Environment Backend**
File `backend/config.production.env`:
```env
NODE_ENV=production
PORT=3001
DB_HOST=localhost
DB_USER=rrpzeeja_esirv2_user
DB_PASSWORD=your_database_password_here
DB_DATABASE=rrpzeeja_prodsysesirv02
DB_PORT=3306
JWT_SECRET=936aa312b4c69844640842bfa497989b2581cbba0449f4c8b6984ab8c51dd2ceff2e97a8b1cd2e804276096687863082d8d2d833931b5f9d1251c64813da69da
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://esirv02.my.id
CORS_ORIGIN=http://esirv02.my.id
```

### **2. File Environment Frontend**
File `frontend/config.production.env`:
```env
REACT_APP_API_URL=http://esirv02.my.id/api
REACT_APP_SOCKET_URL=http://esirv02.my.id
REACT_APP_ENVIRONMENT=production
GENERATE_SOURCEMAP=false
```

### **3. File Server Production**
File `backend/index.production.js`:
```javascript
// Production CORS origins
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.CORS_ORIGIN,
  'http://www.' + process.env.FRONTEND_URL?.replace('http://', ''),
  'http://www.' + process.env.CORS_ORIGIN?.replace('http://', '')
].filter(Boolean);
```

### **4. File .htaccess**
File `.htaccess` sudah dikonfigurasi untuk HTTP:
```apache
# Redirect to HTTPS (Optional - comment out if using HTTP)
# RewriteEngine On
# RewriteCond %{HTTPS} off
# RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

## 🎯 **LANGKAH SETUP DOMAIN**

### **1. Konfigurasi cPanel**
1. Login ke cPanel
2. Pastikan domain `esirv02.my.id` sudah terdaftar
3. Domain harus mengarah ke folder `public_html/`

### **2. Setup Node.js di cPanel**
1. Masuk ke **"Node.js Selector"**
2. Set **Application Root**: `public_html/api`
3. Set **Application URL**: `http://esirv02.my.id/api`
4. Set **Application Startup File**: `index.js`

### **3. Upload File**
1. Upload frontend build ke `public_html/`
2. Upload backend ke `public_html/api/`
3. Upload `.htaccess` ke `public_html/`

## 🧪 **TESTING DOMAIN**

### **1. Test Backend API**
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

### **2. Test Frontend**
```
http://esirv02.my.id
```
**Expected:** Halaman login eSIR 2.0

### **3. Test Database Connection**
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

### **4. Test Login**
Gunakan kredensial default:
- **Admin**: admin@esir.com / admin123
- **RSUD**: admin@rsud.com / admin123
- **Puskesmas**: admin@puskesmas.com / admin123

## 🔧 **TROUBLESHOOTING DOMAIN**

### **Domain Tidak Bisa Diakses**
1. Cek DNS settings di cPanel
2. Pastikan domain mengarah ke hosting yang benar
3. Tunggu propagasi DNS (bisa 24-48 jam)

### **CORS Error**
1. Pastikan `CORS_ORIGIN` di backend sesuai dengan domain
2. Cek konfigurasi di `backend/index.production.js`
3. Pastikan frontend menggunakan URL yang benar

### **API Tidak Bisa Diakses**
1. Cek Node.js application status di cPanel
2. Pastikan port 3001 tidak terblokir
3. Cek error logs di cPanel

### **Frontend Tidak Load**
1. Pastikan file build React terupload dengan benar
2. Cek file `.htaccess` untuk routing
3. Pastikan file `index.html` ada di root `public_html/`

## 🚀 **SETELAH DOMAIN BERFUNGSI**

### **Keamanan**
1. Pertimbangkan upgrade ke HTTPS
2. Setup SSL certificate
3. Update CORS untuk HTTPS

### **Optimasi**
1. Enable caching di cPanel
2. Setup CDN jika diperlukan
3. Monitor performance

### **Monitoring**
1. Setup uptime monitoring
2. Monitor error logs
3. Track user access

## 📋 **CHECKLIST DOMAIN**

- [ ] Domain `esirv02.my.id` terdaftar di cPanel
- [ ] Domain mengarah ke folder `public_html/`
- [ ] File frontend terupload ke `public_html/`
- [ ] File backend terupload ke `public_html/api/`
- [ ] Node.js application berjalan
- [ ] Backend API dapat diakses
- [ ] Frontend dapat diakses
- [ ] Login berfungsi
- [ ] Database terhubung

## 🔄 **UPGRADE KE HTTPS (OPSIONAL)**

Jika ingin upgrade ke HTTPS:

1. **Aktifkan SSL di cPanel**
2. **Update Environment Variables:**
   ```env
   FRONTEND_URL=https://esirv02.my.id
   CORS_ORIGIN=https://esirv02.my.id
   ```
3. **Update .htaccess:**
   ```apache
   # Uncomment HTTPS redirect
   RewriteEngine On
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   ```

---

**Domain eSIR 2.0 siap untuk production!** 🎉✨
