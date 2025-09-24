# 📋 ALUR SISTEM eSIR2.0 - DOKUMENTASI TERBARU

## 🎯 **OVERVIEW SISTEM**

**eSIR2.0** adalah sistem rujukan online untuk fasilitas kesehatan yang dirancang berdasarkan penelitian User-Centered Design (UCD) dengan 22 responden dari 3 rumah sakit. Sistem ini bertujuan untuk meningkatkan efisiensi proses rujukan pasien antar fasilitas kesehatan dengan fitur real-time tracking dan informasi yang akurat.

---

## 🏗️ **ARSITEKTUR SISTEM**

### **1. Backend (Node.js + Express)**
- **Port**: 3001
- **Database**: MySQL (prodsysesirv02)
- **Authentication**: JWT Token
- **Real-time**: Socket.IO
- **API**: RESTful dengan 9 modul utama

### **2. Frontend (React.js)**
- **Port**: 3000
- **Routing**: React Router DOM
- **State Management**: Context API
- **UI Components**: Custom Design System
- **Real-time**: Socket.IO Client

### **3. Database Schema (16 Tabel)**
- **Core Tables**: roles, users, faskes, pasien, rujukan
- **Tracking Tables**: tracking_data, tracking_sessions
- **Support Tables**: tempat_tidur, notifications, dokumen, search_logs

---

## 🔄 **ALUR BISNIS UTAMA**

### **A. PROSES RUJUKAN (Core Flow)**

#### **1. Login & Authentication**
```
User Login → JWT Token → Role-based Access
```
- **Admin Pusat**: Akses penuh ke semua faskes
- **Admin Faskes**: Akses terbatas sesuai faskes
- **Operator**: Akses terbatas untuk input data

#### **2. Input Data Pasien**
```
Cari Pasien (NIK) → Pasien Ada? → Update Data / Buat Baru
```
- **Validasi NIK**: 16 digit angka
- **Auto-generate**: Nomor RM (RM + timestamp)
- **Data Pasien**: Nama, NIK, Tanggal Lahir, Jenis Kelamin, Alamat, Telepon

#### **3. Buat Rujukan**
```
Pilih Faskes Tujuan → Input Diagnosa → Input Alasan → Pilih Transportasi → Submit
```
- **Nomor Rujukan**: Auto-generate (RJ + tanggal + counter)
- **Status**: pending (default)
- **Transportasi**: 
  - `pickup`: RS Tujuan menjemput
  - `delivery`: Faskes perujuk mengantarkan

#### **4. Update Status Rujukan**
```
Faskes Tujuan → Review Rujukan → Update Status → Notifikasi
```
- **Status Options**: diterima, ditolak, selesai, dibatalkan
- **Permission**: Hanya faskes tujuan yang bisa update status
- **Catatan**: Catatan tujuan untuk setiap perubahan status

---

### **B. PROSES TRACKING REAL-TIME**

#### **1. Start Tracking Session**
```
Petugas Ambulans → Login → Pilih Rujukan → Start Session → Generate Token
```
- **Session Token**: 64 karakter hex untuk autentikasi
- **Device ID**: Identifikasi device yang digunakan
- **Status**: menunggu (default)

#### **2. Update Position**
```
GPS Device → Send Coordinates → Calculate Distance → Update Database → Emit Socket
```
- **Data yang dikirim**: latitude, longitude, speed, heading, accuracy, battery_level
- **Validasi Koordinat**: Dalam area Jawa Barat (-7.5 to -5.5 lat, 106.0 to 108.5 lng)
- **Calculation**: Distance ke tujuan menggunakan Haversine formula
- **Real-time**: Socket.IO emit ke room `tracking-{rujukan_id}`

#### **3. Monitor Tracking**
```
Dashboard → Join Tracking Room → Receive Updates → Display Map
```
- **Throttling**: Update setiap 5 detik untuk mencegah spam
- **Room Management**: Auto-join berdasarkan role dan faskes
- **Status Tracking**: menunggu → dijempu → dalam_perjalanan → tiba

---

## 📊 **API ENDPOINTS UTAMA**

### **Authentication (`/api/auth`)**
- `POST /login` - Login user
- `GET /profile` - Get user profile
- `GET /users` - Get all users (admin only)
- `POST /register` - Register new user (admin only)

### **Rujukan (`/api/rujukan`)**
- `GET /` - Get all rujukan (role-filtered)
- `GET /:id` - Get rujukan by ID
- `POST /with-pasien` - Create rujukan with pasien data
- `PUT /:id/status` - Update rujukan status
- `PUT /:id/cancel` - Cancel rujukan
- `GET /stats/overview` - Get rujukan statistics

### **Tracking (`/api/tracking`)**
- `POST /start-session` - Start tracking session
- `POST /update-position` - Update GPS position
- `GET /:rujukan_id` - Get tracking data
- `GET /sessions/active` - Get active sessions
- `POST /end-session/:session_id` - End tracking session

### **Pasien (`/api/pasien`)**
- `GET /` - Get all pasien
- `GET /search?nik=` - Search pasien by NIK
- `POST /` - Create new pasien

### **Faskes (`/api/faskes`)**
- `GET /` - Get all faskes
- `GET /:id` - Get faskes by ID

### **Tempat Tidur (`/api/tempat-tidur`)**
- `GET /` - Get bed availability
- `POST /` - Create bed record
- `PUT /:id` - Update bed status

