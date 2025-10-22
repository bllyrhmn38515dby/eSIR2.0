# 🌐 Panduan Akses Aplikasi eSIR2.0 dari Perangkat Lain

## 📋 Ringkasan
Panduan ini menjelaskan cara mengakses aplikasi eSIR2.0 dari perangkat lain (smartphone, tablet, komputer lain) dalam jaringan yang sama.

## 🔧 Langkah-langkah Setup

### 1. **Setup Otomatis (Recommended)**
```bash
# Jalankan script setup otomatis
setup-network-env.bat

# Kemudian jalankan server
start-network-access.bat
```

### 2. **Setup Manual**

#### A. Buat File Environment
1. Buka folder `frontend`
2. Buat file baru bernama `.env`
3. Isi dengan konfigurasi berikut:
```env
# Konfigurasi untuk akses jaringan
# IP komputer server: 192.168.1.11

# Backend API URL - Ganti dengan IP komputer server Anda
REACT_APP_API_URL=http://192.168.1.11:3001/api

# Socket.IO URL - Ganti dengan IP komputer server Anda  
REACT_APP_SOCKET_URL=http://192.168.1.11:3001

# Google Maps API Key (opsional)
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Konfigurasi untuk development
DANGEROUSLY_DISABLE_HOST_CHECK=true
HOST=0.0.0.0
```

#### B. Jalankan Server
```bash
# Terminal 1 - Backend
cd backend
node index.js

# Terminal 2 - Frontend
cd frontend
set DANGEROUSLY_DISABLE_HOST_CHECK=true
set HOST=0.0.0.0
npm start
```

## 🌐 URL Akses

### Dari Komputer Server:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001

### Dari Perangkat Lain:
- **Frontend**: http://192.168.1.11:3000
- **Backend**: http://192.168.1.11:3001

## 📱 Akses dari Smartphone/Tablet

1. **Pastikan perangkat terhubung ke WiFi yang sama**
2. **Buka browser** (Chrome, Safari, Firefox, dll)
3. **Akses URL**: `http://192.168.1.11:3000`
4. **Login** dengan kredensial yang sama

## 🔍 Troubleshooting

### ❌ Tidak Bisa Akses dari Perangkat Lain

#### 1. **Cek IP Address**
```bash
# Windows
ipconfig

# Linux/Mac
ifconfig
```

#### 2. **Cek Firewall**
- Buka Windows Defender Firewall
- Klik "Allow an app or feature through Windows Defender Firewall"
- Pastikan Node.js dan browser diizinkan

#### 3. **Cek Port**
```bash
# Test apakah port terbuka
telnet 192.168.1.11 3000
telnet 192.168.1.11 3001
```

#### 4. **Cek Jaringan**
- Pastikan semua perangkat dalam subnet yang sama
- Coba ping: `ping 192.168.1.11`

### ❌ Error "Connection Refused"

1. **Restart server** dengan script `start-network-access.bat`
2. **Cek apakah server berjalan** di port yang benar
3. **Update IP address** di file `.env` jika berubah

### ❌ Error "CORS Policy"

1. **Restart backend server**
2. **Cek konfigurasi CORS** di `backend/index.js`
3. **Pastikan IP address** sudah ditambahkan ke whitelist CORS

## 🔧 Konfigurasi Lanjutan

### Menggunakan IP Address Dinamis
Jika IP address berubah, jalankan:
```bash
setup-network-env.bat
```

### Menggunakan Port Lain
Edit file `.env`:
```env
REACT_APP_API_URL=http://192.168.1.11:4001/api
REACT_APP_SOCKET_URL=http://192.168.1.11:4001
```

Dan update backend di `backend/index.js`:
```javascript
const PORT = process.env.PORT || 4001;
```

## 📊 Monitoring

### Cek Status Server
```bash
# Test endpoint
curl http://192.168.1.11:3001/test

# Health check
curl http://192.168.1.11:3001/api/health
```

### Log Server
- **Backend**: Lihat di terminal backend
- **Frontend**: Lihat di terminal frontend
- **Browser**: Buka Developer Tools (F12)

## 🚀 Tips Optimasi

1. **Gunakan koneksi WiFi yang stabil**
2. **Tutup aplikasi yang tidak perlu** untuk menghemat bandwidth
3. **Gunakan browser terbaru** untuk performa optimal
4. **Clear cache browser** jika ada masalah loading

## 📞 Support

Jika mengalami masalah:
1. Cek log error di terminal
2. Restart server
3. Cek konfigurasi network
4. Pastikan semua dependency terinstall

---
**Dibuat untuk eSIR2.0 - Sistem Rujukan Online Rumah Sakit**
