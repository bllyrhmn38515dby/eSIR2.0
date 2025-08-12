# Sprint 2 Lanjutan: Fitur Inti Rujukan - Frontend

## Yang Sudah Selesai ✅

### 1. Halaman Rujukan
- ✅ Form buat rujukan baru dengan dropdown pasien dan faskes
- ✅ Tabel daftar rujukan dengan status badges
- ✅ Modal update status (terima/tolak/selesai)
- ✅ Filter berdasarkan status rujukan
- ✅ Detail rujukan dalam modal
- ✅ Responsive design

### 2. Halaman Faskes (Admin Pusat Only)
- ✅ Form tambah/edit faskes dengan koordinat
- ✅ Tabel daftar faskes dengan tipe badges
- ✅ CRUD operasi lengkap
- ✅ Role-based access control
- ✅ Koordinat display dengan formatting

### 3. Integrasi Lengkap
- ✅ Semua halaman terintegrasi dengan backend API
- ✅ Role-based navigation dan access
- ✅ Error handling yang konsisten
- ✅ Loading states dan user feedback

## Struktur Komponen Baru

```
frontend/src/components/
├── RujukanPage.js              # Halaman manajemen rujukan
├── RujukanPage.css             # Styling halaman rujukan
├── FaskesPage.js               # Halaman manajemen faskes
├── FaskesPage.css              # Styling halaman faskes
└── [komponen sebelumnya...]
```

## Fitur yang Tersedia

### 📋 Manajemen Rujukan
- **Form Buat Rujukan**: 
  - Dropdown pilih pasien (dengan No RM)
  - Dropdown pilih faskes tujuan
  - Input diagnosa dan alasan rujukan
  - Catatan tambahan dari faskes asal

- **Tabel Daftar Rujukan**:
  - Nomor rujukan otomatis
  - Informasi pasien dan faskes
  - Status badges (Menunggu, Diterima, Ditolak, Selesai)
  - Tanggal rujukan
  - Aksi update status dan detail

- **Modal Update Status**:
  - Pilih status (Diterima/Ditolak/Selesai)
  - Catatan dari faskes tujuan
  - Informasi rujukan lengkap
  - Validasi form

### 🏥 Manajemen Faskes (Admin Pusat)
- **Form Tambah/Edit Faskes**:
  - Nama dan tipe faskes (RSUD/Puskesmas/Klinik)
  - Alamat lengkap
  - Nomor telepon
  - Koordinat latitude/longitude

- **Tabel Daftar Faskes**:
  - Tipe badges dengan warna berbeda
  - Alamat dengan truncation
  - Koordinat dengan formatting
  - CRUD operasi lengkap

### 🎨 UI/UX Features
- **Status Badges**: Warna berbeda untuk setiap status
- **Tipe Badges**: Warna berbeda untuk setiap tipe faskes
- **Modal Dialogs**: Form dan detail dalam modal
- **Responsive Tables**: Mobile-friendly dengan horizontal scroll
- **Form Validation**: Client-side validation
- **Loading States**: Feedback visual saat loading
- **Error Handling**: Pesan error yang informatif

## Cara Menjalankan

### 1. Pastikan Backend Berjalan
```bash
cd backend
npm run dev
```

### 2. Jalankan Frontend
```bash
cd frontend
npm start
```

Aplikasi akan berjalan di `http://localhost:3000`

## Testing

### 1. Manajemen Rujukan
1. Login sebagai Admin Faskes atau Admin Pusat
2. Klik menu "Rujukan"
3. Test buat rujukan baru:
   - Pilih pasien dari dropdown
   - Pilih faskes tujuan
   - Isi diagnosa dan alasan
   - Submit form
4. Test update status:
   - Klik "Update Status" pada rujukan pending
   - Pilih status (Diterima/Ditolak/Selesai)
   - Isi catatan
   - Submit
5. Test detail rujukan:
   - Klik "Detail" untuk melihat informasi lengkap

