# Implementasi Form Rujukan Terintegrasi eSIR 2.0

## 🎯 **Tujuan Implementasi**

Mengubah alur pembuatan rujukan dari **2 langkah terpisah** menjadi **1 langkah terintegrasi**:
- ❌ **Sebelum**: Menu Pasien → Input pasien → Menu Rujukan → Pilih pasien → Input rujukan
- ✅ **Sesudah**: Menu Rujukan → Input pasien + rujukan dalam 1 form

## 🔧 **Fitur yang Ditambahkan**

### **1. Pencarian Pasien Cerdas**
- ✅ **Input NIK** → Auto-search pasien existing
- ✅ **Jika ditemukan**: Auto-fill data pasien (editable)
- ✅ **Jika tidak ada**: Mode tambah pasien baru
- ✅ **Indikator visual**: Status "Pasien Ditemukan" vs "Pasien Baru"

### **2. Form Terintegrasi**
- ✅ **Section 1**: Pencarian Pasien
- ✅ **Section 2**: Data Pasien (editable)
- ✅ **Section 3**: Data Rujukan
- ✅ **Validasi lengkap**: Frontend + Backend

### **3. Workflow Fleksibel**
- ✅ **Pasien baru**: Create pasien + create rujukan
- ✅ **Pasien existing**: Update pasien + create rujukan
- ✅ **Data konsisten**: Sinkron dengan menu Pasien

## 📋 **Struktur Form Baru**

### **🔍 Section Pencarian Pasien:**
```
┌─────────────────────────────────────┐
│  🔍 Pencarian Pasien                │
├─────────────────────────────────────┤
│  NIK Pasien: [3201234567890001] [🔍 Cari] [🔄 Reset] │
│                                     │
│  ✅ Pasien ditemukan: Ahmad Rizki   │
│  ℹ️ Pasien baru akan dibuat         │
└─────────────────────────────────────┘
```

### **📋 Section Data Pasien:**
```
┌─────────────────────────────────────┐
│  📋 Data Pasien                     │
├─────────────────────────────────────┤
│  NIK *: [3201234567890001] (readonly jika ditemukan) │
│  Nama Pasien *: [Ahmad Rizki]       │
│  Tanggal Lahir *: [1990-05-15]      │
│  Jenis Kelamin *: [Laki-laki ▼]     │
│  Alamat *: [Jl. Sudirman No.123]    │
│  Telepon: [08123456789]             │
└─────────────────────────────────────┘
```

### **📄 Section Data Rujukan:**
```
┌─────────────────────────────────────┐
│  📄 Data Rujukan                    │
├─────────────────────────────────────┤
│  Faskes Asal *: [Puskesmas Bogor ▼] │
│  Faskes Tujuan *: [RSUD Bogor ▼]    │
│  Diagnosa *: [Demam Berdarah]       │
│  Alasan Rujukan *: [Perlu perawatan intensif] │
│  Catatan Asal: [Catatan tambahan]   │
└─────────────────────────────────────┘
```

## 🔄 **Alur User Experience**

### **Scenario 1: Pasien Baru**
1. User input NIK → "Tidak ditemukan"
2. Form mode "Tambah Pasien Baru"
3. User isi data pasien + data rujukan
4. Klik "Buat Pasien & Rujukan"
5. **Result**: Create pasien + create rujukan

### **Scenario 2: Pasien Existing**
1. User input NIK → "Ditemukan: Ahmad Rizki"
2. Form mode "Edit Pasien + Rujukan Baru"
3. User bisa edit data pasien + isi data rujukan
4. Klik "Update Pasien & Buat Rujukan"
5. **Result**: Update pasien + create rujukan

## 🛠 **Perubahan Backend**

### **1. Endpoint Pencarian Pasien:**
```javascript
// GET /api/pasien/search?nik=3201234567890001
router.get('/search', verifyToken, async (req, res) => {
  // Cari pasien berdasarkan NIK
  // Return 404 jika tidak ditemukan
  // Return data pasien jika ditemukan
});
```

### **2. Endpoint Rujukan Terintegrasi:**
```javascript
// POST /api/rujukan/with-pasien
router.post('/with-pasien', verifyToken, async (req, res) => {
  // 1. Validasi input (pasien + rujukan)
  // 2. Cek apakah pasien sudah ada (berdasarkan NIK)
  // 3. Jika ada: Update pasien
  // 4. Jika tidak ada: Create pasien baru
  // 5. Create rujukan dengan pasien_id
  // 6. Send notification
  // 7. Return response
});
```

