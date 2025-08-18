# 🚀 Quick Setup eSIR 2.0

## 📋 Prerequisites
- Node.js (v14 atau lebih baru)
- MySQL Server (v8.0 atau lebih baru)
- npm atau yarn

## ⚡ Quick Start

### 1. Install Dependencies
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 2. Setup Database
```bash
# Login ke MySQL
mysql -u root -p

# Buat database
CREATE DATABASE esirv2;
USE esirv2;

# Import schema
source backend/database.sql;
```

### 3. Setup Environment
```bash
cd backend
copy env.example .env
```

Edit file `.env` dengan kredensial database Anda:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_DATABASE=esirv2
JWT_SECRET=your_jwt_secret_key_here
PORT=3001
```

### 4. Start Application
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

## 🌐 Access URLs
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001

## 👤 Default Login
- **Admin Pusat:** admin@pusat.com / admin123
- **Admin Faskes:** admin@rsud.com / admin123

## 🔧 Troubleshooting

### Frontend Error: 'react-scripts' is not recognized
```bash
cd frontend
npm install
npm start
```

### Backend Error: Database connection failed
1. Pastikan MySQL Server berjalan
2. Periksa kredensial di file `.env`
3. Pastikan database `esirv2` sudah dibuat

### Port Already in Use
```bash
# Cek proses yang menggunakan port
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Matikan proses jika perlu
taskkill /PID <process_id> /F
```

## 📱 Features Available
- ✅ User Authentication & Authorization
- ✅ Patient Management (CRUD)
- ✅ Referral Management (CRUD)
- ✅ Healthcare Facility Management
- ✅ Interactive Maps with Real-time Updates
- ✅ Real-time Notifications
- ✅ Bed Management
- ✅ Search & Filter
- ✅ Reports & Analytics
- ✅ Ambulance Tracking
- ✅ Real-time Route Tracking

## 🗺️ Coverage Area
Kota Bogor, Jawa Barat dengan koordinat:
- Latitude: -6.5971
- Longitude: 106.8060

## 📞 Support
Jika mengalami masalah, periksa:
1. Console browser untuk error frontend
2. Terminal backend untuk error server
3. MySQL logs untuk error database
