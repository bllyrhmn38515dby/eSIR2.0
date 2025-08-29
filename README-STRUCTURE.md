# 📁 STRUKTUR PROYEK eSIR 2.0 (TERORGANISIR)

## 🎯 **TUJUAN REORGANISASI**
Struktur proyek telah diorganisir ulang untuk memisahkan file **CORE** (sistem utama) dan **NON-CORE** (testing/debugging) agar lebih rapi dan mudah dipahami.

## 🚀 **STRUKTUR UTAMA**

```
📁 eSIR2.0/
├── 📦 package.json                    # Dependencies utama
├── 📦 package-lock.json              # Lock file dependencies
├── 📁 backend/                       # 🚀 BACKEND CORE
├── 📁 frontend/                      # 🎨 FRONTEND CORE
├── 📁 testing-scripts/               # 🧪 TESTING FILES
├── 📁 documentation/                 # 📚 DOKUMENTASI
└── 📁 batch-scripts/                 # 🔧 SCRIPT OTOMATISASI
```

## 🚀 **FILE CORE (SISTEM UTAMA)**

### **Backend Core Files:**
- `backend/index.js` - Entry point server
- `backend/package.json` - Dependencies
- `backend/database.sql` - Database schema
- `backend/config/db.js` - Database config
- `backend/routes/*.js` - API endpoints
- `backend/middleware/*.js` - Middleware
- `backend/utils/*.js` - Utilities

### **Frontend Core Files:**
- `frontend/src/App.js` - Main React component
- `frontend/src/index.js` - React entry point
- `frontend/src/components/*.js` - React components
- `frontend/src/context/*.js` - React context
- `frontend/package.json` - Dependencies

## 🧪 **FILE NON-CORE (TESTING/DEBUGGING)**

### **Testing Scripts:**
- `testing-scripts/test-files/` - Test scripts
- `testing-scripts/debug-files/` - Debug scripts
- `testing-scripts/setup-files/` - Setup scripts
- `testing-scripts/check-files/` - Check scripts
- `testing-scripts/fix-files/` - Fix scripts
- `testing-scripts/add-files/` - Add scripts
- `testing-scripts/create-files/` - Create scripts
- `testing-scripts/quick-files/` - Quick scripts
- `testing-scripts/simple-files/` - Simple scripts
- `testing-scripts/verify-files/` - Verify scripts
- `testing-scripts/generate-files/` - Generate scripts
- `testing-scripts/backend-test-files/` - Backend testing

### **Documentation:**
- `documentation/*.md` - Semua file dokumentasi

### **Batch Scripts:**
- `batch-scripts/*.bat` - Windows batch files
- `batch-scripts/*.sh` - Shell scripts

## 📊 **KEUNTUNGAN REORGANISASI**

✅ **Struktur Lebih Rapi** - File core dan non-core terpisah
✅ **Mudah Dipahami** - Struktur yang jelas dan terorganisir
✅ **Maintenance Lebih Mudah** - File testing tidak mengganggu core
✅ **Development Lebih Fokus** - Fokus pada file core untuk development
✅ **Backup Lebih Efisien** - Bisa backup hanya file core jika diperlukan

## 🚀 **CARA MENJALANKAN SISTEM**

### **Setup Database:**
```bash
mysql -u root -p esirv2 < backend/database.sql
```

### **Install Dependencies:**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### **Jalankan Aplikasi:**
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

## 📝 **CATATAN**

- File di folder `testing-scripts/` **BISA DIHAPUS** tanpa mempengaruhi sistem
- File di folder `documentation/` **BISA DIHAPUS** tanpa mempengaruhi sistem
- File di folder `batch-scripts/` **BISA DIHAPUS** tanpa mempengaruhi sistem
- **HANYA** file di `backend/` dan `frontend/` yang **WAJIB ADA** untuk menjalankan sistem
