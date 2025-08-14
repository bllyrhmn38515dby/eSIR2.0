
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
│   │   │   ├── Register.js       # Register page
│   │   │   ├── Dashboard.js      # Main dashboard
│   │   │   ├── PasienPage.js     # Patient management
│   │   │   ├── RujukanPage.js    # Referral management
│   │   │   ├── FaskesPage.js     # Facility management
│   │   │   ├── MapPage.js        # Interactive map
│   │   │   ├── Navigation.js     # Navigation component
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
CREATE DATABASE esir_db;
USE esir_db;

# Import struktur database
source backend/database.sql;
```

### **3. Setup Backend**
```bash
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env sesuai konfigurasi database Anda

# Jalankan server development
npm run dev
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

2. **Admin Faskes**
   - Email: `admin@soetomo.com`
   - Password: `admin123`
   - Role: `admin_faskes`

3. **Admin Puskesmas**
   - Email: `admin@kenjeran.com`
   - Password: `admin123`
   - Role: `admin_faskes`

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
- Role-based filtering (puskesmas hanya lihat rujukan dari faskesnya)
- Catatan dokter untuk tracking

### **🗺️ Interactive Map**
- Real-time map dengan OpenStreetMap
- Custom markers untuk setiap faskes
- Rujukan lines dengan warna berdasarkan status
- Real-time updates via Socket.IO
- Responsive design

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

### **Referrals**
- `GET /api/rujukan` - Get all referrals
- `POST /api/rujukan` - Create new referral
- `PUT /api/rujukan/:id/status` - Update referral status
- `GET /api/rujukan/stats/overview` - Get referral statistics

### **Healthcare Facilities**
- `GET /api/faskes` - Get all facilities
- `POST /api/faskes` - Create new facility
- `PUT /api/faskes/:id` - Update facility
- `DELETE /api/faskes/:id` - Delete facility

### **Notifications**
- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications/:id/read` - Mark notification as read
- `PATCH /api/notifications/read-all` - Mark all as read
- `GET /api/notifications/unread-count` - Get unread count

## 🧪 Testing

### **Backend Testing**
```bash
cd backend
node test-auth-fix.js
```

### **Frontend Testing**
1. Buka browser ke http://localhost:3000
2. Login dengan salah satu user default
3. Test semua fitur: CRUD pasien, rujukan, faskes
4. Test peta interaktif
5. Test real-time notifications

## 🐛 Troubleshooting

### **Common Issues**

1. **Database Connection Error**
   - Pastikan MySQL berjalan
   - Periksa konfigurasi di `.env`
   - Pastikan database `esir_db` sudah dibuat

2. **CORS Error**
   - Pastikan backend berjalan di port 3001
   - Periksa CORS configuration di backend

3. **JWT Token Error**
   - Clear localStorage dan login ulang
   - Pastikan JWT_SECRET sama di backend

4. **Socket.IO Connection Error**
   - Pastikan backend server berjalan
   - Periksa CORS configuration untuk Socket.IO

### **Development Tips**
- Gunakan browser DevTools untuk debug
- Check console logs untuk error messages
- Monitor network requests di DevTools
- Restart server jika ada perubahan di backend

## 📝 Environment Variables

### **Backend (.env)**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=esir_db
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
