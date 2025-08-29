# Troubleshooting Dropdown Faskes

## 🐛 **Masalah yang Dilaporkan**

**User**: "Ada kendala ketika memilih faskes awal data faskes tidak muncul begitu pun dengan faskes akhir"

## 🔍 **Analisis Masalah**

### **Kemungkinan Penyebab:**
1. **Data faskes kosong** di database
2. **Error saat fetch data** faskes dari backend
3. **State faskes tidak terupdate** dengan benar
4. **Network error** saat request ke API
5. **Authentication issues** dengan token

## 🛠 **Perbaikan yang Diterapkan**

### **1. Debugging Logs**
```javascript
// Tambahkan console.log untuk debugging
console.log('Data faskes:', faskesRes.data.data);
console.log('Rendering faskes dropdown, count:', faskes.length);
console.log('Faskes item:', f);
```

### **2. Verifikasi Data Sample**
```bash
# Jalankan script untuk memastikan data faskes ada
node add-sample-data.js
```

### **3. Data Sample yang Tersedia**
- **RSUD Kota Bogor** (RSUD)
- **Puskesmas Bogor Utara** (Puskesmas)
- **Klinik Sejahtera** (Klinik)
- **RS Hermina Bogor** (RS Swasta)

## 🧪 **Cara Testing**

### **1. Test di Browser Console**
```javascript
// Buka browser console dan test:
// 1. Buka halaman Rujukan
// 2. Klik "Buat Rujukan"
// 3. Lihat console log untuk debugging
// 4. Verifikasi data faskes muncul
```

### **2. Test Backend API**
```bash
# Test endpoint faskes
curl -X GET "http://localhost:3001/api/faskes" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### **3. Verifikasi Database**
```sql
-- Cek data faskes di database
SELECT * FROM faskes;
```

## 📋 **Checklist Debugging**

### **Frontend:**
- [ ] Console log menampilkan data faskes
- [ ] State faskes terisi dengan benar
- [ ] Dropdown menampilkan opsi faskes
- [ ] Tidak ada error JavaScript di console

### **Backend:**
- [ ] Endpoint `/api/faskes` berfungsi
- [ ] Response data faskes lengkap
- [ ] Tidak ada error di server log
- [ ] Authentication berfungsi

### **Database:**
- [ ] Tabel `faskes` ada data
- [ ] Field `nama_faskes` dan `tipe` terisi
- [ ] Data sample sudah ditambahkan

## 🔧 **Solusi Alternatif**

### **Jika Masalah Masih Berlanjut:**

1. **Force Re-render Component**
```javascript
// Tambahkan key untuk force re-render
const [formKey, setFormKey] = useState(0);

// Setelah fetch data
setFormKey(prev => prev + 1);
```

2. **Manual Fetch Faskes**
```javascript
// Fetch faskes secara terpisah
const fetchFaskes = async () => {
  try {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const response = await axios.get('http://localhost:3001/api/faskes', { headers });
    setFaskes(response.data.data);
  } catch (error) {
    console.error('Error fetching faskes:', error);
  }
};
```

3. **Error Handling yang Lebih Baik**
```javascript
// Tambahkan error handling
if (faskesRes.data.success) {
  setFaskes(faskesRes.data.data);
} else {
  console.error('Failed to fetch faskes:', faskesRes.data.message);
}
```

## 📊 **Status Perbaikan**

- ✅ **Data sample** sudah ditambahkan
- ✅ **Debugging logs** ditambahkan
- 🔄 **Testing** perlu dilakukan
- ⏳ **User feedback** menunggu konfirmasi

## 🚀 **Langkah Selanjutnya**

1. **Test perbaikan** di browser
2. **Verifikasi** dropdown faskes muncul
3. **Test pilihan** faskes asal dan tujuan
4. **Hapus debugging logs** jika sudah berfungsi
5. **Dokumentasikan** solusi final

## 📋 **Expected Results**

### **Setelah Perbaikan:**
- ✅ **Dropdown faskes** menampilkan opsi
- ✅ **Faskes asal** bisa dipilih
- ✅ **Faskes tujuan** bisa dipilih
- ✅ **Data faskes** lengkap (nama + tipe)
- ✅ **Tidak ada error** di console
