# 🚀 eSIR 2.0 Production Deployment Guide

## 📋 **File yang Sudah Siap untuk Production**

### **Frontend (Build Ready)**
```
frontend/build/
├── index.html              # ✅ Main HTML file
├── favicon.ico             # ✅ Favicon
├── manifest.json           # ✅ PWA manifest
├── robots.txt              # ✅ SEO robots
├── sw.js                   # ✅ Service worker
├── .htaccess               # ✅ Apache configuration
└── static/
    ├── css/
    │   └── main.6063a65a.css    # ✅ Optimized CSS
    └── js/
        ├── main.7d8a1d66.js     # ✅ Main JS bundle
        └── 453.670e15c7.chunk.js # ✅ Chunk JS
```

### **Backend (Production Ready)**
```
backend/
├── index.js                # ✅ Main server file
├── package.json            # ✅ Dependencies
├── config.production.env   # ✅ Production config
├── config/
│   └── db.js              # ✅ Database config
├── middleware/             # ✅ Auth & upload middleware
├── routes/                 # ✅ API routes
├── utils/                  # ✅ Utilities
└── uploads/                # ✅ Upload directory
```

## 🗂️ **Struktur Upload ke cPanel**

### **Opsi 1: Single Domain**
```
public_html/
├── index.html              # Dari frontend/build/
├── favicon.ico             # Dari frontend/build/
├── manifest.json           # Dari frontend/build/
├── robots.txt              # Dari frontend/build/
├── sw.js                   # Dari frontend/build/
├── .htaccess               # Dari frontend/build/
├── static/                 # Dari frontend/build/static/
└── api/                    # Backend files
    ├── index.js
    ├── package.json
    ├── config.production.env
    ├── config/
    ├── middleware/
    ├── routes/
    ├── utils/
    └── uploads/
```

### **Opsi 2: Subdomain (Recommended)**
```
public_html/                # Frontend
├── index.html
├── favicon.ico
├── manifest.json
├── robots.txt
├── sw.js
├── .htaccess
└── static/

api.yourdomain.com/         # Backend subdomain
├── index.js
├── package.json
├── config.production.env
├── config/
├── middleware/
├── routes/
├── utils/
└── uploads/
```

## ⚙️ **Konfigurasi cPanel**

### **1. Database Setup**
1. Buat database MySQL di cPanel
2. Buat user database
3. Berikan permission ke user
4. Import file `database.sql`

### **2. Node.js Setup**
1. Aktifkan Node.js di cPanel
2. Set Node.js version (14.x atau 16.x)
3. Set start command: `node index.js`
4. Set port: `3001` atau sesuai hosting

### **3. Environment Variables**
Update `config.production.env`:
```env
NODE_ENV=production
PORT=3001
DB_HOST=localhost
DB_USER=your_actual_db_user
DB_PASSWORD=your_actual_db_password
DB_DATABASE=your_actual_db_name
JWT_SECRET=your_secure_jwt_secret
CORS_ORIGIN=https://yourdomain.com
```

## 📤 **Tahapan Upload**

### **Step 1: Upload Frontend**
1. Upload semua file dari `frontend/build/` ke `public_html/`
2. Pastikan file `.htaccess` terupload
3. Set permissions: 644 untuk files, 755 untuk folders

### **Step 2: Upload Backend**
1. Upload folder `backend/` ke `public_html/api/` atau subdomain
2. Upload file `package.json` dan dependencies
3. Set permissions: 644 untuk files, 755 untuk folders

### **Step 3: Install Dependencies**
```bash
cd api/  # atau subdomain
npm install --production
```

### **Step 4: Database Setup**
1. Import `database.sql` ke database
2. Update konfigurasi database di `config.production.env`

### **Step 5: Start Application**
1. Set start command di cPanel Node.js: `node index.js`
2. Set port: `3001`
3. Start application

## 🔧 **Konfigurasi Frontend untuk Production**

### **Update API URL**
Jika backend di subdomain, update di `frontend/build/index.html`:
```html
<script>
  window.REACT_APP_API_URL = 'https://api.yourdomain.com';
</script>
```

### **CORS Configuration**
Update di backend `index.js`:
```javascript
app.use(cors({
  origin: ['https://yourdomain.com', 'https://www.yourdomain.com'],
  credentials: true
}));
```

## 🧪 **Testing Production**

### **1. Test Frontend**
- Buka `https://yourdomain.com`
- Test login dan navigasi
- Test semua fitur utama

### **2. Test API**
- Test endpoint: `https://yourdomain.com/api/` atau `https://api.yourdomain.com/`
- Test login API
- Test tracking API

### **3. Test Database**
- Test koneksi database
- Test CRUD operations
- Test real-time features

## 🛡️ **Security Checklist**

- ✅ HTTPS enabled
- ✅ Environment variables secured
- ✅ Database credentials protected
- ✅ CORS properly configured
- ✅ File permissions set correctly
- ✅ Error logging enabled
- ✅ Backup strategy in place

## 📊 **Monitoring**

### **Logs to Monitor**
- Application logs
- Error logs
- Database logs
- Server logs

### **Performance Metrics**
- Response time
- Memory usage
- CPU usage
- Database connections

## 🔄 **Update Process**

### **Frontend Updates**
1. Build new version: `npm run build`
2. Upload new files to `public_html/`
3. Clear browser cache

### **Backend Updates**
1. Upload new files
2. Restart Node.js application
3. Test functionality

## 🆘 **Troubleshooting**

### **Common Issues**
1. **CORS Error** - Check CORS configuration
2. **Database Connection** - Verify credentials
3. **File Permissions** - Set correct permissions
4. **Node.js Version** - Ensure compatibility

### **Debug Commands**
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Install dependencies
npm install

# Start application
node index.js
```

## 📞 **Support**

Jika ada masalah dengan deployment, periksa:
1. Error logs di cPanel
2. Console browser untuk frontend errors
3. Network tab untuk API errors
4. Database connection status

---

**eSIR 2.0 siap untuk production deployment!** 🚀✨
