
# eSIR 2.0 - Sistem Informasi Rujukan Online

Sistem rujukan rumah sakit online dengan fitur pemantauan dan pemetaan rujukan secara realtime. Aplikasi ini memungkinkan operator pusat (seperti Dinas Kesehatan) untuk memantau semua aktivitas rujukan secara live melalui dashboard berbasis peta.

## 🎯 Tentang Proyek

Proyek ini bertujuan untuk mendigitalisasi dan mempercepat alur rujukan pasien antar fasilitas kesehatan. Fitur utamanya adalah kemampuan operator pusat untuk memantau semua aktivitas rujukan secara realtime melalui dashboard berbasis peta dengan notifikasi instan.

## 🚀 Status Proyek

### ✅ **Sprint 1: Fondasi & Autentikasi** - SELESAI
- ✅ Database setup dengan MySQL
- ✅ Backend API dengan Node.js & Express
- ✅ JWT Authentication & Authorization
- ✅ Frontend React dengan login/register
- ✅ Protected routes & role-based access

### ✅ **Sprint 2: Fitur Inti Rujukan** - SELESAI
- ✅ CRUD operasi untuk Pasien
- ✅ CRUD operasi untuk Rujukan
- ✅ CRUD operasi untuk Faskes
- ✅ Auto-generate nomor rujukan
- ✅ Status tracking: pending → diterima/ditolak → selesai
- ✅ Role-based filtering data

### ✅ **Sprint 3: Implementasi Realtime** - SELESAI
- ✅ Socket.IO integration
- ✅ Real-time notifications
- ✅ Live status updates
- ✅ Room-based broadcasting
- ✅ Notification persistence

### ✅ **Sprint 4: Peta Interaktif** - SELESAI
- ✅ Leaflet.js integration
- ✅ Interactive map dengan OpenStreetMap
- ✅ Custom markers untuk faskes
- ✅ Rujukan lines dengan status-based colors
- ✅ Real-time map updates
- ✅ Responsive design

### ✅ **Sprint 5: Bug Fixes & Optimization** - SELESAI
- ✅ Perbaikan query database rujukan
- ✅ Perbaikan filter role untuk admin pusat
- ✅ Optimasi API response
- ✅ Perbaikan frontend data loading

## 🛠️ Tumpukan Teknologi (Technology Stack)

### **Backend**
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL
- **Authentication:** JWT (JSON Web Tokens)
- **Realtime:** Socket.IO
- **Password Hashing:** bcryptjs
- **Environment:** dotenv

### **Frontend**
- **Framework:** React.js
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **State Management:** Context API
- **Maps:** Leaflet.js + React-Leaflet
- **Realtime:** Socket.IO Client
- **Styling:** CSS3 dengan modern design

### **Development Tools**
- **Package Manager:** npm
- **Development Server:** nodemon (backend), react-scripts (frontend)
- **Version Control:** Git

## 📁 Struktur Proyek

```
eSIR2.0/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection
│   ├── middleware/
│   │   ├── auth.js               # JWT authentication
│   │   └── socketAuth.js         # Socket.IO authentication
│   ├── routes/
│   │   ├── auth.js               # Authentication routes
│   │   ├── pasien.js             # Patient management
│   │   ├── rujukan.js            # Referral management
│   │   ├── faskes.js             # Healthcare facility management
│   │   ├── tracking.js           # Tracking management
│   │   ├── search.js             # Search functionality
│   │   ├── laporan.js            # Report management
│   │   ├── tempatTidur.js        # Bed management
│   │   └── notifications.js      # Notification routes
│   ├── utils/
│   │   └── notificationHelper.js # Notification utilities
│   ├── index.js                  # Main server file
│   ├── package.json              # Backend dependencies
│   └── .env                      # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js          # Login page
│   │   │   ├── Dashboard.js      # Main dashboard
│   │   │   ├── PasienPage.js     # Patient management
│   │   │   ├── RujukanPage.js    # Referral management
│   │   │   ├── FaskesPage.js     # Facility management
│   │   │   ├── MapPage.js        # Interactive map
│   │   │   ├── TrackingPage.js   # Tracking page
│   │   │   ├── SearchPage.js     # Search page
│   │   │   ├── LaporanPage.js    # Report page
│   │   │   ├── TempatTidurPage.js # Bed management
│   │   │   ├── AmbulanceTracker.js # Ambulance tracking
│   │   │   ├── Navigation.js     # Navigation component
│   │   │   ├── NotificationBell.js # Notification component
│   │   │   ├── UserManagement.js # User management
│   │   │   └── ProtectedRoute.js # Route protection
│   │   ├── context/
│   │   │   ├── AuthContext.js    # Authentication context
│   │   │   └── SocketContext.js  # Socket.IO context
│   │   ├── App.js                # Main app component
│   │   └── index.js              # Entry point
│   └── package.json              # Frontend dependencies
└── README.md                     # This file
```

