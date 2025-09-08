# 🔧 DEVELOPMENT MODE - eSIR 2.0

## 📋 Overview
Development mode telah diaktifkan untuk memudahkan testing dan development aplikasi eSIR 2.0.

## 🔐 Password Authentication
**Status**: Hash password **DINONAKTIFKAN** untuk development

### ✅ Kredensial Login (Plain Text):
- **Email**: `admin@esir.com`
- **Password**: `admin123`
- **Role**: `admin_pusat`

- **Email**: `admin@rsud.com`
- **Password**: `admin123`
- **Role**: `admin_faskes`

- **Email**: `admin@puskesmas.com`
- **Password**: `admin123`
- **Role**: `admin_faskes`

- **Email**: `operator@rsud.com`
- **Password**: `admin123`
- **Role**: `operator`

## 🛠️ Konfigurasi Development Mode

### File: `backend/routes/auth.js`
```javascript
// DEVELOPMENT MODE: Nonaktifkan hash password untuk testing
const DEV_MODE = true; // Set ke false untuk production
```

### Fitur yang Dimodifikasi:
1. **Login Authentication**: Password dibandingkan sebagai plain text
2. **User Creation**: Password disimpan sebagai plain text
3. **Password Update**: Password diupdate sebagai plain text
4. **Password Reset**: Password reset disimpan sebagai plain text

## ⚠️ PENTING UNTUK PRODUCTION

### Sebelum Deploy ke Production:
1. **Ubah `DEV_MODE = false`** di `backend/routes/auth.js`
2. **Hash semua password** yang ada di database
3. **Test ulang** semua fitur authentication

### Script untuk Production:
```bash
# Hash semua password di database
node hash-all-passwords.js
```

## 🧪 Testing

### Test Login:
```bash
cd backend
node test-login-quick.js
```

### Expected Response:
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "nama_lengkap": "Admin Pusat",
      "email": "admin@esir.com",
      "role": "admin_pusat",
      "last_login": "2025-09-05T04:46:47.000Z"
    }
  }
}
```

## 📊 Database Status
- **Database**: `prodsysesirv02`
- **Connection**: ✅ Active
- **Tables**: ✅ Complete
- **Users**: ✅ 4 users with plain text passwords

## 🚀 Server Status
- **Backend**: ✅ Running on port 3001
- **Authentication**: ✅ Working (plain text mode)
- **API Endpoints**: ✅ Active

## 📝 Log Messages
Development mode akan menampilkan log khusus:
- `🔧 DEV MODE: Password comparison (plain text)`
- `🔧 DEV MODE: Password stored as plain text`
- `🔧 DEV MODE: Password updated as plain text`
- `🔧 DEV MODE: Reset password stored as plain text`

---
**Last Updated**: 2025-09-05
**Status**: Development Mode Active
