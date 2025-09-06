# 🚗 Panduan Dashboard Sopir Ambulans - eSIR 2.0

## 📋 **Overview**

Dashboard Sopir Ambulans adalah interface web khusus untuk sopir ambulans yang terintegrasi penuh dengan sistem eSIR 2.0 dan menyediakan semua fungsi tracking yang diperlukan.

## 🎯 **Fitur Utama**

### ✅ **Fitur yang Tersedia:**
- 🔐 **Authentication** - Login dengan role sopir ambulans
- 📍 **GPS Tracking** - Real-time location tracking via browser
- 🗺️ **Session Management** - Kelola session tracking aktif
- 📡 **Real-time Updates** - Socket.IO connection untuk update real-time
- 🎛️ **Status Control** - Update status tracking (menunggu → dijemput → dalam_perjalanan → tiba)
- 💾 **Data Persistence** - Data tersimpan di database
- 📱 **Responsive Design** - Works on mobile dan desktop

### 🚀 **Keunggulan vs Mobile App:**
- ✅ **Tidak perlu install** - Akses langsung via browser
- ✅ **Cross-platform** - Bekerja di semua device dengan browser
- ✅ **Real-time sync** - Terintegrasi dengan sistem utama
- ✅ **Easy maintenance** - Update otomatis tanpa install ulang
- ✅ **Better performance** - Lebih cepat dan stabil

## 🛠️ **Teknologi yang Digunakan**

- **Frontend:** React.js dengan Hooks
- **Styling:** CSS3 dengan responsive design
- **GPS:** Browser Geolocation API
- **Real-time:** Socket.IO client
- **HTTP Client:** Fetch API
- **Authentication:** JWT dengan role-based access

## 🚀 **Cara Menggunakan**

### 1. **Login sebagai Sopir Ambulans**
```
URL: http://localhost:3000/login
Email: driver@esir.com
Password: driver123
```

### 2. **Akses Dashboard Sopir**
```
URL: http://localhost:3000/driver
```

### 3. **Langkah-langkah Tracking:**
1. **Lihat Session Aktif** - Dashboard menampilkan semua session tracking yang aktif
2. **Pilih Session** - Klik pada session yang ingin di-track
3. **Mulai Tracking** - Klik tombol "🚀 Mulai Tracking"
4. **Izinkan GPS** - Browser akan meminta izin akses lokasi
5. **Update Status** - Gunakan tombol status untuk update progress
6. **Monitor Real-time** - Lihat update lokasi dan status secara real-time

## 📊 **Interface Overview**

### **Header Dashboard:**
- 🏠 **Logo eSIR Driver** - Branding dan navigasi
- 👤 **User Info** - Nama dan role user
- 🚪 **Logout** - Keluar dari sistem

### **Session Panel:**
- 📋 **Daftar Session Aktif** - Semua session yang bisa di-track
- 🔄 **Refresh Button** - Update daftar session
- 🚀 **Start Tracking** - Mulai tracking session

### **Tracking Panel:**
- 📍 **Lokasi Saat Ini** - Koordinat GPS real-time
- 🎛️ **Kontrol Status** - Tombol untuk update status
- 📋 **Detail Session** - Informasi lengkap session

## 🔧 **Konfigurasi**

### **Environment Variables:**
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_SOCKET_URL=http://localhost:3001
```

### **GPS Settings:**
```javascript
{
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 5000
}
```

### **Update Interval:**
- **Position Update:** Setiap 10 detik
- **Status Update:** Setiap 30 detik
- **Real-time Sync:** Instant via Socket.IO

## 🎭 **Role & Permissions**

### **Role: sopir_ambulans**
- ✅ Akses ke `/driver` dashboard
- ✅ View active tracking sessions
- ✅ Start/stop tracking
- ✅ Update position dan status
- ❌ Tidak bisa akses fitur admin
- ❌ Tidak bisa manage users

### **Navigation Menu:**
- Hanya menampilkan "Dashboard Sopir" untuk role sopir_ambulans
- Interface yang disederhanakan untuk fokus pada tracking

## 📱 **Mobile Responsive**

### **Desktop (1200px+):**
- 2 kolom layout (sessions + tracking)
- Full feature set
- Large buttons dan text

### **Tablet (768px - 1199px):**
- 1 kolom layout
- Responsive grid
- Touch-friendly interface

### **Mobile (< 768px):**
- Single column layout
- Large touch targets
- Simplified navigation
- Optimized for one-handed use

## 🔒 **Security Features**

- **JWT Authentication** - Secure token-based auth
- **Role-based Access** - Hanya sopir ambulans yang bisa akses
- **HTTPS Ready** - Siap untuk production dengan SSL
- **Input Validation** - Validasi semua input user
- **Error Handling** - Comprehensive error handling

## 🚨 **Troubleshooting**

### **GPS Tidak Bekerja:**
1. Pastikan browser mendukung Geolocation API
2. Izinkan akses lokasi di browser
3. Cek koneksi internet
4. Restart browser jika perlu

### **Session Tidak Muncul:**
1. Pastikan ada session aktif di sistem
2. Cek koneksi ke backend
3. Refresh halaman
4. Cek console untuk error

### **Real-time Update Tidak Bekerja:**
1. Cek koneksi Socket.IO
2. Pastikan backend berjalan
3. Cek firewall settings
4. Restart aplikasi

## 📈 **Performance Tips**

- **Browser Cache** - Enable browser caching untuk faster loading
- **GPS Optimization** - Gunakan enableHighAccuracy untuk akurasi tinggi
- **Network Monitoring** - Monitor koneksi untuk stability
- **Error Recovery** - Automatic retry untuk failed requests

## 🔄 **Integration dengan Sistem Utama**

### **Backend Integration:**
- Menggunakan API endpoints yang sama dengan mobile app
- Real-time updates via Socket.IO
- Database integration untuk persistence

### **Frontend Integration:**
- Terintegrasi dengan AuthContext
- Menggunakan SocketContext untuk real-time
- Consistent dengan design system eSIR 2.0

## 🎉 **Keuntungan Implementasi**

1. **Maintenance Mudah** - Tidak perlu maintain 2 aplikasi terpisah
2. **Update Otomatis** - Perubahan langsung terlihat tanpa install
3. **Cross-platform** - Bekerja di semua device dengan browser
4. **Cost Effective** - Tidak perlu develop mobile app terpisah
5. **Better UX** - Interface yang konsisten dengan sistem utama

## 📞 **Support**

Jika mengalami masalah atau butuh bantuan:
1. Cek console browser untuk error messages
2. Pastikan backend berjalan di port 3001
3. Cek koneksi database
4. Restart aplikasi jika perlu

---

**🎯 Dashboard Sopir Ambulans eSIR 2.0 - Solusi modern untuk tracking ambulans yang terintegrasi penuh dengan sistem utama.**
