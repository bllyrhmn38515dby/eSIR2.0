# 🔧 BACKEND APIs - MANAJEMEN RUJUKAN & TRACKING

## 📋 **OVERVIEW BACKEND APIs**

Backend eSIR2.0 dibangun dengan **Node.js + Express** dan menyediakan 9 modul API utama untuk manajemen rujukan pasien dan tracking GPS real-time. Semua API menggunakan **JWT Authentication** dan **Role-based Access Control**.

---

## 🏗️ **ARSITEKTUR BACKEND**

### **Teknologi Stack**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL (prodsysesirv02)
- **Authentication**: JWT Token
- **Real-time**: Socket.IO
- **Port**: 3001

### **Struktur Direktori**
```
backend/
├── routes/           # API endpoints
├── middleware/       # Authentication & validation
├── config/          # Database & server config
├── utils/           # Helper functions
└── database.sql     # Database schema
```

---

## 🔐 **AUTHENTICATION & AUTHORIZATION**

### **JWT Token System**
```javascript
// Middleware: verifyToken
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token tidak ditemukan' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token tidak valid' });
  }
};
```

### **Role-based Access Control**
- **admin_pusat**: Akses penuh ke semua faskes
- **admin_faskes**: Akses terbatas sesuai faskes
- **operator**: Akses terbatas untuk input data

---

## 📊 **API MODULES OVERVIEW**

### **1. Authentication API (`/api/auth`)**
### **2. Rujukan API (`/api/rujukan`)**
### **3. Tracking API (`/api/tracking`)**
### **4. Pasien API (`/api/pasien`)**
### **5. Faskes API (`/api/faskes`)**
### **6. Tempat Tidur API (`/api/tempat-tidur`)**
### **7. Notifications API (`/api/notifications`)**
### **8. Dokumen API (`/api/dokumen`)**
### **9. Search API (`/api/search`)**

---

## 🏥 **1. RUJUKAN API (`/api/rujukan`)**

### **Endpoint Overview**
```javascript
GET    /api/rujukan              # Get all rujukan (role-filtered)
GET    /api/rujukan/:id          # Get rujukan by ID
POST   /api/rujukan              # Create rujukan (legacy)
POST   /api/rujukan/with-pasien  # Create rujukan with pasien data
PUT    /api/rujukan/:id/status   # Update rujukan status
PUT    /api/rujukan/:id/cancel   # Cancel rujukan
GET    /api/rujukan/stats/overview # Get rujukan statistics
```

### **A. GET All Rujukan**
```javascript
// GET /api/rujukan
// Headers: Authorization: Bearer <token>

// Response
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nomor_rujukan": "RJ20241201001",
      "pasien_id": 1,
      "faskes_asal_id": 1,
      "faskes_tujuan_id": 2,
      "diagnosa": "Sakit jantung",
      "alasan_rujukan": "Perlu pemeriksaan lebih lanjut",
      "status": "pending",
      "transport_type": "pickup",
      "nama_pasien": "Ahmad Susanto",
      "nik_pasien": "1234567890123456",
      "faskes_asal_nama": "Puskesmas Jakarta",
      "faskes_tujuan_nama": "RS Jantung Harapan",
      "created_at": "2024-12-01T10:30:00.000Z"
    }
  ]
}
```

### **B. Create Rujukan with Pasien Data**
```javascript
// POST /api/rujukan/with-pasien
// Headers: Authorization: Bearer <token>
// Body:
{
  "nik": "1234567890123456",
  "nama_pasien": "Ahmad Susanto",
  "tanggal_lahir": "1989-05-15",
  "jenis_kelamin": "L",
  "alamat": "Jl. Merdeka No. 123, Jakarta",
  "telepon": "081234567890",
  "faskes_asal_id": 1,        // Optional untuk admin_pusat
  "faskes_tujuan_id": 2,
  "diagnosa": "Sakit jantung",
  "alasan_rujukan": "Perlu pemeriksaan lebih lanjut",
  "catatan_asal": "Pasien mengeluh nyeri dada",
  "transport_type": "pickup"  // "pickup" atau "delivery"
}

// Response
{
  "success": true,
  "message": "Pasien berhasil diupdate dan rujukan berhasil dibuat",
  "data": {
    "id": 1,
    "nomor_rujukan": "RJ20241201001",
    "status": "pending",
    "nama_pasien": "Ahmad Susanto",
    "faskes_asal_nama": "Puskesmas Jakarta",
    "faskes_tujuan_nama": "RS Jantung Harapan"
  }
}
```

