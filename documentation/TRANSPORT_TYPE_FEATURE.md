# 🚑 Fitur Jenis Transportasi Ambulans - eSIR 2.0

## 📋 **Overview**

Fitur ini menambahkan fleksibilitas dalam sistem rujukan ambulans dengan mendukung dua jenis transportasi:

1. **🚑 RS Tujuan Menjemput** (`pickup`) - Ambulans dari RS tujuan menjemput pasien di faskes perujuk
2. **🚑 Faskes Perujuk Mengantarkan** (`delivery`) - Ambulans dari faskes perujuk mengantarkan pasien ke RS tujuan

## 🗂️ **Perubahan Database**

### Tabel `rujukan`
```sql
ALTER TABLE rujukan 
ADD COLUMN transport_type ENUM('pickup', 'delivery') DEFAULT 'pickup' 
COMMENT 'pickup = RS tujuan menjemput, delivery = Faskes perujuk mengantarkan';
```

## 🔧 **Perubahan Backend**

### 1. **API Rujukan** (`backend/routes/rujukan.js`)
- Menambahkan field `transport_type` ke form data
- Validasi transport_type (pickup/delivery)
- Update query INSERT untuk menyertakan transport_type

### 2. **API Tracking** (`backend/routes/tracking.js`)
- Update query untuk mengambil transport_type
- Menambahkan nama_pasien ke response

## 🎨 **Perubahan Frontend**

### 1. **Form Rujukan** (`frontend/src/components/RujukanPage.js`)
- Menambahkan dropdown "Jenis Transportasi"
- Opsi: "🚑 RS Tujuan Menjemput" dan "🚑 Faskes Perujuk Mengantarkan"
- Menambahkan help text untuk menjelaskan perbedaan

### 2. **Tabel Rujukan**
- Menambahkan kolom "Transportasi" di tabel rujukan
- Menampilkan badge dengan jenis transportasi

### 3. **Dashboard Sopir** (`frontend/src/pages/DriverDashboard.js`)
- Menampilkan jenis transportasi di session card
- Menampilkan jenis transportasi di detail session

### 4. **Styling** (`frontend/src/pages/DriverDashboard.css`, `frontend/src/components/RujukanPage.css`)
- Menambahkan CSS untuk `.transport-badge`
- Menambahkan CSS untuk `.form-help`

## 🚀 **Cara Menggunakan**

### 1. **Membuat Rujukan Baru**
1. Buka halaman Rujukan
2. Klik "Tambah Rujukan"
3. Isi data pasien dan rujukan
4. Pilih "Jenis Transportasi":
   - **🚑 RS Tujuan Menjemput**: Ambulans dari RS tujuan akan menjemput pasien
   - **🚑 Faskes Perujuk Mengantarkan**: Ambulans dari faskes perujuk akan mengantarkan pasien
5. Submit form

### 2. **Dashboard Sopir**
- Jenis transportasi ditampilkan di setiap session card
- Informasi transportasi juga tersedia di detail session

## 📊 **Status Tracking**

Status tracking tetap sama untuk kedua jenis transportasi:
- `menunggu` - Ambulans siap berangkat
- `dijemput` - Ambulans dalam perjalanan ke lokasi pasien
- `dalam_perjalanan` - Ambulans membawa pasien
- `tiba` - Ambulans tiba di tujuan

## 🔄 **Alur Sistem**

### **Pickup (RS Tujuan Menjemput)**
```
🏥 RS Tujuan (Base) 
    ↓ (Ambulans berangkat)
🏥 Faskes Perujuk (Jemput pasien)
    ↓ (Dengan pasien)
🏥 RS Tujuan (Antar pasien)
```

### **Delivery (Faskes Perujuk Mengantarkan)**
```
🏥 Faskes Perujuk (Base)
    ↓ (Ambulans berangkat)
🏥 RS Tujuan (Antar pasien)
```

## 🎯 **Keunggulan**

1. **Fleksibilitas**: Mendukung kedua model transportasi
2. **Transparansi**: Jenis transportasi jelas terlihat di semua interface
3. **Efisiensi**: Dapat memilih model yang paling efisien
4. **Tracking**: Real-time tracking tetap berfungsi untuk kedua jenis

## 🔧 **File yang Dimodifikasi**

### Backend:
- `backend/routes/rujukan.js` - API rujukan
- `backend/routes/tracking.js` - API tracking
- `backend/add-transport-type.js` - Script migrasi database

### Frontend:
- `frontend/src/components/RujukanPage.js` - Form dan tabel rujukan
- `frontend/src/components/RujukanPage.css` - Styling form
- `frontend/src/pages/DriverDashboard.js` - Dashboard sopir
- `frontend/src/pages/DriverDashboard.css` - Styling dashboard

### Database:
- `backend/add-transport-type.sql` - Script SQL migrasi

## ✅ **Testing**

1. **Test Form Rujukan**: Pastikan dropdown transportasi berfungsi
2. **Test Database**: Pastikan transport_type tersimpan dengan benar
3. **Test Dashboard**: Pastikan jenis transportasi ditampilkan
4. **Test Tracking**: Pastikan tracking berfungsi untuk kedua jenis

## 🚀 **Deployment**

1. Jalankan script migrasi database:
   ```bash
   cd backend
   node add-transport-type.js
   ```

2. Restart backend server:
   ```bash
   cd backend
   npm start
   ```

3. Refresh frontend untuk melihat perubahan

---

**Fitur ini memberikan fleksibilitas maksimal dalam sistem rujukan ambulans eSIR 2.0!** 🚑✨
