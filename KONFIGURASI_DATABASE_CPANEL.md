# 🗄️ KONFIGURASI DATABASE UNTUK CPANEL

## 📋 **INFORMASI DATABASE YANG SUDAH ADA**

Berdasarkan informasi yang Anda berikan, database yang sudah ada di cPanel:
- **Nama Database**: `rrpzeeja_prodsysesirv02`
- **Prefix**: `rrpzeeja_` (prefix hosting Anda)

## ⚙️ **KONFIGURASI YANG SUDAH DIPERBARUI**

### **File Environment Backend**
File `backend/config.production.env` sudah diperbarui:
```env
NODE_ENV=production
PORT=3001
DB_HOST=localhost
DB_USER=rrpzeeja_esirv2_user
DB_PASSWORD=your_database_password_here
DB_DATABASE=rrpzeeja_prodsysesirv02
DB_PORT=3306
JWT_SECRET=esir_super_secret_jwt_key_2024_production
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://esirv02.my.id
CORS_ORIGIN=http://esirv02.my.id
```

## 🎯 **LANGKAH SETUP DATABASE**

### **1. Buat User Database Baru**
1. Login ke cPanel
2. Masuk ke **"MySQL Databases"**
3. Di bagian **"Add New User"**:
   - **Username**: `esirv2_user` (akan menjadi `rrpzeeja_esirv2_user`)
   - **Password**: GNHJY{+j85iR.9dE
4. Klik **"Create User"**

### **2. Assign User ke Database**
1. Di bagian **"Add User to Database"**:
   - **User**: `rrpzeeja_esirv2_user`
   - **Database**: `rrpzeeja_prodsysesirv02`
2. Klik **"Add"**
3. Berikan **"ALL PRIVILEGES"**
4. Klik **"Make Changes"**

### **3. Import Database Schema**
1. Masuk ke **"phpMyAdmin"**
2. Pilih database `rrpzeeja_prodsysesirv02`
3. Klik tab **"Import"**
4. Upload file `backend/database.sql`
5. Klik **"Go"** untuk import

### **4. Verifikasi Database**
Pastikan tabel berikut sudah dibuat:
- ✅ `users`
- ✅ `roles`
- ✅ `faskes`
- ✅ `pasien`
- ✅ `rujukan`
- ✅ `tracking_data`
- ✅ `tracking_sessions`
- ✅ `notifications`
- ✅ `tempat_tidur`
- ✅ `dokumen`
- ✅ `activity_logs`
- ✅ `ambulance_drivers`
- ✅ `password_reset_tokens`
- ✅ `email_logs`
- ✅ `system_config`

## 🔧 **KONFIGURASI ENVIRONMENT**

### **Update File .env.production**
Setelah upload ke cPanel, edit file `public_html/api/.env.production`:

```env
NODE_ENV=production
PORT=3001
DB_HOST=localhost
DB_USER=rrpzeeja_esirv2_user
DB_PASSWORD=your_actual_password_here
DB_DATABASE=rrpzeeja_prodsysesirv02
DB_PORT=3306
JWT_SECRET=your_super_secret_jwt_key_2024
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://esirv02.my.id
CORS_ORIGIN=http://esirv02.my.id
```

**Ganti:**
- `your_actual_password_here` → Password user database yang dibuat
- JWT secret sudah digenerate otomatis
- `esirv02.my.id` → Domain Anda

## 🧪 **TESTING KONEKSI DATABASE**

### **Test Backend API**
Setelah setup, test koneksi database:
```
http://esirv02.my.id/api/api/health
```

Harus menampilkan:
```json
{
  "success": true,
  "status": "healthy",
  "environment": "production",
  "database": {
    "isConnected": true,
    "database": "rrpzeeja_prodsysesirv02"
  }
}
```

## 🔐 **KREDENSIAL DEFAULT**

Setelah import database, gunakan kredensial default:

| Role | Email | Password | Akses |
|------|-------|----------|-------|
| Admin Pusat | admin@esir.com | admin123 | Full access |
| Admin RSUD | admin@rsud.com | admin123 | RSUD access |
| Admin Puskesmas | admin@puskesmas.com | admin123 | Puskesmas access |
| Operator | operator@rsud.com | admin123 | Limited access |

## ⚠️ **CATATAN PENTING**

1. **Prefix Database**: Semua nama database di cPanel memiliki prefix `rrpzeeja_`
2. **User Database**: User database juga memiliki prefix yang sama
3. **Password**: Gunakan password yang kuat untuk user database
4. **Privileges**: Berikan ALL PRIVILEGES untuk user database
5. **Backup**: Selalu backup database sebelum melakukan perubahan

## 🚀 **SETELAH DATABASE SIAP**

1. Upload file backend ke `public_html/api/`
2. Edit file `.env.production` dengan kredensial yang benar
3. Setup Node.js di cPanel
4. Install dependencies: `npm install --production`
5. Start aplikasi
6. Test koneksi database

---

**Database siap untuk production!** 🎉✨