### **C. Update Rujukan Status**
```javascript
// PUT /api/rujukan/:id/status
// Headers: Authorization: Bearer <token>
// Body:
{
  "status": "diterima",  // "diterima", "ditolak", "selesai"
  "catatan_tujuan": "Pasien diterima untuk rawat inap"
}

// Response
{
  "success": true,
  "message": "Status rujukan berhasil diupdate",
  "data": {
    "id": 1,
    "status": "diterima",
    "catatan_tujuan": "Pasien diterima untuk rawat inap",
    "tanggal_respon": "2024-12-01T11:00:00.000Z"
  }
}
```

### **D. Cancel Rujukan**
```javascript
// PUT /api/rujukan/:id/cancel
// Headers: Authorization: Bearer <token>
// Body:
{
  "alasan_pembatalan": "Pasien menolak untuk dirujuk"
}

// Response
{
  "success": true,
  "message": "Rujukan berhasil dibatalkan",
  "data": {
    "id": 1,
    "status": "dibatalkan",
    "catatan_tujuan": "DIBATALKAN: Pasien menolak untuk dirujuk"
  }
}
```

### **E. Rujukan Statistics**
```javascript
// GET /api/rujukan/stats/overview
// Headers: Authorization: Bearer <token>

// Response
{
  "success": true,
  "data": {
    "total": 150,
    "pending": 25,
    "diterima": 80,
    "ditolak": 15,
    "selesai": 25,
    "dibatalkan": 5
  }
}
```

---

## 🛰️ **2. TRACKING API (`/api/tracking`)**

### **Endpoint Overview**
```javascript
POST   /api/tracking/start-session     # Start tracking session
POST   /api/tracking/update-position   # Update GPS position
GET    /api/tracking/:rujukan_id       # Get tracking data
GET    /api/tracking/sessions/active   # Get active sessions
POST   /api/tracking/end-session/:session_id # End tracking session
```

### **A. Start Tracking Session**
```javascript
// POST /api/tracking/start-session
// Headers: Authorization: Bearer <token>
// Body:
{
  "rujukan_id": 1,
  "device_id": "mobile_device_001"  // Optional
}

// Response
{
  "success": true,
  "message": "Session tracking berhasil dimulai",
  "data": {
    "session_id": 1,
    "session_token": "a1b2c3d4e5f6...",  // 64 karakter hex
    "rujukan": {
      "id": 1,
      "nomor_rujukan": "RJ20241201001",
      "nama_pasien": "Ahmad Susanto",
      "faskes_asal_nama": "Puskesmas Jakarta",
      "faskes_tujuan_nama": "RS Jantung Harapan"
    },
    "is_existing": false
  }
}
```

### **B. Update GPS Position**
```javascript
// POST /api/tracking/update-position
// Body: (Tidak perlu token, menggunakan session_token)
{
  "session_token": "a1b2c3d4e5f6...",
  "latitude": -6.5971,
  "longitude": 106.8060,
  "status": "dalam_perjalanan",  // "menunggu", "dijemput", "dalam_perjalanan", "tiba"
  "speed": 45.5,                 // km/h
  "heading": 180,                // derajat (0-360)
  "accuracy": 5.0,               // meter
  "battery_level": 85            // 0-100
}

// Response
{
  "success": true,
  "message": "Posisi berhasil diupdate",
  "data": {
    "estimated_distance": 12.5,  // km
    "estimated_time": 18,        // menit
    "status": "dalam_perjalanan"
  }
}
```

