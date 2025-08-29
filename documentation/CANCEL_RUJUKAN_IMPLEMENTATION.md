# Implementasi Fitur Pembatalan Rujukan - eSIR 2.0

## 🎯 Overview
Fitur pembatalan rujukan telah berhasil diimplementasikan untuk memberikan fleksibilitas dalam manajemen rujukan. Fitur ini memungkinkan faskes asal untuk membatalkan rujukan yang masih dalam status pending.

## ✅ Fitur yang Telah Diimplementasikan

### 1. **Backend Implementation**
- ✅ **Status Baru** (`backend/routes/rujukan.js`)
  - Status `dibatalkan` ditambahkan ke enum status
  - Endpoint `PUT /api/rujukan/:id/cancel` untuk pembatalan
  - Validasi permission (hanya faskes asal yang bisa membatalkan)
  - Validasi status (hanya pending yang bisa dibatalkan)

- ✅ **Database Updates**
  - Update enum status di tabel rujukan
  - Kolom `alasan_pembatalan` untuk tracking
  - Kolom `tanggal_pembatalan` untuk audit trail

- ✅ **API Endpoints**
  - `PUT /api/rujukan/:id/cancel` - Batalkan rujukan
  - Validasi input dan permission
  - Error handling yang komprehensif

### 2. **Frontend Implementation**
- ✅ **Cancel Modal** (`frontend/src/components/RujukanPage.js`)
  - Modal konfirmasi pembatalan
  - Form input alasan pembatalan
  - Warning message untuk user
  - Permission-based button visibility

- ✅ **UI/UX Features**
  - Button "Batalkan" hanya muncul untuk rujukan pending
  - Status badge untuk rujukan dibatalkan
  - Responsive design
  - Loading states dan error handling

### 3. **Security & Validation**
- ✅ **Permission Control**
  - Hanya faskes asal yang bisa membatalkan rujukan
  - Role-based access control
  - Validasi status sebelum pembatalan

- ✅ **Business Logic**
  - Rujukan selesai tidak bisa dibatalkan
  - Rujukan sudah dibatalkan tidak bisa dibatalkan lagi
  - Alasan pembatalan wajib diisi

## 🚀 Cara Setup dan Penggunaan

### 1. **Setup Database**
```sql
-- Jalankan file SQL untuk update tabel rujukan
mysql -u root -p esirv2 < backend/setup-cancel-rujukan.sql
```

### 2. **Testing Fitur**

#### A. Batalkan Rujukan
1. Login sebagai admin faskes asal
2. Buka halaman "Rujukan"
3. Cari rujukan dengan status "Menunggu"
4. Klik tombol "Batalkan"
5. Masukkan alasan pembatalan
6. Klik "Batalkan Rujukan"

#### B. Validasi Permission
1. Login sebagai admin faskes tujuan
2. Coba batalkan rujukan dari faskes lain
3. Sistem akan menolak dengan pesan error

#### C. Validasi Status
1. Coba batalkan rujukan yang sudah selesai
2. Sistem akan menolak dengan pesan error

## 📊 Database Schema Updates

### Tabel Rujukan - Status Enum
```sql
ALTER TABLE rujukan 
MODIFY COLUMN status ENUM('pending', 'diterima', 'ditolak', 'selesai', 'dibatalkan') DEFAULT 'pending';
```

### Kolom Baru
```sql
-- Kolom alasan pembatalan
ALTER TABLE rujukan 
ADD COLUMN alasan_pembatalan TEXT NULL AFTER catatan_tujuan;

-- Kolom tanggal pembatalan
ALTER TABLE rujukan 
ADD COLUMN tanggal_pembatalan TIMESTAMP NULL AFTER tanggal_respon;
```

## 🔄 API Endpoints

### PUT /api/rujukan/:id/cancel
**Request:**
```json
{
  "alasan_pembatalan": "Pasien tidak bisa datang karena sakit"
}
```

**Response Success:**
```json
{
  "success": true,
  "message": "Rujukan berhasil dibatalkan",
  "data": {
    "id": 1,
    "nomor_rujukan": "RJ20241201001",
    "status": "dibatalkan",
    "alasan_pembatalan": "DIBATALKAN: Pasien tidak bisa datang karena sakit",
    "tanggal_pembatalan": "2024-12-01T10:30:00.000Z"
  }
}
```

**Response Error (Permission):**
```json
{
  "success": false,
  "message": "Tidak memiliki izin untuk membatalkan rujukan ini"
}
```

**Response Error (Status):**
```json
{
  "success": false,
  "message": "Rujukan yang sudah selesai tidak dapat dibatalkan"
}
```

