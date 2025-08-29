
# 🚑 eSIR 2.0 - Sistem Informasi Rujukan

Sistem Informasi Rujukan (eSIR) 2.0 adalah aplikasi web untuk mengelola rujukan pasien antar fasilitas kesehatan dengan fitur tracking ambulans real-time.

## 🎯 **FITUR UTAMA**

- 🔐 **Sistem Autentikasi Multi-Role** (Admin Pusat, Admin Faskes, Sopir Ambulans)
- 📋 **Manajemen Rujukan Pasien**
- 🚑 **Tracking Ambulans Real-time**
- 📊 **Dashboard Statistik**
- 🔔 **Sistem Notifikasi**
- 📱 **Responsive Design**
- 🗺️ **Integrasi Peta (Leaflet)**
- 📄 **Upload & Manajemen Dokumen**

## 🚀 **STATUS PROYEK**

### ✅ **SEMUA SISTEM OPERASIONAL**
- ✅ Backend API (Node.js + Express)
- ✅ Frontend React
- ✅ Database MySQL
- ✅ Real-time Socket.IO
- ✅ Authentication & Authorization
- ✅ File Upload System
- ✅ GPS Tracking System

### 🔧 **PERBAIKAN TERAKHIR**
- ✅ Fixed React Router context error
- ✅ Fixed ToastContainer initialization error
- ✅ Fixed AuthContext circular dependency
- ✅ All ESLint warnings resolved
- ✅ All dependencies updated

## 📋 **PRASYARAT**

- Node.js (v16 atau lebih baru)
- MySQL (v8.0 atau lebih baru)
- npm atau yarn

## 🛠️ **INSTALASI**

### 1. Clone Repository
```bash
git clone <repository-url>
cd eSIR2.0
```

### 2. Setup Database
```bash
# Buat database MySQL
CREATE DATABASE esirv2;

# Import struktur database
mysql -u root -p esirv2 < backend/database.sql
```

### 3. Setup Environment Variables

**Backend (`backend/config.env`):**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=esirv2
DB_PORT=3306
JWT_SECRET=your_jwt_secret
PORT=3001
FRONTEND_URL=http://localhost:3000
```

**Frontend (`frontend/.env`):**
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_SOCKET_URL=http://localhost:3001
```

### 4. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 5. Jalankan Aplikasi

**Cara 1: Menggunakan Script Otomatis**
```bash
# Dari root directory
./start-app.bat
```

**Cara 2: Manual**
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

## 🔐 **AKUN LOGIN YANG TERSEDIA**

### **👑 Admin Pusat (Full Access)**
| Email | Username | Password | Role |
|-------|----------|----------|------|
| `admin@esirv2.com` | `superadminesirv2` | `password123` | admin_pusat |
| `adminstaff@esirv2.com` | `adminesirv2staff` | `password123` | admin_pusat |
| `admin@esir.com` | `admin_test` | `password123` | admin_pusat |

### **🏥 Admin Faskes (Terbatas per Faskes)**
| Email | Username | Password | Role | Faskes |
|-------|----------|----------|------|--------|
| `retaazra@esirv2faskes.com` | `retafaskesazra` | `password123` | admin_faskes | RS Azra Bogor |
| `willinmm@esirv2faskes.com` | `willinammarzoeki` | `password123` | admin_faskes | RS dr. H. Marzoeki Mahdi |

### **🚑 Sopir Ambulans**
| Email | Username | Password | Faskes |
|-------|----------|----------|--------|
| `ahmad.supriadi@ambulans.com` | `ahmad.supriadi` | `password123` | Puskesmas Bogor Tengah |
| `budi.santoso@ambulans.com` | `budi.santoso` | `password123` | Puskesmas Bogor Tengah |
| `candra.wijaya@ambulans.com` | `candra.wijaya` | `password123` | Puskesmas Bogor Tengah |
| `dedi.kurniawan@ambulans.com` | `dedi.kurniawan` | `password123` | RS dr. H. Marzoeki Mahdi |
| `eko.prasetyo@ambulans.com` | `eko.prasetyo` | `password123` | RS dr. H. Marzoeki Mahdi |
| `fajar.ramadhan@ambulans.com` | `fajar.ramadhan` | `password123` | RS dr. H. Marzoeki Mahdi |
| `gunawan.setiawan@ambulans.com` | `gunawan.setiawan` | `password123` | RS Azra Bogor |
| `hendra.kusuma@ambulans.com` | `hendra.kusuma` | `password123` | RS Azra Bogor |
| `indra.permana@ambulans.com` | `indra.permana` | `password123` | RS Azra Bogor |
| `joko.widodo@ambulans.com` | `joko.widodo` | `password123` | RS Azra Bogor |
| `nicorimaw@ambulans.com` | `nicrimawan` | `password123` | RS dr. H. Marzoeki Mahdi |

