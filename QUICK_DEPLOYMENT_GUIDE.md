# ⚡ QUICK DEPLOYMENT GUIDE - eSIR 2.0 KE CPANEL
## Panduan Cepat untuk Mengatasi Masalah Deployment

---

## 🎯 **MASALAH UTAMA**
- Frontend di `esirv02.my.id` bisa diakses tapi tidak bisa login
- Harus menjalankan `npm start` di local dulu baru bisa login
- CRUD operations tersimpan di database local, bukan CPanel

**PENYEBAB:** Backend belum di-deploy ke CPanel!

---

## 🚀 **SOLUSI CEPAT (5 LANGKAH)**

### **LANGKAH 1: Siapkan File Backend**
```bash
# 1. Copy template environment
cp backend/env.production.template backend/.env

# 2. Edit file .env, update password database:
DB_PASSWORD=your_actual_database_password_here
```

### **LANGKAH 2: Upload Backend ke CPanel**
1. **Login CPanel** → **File Manager**
2. **Buat folder** `public_html/api/`
3. **Upload semua file** dari `backend/` ke `public_html/api/`
4. **JANGAN upload** folder `node_modules/`

### **LANGKAH 3: Setup Node.js di CPanel**
1. **CPanel** → **Node.js Selector**
2. **Create Application:**
   - Node.js Version: 16.x
   - Application Root: `public_html/api`
   - Application URL: `https://esirv02.my.id/api`
   - Application Startup File: `index.js`
   - Application Port: `3001`

### **LANGKAH 4: Install & Start**
1. **Terminal CPanel:**
   ```bash
   cd public_html/api
   npm install --production
   ```
2. **Node.js Selector** → **Start Application**

### **LANGKAH 5: Test**
1. **Test API:** `https://esirv02.my.id/api/test`
2. **Test Login:** `https://esirv02.my.id/api/auth/login`
3. **Test Frontend:** `https://esirv02.my.id` → Login

---

## ✅ **HASIL YANG DIHARAPKAN**

Setelah deployment berhasil:
- ✅ `https://esirv02.my.id` bisa login tanpa backend local
- ✅ CRUD operations tersimpan di database CPanel
- ✅ Tidak perlu `npm start` di local lagi
- ✅ Semua fitur real-time berfungsi

---

## 🔧 **TROUBLESHOOTING CEPAT**

### **API Tidak Bisa Diakses:**
- Cek status Node.js application di CPanel
- Restart application
- Cek error logs

### **Database Error:**
- Update password di file `.env`
- Cek database user privileges

### **CORS Error:**
- Pastikan domain sudah di CORS origin
- Gunakan HTTPS

---

## 📋 **CHECKLIST CEPAT**

- [ ] File backend diupload ke `public_html/api/`
- [ ] File `.env` dikonfigurasi dengan database CPanel
- [ ] Node.js application dibuat dan diaktifkan
- [ ] Dependencies diinstall
- [ ] Application status "Running"
- [ ] API endpoint `/test` bisa diakses
- [ ] Login berfungsi tanpa backend local

---

**🎉 Setelah 5 langkah ini, aplikasi akan berjalan sepenuhnya di CPanel!**