## 🚀 Cara Menjalankan Proyek

### **Prerequisites**
- Node.js (v14 atau lebih baru)
- MySQL (v8.0 atau lebih baru)
- npm atau yarn

### **1. Clone Repository**
```bash
git clone <repository-url>
cd eSIR2.0
```

### **2. Setup Database**
```bash
# Login ke MySQL
mysql -u root -p

# Buat database
CREATE DATABASE esirv2;
USE esirv2;

# Import struktur database
source backend/database.sql;
```

### **3. Setup Backend**
```bash
cd backend

# Install dependencies
npm install

# Setup environment variables
cp env.example .env
# Edit .env sesuai konfigurasi database Anda

# Jalankan server development
npm start
# atau
node index.js
```

### **4. Setup Frontend**
```bash
cd frontend

# Install dependencies
npm install

# Jalankan development server
npm start
```

### **5. Akses Aplikasi**
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001

## 👥 User Accounts

### **Default Users (sudah tersedia)**
1. **Admin Pusat**
   - Email: `admin@pusat.com`
   - Password: `admin123`
   - Role: `admin_pusat`
   - Akses: Semua fitur dan data

2. **Admin Faskes**
   - Email: `admin@rsud.com`
   - Password: `admin123`
   - Role: `admin_faskes`
   - Akses: Data faskes tertentu saja

## 🔧 Fitur Utama

### **🔐 Authentication & Authorization**
- JWT-based authentication
- Role-based access control (admin_pusat, admin_faskes)
- Protected routes
- Auto-login dengan token validation
- **Hanya admin pusat yang dapat membuat akun user baru**

### **👥 Patient Management**
- CRUD operasi untuk data pasien
- Validasi NIK (16 digit)
- Data lengkap: nama, NIK, tanggal lahir, jenis kelamin, alamat, telepon
- Medical history: golongan darah, alergi, riwayat penyakit

### **🏥 Healthcare Facility Management**
- CRUD operasi untuk faskes
- Tipe faskes: RSUD, Puskesmas, Klinik
- Data lengkap: nama, alamat, telepon, koordinat
- Role-based access (admin only)

### **📋 Referral Management**
- Auto-generate nomor rujukan (format: RJYYYYMMDD001)
- Status tracking: pending → diterima/ditolak → selesai
- Role-based filtering (admin pusat lihat semua, admin faskes lihat faskes tertentu)
- Catatan dokter untuk tracking
- **✅ FIXED: Data rujukan sekarang muncul dengan benar di frontend**

### **🗺️ Interactive Map**
- Real-time map dengan OpenStreetMap
- Custom markers untuk setiap faskes
- Rujukan lines dengan warna berdasarkan status
- Real-time updates via Socket.IO
- Responsive design

### **🚑 Ambulance Tracking**
- Real-time tracking ambulans
- Status tracking: standby → berangkat → tiba
- Integration dengan peta interaktif
- Notifikasi real-time

### **🔍 Search & Filter**
- Pencarian pasien berdasarkan NIK
- Filter rujukan berdasarkan status
- Filter berdasarkan tanggal
- Advanced search options

### **📊 Reports & Analytics**
- Laporan rujukan harian/bulanan
- Statistik per faskes
- Export data ke Excel/PDF
- Dashboard analytics

### **🛏️ Bed Management**
- Manajemen tempat tidur per faskes
- Status: tersedia/terisi/reserved
- Real-time bed availability
- Integration dengan sistem rujukan

### **🔔 Real-time Notifications**
- Socket.IO integration
- Live notifications untuk rujukan baru
- Status update notifications
- Room-based broadcasting
- Notification persistence di database

### **📊 Dashboard & Statistics**
- Overview statistik rujukan
- Role-based data filtering
- Real-time updates
- Modern UI/UX design

### **👤 User Management (Admin Pusat Only)**
- Manajemen user oleh admin pusat
- Pembuatan akun user baru
- View daftar semua user
- Role-based access control

## 🔌 API Endpoints

### **Authentication**
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register user baru (Admin Pusat only)
- `POST /api/auth/create-user` - Create user baru (Admin Pusat only)
- `GET /api/auth/users` - Get all users (Admin Pusat only)
- `GET /api/auth/roles` - Get all roles (Admin Pusat only)
- `GET /api/auth/profile` - Get user profile

