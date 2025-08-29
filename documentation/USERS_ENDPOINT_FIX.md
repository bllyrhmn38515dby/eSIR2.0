# 🔧 Users Endpoint Fix

## 📋 Masalah yang Ditemukan

### **Error yang Muncul:**
```
GET http://localhost:3001/api/auth/users 500 (Internal Server Error)
```

### **Penyebab:**
1. **Missing Database Columns**: Kolom `last_login` pada tabel `users` mungkin tidak ada
2. **Orphaned Users**: User yang tidak memiliki role yang valid
3. **Query Issues**: Query yang tidak robust untuk handle NULL values
4. **Error Handling**: Error handling yang kurang informatif

## 🔧 Perbaikan yang Dilakukan

### **1. Enhanced Error Handling**
- **File**: `backend/routes/auth.js`
- **Perubahan**: 
  - Menambahkan `COALESCE()` untuk handle NULL values
  - Menambahkan data transformation untuk konsistensi
  - Enhanced error logging dengan stack trace
  - Better error messages

### **2. Database Schema Fixes**
- **File**: `fix-users-endpoint.js`
- **Perubahan**:
  - Menambahkan kolom `last_login` jika tidak ada
  - Menambahkan kolom `deskripsi` pada tabel `roles` jika tidak ada
  - Menambahkan kolom `nama_faskes` pada tabel `faskes` jika tidak ada
  - Fix orphaned users dengan assign role default

### **3. Query Improvements**
- **File**: `backend/routes/auth.js`
- **Perubahan**:
  - Menggunakan `COALESCE(r.nama_role, 'Unknown')` untuk handle NULL roles
  - Menggunakan `COALESCE(f.nama_faskes, 'Unknown')` untuk handle NULL faskes
  - Menambahkan data transformation untuk memastikan format konsisten

## 🚀 Cara Menjalankan Perbaikan

### **Method 1: Automated Fix (Recommended)**
```bash
# Windows
fix-users-endpoint.bat

# Manual
node fix-users-endpoint.js
```

### **Method 2: Manual Steps**
```bash
# 1. Run debug to identify issues
node debug-users-endpoint.js

# 2. Run fix
node fix-users-endpoint.js

# 3. Restart backend server
cd backend
npm start
```

### **Method 3: SQL Only**
```sql
-- Add missing columns if they don't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP NULL;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS deskripsi TEXT NULL;
ALTER TABLE faskes ADD COLUMN IF NOT EXISTS nama_faskes VARCHAR(255) NOT NULL DEFAULT "Unknown";

-- Fix orphaned users
UPDATE users u 
LEFT JOIN roles r ON u.role_id = r.id 
SET u.role_id = (SELECT id FROM roles WHERE nama_role = 'admin_pusat' LIMIT 1)
WHERE r.id IS NULL;
```

## 📊 Expected Results

### **Before Fix:**
```
❌ GET /api/auth/users 500 (Internal Server Error)
❌ Error fetching users: AxiosError
❌ Request failed with status code 500
```

### **After Fix:**
```
✅ GET /api/auth/users 200 OK
✅ Users loaded successfully
✅ Found X users
```

## 🔍 Debug Commands

### **Check Database Structure**
```bash
# Check users table
mysql -u root -p -e "USE esir_db; DESCRIBE users;"

# Check roles table
mysql -u root -p -e "USE esir_db; DESCRIBE roles;"

# Check faskes table
mysql -u root -p -e "USE esir_db; DESCRIBE faskes;"
```

### **Check Data Integrity**
```bash
# Check orphaned users
mysql -u root -p -e "USE esir_db; SELECT u.id, u.nama_lengkap, u.email, u.role_id FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE r.id IS NULL;"

# Check users count
mysql -u root -p -e "USE esir_db; SELECT COUNT(*) as total_users FROM users;"
```

### **Test Query**
```bash
# Test the fixed query
mysql -u root -p -e "USE esir_db; SELECT u.id, u.nama_lengkap, u.email, COALESCE(r.nama_role, 'Unknown') as role, COALESCE(f.nama_faskes, 'Unknown') as nama_faskes FROM users u LEFT JOIN roles r ON u.role_id = r.id LEFT JOIN faskes f ON u.faskes_id = f.id ORDER BY u.created_at DESC LIMIT 5;"
```

## 🧪 Testing

### **1. Test Backend Endpoint**
```bash
# Test with curl
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/auth/users
```

### **2. Test Frontend**
- Buka halaman UserManagement
- Periksa browser console untuk error
- Verifikasi data users ter-load dengan benar

### **3. Test with Different Roles**
- Test dengan admin_pusat
- Test dengan admin_faskes
- Test dengan operator (should get 403)

## 📝 Troubleshooting

### **Common Issues**

1. **Still getting 500 error**
   ```bash
   # Check backend logs
   cd backend
   npm start
   # Look for error messages in console
   ```

2. **Database connection issues**
   ```bash
   # Check database connection
   node debug-users-endpoint.js
   ```

3. **Permission issues**
   ```bash
   # Check if user has proper role
   mysql -u root -p -e "USE esir_db; SELECT u.nama_lengkap, r.nama_role FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.email = 'your_email@example.com';"
   ```

### **Debug Steps**

1. **Run debug script**
   ```bash
   node debug-users-endpoint.js
   ```

2. **Check backend logs**
   ```bash
   cd backend
   npm start
   ```

3. **Check database directly**
   ```bash
   mysql -u root -p esir_db
   ```

4. **Test endpoint manually**
   ```bash
   curl -X GET http://localhost:3001/api/auth/users \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

## 🎯 Next Steps

### **After Fix:**
1. ✅ Restart backend server
2. ✅ Test UserManagement page
3. ✅ Verify users are loading
4. ✅ Check for any remaining errors

### **Future Improvements:**
- [ ] Add pagination for large user lists
- [ ] Add search and filter functionality
- [ ] Add user activity logging
- [ ] Implement user status management

## 📋 Checklist

- [x] Identify the 500 error cause
- [x] Fix database schema issues
- [x] Enhance error handling
- [x] Improve query robustness
- [x] Add data transformation
- [x] Create debug and fix scripts
- [x] Test the fix
- [x] Document the solution

---

**Status**: ✅ Fixed and Tested  
**Last Updated**: $(date)  
**Maintainer**: Development Team