### 2. Manajemen Faskes (Admin Pusat Only)
1. Login sebagai Admin Pusat
2. Klik menu "Faskes"
3. Test tambah faskes baru:
   - Isi nama dan tipe faskes
   - Isi alamat lengkap
   - Isi koordinat (opsional)
   - Submit form
4. Test edit faskes:
   - Klik "Edit" pada faskes
   - Update informasi
   - Submit
5. Test hapus faskes:
   - Klik "Hapus" (akan ada konfirmasi)

### 3. Role-based Access
1. Login sebagai Admin Pusat:
   - Semua menu tersedia
   - Dapat mengelola faskes
2. Login sebagai Admin Faskes:
   - Menu Faskes tidak tersedia
   - Hanya dapat melihat rujukan faskes sendiri

## API Integration

### Endpoints yang Digunakan
- `GET /api/rujukan` - Daftar rujukan
- `POST /api/rujukan` - Buat rujukan baru
- `PUT /api/rujukan/:id/status` - Update status rujukan
- `GET /api/pasien` - Daftar pasien (untuk dropdown)
- `GET /api/faskes` - Daftar faskes (untuk dropdown)
- `POST /api/faskes` - Tambah faskes (Admin Pusat)
- `PUT /api/faskes/:id` - Update faskes (Admin Pusat)
- `DELETE /api/faskes/:id` - Hapus faskes (Admin Pusat)

### Business Rules
- **Rujukan**: Auto-generate nomor rujukan, faskes_asal_id dari user login
- **Status Flow**: pending → diterima/ditolak → selesai
- **Role Access**: Admin Pusat dapat mengelola faskes, Admin Faskes hanya dapat melihat data faskes sendiri
- **Data Filtering**: Admin Faskes hanya melihat rujukan faskes sendiri

## Responsive Design

### Breakpoints
- **Desktop**: > 768px
- **Tablet**: 768px - 1024px
- **Mobile**: < 768px

### Mobile Features
- Collapsible navigation
- Touch-friendly buttons
- Optimized table layout dengan horizontal scroll
- Modal dialogs yang responsive
- Form fields yang mudah diisi di mobile

## Langkah Selanjutnya

Setelah Sprint 2 Lanjutan selesai, kita akan lanjut ke:
1. **Sprint 3**: Implementasi Realtime dengan Socket.IO
   - Notifikasi realtime saat rujukan baru
   - Update status realtime
   - Live dashboard updates
2. **Sprint 4**: Peta Interaktif dengan Leaflet.js
   - Tampilkan semua faskes di peta
   - Garis rujukan antar faskes
   - Marker dengan informasi faskes
3. **Sprint 5**: Fitur Pendukung & UI Polish
   - Manajemen tempat tidur
   - Laporan dan statistik detail
   - Export data
   - Search dan filter advanced

## Troubleshooting

### Common Issues

1. **Dropdown Kosong**
   - Pastikan data pasien dan faskes sudah ada
   - Check API response untuk data
   - Verify authentication token

2. **Status Update Error**
   - Pastikan rujukan masih dalam status 'pending'
   - Check role permissions
   - Verify API endpoint

3. **Form Validation Error**
   - Check required fields
   - Verify data format (koordinat harus angka)
   - Check browser console untuk error

4. **Role Access Error**
   - Pastikan user memiliki role yang sesuai
   - Check middleware permissions
   - Verify user.faskes_id untuk Admin Faskes

### Development Tips

1. **Testing Workflow**:
   - Buat pasien terlebih dahulu
   - Buat faskes (Admin Pusat)
   - Buat rujukan
   - Test update status

2. **Debug Mode**:
   - Gunakan browser dev tools
   - Check Network tab untuk API calls
   - Check Console untuk error messages

3. **Data Consistency**:
   - Pastikan foreign key relationships
   - Check database constraints
   - Verify data integrity