### **3. Logika Bisnis:**
```javascript
// Cek pasien existing
const [existingPasien] = await db.execute(
  'SELECT id FROM pasien WHERE nik = ?', [nik]
);

if (existingPasien.length > 0) {
  // Update pasien existing
  pasienId = existingPasien[0].id;
  await db.execute('UPDATE pasien SET ... WHERE id = ?', [...]);
} else {
  // Create pasien baru
  const [pasienResult] = await db.execute(
    'INSERT INTO pasien (...) VALUES (...)', [...]
  );
  pasienId = pasienResult.insertId;
}

// Create rujukan
await db.execute('INSERT INTO rujukan (...) VALUES (...)', [...]);
```

## 🎨 **Perubahan Frontend**

### **1. State Management:**
```javascript
const [formData, setFormData] = useState({
  // Data Pasien
  nik: '',
  nama_pasien: '',
  tanggal_lahir: '',
  jenis_kelamin: 'L',
  alamat: '',
  telepon: '',
  // Data Rujukan
  faskes_asal_id: '',
  faskes_tujuan_id: '',
  diagnosa: '',
  alasan_rujukan: '',
  catatan_asal: ''
});

const [searchNik, setSearchNik] = useState('');
const [foundPasien, setFoundPasien] = useState(null);
const [isSearching, setIsSearching] = useState(false);
const [isNewPasien, setIsNewPasien] = useState(false);
```

### **2. Fungsi Pencarian:**
```javascript
const handleSearchPasien = async () => {
  // 1. Validasi NIK (16 digit)
  // 2. Call API search pasien
  // 3. Jika ditemukan: Auto-fill form
  // 4. Jika tidak ada: Mode tambah baru
  // 5. Update state sesuai hasil
};
```

### **3. Form Submission:**
```javascript
const handleSubmit = async (e) => {
  // 1. Call API /api/rujukan/with-pasien
  // 2. Handle response (success/error)
  // 3. Reset form dan close modal
  // 4. Refresh data rujukan
};
```

## 🎯 **Keuntungan Sistem Baru**

### **1. Efisiensi:**
- ✅ **Lebih cepat**: 1 form untuk 2 operasi
- ✅ **Lebih praktis**: Tidak perlu pindah menu
- ✅ **Workflow natural**: Sesuai proses nyata

### **2. User Experience:**
- ✅ **Cerdas**: Auto-detect pasien existing
- ✅ **Fleksibel**: Bisa edit data pasien
- ✅ **Konsisten**: Data tetap sinkron

### **3. Maintainability:**
- ✅ **Backward compatible**: Endpoint lama tetap berfungsi
- ✅ **Modular**: Kode terorganisir dengan baik
- ✅ **Scalable**: Mudah ditambah fitur baru

## 🧪 **Testing**

### **Test Case 1: Pasien Baru**
1. Input NIK yang belum ada
2. Isi semua field wajib
3. Submit form
4. **Expected**: Pasien baru + rujukan berhasil dibuat

### **Test Case 2: Pasien Existing**
1. Input NIK yang sudah ada
2. Edit data pasien (opsional)
3. Isi data rujukan
4. Submit form
5. **Expected**: Data pasien terupdate + rujukan baru dibuat

### **Test Case 3: Validasi**
1. Input NIK format salah
2. Kosongkan field wajib
3. Submit form
4. **Expected**: Error message yang informatif

## 📊 **Status Implementasi**

- ✅ **Frontend**: Form terintegrasi selesai
- ✅ **Backend**: Endpoint pencarian dan rujukan terintegrasi selesai
- ✅ **Database**: Tidak perlu perubahan struktur
- ✅ **CSS**: Styling form section selesai
- ✅ **Validation**: Frontend + backend validation selesai

## 🚀 **Cara Penggunaan**

1. **Akses menu Rujukan**
2. **Klik "Buat Rujukan"**
3. **Input NIK pasien** → Klik "Cari"
4. **Jika ditemukan**: Data otomatis terisi (bisa diedit)
5. **Jika tidak ada**: Isi data pasien baru
6. **Isi data rujukan** (faskes, diagnosa, dll)
7. **Klik submit** → Selesai!

**Menu Pasien tetap ada** untuk keperluan manajemen data pasien secara terpisah.
