# 🚑 Ambulance Drivers Setup

## 📋 Overview
Setup lengkap untuk menambahkan akun user sopir ambulans ke sistem eSIR 2.0.

## 🗂️ Files yang Dibuat

### **1. Database Scripts**
- `create-ambulance-drivers-table.sql` - SQL untuk membuat tabel ambulance_drivers
- `manual-ambulance-driver-queries.sql` - Query manual untuk menambah sopir ambulans

### **2. Node.js Scripts**
- `add-ambulance-driver-role.js` - Menambah role sopir_ambulans
- `add-ambulance-drivers.js` - Menambah user sopir ambulans
- `setup-ambulance-drivers.js` - Script utama untuk setup lengkap

### **3. Testing**
- `test-ambulance-drivers.js` - Testing untuk memverifikasi setup

## 🚀 Cara Menjalankan

### **Method 1: Automated Setup (Recommended)**
```bash
# 1. Install dependencies (if not already installed)
npm install mysql2 bcryptjs dotenv

# 2. Run automated setup
node setup-ambulance-drivers.js
```

### **Method 2: Manual Setup**
```bash
# 1. Create table
mysql -u root -p esir_db < create-ambulance-drivers-table.sql

# 2. Add role
node add-ambulance-driver-role.js

# 3. Add drivers
node add-ambulance-drivers.js
```

### **Method 3: Manual SQL Queries**
```bash
# Run queries from manual-ambulance-driver-queries.sql
mysql -u root -p esir_db
```

## 📊 Data Sopir Ambulans yang Ditambahkan

| Nama | Email | Password | Ambulance | SIM | Faskes |
|------|-------|----------|-----------|-----|--------|
| Ahmad Supriadi | ahmad.supriadi@ambulans.com | sopir123 | AMB-001 | B1234567 | Faskes 1 |
| Budi Santoso | budi.santoso@ambulans.com | sopir123 | AMB-002 | B1234568 | Faskes 1 |
| Candra Wijaya | candra.wijaya@ambulans.com | sopir123 | AMB-003 | B1234569 | Faskes 2 |
| Dedi Kurniawan | dedi.kurniawan@ambulans.com | sopir123 | AMB-004 | B1234570 | Faskes 2 |
| Eko Prasetyo | eko.prasetyo@ambulans.com | sopir123 | AMB-005 | B1234571 | Faskes 3 |

## 🗄️ Database Schema

### **Table: ambulance_drivers**
```sql
CREATE TABLE ambulance_drivers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  nomor_sim VARCHAR(20) NOT NULL,
  nomor_ambulans VARCHAR(20) NOT NULL,
  status ENUM('aktif', 'nonaktif', 'cuti', 'sakit') DEFAULT 'aktif',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_nomor_sim (nomor_sim),
  UNIQUE KEY unique_nomor_ambulans (nomor_ambulans),
  UNIQUE KEY unique_user_driver (user_id)
);
```

### **Role: sopir_ambulans**
- **Nama**: sopir_ambulans
- **Deskripsi**: Sopir ambulans yang bertugas mengantar pasien
- **Permissions**: View-only access to relevant data

## 🧪 Testing

### **Run Test Script**
```bash
node test-ambulance-drivers.js
```

### **Manual Testing**
```bash
# Test login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ahmad.supriadi@ambulans.com","password":"sopir123"}'

# Test profile
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/auth/profile
```

## 🔍 Database Queries

### **View All Ambulance Drivers**
```sql
SELECT 
    u.id,
    u.nama_lengkap,
    u.email,
    u.telepon,
    r.nama_role,
    f.nama_faskes,
    ad.nomor_sim,
    ad.nomor_ambulans,
    ad.status
FROM users u
LEFT JOIN roles r ON u.role_id = r.id
LEFT JOIN faskes f ON u.faskes_id = f.id
LEFT JOIN ambulance_drivers ad ON u.id = ad.user_id
WHERE r.nama_role = 'sopir_ambulans'
ORDER BY u.nama_lengkap;
```

### **Add Single Ambulance Driver**
```sql
-- 1. Add user
INSERT INTO users (nama_lengkap, username, password, email, role_id, faskes_id, telepon, created_at, updated_at) 
VALUES ('Nama Sopir', 'username', '$2a$12$hashedpassword', 'email@ambulans.com', 
        (SELECT id FROM roles WHERE nama_role = 'sopir_ambulans'), 1, '081234567890', NOW(), NOW());

-- 2. Add ambulance driver details
INSERT INTO ambulance_drivers (user_id, nomor_sim, nomor_ambulans, status, created_at, updated_at) 
VALUES (LAST_INSERT_ID(), 'B1234572', 'AMB-006', 'aktif', NOW(), NOW());
```

### **Update Driver Status**
```sql
UPDATE ambulance_drivers 
SET status = 'nonaktif', updated_at = NOW() 
WHERE user_id = (SELECT id FROM users WHERE email = 'email@ambulans.com');
```

## 🛡️ Security Features

### **1. Password Security**
- ✅ Passwords hashed dengan bcrypt
- ✅ Salt rounds: 12
- ✅ Default password: sopir123

### **2. Role-based Access**
- ✅ Role sopir_ambulans dengan permissions terbatas
- ✅ View-only access untuk data yang relevan
- ✅ Filtered data berdasarkan faskes

### **3. Data Validation**
- ✅ Unique constraints untuk nomor SIM dan ambulans
- ✅ Foreign key constraints
- ✅ Status validation (aktif, nonaktif, cuti, sakit)

## 🎯 Next Steps

### **1. Backend Development**
- [ ] Update auth routes untuk support sopir_ambulans role
- [ ] Create ambulance driver specific endpoints
- [ ] Add tracking endpoints untuk ambulans

### **2. Frontend Development**
- [ ] Create ambulance driver dashboard
- [ ] Add tracking interface
- [ ] Create driver profile management

### **3. Features**
- [ ] Real-time ambulance tracking
- [ ] Driver status updates
- [ ] Route optimization
- [ ] Emergency notifications

## 🔧 Configuration

### **Environment Variables**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=esir_db
```

### **Dependencies**
```json
{
  "mysql2": "^3.0.0",
  "bcryptjs": "^2.4.3",
  "dotenv": "^16.0.0"
}
```

## 📝 Troubleshooting

### **Common Issues**

1. **Role not found**
   ```bash
   # Run role creation first
   node add-ambulance-driver-role.js
   ```

2. **Table already exists**
   ```sql
   -- Drop and recreate
   DROP TABLE IF EXISTS ambulance_drivers;
   -- Then run create-ambulance-drivers-table.sql
   ```

3. **Password hash issues**
   ```javascript
   // Use bcrypt to hash password
   const bcrypt = require('bcryptjs');
   const hashedPassword = await bcrypt.hash('sopir123', 12);
   ```

### **Debug Commands**
```bash
# Check database connection
mysql -u root -p -e "USE esir_db; SHOW TABLES;"

# Check roles
mysql -u root -p -e "USE esir_db; SELECT * FROM roles;"

# Check users
mysql -u root -p -e "USE esir_db; SELECT u.nama_lengkap, u.email, r.nama_role FROM users u LEFT JOIN roles r ON u.role_id = r.id;"
```

---

**Status**: ✅ Ready for Implementation  
**Last Updated**: $(date)  
**Maintainer**: Development Team
