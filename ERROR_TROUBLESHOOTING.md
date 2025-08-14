# Troubleshooting Error 500 & 404

## 🐛 **Error yang Terjadi**

### **1. Error 500 pada `/api/rujukan`**
```
Failed to load resource: the server responded with a status of 500 (Internal Server Error)
```

### **2. Error 404 pada pencarian pasien**
```
Failed to load resource: the server responded with a status of 404 (Not Found)
```

### **3. Socket Connection Issues**
```
SocketContext.js:61 ❌ Socket disconnected: io client disconnect
```

## 🔍 **Analisis Masalah**

### **Penyebab Error 500:**
1. **Field `nama_lengkap` tidak ada** di tabel `users`
2. **Routing conflict** di endpoint pasien
3. **Database connection issues**

### **Penyebab Error 404:**
1. **NIK tidak ditemukan** di database
2. **Routing conflict** - endpoint `/search` diletakkan setelah `/:id`

### **Penyebab Socket Issues:**
1. **Backend restart** menyebabkan socket terputus
2. **Authentication issues**

## 🛠 **Perbaikan yang Diterapkan**

### **1. Perbaikan Routing Pasien**
```javascript
// Urutan yang benar:
router.get('/', verifyToken, async (req, res) => { ... });        // Get all pasien
router.get('/search', verifyToken, async (req, res) => { ... });  // Search pasien
router.get('/:id', verifyToken, async (req, res) => { ... });     // Get by ID
```

### **2. Perbaikan Field Users**
```javascript
// Sebelum (Error):
u.nama_lengkap as user_nama

// Sesudah (Fixed):
u.nama as user_nama
```

### **3. Restart Backend**
```bash
# Kill semua proses Node.js
taskkill /f /im node.exe

# Restart backend
npm start
```

## 📋 **Status Perbaikan**

- ✅ **Routing conflict** diperbaiki
- ✅ **Field users** diperbaiki
- ✅ **Backend restart** dilakukan
- 🔄 **Testing** perlu dilakukan
- ⏳ **Data sample** perlu ditambahkan

## 🧪 **Cara Testing**

### **1. Test Backend API**
```bash
# Test endpoint rujukan
curl -X GET "http://localhost:3001/api/rujukan" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test endpoint pencarian pasien
curl -X GET "http://localhost:3001/api/pasien/search?nik=3201234567890001" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### **2. Test di Browser**
1. **Buka browser** dan akses aplikasi
2. **Login** ke sistem
3. **Akses menu Rujukan**
4. **Klik "Buat Rujukan"**
5. **Input NIK** yang valid
6. **Klik "Cari"**
7. **Verifikasi** tidak ada error di console

### **3. Test Auto-Fill**
1. **Input NIK**: `3201234567890001`
2. **Klik "Cari"**
3. **Verifikasi** semua field terisi:
   - ✅ NIK: 3201234567890001
   - ✅ Nama Pasien: Ahmad Rizki
   - ✅ Tanggal Lahir: 1990-05-15
   - ✅ Jenis Kelamin: Laki-laki
   - ✅ Alamat: Jl. Sudirman No. 123, Bogor
   - ✅ Telepon: 08123456789

## 🔧 **Data Sample untuk Testing**

### **Pasien yang Tersedia:**
- **NIK**: `3201234567890001` → **Ahmad Rizki**
- **NIK**: `3201234567890002` → **Siti Nurhaliza**
- **NIK**: `3201234567890003` → **Budi Santoso**

### **Jika Data Tidak Ada:**
1. **Jalankan script** `add-sample-pasien.js`
2. **Atau input manual** di database
3. **Atau gunakan NIK baru** untuk test "pasien baru"

## 📊 **Expected Results**

### **Setelah Perbaikan:**
- ✅ **Error 500** hilang
- ✅ **Error 404** hanya muncul jika NIK tidak ada
- ✅ **Auto-fill** berfungsi dengan baik
- ✅ **Socket connection** stabil
- ✅ **Form rujukan** berfungsi normal

## 🚀 **Langkah Selanjutnya**

1. **Test perbaikan** di browser
2. **Verifikasi** semua error hilang
3. **Test auto-fill** dengan data sample
4. **Test create rujukan** dengan pasien baru dan existing
5. **Dokumentasikan** hasil testing
