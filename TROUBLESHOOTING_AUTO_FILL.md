# Troubleshooting Auto-Fill Form Rujukan

## 🐛 **Masalah yang Dilaporkan**

**User**: "Ketika cari NIK data yang sudah ada ditemukan, hanya data NIK yang auto muncul di kolom data pasien. Nama pasien, tanggal lahir dan lain nya tidak ikut terisi automatis."

## 🔍 **Analisis Masalah**

### **Kemungkinan Penyebab:**

1. **Format Tanggal**: Data tanggal dari database mungkin tidak kompatibel dengan HTML date input
2. **State Update**: Masalah dengan cara update state formData
3. **Data Response**: Data yang dikembalikan dari backend tidak lengkap
4. **Field Mapping**: Mismatch antara nama field di database dan frontend

## 🛠 **Perbaikan yang Diterapkan**

### **1. Debugging Logs**
```javascript
// Tambahkan console.log untuk debugging
console.log('Pasien ditemukan:', pasien);
console.log('Form data yang akan diupdate:', updatedFormData);
```

### **2. Format Tanggal**
```javascript
// Format tanggal dari MySQL ke HTML date input format
let formattedTanggalLahir = pasien.tanggal_lahir;
if (pasien.tanggal_lahir && typeof pasien.tanggal_lahir === 'string') {
  const date = new Date(pasien.tanggal_lahir);
  if (!isNaN(date.getTime())) {
    formattedTanggalLahir = date.toISOString().split('T')[0];
  }
}
```

### **3. State Update yang Lebih Aman**
```javascript
// Gunakan object langsung daripada callback function
const updatedFormData = {
  ...formData,
  nik: pasien.nik,
  nama_pasien: pasien.nama_pasien,
  tanggal_lahir: formattedTanggalLahir,
  jenis_kelamin: pasien.jenis_kelamin,
  alamat: pasien.alamat,
  telepon: pasien.telepon || ''
};
setFormData(updatedFormData);
```

## 🧪 **Cara Testing**

### **1. Test di Browser Console**
```javascript
// Buka browser console dan test pencarian
// 1. Buka halaman Rujukan
// 2. Klik "Buat Rujukan"
// 3. Input NIK yang sudah ada
// 4. Klik "Cari"
// 5. Lihat console log untuk debugging
```

### **2. Test Endpoint Backend**
```bash
# Test endpoint pencarian pasien
curl -X GET "http://localhost:3001/api/pasien/search?nik=3201234567890001" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### **3. Verifikasi Data Database**
```sql
-- Cek data pasien di database
SELECT * FROM pasien WHERE nik = '3201234567890001';
```

## 📋 **Checklist Debugging**

### **Frontend:**
- [ ] Console log menampilkan data pasien yang ditemukan
- [ ] Console log menampilkan form data yang akan diupdate
- [ ] Tidak ada error JavaScript di console
- [ ] State formData terupdate dengan benar

### **Backend:**
- [ ] Endpoint `/api/pasien/search` berfungsi
- [ ] Response data lengkap (nik, nama_pasien, tanggal_lahir, dll)
- [ ] Format tanggal sesuai (YYYY-MM-DD)
- [ ] Tidak ada error di server log

### **Database:**
- [ ] Data pasien ada di tabel `pasien`
- [ ] Field `nama_pasien` terisi (bukan `nama`)
- [ ] Format tanggal valid
- [ ] Semua field required terisi

## 🔧 **Solusi Alternatif**

### **Jika Masalah Masih Berlanjut:**

1. **Force Re-render Component**
```javascript
// Tambahkan key untuk force re-render
const [formKey, setFormKey] = useState(0);

// Setelah update formData
setFormKey(prev => prev + 1);
```

2. **UseEffect untuk Auto-fill**
```javascript
useEffect(() => {
  if (foundPasien) {
    setFormData(prev => ({
      ...prev,
      nik: foundPasien.nik,
      nama_pasien: foundPasien.nama_pasien,
      // ... lainnya
    }));
  }
}, [foundPasien]);
```

3. **Manual Trigger Update**
```javascript
// Setelah setFormData, trigger manual update
setTimeout(() => {
  // Force re-render form
}, 100);
```

## 📊 **Status Perbaikan**

- ✅ **Debugging logs** ditambahkan
- ✅ **Format tanggal** diperbaiki
- ✅ **State update** dioptimalkan
- 🔄 **Testing** sedang dilakukan
- ⏳ **User feedback** menunggu konfirmasi

## 🚀 **Langkah Selanjutnya**

1. **Test perbaikan** di browser
2. **Verifikasi** auto-fill berfungsi
3. **Hapus debugging logs** jika sudah berfungsi
4. **Dokumentasikan** solusi final
