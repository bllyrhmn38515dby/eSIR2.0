# 🛠️ PANDUAN RECOVERY INNODB eSIR 2.0

## 📋 **DESKRIPSI MASALAH**

Error yang Anda alami menunjukkan **InnoDB log sequence number (LSN) tidak sinkron**:

```
InnoDB: Page [page id: space=0, page number=12] log sequence number 1933671 is in the future! 
Current system log sequence number 1924703.
```

## 🔍 **PENYEBAB**

1. **Copy database tanpa log files InnoDB**
2. **Shutdown database yang tidak proper**
3. **Disk space penuh** saat operasi database
4. **Crash atau restart paksa** server
5. **Ketidakcocokan** antara tablespace dan log files

## ⚡ **SOLUSI CEPAT**

### **Opsi 1: Menggunakan Script Recovery (Recommended)**

**Windows:**
```cmd
innodb-recovery.bat
```

**Linux/Mac:**
```bash
chmod +x innodb-recovery.sh
./innodb-recovery.sh
```

### **Opsi 2: Manual Recovery**

#### **Langkah 1: Backup Data**
```bash
mysqldump -u root -p prodsysesirv02 > backup_prodsysesirv02_$(date +%Y%m%d_%H%M%S).sql
```

#### **Langkah 2: Force Recovery Mode**
Edit file `my.cnf` atau `my.ini`:
```ini
[mysqld]
innodb_force_recovery = 1
```

#### **Langkah 3: Restart MySQL**
```bash
# Windows
net stop mysql
net start mysql

# Linux
sudo systemctl restart mysql
```

#### **Langkah 4: Export Data**
```bash
mysqldump -u root -p --all-databases > all_databases_recovery.sql
```

#### **Langkah 5: Clean Recovery**
1. **Stop MySQL**
2. **Hapus InnoDB log files**:
   ```bash
   # Windows (XAMPP)
   del C:\xampp_temp\mysql\data\ib_logfile*
   
   # Linux
   sudo rm /var/lib/mysql/ib_logfile*
   ```
3. **Start MySQL** (InnoDB akan membuat log files baru)
4. **Restore data**:
   ```bash
   mysql -u root -p prodsysesirv02 < backup_prodsysesirv02_YYYYMMDD_HHMMSS.sql
   ```

## 🔧 **MODE RECOVERY INNODB**

| Mode | Deskripsi | Penggunaan |
|------|-----------|------------|
| 0 | Normal operation | Default |
| 1 | Abaikan corrupt pages | Mulai dari sini |
| 2 | Hentikan master thread | Jika mode 1 gagal |
| 3 | Cegah rollback transactions | Jika mode 2 gagal |
| 4 | Cegah rollback + hentikan background tasks | Jika mode 3 gagal |
| 5 | Treat incomplete transactions as committed | Jika mode 4 gagal |
| 6 | Disable redo log roll-forward | Mode terakhir |

## ⚠️ **PERINGATAN**

- **Selalu backup** data sebelum recovery
- **Mode recovery tinggi** (4-6) dapat menyebabkan data inconsistency
- **Test aplikasi** setelah recovery untuk memastikan data integrity
- **Monitor log** untuk error lainnya

## 🚀 **VERIFIKASI SETELAH RECOVERY**

### **1. Test Koneksi Database**
```bash
mysql -u root -p prodsysesirv02 -e "SHOW TABLES;"
```

### **2. Test Aplikasi eSIR 2.0**
```bash
# Start backend
cd backend
npm start

# Test endpoint
curl http://localhost:3001/test
```

### **3. Check Database Health**
```sql
-- Check InnoDB status
SHOW ENGINE INNODB STATUS;

-- Check table integrity
CHECK TABLE users, faskes, pasien, rujukan;
```

## 📊 **MONITORING**

### **File Log Penting**
- **Error Log**: `/var/lib/mysql/error.log` (Linux) atau `C:\xampp_temp\mysql\data\error.log` (Windows)
- **InnoDB Log**: `ib_logfile0`, `ib_logfile1`

### **Command Monitoring**
```bash
# Monitor MySQL process
ps aux | grep mysql

# Check disk space
df -h

# Monitor MySQL logs
tail -f /var/lib/mysql/error.log
```

## 🔄 **PREVENTIVE MEASURES**

### **1. Backup Rutin**
```bash
# Daily backup script
#!/bin/bash
mysqldump -u root -p prodsysesirv02 > /backups/daily_$(date +%Y%m%d).sql
```

### **2. Proper Shutdown**
```bash
# Always shutdown MySQL properly
sudo systemctl stop mysql
# atau
mysqladmin -u root -p shutdown
```

### **3. Monitor Disk Space**
```bash
# Check disk usage
df -h
# Clean old logs if needed
sudo mysql -e "PURGE BINARY LOGS BEFORE DATE_SUB(NOW(), INTERVAL 7 DAY);"
```

## 📞 **SUPPORT**

Jika masalah masih berlanjut:

1. **Check error log** untuk detail lebih lanjut
2. **Verify disk space** dan permissions
3. **Consider database migration** jika corruption parah
4. **Contact system administrator** untuk bantuan lebih lanjut

---

**Catatan**: Recovery ini khusus untuk masalah InnoDB LSN mismatch. Untuk masalah database lainnya, gunakan solusi yang sesuai.