### **Patients**
- `GET /api/pasien` - Get all patients
- `POST /api/pasien` - Create new patient
- `PUT /api/pasien/:id` - Update patient
- `DELETE /api/pasien/:id` - Delete patient
- `GET /api/pasien/search?nik=xxx` - Search patient by NIK

### **Referrals**
- `GET /api/rujukan` - Get all referrals (role-based filtered)
- `POST /api/rujukan` - Create new referral
- `POST /api/rujukan/with-pasien` - Create referral with patient data
- `PUT /api/rujukan/:id/status` - Update referral status
- `GET /api/rujukan/stats/overview` - Get referral statistics

### **Healthcare Facilities**
- `GET /api/faskes` - Get all facilities
- `POST /api/faskes` - Create new facility
- `PUT /api/faskes/:id` - Update facility
- `DELETE /api/faskes/:id` - Delete facility

### **Tracking**
- `GET /api/tracking` - Get tracking data
- `POST /api/tracking` - Create tracking entry
- `PUT /api/tracking/:id` - Update tracking

### **Search**
- `GET /api/search` - Global search
- `GET /api/search/pasien` - Search patients
- `GET /api/search/rujukan` - Search referrals

### **Reports**
- `GET /api/laporan` - Get reports
- `POST /api/laporan` - Generate report

### **Bed Management**
- `GET /api/tempat-tidur` - Get bed data
- `POST /api/tempat-tidur` - Create bed entry
- `PUT /api/tempat-tidur/:id` - Update bed status

### **Notifications**
- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications/:id/read` - Mark notification as read
- `PATCH /api/notifications/read-all` - Mark all as read
- `GET /api/notifications/unread-count` - Get unread count

## 🧪 Testing

### **Backend Testing**
```bash
cd backend

# Test API rujukan
node debug-rujukan-api.js

# Test database query
node test-rujukan-query.js

# Test login
node test-rujukan-with-login.js
```

### **Frontend Testing**
1. Buka browser ke http://localhost:3000
2. Login dengan salah satu user default
3. Test semua fitur: CRUD pasien, rujukan, faskes
4. Test peta interaktif
5. Test real-time notifications
6. Test search dan filter
7. Test tracking dan laporan

## 🐛 Troubleshooting

### **Common Issues**

1. **Database Connection Error**
   - Pastikan MySQL berjalan
   - Periksa konfigurasi di `.env`
   - Pastikan database `esirv2` sudah dibuat

2. **CORS Error**
   - Pastikan backend berjalan di port 3001
   - Periksa CORS configuration di backend

3. **JWT Token Error**
   - Clear localStorage dan login ulang
   - Pastikan JWT_SECRET sama di backend

4. **Socket.IO Connection Error**
   - Pastikan backend server berjalan
   - Periksa CORS configuration untuk Socket.IO

5. **Data Rujukan Tidak Muncul**
   - ✅ **FIXED**: Perbaikan query database dan filter role
   - Pastikan server backend sudah di-restart setelah perubahan
   - Periksa console browser untuk error

6. **Frontend Server Error**
   - Pastikan berada di direktori `frontend` saat menjalankan `npm start`
   - Periksa package.json ada di direktori frontend

### **Recent Bug Fixes**

#### **✅ Fixed: Data Rujukan Tidak Muncul di Frontend**
- **Problem**: Query database menggunakan kolom `u.nama` yang tidak ada
- **Solution**: Ubah ke `u.nama_lengkap` di semua query rujukan
- **Problem**: Filter role admin pusat tidak berfungsi
- **Solution**: Perbaiki logic filter untuk admin pusat dengan `faskes_id = null`

#### **✅ Fixed: Server Startup Issues**
- **Problem**: Server tidak start dengan benar
- **Solution**: Gunakan `node index.js` atau `npm start` di direktori yang benar

### **Development Tips**
- Gunakan browser DevTools untuk debug
- Check console logs untuk error messages
- Monitor network requests di DevTools
- Restart server jika ada perubahan di backend
- Pastikan kedua server (frontend & backend) berjalan

## 📝 Environment Variables

### **Backend (.env)**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=esirv2
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h
PORT=3001
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

Dikembangkan dengan ❤️ untuk sistem rujukan kesehatan yang lebih efisien.

---

**Status:** ✅ **PRODUCTION READY** - Semua fitur utama telah selesai dan siap untuk deployment.

**Last Updated:** 16 Agustus 2025
**Version:** 2.0.0
