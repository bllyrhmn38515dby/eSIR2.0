# 🔧 Troubleshooting User Management

## ❌ Masalah: Error 404 saat Update/Create User

### 🔍 **Gejala:**
- Error 404 saat klik tombol Update/Create User
- Console browser menampilkan: `Failed to load resource: the server responded with a status of 404 (Not Found)`
- Endpoint `/api/auth/users` tidak ditemukan

### 🛠️ **Solusi:**

#### **1. Pastikan Backend Server Berjalan**
```bash
# Cek apakah port 3001 digunakan
netstat -ano | findstr :3001

# Jika ada proses yang menggunakan port 3001, matikan
taskkill /PID <PID> /F

# Jalankan backend
cd backend
npm start
```

#### **2. Test Endpoint API**
```bash
# Test server connection
curl http://localhost:3001/test

# Test auth endpoint (harus return 401 tanpa token)
curl http://localhost:3001/api/auth/users
```

#### **3. Perbaikan yang Sudah Dilakukan:**

##### **Backend (auth.js):**
- ✅ Menambahkan role `operator` ke database
- ✅ Memperbaiki role mapping (nama_role → role_id)
- ✅ Memperbaiki handling faskes_id (string → number)
- ✅ Menghapus duplikasi route `/profile`
- ✅ Menambahkan debugging logs

##### **Frontend (UserManagement.js):**
- ✅ Memperbaiki type conversion faskes_id
- ✅ Menambahkan error handling yang lebih baik
- ✅ Menambahkan console.log untuk debugging

#### **4. Langkah Test:**

1. **Login sebagai Admin Pusat:**
   - Email: `admin@pusat.com`
   - Password: `admin123`

2. **Buka User Management:**
   - Klik menu "User Management"

3. **Test Create User:**
   - Klik "Tambah User"
   - Isi form dengan data valid
   - Klik "Simpan"

4. **Test Update User:**
   - Klik tombol edit (✏️) pada user yang ada
   - Ubah data
   - Klik "Update"

#### **5. Debugging:**

##### **Cek Console Browser:**
```javascript
// Buka Developer Tools (F12)
// Lihat tab Console untuk error messages
// Lihat tab Network untuk HTTP requests
```

##### **Cek Console Backend:**
```bash
# Lihat log server untuk debugging info
# Cari pesan seperti:
# - "Update user request:"
# - "Looking for role:"
# - "Using role_id:"
```

#### **6. Jika Masih Error:**

1. **Restart Kedua Server:**
   ```bash
   # Jalankan script start-app.bat
   start-app.bat
   ```

2. **Cek Database Connection:**
   ```bash
   cd backend
   node check-roles.js
   ```

3. **Test Endpoint Manual:**
   ```bash
   cd backend
   node test-endpoints.js
   ```

#### **7. Fallback Solution:**

Jika masih bermasalah, gunakan script test sederhana:

```bash
# Jalankan backend dengan debugging
cd backend
node index.js

# Di terminal lain, test endpoint
node quick-test.js
```

### 📞 **Support:**

Jika masalah masih berlanjut:
1. Cek log error di console browser dan backend
2. Pastikan database MySQL berjalan
3. Pastikan semua dependencies terinstall
4. Restart komputer jika diperlukan

### ✅ **Expected Result:**

Setelah perbaikan, User Management harus berfungsi:
- ✅ Create user baru
- ✅ Update user existing
- ✅ Delete user (kecuali admin pusat)
- ✅ View semua user dengan role dan faskes
- ✅ Role-based access control