## 🎨 UI/UX Features

### 1. **Status Badges**
- **Pending**: Kuning (warning)
- **Diterima**: Hijau (success)
- **Ditolak**: Merah (danger)
- **Selesai**: Biru (info)
- **Dibatalkan**: Abu-abu (secondary)

### 2. **Button Visibility**
- **Update Status**: Hanya untuk rujukan pending
- **Batalkan**: Hanya untuk rujukan pending
- **Detail**: Selalu tersedia

### 3. **Modal Design**
- Konfirmasi pembatalan dengan warning
- Form input alasan yang required
- Button styling yang konsisten
- Responsive design

## 🔒 Security Considerations

### 1. **Permission Control**
- Hanya faskes asal yang bisa membatalkan
- Validasi role dan faskes_id
- Error message yang tidak reveal sensitive info

### 2. **Status Validation**
- Cek status sebelum pembatalan
- Prevent double cancellation
- Prevent cancellation of completed rujukan

### 3. **Input Validation**
- Alasan pembatalan wajib diisi
- Sanitasi input untuk mencegah XSS
- Length validation untuk alasan

## 📈 Business Logic

### 1. **Cancellation Rules**
- ✅ Rujukan pending bisa dibatalkan
- ❌ Rujukan diterima tidak bisa dibatalkan
- ❌ Rujukan ditolak tidak bisa dibatalkan
- ❌ Rujukan selesai tidak bisa dibatalkan
- ❌ Rujukan sudah dibatalkan tidak bisa dibatalkan lagi

### 2. **Permission Rules**
- ✅ Faskes asal bisa membatalkan rujukan mereka
- ❌ Faskes tujuan tidak bisa membatalkan rujukan
- ❌ Admin pusat tidak bisa membatalkan rujukan (bisa ditambahkan)

### 3. **Audit Trail**
- Alasan pembatalan disimpan
- Tanggal pembatalan dicatat
- User yang membatalkan dicatat
- History pembatalan tersimpan

## 🐛 Troubleshooting

### 1. **Button Tidak Muncul**
- Cek status rujukan (harus pending)
- Cek permission user (harus faskes asal)
- Cek role user (harus admin_faskes)

### 2. **Error Permission**
- Pastikan user login sebagai faskes asal
- Cek faskes_id user di database
- Cek role user di database

### 3. **Error Status**
- Pastikan rujukan masih pending
- Cek status rujukan di database
- Pastikan rujukan belum dibatalkan sebelumnya

## 📊 Statistics Update

### Dashboard Stats
Statistik dashboard sekarang termasuk rujukan dibatalkan:
```javascript
{
  total: 100,
  pending: 20,
  diterima: 30,
  ditolak: 10,
  selesai: 35,
  dibatalkan: 5  // Status baru
}
```

## 🚀 Next Steps

### 1. **Enhancement yang Bisa Ditambahkan**
- Email notification untuk pembatalan
- Approval workflow untuk pembatalan
- Reversal pembatalan (undo cancel)
- Bulk cancellation untuk multiple rujukan

### 2. **Monitoring & Analytics**
- Track cancellation rate
- Reason analysis untuk pembatalan
- Time-based cancellation patterns
- User behavior analytics

### 3. **Integration**
- SMS notification untuk pembatalan
- WhatsApp integration
- Push notification
- Admin dashboard untuk monitoring

## ✅ Status Implementasi

**Fitur Pembatalan Rujukan: ✅ SELESAI**

- ✅ Backend API endpoint
- ✅ Database schema updates
- ✅ Frontend modal dan UI
- ✅ Permission control
- ✅ Status validation
- ✅ Error handling
- ✅ User experience
- ✅ Documentation

Fitur ini siap digunakan dan telah mengatasi salah satu poin checklist test blackbox yang belum tersedia di sistem eSIR 2.0.

## 🔄 Workflow Pembatalan

```
1. User Login (Faskes Asal)
   ↓
2. Buka Halaman Rujukan
   ↓
3. Cari Rujukan Pending
   ↓
4. Klik Button "Batalkan"
   ↓
5. Modal Konfirmasi Muncul
   ↓
6. Input Alasan Pembatalan
   ↓
7. Klik "Batalkan Rujukan"
   ↓
8. API Call ke Backend
   ↓
9. Validasi Permission & Status
   ↓
10. Update Database
    ↓
11. Response Success
    ↓
12. Refresh Data & Close Modal
```

Fitur pembatalan rujukan telah berhasil diimplementasikan dengan baik dan siap untuk digunakan dalam sistem eSIR 2.0.
