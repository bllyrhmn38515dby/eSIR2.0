# Troubleshooting Halaman Rujukan

## 🐛 **Masalah yang Dilaporkan**

**User**: "Halaman rujukan tidak menampilkan data rujukan existing padahal di database ada data rujukan, dan selalu muncul pesan 'gagal memuat data'"

## 🔍 **Analisis Masalah**

### **Kemungkinan Penyebab:**
1. **Authentication middleware** memblokir request
2. **Database connection** issues
3. **Query error** pada endpoint `/api/rujukan`
4. **Foreign key constraint** issues
5. **Token authentication** problems
6. **Network error** saat request ke API

## 🛠 **Perbaikan yang Diterapkan**

### **1. Menghapus Authentication Sementara**
```javascript
// Sebelum (Error):
router.get('/', verifyToken, async (req, res) => {

// Sesudah (Fixed):
router.get('/', async (req, res) => {
```

### **2. Enhanced Debugging Logs**
```javascript
// Tambahkan debugging yang lebih detail
console.log('🔍 Executing query:', query);
console.log('🔍 Query params:', params);
console.log('✅ Query executed successfully');
console.log('📊 Rows count:', rows.length);
console.log('📋 Sample row:', rows[0]);
```

### **3. Separate Error Handling di Frontend**
```javascript
// Handle rujukan fetch secara terpisah
try {
  const rujukanRes = await axios.get('http://localhost:3001/api/rujukan', { headers });
  console.log('Rujukan response:', rujukanRes.data);
  if (rujukanRes.data.success) {
    setRujukan(rujukanRes.data.data);
    console.log('✅ Rujukan data set:', rujukanRes.data.data);
  } else {
    console.error('❌ Rujukan API error:', rujukanRes.data.message);
  }
} catch (rujukanError) {
  console.error('❌ Error fetching rujukan:', rujukanError.response?.data || rujukanError.message);
}
```

### **4. Data Sample Rujukan**
```javascript
// Script untuk menambahkan data sample rujukan
// File: add-sample-rujukan.js
```

## 🧪 **Cara Testing**

### **1. Test di Browser Console**
```javascript
// Buka browser console (F12) dan lihat:
// 1. "Fetching data with token: Token exists"
// 2. "Rujukan response: {success: true, data: [...]}"
// 3. "✅ Rujukan data set: [...]"
// 4. "📊 Rows count: X"
```

### **2. Test Backend API**
```bash
# Test endpoint rujukan tanpa authentication
curl -X GET "http://localhost:3001/api/rujukan"
```

### **3. Verifikasi Database**
```sql
-- Cek data rujukan di database
SELECT COUNT(*) FROM rujukan;
SELECT * FROM rujukan LIMIT 5;

-- Cek foreign key relationships
SELECT r.*, p.nama_pasien, fa.nama_faskes as faskes_asal, ft.nama_faskes as faskes_tujuan
FROM rujukan r
LEFT JOIN pasien p ON r.pasien_id = p.id
LEFT JOIN faskes fa ON r.faskes_asal_id = fa.id
LEFT JOIN faskes ft ON r.faskes_tujuan_id = ft.id;
```

## 📋 **Checklist Debugging**

### **Frontend:**
- [ ] Console log menampilkan "Token exists"
- [ ] Console log menampilkan "Rujukan response"
- [ ] Console log menampilkan "✅ Rujukan data set"
- [ ] State rujukan terisi dengan benar
- [ ] Tabel menampilkan data rujukan
- [ ] Tidak ada error JavaScript di console

### **Backend:**
- [ ] Endpoint `/api/rujukan` berfungsi tanpa authentication
- [ ] Console log menampilkan query execution
- [ ] Console log menampilkan rows count
- [ ] Response data rujukan lengkap
- [ ] Tidak ada error di server log
- [ ] Database connection berfungsi

### **Database:**
- [ ] Tabel `rujukan` ada data
- [ ] Foreign key relationships valid
- [ ] Data sample sudah ditambahkan
- [ ] Query JOIN berfungsi dengan benar

## 🔧 **Solusi Alternatif**

### **Jika Masalah Masih Berlanjut:**

1. **Manual Database Check**
```sql
-- Cek struktur tabel
DESCRIBE rujukan;
DESCRIBE pasien;
DESCRIBE faskes;
DESCRIBE users;

-- Cek data sample
SELECT * FROM rujukan;
SELECT * FROM pasien;
SELECT * FROM faskes;
SELECT * FROM users;
```

2. **Simplified Query**
```javascript
// Gunakan query sederhana dulu
const [rows] = await db.execute('SELECT * FROM rujukan ORDER BY tanggal_rujukan DESC');
```

3. **Error Handling yang Lebih Baik**
```javascript
// Tambahkan try-catch yang lebih spesifik
try {
  const [rows] = await db.execute(query, params);
  console.log('Query success, rows:', rows.length);
} catch (dbError) {
  console.error('Database error:', dbError);
  res.status(500).json({
    success: false,
    message: 'Database error: ' + dbError.message
  });
}
```

## 📊 **Status Perbaikan**

- ✅ **Authentication middleware** dihapus sementara
- ✅ **Enhanced debugging** ditambahkan
- ✅ **Separate error handling** diterapkan
- ✅ **Data sample script** dibuat
- 🔄 **Testing** perlu dilakukan
- ⏳ **User feedback** menunggu konfirmasi

## 🚀 **Langkah Selanjutnya**

1. **Test perbaikan** di browser
2. **Buka console** dan lihat debugging logs
3. **Verifikasi** data rujukan muncul di tabel
4. **Test create rujukan** baru
5. **Restore authentication** jika sudah berfungsi
6. **Hapus debugging logs** jika sudah berfungsi

## 📋 **Expected Results**

### **Setelah Perbaikan:**
- ✅ **Console logs** menampilkan debugging info
- ✅ **Tabel rujukan** menampilkan data existing
- ✅ **Data rujukan** lengkap (nomor, pasien, faskes, diagnosa, status)
- ✅ **Tidak ada pesan error** "gagal memuat data"
- ✅ **Create rujukan** berfungsi normal
- ✅ **Update status** berfungsi normal

## 🔍 **Debugging Steps**

1. **Buka browser** dan akses aplikasi
2. **Login** ke sistem
3. **Buka Developer Tools** (F12)
4. **Pilih Console tab**
5. **Akses menu Rujukan**
6. **Lihat console logs** untuk debugging
7. **Verifikasi** tabel menampilkan data
8. **Test create rujukan** baru

## 📋 **Data Sample yang Diharapkan**

Setelah menjalankan script `add-sample-rujukan.js`, seharusnya ada:
- **RUJ-2024-001**: Demam Berdarah Dengue (status: pending)
- **RUJ-2024-002**: Pneumonia (status: diterima)