### **C. Get Tracking Data**
```javascript
// GET /api/tracking/:rujukan_id
// Headers: Authorization: Bearer <token>

// Response
{
  "success": true,
  "data": {
    "rujukan": {
      "id": 1,
      "nomor_rujukan": "RJ20241201001",
      "nama_pasien": "Ahmad Susanto",
      "faskes_asal_nama": "Puskesmas Jakarta",
      "faskes_tujuan_nama": "RS Jantung Harapan"
    },
    "tracking": {
      "latitude": -6.5971,
      "longitude": 106.8060,
      "status": "dalam_perjalanan",
      "estimated_time": 18,
      "estimated_distance": 12.5,
      "speed": 45.5,
      "heading": 180,
      "accuracy": 5.0,
      "battery_level": 85,
      "updated_at": "2024-12-01T11:30:00.000Z"
    },
    "route": {
      "origin": {
        "lat": -6.5971,
        "lng": 106.8060,
        "name": "Puskesmas Jakarta"
      },
      "destination": {
        "lat": -6.2000,
        "lng": 106.8167,
        "name": "RS Jantung Harapan"
      }
    }
  }
}
```

### **D. Get Active Sessions**
```javascript
// GET /api/tracking/sessions/active
// Headers: Authorization: Bearer <token>

// Response
{
  "success": true,
  "data": [
    {
      "id": 1,
      "rujukan_id": 1,
      "nomor_rujukan": "RJ20241201001",
      "nama_pasien": "Ahmad Susanto",
      "faskes_asal_nama": "Puskesmas Jakarta",
      "faskes_tujuan_nama": "RS Jantung Harapan",
      "status": "dalam_perjalanan",
      "estimated_time": 18,
      "estimated_distance": 12.5,
      "petugas_nama": "Dr. Ahmad",
      "created_at": "2024-12-01T11:00:00.000Z"
    }
  ]
}
```

---

## 👤 **3. PASIEN API (`/api/pasien`)**

### **Endpoint Overview**
```javascript
GET    /api/pasien              # Get all pasien
GET    /api/pasien/search?nik=  # Search pasien by NIK
POST   /api/pasien              # Create new pasien
PUT    /api/pasien/:id          # Update pasien
DELETE /api/pasien/:id          # Delete pasien
```

### **A. Search Pasien by NIK**
```javascript
// GET /api/pasien/search?nik=1234567890123456
// Headers: Authorization: Bearer <token>

// Response
{
  "success": true,
  "data": {
    "id": 1,
    "no_rm": "RM12345678",
    "nik": "1234567890123456",
    "nama_pasien": "Ahmad Susanto",
    "tanggal_lahir": "1989-05-15",
    "jenis_kelamin": "L",
    "alamat": "Jl. Merdeka No. 123, Jakarta",
    "telepon": "081234567890",
    "created_at": "2024-12-01T10:00:00.000Z"
  }
}
```

---

## 🏥 **4. FASKES API (`/api/faskes`)**

### **Endpoint Overview**
```javascript
GET    /api/faskes              # Get all faskes
GET    /api/faskes/:id          # Get faskes by ID
POST   /api/faskes              # Create new faskes (admin only)
PUT    /api/faskes/:id          # Update faskes (admin only)
DELETE /api/faskes/:id          # Delete faskes (admin only)
```

### **A. Get All Faskes**
```javascript
// GET /api/faskes
// Headers: Authorization: Bearer <token>

// Response
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nama_faskes": "Puskesmas Jakarta",
      "tipe": "Puskesmas",
      "alamat": "Jl. Sudirman No. 1, Jakarta",
      "telepon": "021-1234567",
      "latitude": -6.5971,
      "longitude": 106.8060,
      "is_active": true
    },
    {
      "id": 2,
      "nama_faskes": "RS Jantung Harapan",
      "tipe": "Rumah Sakit",
      "alamat": "Jl. Gatot Subroto No. 2, Jakarta",
      "telepon": "021-7654321",
      "latitude": -6.2000,
      "longitude": 106.8167,
      "is_active": true
    }
  ]
}
```

---

