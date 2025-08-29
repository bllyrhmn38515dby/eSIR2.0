# Perbaikan Error: Connection Refused

## 🐛 **Masalah yang Ditemukan**

**User**: "AuthContext.js:123 GET http://localhost:3001/api/auth/profile net::ERR_CONNECTION_REFUSED"

**Error Details:**
```
❌ Token invalid, trying refresh: Network Error
GET http://localhost:3001/api/auth/profile net::ERR_CONNECTION_REFUSED
POST http://localhost:3001/api/auth/login net::ERR_CONNECTION_REFUSED
POST http://localhost:3001/api/auth/refresh net::ERR_CONNECTION_REFUSED
```

## 🔍 **Analisis Masalah**

### **Root Cause:**
1. **Backend server tidak berjalan**: Server di port 3001 tidak aktif
2. **Database mismatch**: Aplikasi menggunakan database `esirv2` yang benar
3. **Frontend tidak dapat terhubung**: ERR_CONNECTION_REFUSED saat akses API
4. **Authentication gagal**: Token refresh dan login tidak dapat diakses

### **Lokasi Error:**
- Frontend: `AuthContext.js` - Error saat akses API
- Backend: Server tidak berjalan di port 3001
- Database: `esirv2` (sudah benar)

## ✅ **Solusi yang Diterapkan**

### **1. Start Backend Server**
```bash
cd backend
node index.js
```

### **2. Verifikasi Server Status**
```bash
# Cek apakah port 3001 digunakan
netstat -ano | findstr :3001

# Jika ada proses yang menggunakan port 3001, matikan dulu
taskkill /PID <PID> /F
```

### **3. Verifikasi Database Connection**
```javascript
// Server output yang diharapkan:
✅ Server berjalan di port 3001
✅ Database terhubung: esirv2
✅ Test endpoint: http://localhost:3001/test
✅ Login endpoint: http://localhost:3001/api/auth/login
```

### **4. Test API dengan User yang Valid**
```javascript
// File: backend/test-login-only.js
// Test login dengan user dari database esirv2
```

## 🎯 **Keuntungan Solusi**

### **Server:**
- ✅ **Backend berjalan** di port 3001
- ✅ **Database terhubung** ke esirv2
- ✅ **API endpoints** dapat diakses
- ✅ **Authentication** berfungsi

### **Frontend:**
- ✅ **Connection refused** teratasi
- ✅ **Login** dapat dilakukan
- ✅ **Token refresh** berfungsi
- ✅ **API calls** berhasil

### **Database:**
- ✅ **Database esirv2** dengan data lengkap
- ✅ **User authentication** tersedia
- ✅ **Tempat tidur data** tersedia

## 🧪 **Testing**

### **Test Cases:**
1. **Server Status**: Backend berjalan di port 3001
2. **Database Connection**: Terhubung ke esirv2
3. **API Endpoints**: Login, profile, refresh dapat diakses
4. **Frontend Connection**: Tidak ada ERR_CONNECTION_REFUSED
5. **Authentication**: Login dan token refresh berfungsi

### **Expected Results:**
- Server output: "✅ Server berjalan di port 3001"
- Database output: "✅ Database terhubung: esirv2"
- Frontend: Tidak ada error connection refused
- Login: Berhasil dengan user yang valid

## 📊 **Data yang Tersedia di esirv2**

### **Users dengan Role admin_pusat:**
- Billy (admin@esirv2.com)
- Rahman (adminstaff@esirv2.com)
- Admin Test (admin@esir.com)
- helen (billiedeboy@gmail.com)

### **Users dengan Role admin_faskes:**
- Reta (retaazra@esirv2faskes.com)
- willin (willinmm@esirv2faskes.com)

### **Tempat Tidur:**
- 5 records tersedia di database

## 🚀 **Deployment**

### **Langkah-langkah Perbaikan:**

1. **Start Backend Server:**
   ```bash
   cd backend
   node index.js
   ```

2. **Verifikasi Server:**
   - Server berjalan di port 3001
   - Database terhubung ke esirv2
   - Test endpoint: http://localhost:3001/test

3. **Test Login:**
   ```bash
   # Gunakan salah satu user yang valid:
   Email: admin@esirv2.com
   Password: password
   ```

4. **Start Frontend:**
   ```bash
   cd frontend
   npm start
   ```

5. **Test Frontend:**
   - Buka http://localhost:3000
   - Login dengan user yang valid
   - Pastikan tidak ada error connection refused

### **Verification:**
1. Backend server berjalan di port 3001
2. Database terhubung ke esirv2
3. Frontend dapat login tanpa error
4. API calls berhasil
5. Halaman tempat tidur dapat diakses

## 🔧 **Troubleshooting**

### **Jika Server Tidak Start:**
```bash
# Cek port yang digunakan
netstat -ano | findstr :3001

# Matikan proses yang menggunakan port 3001
taskkill /PID <PID> /F

# Start server lagi
node index.js
```

### **Jika Database Error:**
```bash
# Cek koneksi database
node check-esirv2-db.js

# Pastikan MySQL berjalan
# Pastikan database esirv2 ada
```

### **Jika Frontend Masih Error:**
```bash
# Pastikan backend berjalan
# Cek browser console untuk error detail
# Restart frontend jika perlu
```

## 📝 **Kesimpulan**

**Error connection refused telah berhasil diperbaiki** dengan:

1. **Start backend server** di port 3001
2. **Menggunakan database yang benar** (esirv2)
3. **Memverifikasi koneksi database** dan server status
4. **Test API endpoints** dengan user yang valid

**Frontend sekarang dapat terhubung ke backend dan tidak akan menampilkan error connection refused!** 🎉

### **Status:**
- ✅ **Backend**: Berjalan di port 3001
- ✅ **Database**: esirv2 dengan data lengkap
- ✅ **API**: Endpoints dapat diakses
- ✅ **Frontend**: Dapat login dan akses API
- ✅ **Authentication**: Login dan token refresh berfungsi
