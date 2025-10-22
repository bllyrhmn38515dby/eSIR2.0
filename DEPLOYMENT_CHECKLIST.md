# ✅ CHECKLIST DEPLOYMENT eSIR 2.0 KE CPANEL

## 📋 **PERSIAPAN SEBELUM DEPLOYMENT**

### **1. Verifikasi Hosting CPanel**
- [ ] Hosting mendukung Node.js (versi 16+)
- [ ] Hosting mendukung MySQL Database
- [ ] Hosting mendukung WebSocket (untuk Socket.IO)
- [ ] Hosting memiliki Terminal Access
- [ ] SSL Certificate aktif

### **2. Verifikasi Database**
- [ ] Database `rrpzeeja_prodsysesirv02` sudah dibuat
- [ ] User `rrpzeeja_esirv2_user` sudah dibuat
- [ ] User memiliki privileges pada database
- [ ] Database schema sudah di-import
- [ ] Password database sudah diketahui

---

## 📋 **LANGKAH DEPLOYMENT BACKEND**

### **3. Siapkan File Backend**
- [ ] Copy `backend/env.production.template` menjadi `backend/.env`
- [ ] Update `DB_PASSWORD` dengan password database yang benar
- [ ] Pastikan semua file backend siap (kecuali `node_modules/`)
- [ ] Verifikasi CORS configuration di `index.js`

### **4. Upload Backend ke CPanel**
- [ ] Login ke CPanel File Manager
- [ ] Buat folder `public_html/api/`
- [ ] Upload semua file backend ke `public_html/api/`
- [ ] Set permission folder `uploads/` ke 755 atau 777
- [ ] Pastikan file `.env` terupload dengan benar

### **5. Setup Node.js di CPanel**
- [ ] Buka Node.js Selector di CPanel
- [ ] Buat aplikasi baru dengan konfigurasi:
  - Node.js Version: 16.x atau 18.x
  - Application Root: `public_html/api`
  - Application URL: `https://esirv02.my.id/api`
  - Application Startup File: `index.js`
  - Application Port: `3001`
- [ ] Install dependencies via Terminal: `npm install --production`
- [ ] Start aplikasi dan pastikan status "Running"

---

## 📋 **LANGKAH DEPLOYMENT FRONTEND**

### **6. Siapkan File Frontend**
- [ ] Copy `frontend/env.production.template` menjadi `frontend/.env.production`
- [ ] Update API URL jika diperlukan
- [ ] Build frontend: `npm run build:production`

### **7. Upload Frontend ke CPanel**
- [ ] Upload semua file dari `frontend/build/` ke `public_html/`
- [ ] Pastikan `index.html` ada di root `public_html/`
- [ ] Upload file `.htaccess` untuk routing

---

## 📋 **TESTING DEPLOYMENT**

### **8. Test Backend API**
- [ ] Test endpoint: `https://esirv02.my.id/api/test`
  - Expected: `{"message": "Server is running!"}`
- [ ] Test health check: `https://esirv02.my.id/api/health`
  - Expected: Database connected
- [ ] Test login: `https://esirv02.my.id/api/auth/login`
  - Expected: Login berhasil dengan kredensial default

### **9. Test Frontend**
- [ ] Akses: `https://esirv02.my.id`
  - Expected: Halaman login tampil
- [ ] Login dengan kredensial default:
  - Admin: admin@esir.com / admin123
  - RSUD: admin@rsud.com / admin123
  - Puskesmas: admin@puskesmas.com / admin123
- [ ] Expected: Berhasil masuk dashboard

### **10. Test Fitur Utama**
- [ ] CRUD operations tersimpan di database CPanel (bukan local)
- [ ] Real-time features (Socket.IO) berfungsi
- [ ] File upload berfungsi
- [ ] GPS tracking berfungsi
- [ ] Notifikasi real-time berfungsi

---

## 📋 **VERIFIKASI FINAL**

### **11. Pastikan Tidak Perlu Backend Local**
- [ ] Matikan backend local (`npm start`)
- [ ] Matikan database MySQL local
- [ ] Akses `https://esirv02.my.id` → masih bisa login
- [ ] CRUD operations → data tersimpan di database CPanel
- [ ] Semua fitur berfungsi normal

### **12. Performance & Security**
- [ ] SSL certificate aktif (HTTPS)
- [ ] CORS configuration benar
- [ ] Database connection secure
- [ ] File permissions benar
- [ ] Error logging aktif

---

## 🚨 **TROUBLESHOOTING CHECKLIST**

### **Jika Backend API Tidak Bisa Diakses:**
- [ ] Cek status Node.js application di CPanel
- [ ] Cek error logs di Node.js Selector
- [ ] Pastikan port 3001 tidak conflict
- [ ] Restart application

### **Jika Database Connection Error:**
- [ ] Cek kredensial database di file `.env`
- [ ] Pastikan database user memiliki privileges
- [ ] Test koneksi database di phpMyAdmin
- [ ] Cek firewall hosting

### **Jika CORS Error:**
- [ ] Pastikan domain sudah ditambahkan di CORS origin
- [ ] Cek konfigurasi CORS di `index.js`
- [ ] Pastikan menggunakan HTTPS

### **Jika Frontend Tidak Bisa Login:**
- [ ] Cek API URL di frontend configuration
- [ ] Pastikan backend sudah running
- [ ] Cek browser console untuk error
- [ ] Test API endpoint secara langsung

---

## 🎯 **KRITERIA SUKSES**

Deployment dianggap berhasil jika:
- ✅ Aplikasi bisa diakses via `https://esirv02.my.id`
- ✅ Login berfungsi tanpa backend local
- ✅ CRUD operations tersimpan di database CPanel
- ✅ Real-time features berfungsi
- ✅ File upload berfungsi
- ✅ GPS tracking berfungsi
- ✅ Tidak perlu menjalankan `npm start` di local

---

## 📞 **DUKUNGAN**

Jika mengalami masalah:
1. **Cek error logs** di Node.js Selector
2. **Cek database logs** di phpMyAdmin
3. **Test endpoint** satu per satu
4. **Hubungi support hosting** jika diperlukan

---

**🎉 Setelah semua checklist terpenuhi, aplikasi eSIR 2.0 akan berjalan sepenuhnya di CPanel!**
