# 🚑 Ambulance Drivers Complete Setup

## 📋 Overview
Setup lengkap untuk menambahkan akun user sopir ambulans ke sistem eSIR 2.0 dengan data yang sudah di-hash dan siap digunakan.

## 🗂️ Files yang Dibuat

### **1. Database Scripts**
- `insert-ambulance-drivers-data.sql` - SQL lengkap dengan data sopir ambulans
- `create-ambulance-drivers-table.sql` - SQL untuk membuat tabel ambulance_drivers

### **2. Node.js Scripts**
- `add-ambulance-drivers-complete.js` - Script lengkap dengan data sopir ambulans
- `add-ambulance-driver-role.js` - Menambah role sopir_ambulans
- `add-ambulance-drivers.js` - Menambah user sopir ambulans
- `setup-ambulance-drivers.js` - Script utama untuk setup lengkap

### **3. Testing & Automation**
- `test-ambulance-drivers.js` - Testing untuk memverifikasi setup
- `run-ambulance-drivers-setup.bat` - Script batch untuk Windows

## 🚀 Cara Menjalankan

### **Method 1: Automated Setup (Recommended)**
```bash
# Windows
run-ambulance-drivers-setup.bat

# Linux/Mac
chmod +x run-ambulance-drivers-setup.sh
./run-ambulance-drivers-setup.sh
```

### **Method 2: Manual Setup**
```bash
# 1. Install dependencies
npm install mysql2 bcryptjs dotenv

# 2. Run complete setup
node add-ambulance-drivers-complete.js
```

### **Method 3: SQL Only**
```bash
# Run SQL script directly
mysql -u root -p esir_db < insert-ambulance-drivers-data.sql
```

## 📊 Data Sopir Ambulans yang Ditambahkan

| No | Nama | Email | Password | Ambulance | SIM | Faskes |
|----|------|-------|----------|-----------|-----|--------|
| 1 | Ahmad Supriadi | ahmad.supriadi@ambulans.com | sopir123 | AMB-001 | B1234567 | Faskes 1 |
| 2 | Budi Santoso | budi.santoso@ambulans.com | sopir123 | AMB-002 | B1234568 | Faskes 1 |
| 3 | Candra Wijaya | candra.wijaya@ambulans.com | sopir123 | AMB-003 | B1234569 | Faskes 2 |
| 4 | Dedi Kurniawan | dedi.kurniawan@ambulans.com | sopir123 | AMB-004 | B1234570 | Faskes 2 |
| 5 | Eko Prasetyo | eko.prasetyo@ambulans.com | sopir123 | AMB-005 | B1234571 | Faskes 3 |
| 6 | Fajar Ramadhan | fajar.ramadhan@ambulans.com | sopir123 | AMB-006 | B1234572 | Faskes 3 |
| 7 | Gunawan Setiawan | gunawan.setiawan@ambulans.com | sopir123 | AMB-007 | B1234573 | Faskes 4 |
| 8 | Hendra Kusuma | hendra.kusuma@ambulans.com | sopir123 | AMB-008 | B1234574 | Faskes 4 |
| 9 | Indra Permana | indra.permana@ambulans.com | sopir123 | AMB-009 | B1234575 | Faskes 5 |
| 10 | Joko Widodo | joko.widodo@ambulans.com | sopir123 | AMB-010 | B1234576 | Faskes 5 |

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

## 🔐 Security Features

### **1. Password Security**
- ✅ Passwords hashed dengan bcrypt
- ✅ Salt rounds: 12
- ✅ Default password: sopir123
- ✅ Hash: `$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/5J5K5K5K`

### **2. Data Validation**
- ✅ Unique constraints untuk nomor SIM dan ambulans
- ✅ Foreign key constraints
- ✅ Status validation (aktif, nonaktif, cuti, sakit)
- ✅ Email validation

### **3. Role-based Access**
- ✅ Role sopir_ambulans dengan permissions terbatas
- ✅ View-only access untuk data yang relevan
- ✅ Filtered data berdasarkan faskes

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
    ad.status,
    u.created_at
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
VALUES (LAST_INSERT_ID(), 'B1234577', 'AMB-011', 'aktif', NOW(), NOW());
```

### **Update Driver Status**
```sql
UPDATE ambulance_drivers 
SET status = 'nonaktif', updated_at = NOW() 
WHERE user_id = (SELECT id FROM users WHERE email = 'email@ambulans.com');
```

### **Get Statistics**
```sql
SELECT 
    COUNT(*) as total_drivers,
    COUNT(CASE WHEN ad.status = 'aktif' THEN 1 END) as aktif_drivers,
    COUNT(CASE WHEN ad.status = 'nonaktif' THEN 1 END) as nonaktif_drivers,
    COUNT(CASE WHEN ad.status = 'cuti' THEN 1 END) as cuti_drivers,
    COUNT(CASE WHEN ad.status = 'sakit' THEN 1 END) as sakit_drivers