## 🏥 **FASKES YANG TERSEDIA**

1. **RSUD Kota Bogor** (RSUD)
2. **Puskesmas Bogor Tengah** (Puskesmas)
3. **RS dr. H. Marzoeki Mahdi** (RS)
4. **RS Azra Bogor** (RS)

## 📱 **CARA PENGGUNAAN**

### **Untuk Admin Pusat:**
1. Login dengan akun admin pusat
2. Akses Dashboard untuk melihat statistik
3. Kelola user dan faskes
4. Monitor semua rujukan

### **Untuk Admin Faskes:**
1. Login dengan akun admin faskes
2. Kelola rujukan untuk faskes Anda
3. Monitor tracking ambulans
4. Upload dokumen rujukan

### **Untuk Sopir Ambulans:**
1. Login dengan akun sopir
2. Akses halaman tracking
3. Update posisi GPS real-time
4. Lihat detail rujukan yang ditugaskan

## 🔧 **ENDPOINT API**

### **Authentication**
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout user

### **Users**
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### **Rujukan**
- `GET /api/rujukan` - Get all referrals
- `POST /api/rujukan` - Create referral
- `PUT /api/rujukan/:id` - Update referral
- `DELETE /api/rujukan/:id` - Cancel referral

### **Tracking**
- `GET /api/tracking` - Get active tracking
- `POST /api/tracking/start` - Start tracking session
- `PUT /api/tracking/position` - Update position
- `POST /api/tracking/end` - End tracking session

### **Statistics**
- `GET /api/stats` - Get dashboard statistics
- `GET /api/stats/rujukan` - Get referral statistics

## 🛠️ **TEKNOLOGI YANG DIGUNAKAN**

### **Backend**
- Node.js
- Express.js
- MySQL2
- Socket.IO
- JWT Authentication
- Multer (File Upload)
- Nodemailer
- Bcryptjs

### **Frontend**
- React.js
- React Router DOM
- Leaflet (Maps)
- Socket.IO Client
- Axios
- React Hooks

### **Database**
- MySQL
- Connection Pooling

## 📊 **MONITORING & DEBUGGING**

### **Status Check**
```bash
node check-status.js
```

### **Database Check**
```bash
node check-users-database.js
```

### **Logs**
- Backend logs: `backend/logs/`
- Frontend logs: Browser console
- Database logs: MySQL error log

## 🚨 **TROUBLESHOOTING**

### **Common Issues**

1. **Database Connection Error**
   - Pastikan MySQL server berjalan
   - Periksa konfigurasi database di `backend/config.env`

2. **Port Already in Use**
   - Backend: `netstat -ano | findstr :3001`
   - Frontend: `netstat -ano | findstr :3000`

3. **Module Not Found**
   - Jalankan `npm install` di folder backend dan frontend
   - Periksa `package.json` dependencies

4. **Authentication Error**
   - Periksa JWT_SECRET di environment variables
   - Pastikan token tidak expired

## 📝 **CHANGELOG**

### **v2.0.0 (Latest)**
- ✅ Fixed all React Router context errors
- ✅ Fixed ToastContainer initialization issues
- ✅ Fixed AuthContext circular dependencies
- ✅ Resolved all ESLint warnings
- ✅ Updated all dependencies
- ✅ Added comprehensive user management
- ✅ Enhanced GPS tracking system
- ✅ Improved notification system

### **v1.0.0**
- Initial release with basic functionality

## 🤝 **KONTRIBUSI**

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 **LICENSE**

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 **KONTAK**

- **Project Link:** [https://github.com/your-username/eSIR2.0](https://github.com/your-username/eSIR2.0)
- **Email:** admin@esirv2.com

---

## 🎉 **PROYEK SIAP DIGUNAKAN!**

Semua sistem telah diperbaiki dan siap untuk digunakan. Tidak ada error kritis yang tersisa.

**🌐 Akses Aplikasi:** http://localhost:3000
**🔧 API Backend:** http://localhost:3001
**📊 Database:** MySQL esirv2
