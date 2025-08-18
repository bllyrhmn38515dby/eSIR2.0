# 🔧 Troubleshooting Login Issue

## ❌ Masalah: Login tidak redirect ke dashboard

### 🔍 **Gejala:**
- Halaman login muncul
- Klik tombol login
- Halaman tidak redirect ke dashboard
- Tetap di halaman login

### 🛠️ **Solusi yang Telah Dilakukan:**

#### **1. Backend Fixes:**
- ✅ **JWT Configuration** - Membuat file `.env` dengan JWT_SECRET
- ✅ **Login Endpoint** - Memperbaiki response format
- ✅ **Profile Endpoint** - Menambahkan route `/profile` yang hilang
- ✅ **Middleware Auth** - Menambahkan debugging ke middleware
- ✅ **Error Handling** - Memperbaiki error handling

#### **2. Frontend Fixes:**
- ✅ **AuthContext** - Menambahkan debugging dan error handling
- ✅ **Token Management** - Memperbaiki penyimpanan dan penggunaan token
- ✅ **Axios Headers** - Memperbaiki setting Authorization header

### 🚀 **Langkah untuk Menjalankan:**

#### **1. Restart Kedua Server:**
```bash
# Jalankan script start-app.bat
start-app.bat
```

#### **2. Atau Manual:**
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd frontend
npm start
```

#### **3. Test Login:**
1. Buka browser ke `http://localhost:3000`
2. Login dengan:
   - Email: `admin@pusat.com`
   - Password: `admin123`

### 🔍 **Debugging Steps:**

#### **1. Cek Console Browser (F12):**
```javascript
// Lihat tab Console untuk error messages
// Lihat tab Network untuk HTTP requests
// Cari pesan seperti:
// - "🔐 Attempting login with:"
// - "✅ Login response:"
// - "👤 User data:"
```

#### **2. Cek Console Backend:**
```bash
# Lihat log server untuk debugging info
# Cari pesan seperti:
# - "🔍 Middleware - Authorization header:"
# - "✅ Middleware - User authenticated:"
# - "🔍 Profile request for user ID:"
```

### 🛠️ **Manual Fix (Jika Masih Bermasalah):**

#### **1. Clear Browser Data:**
- Buka Developer Tools (F12)
- Tab Application → Storage → Clear storage
- Atau buka `http://localhost:3000` di incognito mode

#### **2. Check Database:**
```bash
cd backend
node check-roles.js
```

#### **3. Test Login API:**
```bash
cd backend
node test-login.js
```

### 📋 **Files yang Diperbaiki:**

#### **Backend:**
- `backend/.env` - JWT configuration
- `backend/routes/auth.js` - Login dan profile endpoints
- `backend/middleware/auth.js` - Authentication middleware

#### **Frontend:**
- `frontend/src/context/AuthContext.js` - Authentication context
- `frontend/src/components/Login.js` - Login component

### ✅ **Expected Result:**

Setelah perbaikan, login harus berfungsi:
- ✅ Login dengan email dan password
- ✅ Token disimpan di localStorage
- ✅ Redirect ke dashboard
- ✅ User data tersedia di context
- ✅ Protected routes berfungsi

### 🚨 **Jika Masih Bermasalah:**

1. **Restart komputer** untuk memastikan tidak ada proses yang stuck
2. **Clear semua cache browser**
3. **Cek apakah port 3000 dan 3001 tidak digunakan oleh aplikasi lain**
4. **Pastikan database MySQL berjalan**

### 📞 **Support:**

Jika masalah masih berlanjut:
1. Cek log error di console browser dan backend
2. Pastikan semua dependencies terinstall
3. Pastikan database MySQL berjalan
4. Restart komputer jika diperlukan