## 🛏️ **5. TEMPAT TIDUR API (`/api/tempat-tidur`)**

### **Endpoint Overview**
```javascript
GET    /api/tempat-tidur        # Get bed availability
POST   /api/tempat-tidur        # Create bed record
PUT    /api/tempat-tidur/:id    # Update bed status
DELETE /api/tempat-tidur/:id    # Delete bed record
```

### **A. Get Bed Availability**
```javascript
// GET /api/tempat-tidur
// Headers: Authorization: Bearer <token>

// Response
{
  "success": true,
  "data": [
    {
      "id": 1,
      "faskes_id": 2,
      "nama_faskes": "RS Jantung Harapan",
      "tipe_kamar": "ICU",
      "total_kamar": 10,
      "terisi": 7,
      "tersedia": 3,
      "updated_at": "2024-12-01T11:00:00.000Z"
    }
  ]
}
```

---

## 🔔 **6. NOTIFICATIONS API (`/api/notifications`)**

### **Endpoint Overview**
```javascript
GET    /api/notifications       # Get user notifications
POST   /api/notifications       # Create notification
PUT    /api/notifications/:id/read # Mark as read
DELETE /api/notifications/:id   # Delete notification
```

---

## 📄 **7. DOKUMEN API (`/api/dokumen`)**

### **Endpoint Overview**
```javascript
GET    /api/dokumen/:rujukan_id     # Get documents by rujukan
POST   /api/dokumen/upload          # Upload document
DELETE /api/dokumen/:id             # Delete document
```

---

## 🔍 **8. SEARCH API (`/api/search`)**

### **Endpoint Overview**
```javascript
GET    /api/search/global?q=        # Global search
GET    /api/search/pasien?q=        # Search pasien
GET    /api/search/rujukan?q=       # Search rujukan
GET    /api/search/faskes?q=        # Search faskes
```

---

## ⚡ **PERFORMANCE & OPTIMIZATION**

### **Database Optimization**
- **Connection Pooling**: MySQL2 connection pooling
- **Indexed Columns**: Primary keys dan foreign keys
- **Query Optimization**: Prepared statements untuk mencegah SQL injection

### **API Performance**
- **Response Time**: < 200ms untuk simple queries
- **Pagination**: Untuk data besar
- **Caching**: Redis untuk data yang sering diakses
- **Rate Limiting**: Mencegah abuse

### **Error Handling**
```javascript
// Standard Error Response
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)",
  "code": "ERROR_CODE"
}
```

---

## 🔒 **SECURITY FEATURES**

### **Input Validation**
- **NIK Validation**: 16 digit angka
- **Coordinate Validation**: Dalam area Jawa Barat
- **SQL Injection Protection**: Prepared statements
- **XSS Protection**: Input sanitization

### **Authentication Security**
- **JWT Expiration**: Configurable (default 24h)
- **Token Refresh**: Auto-refresh mechanism
- **Role-based Access**: Granular permissions

---

## 📊 **MONITORING & LOGGING**

### **Health Check**
```javascript
// GET /api/health
{
  "status": "healthy",
  "timestamp": "2024-12-01T11:00:00.000Z",
  "database": "connected",
  "uptime": "2d 5h 30m"
}
```

### **Logging System**
- **Console Logging**: Development mode
- **Error Tracking**: Detailed error information
- **API Logging**: Request/response logging
- **Performance Metrics**: Response time tracking

---

## 🚀 **DEPLOYMENT CONFIGURATION**

### **Environment Variables**
```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_DATABASE=prodsysesirv02

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# Server
PORT=3001
NODE_ENV=production

# Socket.IO
SOCKET_CORS_ORIGIN=http://localhost:3000
```

### **Startup Process**
1. **Database Connection** - Test connection
2. **Server Start** - Express + Socket.IO
3. **Route Registration** - API endpoints
4. **Socket Setup** - Real-time communication
5. **Health Check** - `/api/health` endpoint

---

*Dokumentasi Backend APIs eSIR2.0 - Sistem Rujukan Online dengan GPS Tracking Real-time*
