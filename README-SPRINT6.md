# Sprint 6: Real-Time Route Tracking (Ambulans/Pasien ke RS)

## 🎯 Tujuan
Mengimplementasikan fitur pelacakan rute secara real-time seperti Google Maps untuk ambulans atau pasien yang sedang dalam proses rujukan ke rumah sakit di Kota Bogor, Jawa Barat.

## ✅ Fitur yang Sudah Diimplementasikan

### Backend
- ✅ **Database Schema**: Tabel `tracking_data` dan `tracking_sessions`
- ✅ **API Routes**: Endpoint untuk tracking management
- ✅ **Real-time Updates**: Socket.IO integration untuk live tracking
- ✅ **GPS Validation**: Validasi koordinat dalam area Kota Bogor
- ✅ **Session Management**: Token-based authentication untuk tracking
- ✅ **Distance Calculation**: Haversine formula untuk estimasi jarak

### Frontend
- ✅ **TrackingPage**: Halaman monitoring real-time dengan Google Maps
- ✅ **AmbulanceTracker**: Komponen untuk petugas mengirim posisi GPS
- ✅ **Real-time Updates**: Socket.IO integration untuk live updates
- ✅ **Responsive Design**: Mobile-friendly interface
- ✅ **Status Management**: Kontrol status perjalanan

## 🗄️ Database Schema

### Tabel tracking_data
```sql
CREATE TABLE tracking_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rujukan_id INT NOT NULL,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    status ENUM('menunggu', 'dijemput', 'dalam_perjalanan', 'tiba') DEFAULT 'menunggu',
    estimated_time INT, -- dalam menit
    estimated_distance DECIMAL(8,2), -- dalam km
    speed DECIMAL(5,2), -- dalam km/h
    heading INT, -- arah dalam derajat (0-360)
    accuracy DECIMAL(5,2), -- akurasi GPS dalam meter
    battery_level INT, -- level baterai device (0-100)
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rujukan_id) REFERENCES rujukan(id) ON DELETE CASCADE,
    INDEX idx_rujukan_status (rujukan_id, status),
    INDEX idx_updated_at (updated_at)
);
```

### Tabel tracking_sessions
```sql
CREATE TABLE tracking_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rujukan_id INT NOT NULL,
    user_id INT NOT NULL, -- petugas yang melakukan tracking
    device_id VARCHAR(255), -- ID device yang digunakan
    session_token VARCHAR(255) UNIQUE, -- token untuk autentikasi tracking
    is_active BOOLEAN DEFAULT TRUE,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rujukan_id) REFERENCES rujukan(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_session_token (session_token),
    INDEX idx_active_sessions (is_active, rujukan_id)
);
```

## 🔌 API Endpoints

### 1. Start Tracking Session
```http
POST /api/tracking/start-session
Authorization: Bearer <token>
Content-Type: application/json

{
  "rujukan_id": 1,
  "device_id": "device-001"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Session tracking berhasil dimulai",
  "data": {
    "session_id": 1,
    "session_token": "abc123...",
    "rujukan": { ... }
  }
}
```

### 2. Update Position
```http
POST /api/tracking/update-position
Content-Type: application/json

{
  "session_token": "abc123...",
  "latitude": -6.5971,
  "longitude": 106.8060,
  "status": "dalam_perjalanan",
  "speed": 35.0,
  "heading": 45,
  "accuracy": 5.0,
  "battery_level": 85
}
```

**Response:**
```json
{
  "success": true,
  "message": "Posisi berhasil diupdate",
  "data": {
    "estimated_distance": 8.5,
    "estimated_time": 15,
    "status": "dalam_perjalanan"
  }
}
```

### 3. Get Tracking Data
```http
GET /api/tracking/:rujukan_id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tracking": { ... },
    "rujukan": { ... },
    "route": {
      "origin": { "name": "Puskesmas Bogor Tengah", "lat": -6.5970, "lng": 106.8060 },
      "destination": { "name": "RSUD Kota Bogor", "lat": -6.5971, "lng": 106.8060 },
      "current": { "lat": -6.5971, "lng": 106.8060, "status": "dalam_perjalanan" }
    }
  }
}
```

### 4. Get Active Sessions
```http
GET /api/tracking/sessions/active
Authorization: Bearer <token>
```

### 5. End Session
```http
POST /api/tracking/end-session/:session_id
Authorization: Bearer <token>
```

## 🗺️ Frontend Components

### TrackingPage
- **Lokasi**: `frontend/src/components/TrackingPage.js`
- **Fitur**:
  - Google Maps integration
  - Real-time position updates
  - Route visualization
  - Session management
  - Status monitoring

### AmbulanceTracker
- **Lokasi**: `frontend/src/components/AmbulanceTracker.js`
- **Fitur**:
  - GPS position tracking
  - Session control
  - Status updates
  - Real-time position sending

## 🔧 Setup & Installation

### 1. Database Setup
```bash
cd backend
node add-tracking-tables.js
```

