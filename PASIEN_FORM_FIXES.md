# Perbaikan Form Pasien eSIR 2.0

## Masalah yang Ditemukan

### **Error "Nama, NIK, Tanggal lahir, Jenis Kelamin, dan alamat wajib diisi"**
- **Penyebab**: Ketidaksesuaian field antara frontend dan backend
- **Gejala**: Form tidak memiliki field NIK, hanya ada No RM
- **Dampak**: User tidak dapat menambahkan pasien baru

## Analisis Masalah

### **Backend mengharapkan field:**
- `nama` → seharusnya `nama_pasien`
- `nik` → field ini tidak ada di frontend
- `tanggal_lahir` → sudah sesuai
- `jenis_kelamin` → sudah sesuai
- `alamat` → sudah sesuai

### **Frontend mengirim field:**
- `nama_pasien` → sudah sesuai dengan database
- `no_rm` → field ini tidak diharapkan backend
- `tanggal_lahir` → sudah sesuai
- `jenis_kelamin` → sudah sesuai
- `alamat` → sudah sesuai

## Solusi yang Diterapkan

### 1. **Perbaikan Backend (routes/pasien.js)**
- ✅ Mengubah field `nama` menjadi `nama_pasien`
- ✅ Menambahkan field `no_rm` di validasi dan query
- ✅ Memperbaiki validasi untuk menggunakan field yang benar
- ✅ Menambahkan validasi duplikasi No RM
- ✅ Memperbaiki query INSERT dan UPDATE

### 2. **Perbaikan Frontend (PasienPage.js)**
- ✅ Menambahkan field NIK di form
- ✅ Menambahkan validasi NIK (16 digit angka)
- ✅ Memperbaiki struktur form yang duplikat
- ✅ Menambahkan kolom NIK di tabel
- ✅ Memperbaiki fungsi handleEdit dan resetForm

## Perubahan Detail

### **Backend Changes:**

#### **Create Pasien:**
```javascript
// Sebelum
const { nama, nik, ... } = req.body;
if (!nama || !nik || ...) { ... }

// Sesudah
const { nama_pasien, nik, no_rm, ... } = req.body;
if (!nama_pasien || !nik || ...) { ... }
```

#### **Update Pasien:**
```javascript
// Sebelum
SET nama = ?, nik = ?, ...

// Sesudah
SET nama_pasien = ?, nik = ?, no_rm = ?, ...
```

### **Frontend Changes:**

#### **Form Structure:**
```javascript
// Sebelum
{
  no_rm: '',
  nama_pasien: '',
  tanggal_lahir: '',
  // tidak ada NIK
}

// Sesudah
{
  no_rm: '',
  nama_pasien: '',
  nik: '', // ✅ Ditambahkan
  tanggal_lahir: '',
  // ...
}
```

#### **Form Fields:**
```html
<!-- Sebelum -->
<label>No RM *</label>
<input name="no_rm" />

<!-- Sesudah -->
<label>No RM *</label>
<input name="no_rm" />
<label>NIK *</label>
<input name="nik" maxLength="16" pattern="[0-9]{16}" />
```

## Validasi yang Ditambahkan

### **Frontend Validation:**
- ✅ NIK harus 16 digit angka
- ✅ Pattern validation: `[0-9]{16}`
- ✅ MaxLength: 16 karakter
- ✅ Required field untuk NIK

### **Backend Validation:**
- ✅ NIK harus 16 digit angka
- ✅ NIK tidak boleh duplikat
- ✅ No RM tidak boleh duplikat (jika diisi)
- ✅ Semua field wajib terisi

## Struktur Form Baru

### **Row 1:**
- No RM * (required)
- NIK * (required, 16 digit)

### **Row 2:**
- Nama Pasien * (required)
- Tanggal Lahir * (required)

### **Row 3:**
- Jenis Kelamin * (required)
- Telepon (optional)

### **Row 4:**
- Alamat * (required, textarea)

### **Row 5:**
- Nama Wali (optional)
- Telepon Wali (optional)

## Struktur Tabel Baru

### **Kolom yang Ditampilkan:**
1. No RM
2. NIK ✅ (Ditambahkan)
3. Nama Pasien
4. Tanggal Lahir
5. Jenis Kelamin
6. Telepon
7. Aksi

## Testing

### **Test Case 1: Menambah Pasien Baru**
1. Klik "Tambah Pasien"
2. Isi semua field wajib:
   - No RM: RM001
   - NIK: 3201234567890001
   - Nama: Ahmad Rizki
   - Tanggal Lahir: 1990-05-15
   - Jenis Kelamin: Laki-laki
   - Alamat: Jl. Sudirman No.123
3. Klik "Simpan"
4. **Expected**: Pasien berhasil ditambahkan

### **Test Case 2: Validasi NIK**
1. Coba isi NIK dengan format salah:
   - NIK: 123 (kurang dari 16 digit)
   - NIK: abcdefghijklmnop (bukan angka)
2. **Expected**: Form tidak bisa disubmit

### **Test Case 3: Validasi Duplikasi**
1. Coba tambah pasien dengan NIK yang sudah ada
2. **Expected**: Error "NIK sudah terdaftar"

### **Test Case 4: Edit Pasien**
1. Klik "Edit" pada pasien yang ada
2. Ubah data
3. Klik "Update"
4. **Expected**: Data berhasil diupdate

## Error Messages

### **Frontend Validation:**
- "NIK harus 16 digit angka" (pattern validation)
- "Field ini wajib diisi" (required validation)

### **Backend Validation:**
- "Nama, NIK, tanggal lahir, jenis kelamin, dan alamat wajib diisi"
- "NIK harus 16 digit angka"
- "NIK sudah terdaftar"
- "No RM sudah terdaftar"

## Kesimpulan

Setelah perbaikan ini:
- ✅ Form pasien sudah memiliki field NIK
- ✅ Validasi frontend dan backend sudah sesuai
- ✅ Error "field wajib diisi" sudah diperbaiki
- ✅ Struktur database dan form sudah konsisten
- ✅ User experience sudah ditingkatkan

Form pasien sekarang dapat:
- Menambahkan pasien baru dengan NIK
- Memvalidasi format NIK (16 digit angka)
- Mencegah duplikasi NIK dan No RM
- Menampilkan data NIK di tabel
- Mengedit data pasien dengan benar