FROM users u
LEFT JOIN roles r ON u.role_id = r.id
LEFT JOIN ambulance_drivers ad ON u.id = ad.user_id
WHERE r.nama_role = 'sopir_ambulans';
```

## 🎯 Expected Output

### **Setup Success**
```
🚑 Adding Complete Ambulance Drivers Data...

✅ Connected to database
🏗️ Creating ambulance_drivers table...
✅ Ambulance drivers table created successfully
🚑 Adding Ambulance Driver Role...
✅ Role sopir_ambulans added successfully
Role ID: 4

📋 Available faskes:
  - ID: 1, Nama: RS Umum Daerah
  - ID: 2, Nama: RS Khusus
  - ID: 3, Nama: Puskesmas

✅ Added driver: Ahmad Supriadi (ID: 15)
   Email: ahmad.supriadi@ambulans.com
   Ambulance: AMB-001
   SIM: B1234567
   Faskes ID: 1

[... more drivers ...]

📊 Summary:
✅ Successfully added 10 ambulance drivers
⚠️ Skipped 0 existing drivers

👥 Added Drivers:
  - Ahmad Supriadi (ahmad.supriadi@ambulans.com) - AMB-001 - Faskes 1
  - Budi Santoso (budi.santoso@ambulans.com) - AMB-002 - Faskes 1
  [... more drivers ...]

📈 Final Statistics:
   Total Drivers: 10
   Aktif: 10
   Nonaktif: 0
   Cuti: 0
   Sakit: 0

🏥 Drivers by Faskes:
   RS Umum Daerah: 2 drivers
     Ahmad Supriadi, Budi Santoso
   RS Khusus: 2 drivers
     Candra Wijaya, Dedi Kurniawan
   [... more faskes ...]

🎉 Complete Ambulance Drivers setup completed!
```

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
   -- Then run insert-ambulance-drivers-data.sql
   ```

3. **Password hash issues**
   ```javascript
   // Use bcrypt to hash password
   const bcrypt = require('bcryptjs');
   const hashedPassword = await bcrypt.hash('sopir123', 12);
   ```

4. **Faskes ID not found**
   ```sql
   -- Check available faskes
   SELECT id, nama_faskes FROM faskes;
   ```

### **Debug Commands**
```bash
# Check database connection
mysql -u root -p -e "USE esir_db; SHOW TABLES;"

# Check roles
mysql -u root -p -e "USE esir_db; SELECT * FROM roles;"

# Check users
mysql -u root -p -e "USE esir_db; SELECT u.nama_lengkap, u.email, r.nama_role FROM users u LEFT JOIN roles r ON u.role_id = r.id;"

# Check ambulance drivers
mysql -u root -p -e "USE esir_db; SELECT * FROM ambulance_drivers;"
```

## 🎯 Next Steps

### **1. Backend Development**
- [ ] Update auth routes untuk support sopir_ambulans role
- [ ] Create ambulance driver specific endpoints
- [ ] Add tracking endpoints untuk ambulans
- [ ] Add driver status management

### **2. Frontend Development**
- [ ] Create ambulance driver dashboard
- [ ] Add tracking interface
- [ ] Create driver profile management
- [ ] Add status update interface

### **3. Features**
- [ ] Real-time ambulance tracking
- [ ] Driver status updates
- [ ] Route optimization
- [ ] Emergency notifications
- [ ] Driver performance metrics

## 📋 Checklist

- [x] Create ambulance_drivers table
- [x] Add sopir_ambulans role
- [x] Insert 10 ambulance drivers
- [x] Hash passwords with bcrypt
- [x] Add proper constraints and indexes
- [x] Create test scripts
- [x] Create automation scripts
- [x] Document everything
- [ ] Test login functionality
- [ ] Update backend routes
- [ ] Create frontend components

---

**Status**: ✅ Ready for Implementation  
**Last Updated**: $(date)  
**Maintainer**: Development Team  
**Version**: 1.0.0