---

## 🎨 **FRONTEND COMPONENTS**

### **Core Pages**
1. **Login** - Authentication dengan role-based redirect
2. **Dashboard** - Overview statistik dengan real-time updates
3. **RujukanPage** - Daftar rujukan dengan CRUD operations
4. **EnhancedRujukanPage** - Multi-step form untuk rujukan
5. **TrackingPage** - Real-time GPS tracking
6. **PasienPage** - Manajemen data pasien
7. **FaskesPage** - Manajemen fasilitas kesehatan
8. **TempatTidurPage** - Manajemen tempat tidur

### **UI Components**
- **Layout** - Sidebar navigation dengan responsive design
- **MultiStepReferralForm** - Form rujukan bertahap
- **AmbulanceTracker** - GPS tracking interface
- **DokumenManager** - File upload dan management
- **ToastContainer** - Notifikasi real-time

---

## 🔐 **SISTEM KEAMANAN**

### **Authentication**
- **JWT Token**: Expires sesuai konfigurasi
- **Role-based Access**: Admin pusat, admin faskes, operator
- **Session Management**: Auto-refresh token

### **Authorization**
- **Faskes Filtering**: User hanya bisa akses faskes terkait
- **Permission Check**: Setiap endpoint memvalidasi role
- **Data Isolation**: Data terpisah berdasarkan faskes

### **Validation**
- **Input Validation**: Server-side validation untuk semua input
- **NIK Validation**: 16 digit angka
- **Coordinate Validation**: Dalam area Jawa Barat
- **SQL Injection Protection**: Prepared statements

---

## 📱 **REAL-TIME FEATURES**

### **Socket.IO Implementation**
- **Connection**: Auto-authentication dengan JWT
- **Room Management**: 
  - `admin` - Admin pusat
  - `faskes-{id}` - Admin faskes
  - `tracking-{rujukan_id}` - Tracking session
- **Events**:
  - `tracking-update` - GPS position updates
  - `rujukan-status-change` - Status rujukan berubah
  - `notification` - Notifikasi umum

### **Throttling & Performance**
- **Update Throttling**: 5 detik untuk GPS updates
- **Connection Monitoring**: Auto-reconnect
- **Error Handling**: Graceful degradation

---

## 🗄️ **DATABASE RELATIONSHIPS**

### **Core Relationships**
```
users (1) ←→ (N) rujukan
faskes (1) ←→ (N) users
faskes (1) ←→ (N) rujukan (asal)
faskes (1) ←→ (N) rujukan (tujuan)
pasien (1) ←→ (N) rujukan
rujukan (1) ←→ (1) tracking_data
rujukan (1) ←→ (N) tracking_sessions
```

### **Data Flow**
1. **User** login → **Faskes** assignment
2. **Pasien** creation/update → **Rujukan** creation
3. **Rujukan** status change → **Notification** trigger
4. **Tracking** session → **GPS** data storage
5. **Search** activity → **Log** recording

---

## 🚀 **DEPLOYMENT & CONFIGURATION**

### **Environment Variables**
```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_DATABASE=prodsysesirv02

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# Server
PORT=3001
NODE_ENV=development
```

### **Startup Process**
1. **Database Connection** - Test connection
2. **Server Start** - Express + Socket.IO
3. **Route Registration** - API endpoints
4. **Socket Setup** - Real-time communication
5. **Health Check** - `/api/health` endpoint

---

## 📈 **PERFORMANCE & MONITORING**

### **Database Monitoring**
- **Connection Pool**: MySQL2 connection pooling
- **Query Optimization**: Indexed columns
- **Error Logging**: Detailed error tracking

### **Real-time Performance**
- **Throttling**: Prevent excessive updates
- **Room Management**: Efficient socket room handling
- **Memory Management**: Cleanup inactive sessions

---

## 🔧 **MAINTENANCE & DEBUGGING**

### **Logging System**
- **Console Logging**: Development mode
- **Error Tracking**: Detailed error information
- **API Logging**: Request/response logging

### **Health Checks**
- **Database Status**: Connection monitoring
- **Server Status**: Uptime tracking
- **API Health**: Endpoint availability

---

## 📋 **KESIMPULAN ALUR SISTEM**

### **Tujuan Utama**
eSIR2.0 dirancang untuk menyelesaikan masalah utama yang ditemukan dalam penelitian UCD:
1. **Navigasi yang rumit** → Sidebar navigation yang intuitif
2. **Informasi tidak real-time** → Socket.IO untuk update real-time
3. **Form input yang sulit** → Multi-step form dengan validasi
4. **Tracking yang tidak akurat** → GPS tracking dengan Haversine calculation

### **Alur Lengkap**
```
Login → Dashboard → Buat Rujukan → Input Pasien → Submit → 
Faskes Tujuan Review → Update Status → Start Tracking → 
GPS Updates → Real-time Monitoring → Selesai
```

### **Key Features**
- ✅ **Role-based Access Control**
- ✅ **Real-time GPS Tracking**
- ✅ **Multi-step Form Design**
- ✅ **Socket.IO Communication**
- ✅ **Comprehensive API**
- ✅ **Responsive UI Design**
- ✅ **Database Optimization**
- ✅ **Security Implementation**

---

*Dokumentasi ini dibuat berdasarkan analisis mendalam terhadap kode sistem eSIR2.0 yang telah diimplementasi dan berfungsi dengan baik.*