### 2. Environment Variables
Tambahkan ke `.env`:
```env
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### 3. Dependencies
Backend sudah menggunakan dependencies yang ada:
- `socket.io` (sudah terinstall)
- `mysql2` (sudah terinstall)

Frontend memerlukan Google Maps API key untuk peta.

## 🚀 Cara Penggunaan

### Untuk Admin/Tenaga Medis (Monitoring)
1. Login ke sistem eSIR 2.0
2. Klik menu "Tracking" di navigation
3. Pilih sesi tracking yang aktif
4. Monitor perjalanan di peta real-time
5. Lihat estimasi waktu dan jarak

### Untuk Petugas Ambulans (GPS Tracking)
1. Login ke sistem eSIR 2.0
2. Klik menu "Ambulance Tracker"
3. Pilih rujukan yang akan di-track
4. Klik "Mulai Tracking"
5. Izinkan akses lokasi di browser
6. Posisi akan otomatis terkirim setiap ada perubahan
7. Update status sesuai kondisi (Menunggu → Dijemput → Dalam Perjalanan → Tiba)

## 📱 Real-time Features

### Socket.IO Events
- `join-tracking`: Join room untuk monitoring specific rujukan
- `leave-tracking`: Leave room tracking
- `tracking-update`: Real-time position updates

### GPS Features
- **High Accuracy**: Menggunakan `enableHighAccuracy: true`
- **Continuous Tracking**: `watchPosition` untuk updates otomatis
- **Speed & Heading**: Mendapatkan kecepatan dan arah perjalanan
- **Battery Level**: Monitoring level baterai device

## 🛡️ Security & Validation

### Koordinat Validation
```javascript
// Validasi area Kota Bogor
if (latitude < -6.7 || latitude > -6.5 || longitude < 106.7 || longitude > 106.9) {
  return res.status(400).json({
    success: false,
    message: 'Koordinat di luar area Kota Bogor'
  });
}
```

### Session Token
- 32-byte random hex token
- Unique per session
- Required untuk update position

### Authentication
- JWT token untuk admin access
- Session token untuk GPS updates
- Role-based access control

## 📊 Data Faskes Kota Bogor

Sistem sudah dilengkapi dengan data faskes Kota Bogor:
- RSUD Kota Bogor
- RS Hermina Bogor
- RS Salak Bogor
- Puskesmas Bogor Tengah/Utara/Selatan/Barat/Timur
- Klinik Bogor Sehat & Medika

## 🧪 Testing

### API Testing
```bash
cd backend
node test-tracking-api.js
```

### Manual Testing
1. Start backend server
2. Start frontend server
3. Login dengan user yang ada
4. Test tracking flow

## 📈 Performance Considerations

### Database Indexing
- `idx_rujukan_status`: Untuk query tracking berdasarkan rujukan dan status
- `idx_updated_at`: Untuk query berdasarkan waktu update
- `idx_session_token`: Untuk validasi session token
- `idx_active_sessions`: Untuk query session aktif

### Real-time Optimization
- Socket.IO room-based broadcasting
- GPS update throttling (tidak terlalu sering)
- Efficient marker management di Google Maps

## 🔮 Future Enhancements

### Planned Features
- [ ] **Offline Support**: Cache data untuk kondisi offline
- [ ] **Push Notifications**: Notifikasi real-time ke mobile
- [ ] **Route Optimization**: Algoritma rute terbaik
- [ ] **Traffic Integration**: Data lalu lintas real-time
- [ ] **Emergency Alerts**: Alert untuk kondisi darurat
- [ ] **Analytics Dashboard**: Statistik tracking performance

### Technical Improvements
- [ ] **WebRTC**: Peer-to-peer communication
- [ ] **Service Workers**: Background sync
- [ ] **Progressive Web App**: Mobile app experience
- [ ] **Machine Learning**: Prediksi waktu tiba

## 🐛 Troubleshooting

### Common Issues

**GPS tidak berfungsi:**
- Pastikan HTTPS (required untuk geolocation)
- Cek izin lokasi di browser
- Test di device fisik (bukan emulator)

**Peta tidak muncul:**
- Cek Google Maps API key
- Pastikan billing aktif di Google Cloud Console
- Cek network connectivity

**Real-time tidak update:**
- Cek Socket.IO connection
- Pastikan room sudah join
- Cek console untuk error

**Database error:**
- Jalankan `node add-tracking-tables.js`
- Cek foreign key constraints
- Pastikan tabel rujukan ada data

## 📞 Support

Untuk bantuan teknis atau pertanyaan:
- Cek log backend untuk error details
- Test API endpoints dengan Postman
- Verifikasi database schema
- Cek browser console untuk frontend errors

---

**Sprint 6 Real-Time Route Tracking** telah berhasil diimplementasikan dengan fitur lengkap untuk monitoring perjalanan ambulans secara real-time di Kota Bogor! 🚑🗺️✨
