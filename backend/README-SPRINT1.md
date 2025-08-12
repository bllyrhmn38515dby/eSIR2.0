# Sprint 1: Fondasi & Autentikasi - Backend

## Yang Sudah Selesai ✅

### 1. Database Setup
- ✅ Tabel `roles` untuk menyimpan peran pengguna
- ✅ Tabel `users` untuk menyimpan data pengguna
- ✅ Foreign key relationships
- ✅ Data awal untuk roles (admin_pusat, admin_faskes)

### 2. Dependencies & Konfigurasi
- ✅ bcryptjs untuk hashing password
- ✅ jsonwebtoken untuk JWT authentication
- ✅ cors untuk cross-origin requests
- ✅ dotenv untuk environment variables
- ✅ Script development (`npm run dev`)

### 3. Middleware Authentication
- ✅ `verifyToken` - verifikasi JWT token
- ✅ `requireRole` - authorization berdasarkan role
- ✅ Error handling untuk token invalid/expired

### 4. API Endpoints
- ✅ `POST /api/auth/register` - Registrasi user baru
- ✅ `POST /api/auth/login` - Login user
- ✅ `GET /api/auth/profile` - Get profile user yang login

## Cara Menjalankan

### 1. Setup Database
```sql
-- Buat database
CREATE DATABASE esir_db;

-- Import struktur tabel
mysql -u root -p esir_db < database.sql
```

### 2. Setup Environment
```bash
# Copy file konfigurasi
cp config.env .env

# Edit .env sesuai konfigurasi database Anda
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Jalankan Server
```bash
npm run dev
```

## Testing API

### Register User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin_pusat",
    "password": "password123",
    "email": "admin@pusat.com",
    "nama_lengkap": "Administrator Pusat",
    "role_id": 1
  }'
```

### Login User
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin_pusat",
    "password": "password123"
  }'
```

### Get Profile (dengan token)
```bash
curl -X GET http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Langkah Selanjutnya

Setelah backend selesai, kita akan lanjut ke:
1. Frontend React untuk halaman login/register
2. Dashboard kosong yang hanya bisa diakses setelah login
3. Integrasi frontend dengan backend API

## Struktur File
```
backend/
├── config/
│   └── db.js              # Database connection
├── middleware/
│   └── auth.js            # Authentication middleware
├── routes/
│   └── auth.js            # Auth routes
├── database.sql           # Database schema
├── index.js               # Main server file
├── package.json           # Dependencies
├── config.env             # Environment variables
└── start-dev.bat          # Development script
```
