# Fitur Upload Dokumen - eSIR 2.0

## 📁 **Ringkasan Fitur**

Fitur Upload Dokumen memungkinkan user untuk mengunggah dan mengelola dokumen pendukung untuk setiap rujukan. Dokumen dapat berupa hasil laboratorium, rontgen, resep, surat rujukan, atau dokumen medis lainnya.

## 🎯 **Fitur yang Tersedia**

### **1. Upload Dokumen**
- ✅ Upload file tunggal dengan metadata
- ✅ Upload multiple files sekaligus
- ✅ Validasi tipe file (PDF, JPG, PNG, DOC, DOCX, XLS, XLSX, TXT)
- ✅ Validasi ukuran file (maksimal 10MB)
- ✅ Kategorisasi dokumen (Hasil Lab, Rontgen, Resep, Surat Rujukan, Lainnya)
- ✅ Deskripsi dokumen (opsional)

### **2. Manajemen Dokumen**
- ✅ Lihat daftar dokumen per rujukan
- ✅ Download dokumen
- ✅ Hapus dokumen (hanya uploader atau admin)
- ✅ Preview informasi dokumen

### **3. Keamanan & Permission**
- ✅ Role-based access control
- ✅ Permission berdasarkan faskes (admin faskes hanya lihat dokumen rujukan faskesnya)
- ✅ Validasi file untuk mencegah upload berbahaya
- ✅ Logging aktivitas upload/download/delete

## 🏗️ **Arsitektur Sistem**

### **Backend Structure**
```
backend/
├── routes/
│   └── dokumen.js          # API endpoints untuk dokumen
├── middleware/
│   └── upload.js           # Multer middleware untuk file upload
├── uploads/
│   └── dokumen/            # Directory penyimpanan file
└── setup-upload-dokumen.js # Script setup database
```

### **Frontend Structure**
```
frontend/src/components/
├── DokumenManager.js       # Komponen utama manajemen dokumen
└── DokumenManager.css      # Styling untuk komponen
```

## 🗄️ **Database Schema**

### **Tabel `dokumen`**
```sql
CREATE TABLE dokumen (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rujukan_id INT(11) NOT NULL,
    nama_file VARCHAR(255) NOT NULL,
    nama_asli VARCHAR(255) NOT NULL,
    tipe_file VARCHAR(100) NOT NULL,
    ukuran_file BIGINT NOT NULL,
    path_file VARCHAR(500) NOT NULL,
    deskripsi TEXT NULL,
    kategori ENUM('hasil_lab', 'rontgen', 'resep', 'surat_rujukan', 'lainnya') DEFAULT 'lainnya',
    uploaded_by INT(11) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (rujukan_id) REFERENCES rujukan(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE
);
```

### **Tabel `dokumen_logs`**
```sql
CREATE TABLE dokumen_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dokumen_id INT(11) NOT NULL,
    user_id INT(11) NOT NULL,
    aksi ENUM('upload', 'download', 'delete', 'view') NOT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dokumen_id) REFERENCES dokumen(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 🔌 **API Endpoints**

### **1. GET /api/dokumen/rujukan/:rujukanId**
**Deskripsi:** Ambil semua dokumen untuk rujukan tertentu
**Permission:** User harus terkait dengan rujukan (faskes asal/tujuan)
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nama_file": "hasil_lab_001.pdf",
      "nama_asli": "Hasil Laboratorium.pdf",
      "tipe_file": "application/pdf",
      "ukuran_file": 1024000,
      "ukuran_file_formatted": "1000.00 KB",
      "deskripsi": "Hasil pemeriksaan darah lengkap",
      "kategori": "hasil_lab",
      "kategori_text": "Hasil Laboratorium",
      "uploaded_by": "Dr. John Doe",
      "created_at": "2024-01-15T10:30:00Z",
      "download_url": "/api/dokumen/1/download"
    }
  ]
}
```

### **2. POST /api/dokumen/upload**
**Deskripsi:** Upload dokumen tunggal
**Permission:** User harus terkait dengan rujukan
**Request:** `multipart/form-data`
- `file`: File yang akan diupload
- `rujukan_id`: ID rujukan
- `deskripsi`: Deskripsi dokumen (opsional)
- `kategori`: Kategori dokumen

### **3. POST /api/dokumen/upload-multiple**
**Deskripsi:** Upload multiple dokumen sekaligus
**Permission:** User harus terkait dengan rujukan
**Request:** `multipart/form-data`
- `files[]`: Array file yang akan diupload
- `rujukan_id`: ID rujukan

### **4. GET /api/dokumen/:id/download**
**Deskripsi:** Download dokumen
**Permission:** User harus terkait dengan rujukan
**Response:** File binary

### **5. DELETE /api/dokumen/:id**
**Deskripsi:** Hapus dokumen
**Permission:** Uploader atau admin_pusat
**Response:**
```json
{
  "success": true,
  "message": "Dokumen berhasil dihapus"
}
```

### **6. GET /api/dokumen/stats/:rujukanId**
**Deskripsi:** Statistik dokumen per rujukan
**Permission:** User harus terkait dengan rujukan
**Response:**
```json
{
  "success": true,
  "data": {
    "total_files": 5,
    "total_size": 5242880,
    "total_size_formatted": "5.00 MB",
    "by_kategori": {
      "hasil_lab": 2,
      "rontgen": 1,
      "resep": 1,
      "surat_rujukan": 0,
      "lainnya": 1
    }
  }
}
```

## 🎨 **UI/UX Features**

### **1. DokumenManager Component**
- **Header:** Judul dan tombol upload/close
- **Upload Form:** Form untuk upload dokumen dengan validasi
- **Dokumen Grid:** Tampilan card untuk setiap dokumen
- **File Icons:** Icon berbeda untuk setiap tipe file
- **Kategori Badges:** Badge berwarna untuk kategori dokumen
- **Action Buttons:** Download dan delete untuk setiap dokumen

### **2. Responsive Design**
- **Desktop:** Grid layout dengan 3-4 kolom
- **Tablet:** Grid layout dengan 2 kolom
- **Mobile:** Single column layout

### **3. User Experience**
- **Drag & Drop:** Area upload yang intuitif
- **Progress Feedback:** Loading states dan success/error messages
- **File Validation:** Real-time validation dengan pesan error yang jelas
- **Confirmation:** Konfirmasi sebelum menghapus dokumen

## 🔒 **Security Features**

### **1. File Validation**
- **Type Validation:** Hanya file yang diizinkan
- **Size Validation:** Maksimal 10MB per file
- **Content Validation:** Validasi MIME type
- **Filename Sanitization:** Sanitasi nama file untuk keamanan

### **2. Access Control**
- **Role-based:** Berdasarkan role user
- **Facility-based:** Admin faskes hanya akses dokumen faskesnya
- **Ownership-based:** Hanya uploader yang bisa hapus dokumen

### **3. Audit Trail**
- **Activity Logging:** Semua aktivitas dicatat
- **IP Tracking:** IP address user dicatat
- **User Agent:** Browser info dicatat
- **Timestamp:** Waktu aktivitas dicatat

## 🚀 **Setup & Installation**

### **1. Backend Setup**
```bash
# Install dependencies
npm install multer

# Setup database
node setup-upload-dokumen.js

# Create upload directory
mkdir -p uploads/dokumen
```

### **2. Environment Variables**
```env
# File upload settings
MAX_FILE_SIZE=10485760  # 10MB in bytes
UPLOAD_PATH=./uploads/dokumen
ALLOWED_FILE_TYPES=pdf,jpg,jpeg,png,gif,doc,docx,xls,xlsx,txt
```

### **3. Frontend Integration**
```javascript
// Import component
import DokumenManager from './components/DokumenManager';

// Use in modal
<DokumenManager 
  rujukanId={selectedRujukan.id}
  onClose={() => setShowDokumenModal(false)}
/>
```

## 📊 **File Type Support**

| Tipe File | Extension | MIME Type | Icon |
|-----------|-----------|-----------|------|
| PDF | .pdf | application/pdf | 📄 |
| Image | .jpg, .jpeg, .png, .gif | image/* | 🖼️ |
| Word | .doc, .docx | application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document | 📝 |
| Excel | .xls, .xlsx | application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet | 📊 |
| Text | .txt | text/plain | 📄 |

## 🎯 **Kategori Dokumen**

| Kategori | Kode | Badge Color | Deskripsi |
|----------|------|-------------|-----------|
| Hasil Laboratorium | `hasil_lab` | Biru | Hasil pemeriksaan laboratorium |
| Rontgen | `rontgen` | Ungu | Foto rontgen dan imaging |
| Resep | `resep` | Hijau | Resep obat dan terapi |
| Surat Rujukan | `surat_rujukan` | Oranye | Surat rujukan formal |
| Lainnya | `lainnya` | Abu-abu | Dokumen lainnya |

## 🔧 **Configuration**

### **1. File Upload Limits**
```javascript
// backend/middleware/upload.js
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5 // Max 5 files per request
  }
});
```

### **2. Allowed File Types**
```javascript
const allowedTypes = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain'
];
```

## 📈 **Performance Considerations**

### **1. File Storage**
- **Local Storage:** File disimpan di filesystem server
- **Future Enhancement:** Cloud storage (AWS S3, Google Cloud Storage)
- **Backup Strategy:** Regular backup untuk file penting

### **2. Database Optimization**
- **Indexes:** Index pada foreign keys dan frequently queried columns
- **Cascade Delete:** Otomatis hapus file saat rujukan dihapus
- **Archive Strategy:** Archive dokumen lama untuk performance

### **3. Caching**
- **File Metadata:** Cache metadata dokumen untuk performance
- **User Permissions:** Cache permission checks
- **Statistics:** Cache dokumen statistics

## 🧪 **Testing**

### **1. Unit Tests**
```javascript
// Test file validation
test('should reject file larger than 10MB', () => {
  const largeFile = createMockFile(11 * 1024 * 1024);
  expect(validateFile(largeFile)).toContain('Ukuran file terlalu besar');
});

// Test permission checks
test('admin_faskes should only access faskes documents', () => {
  const user = { role: 'admin_faskes', faskes_id: 1 };
  const rujukan = { faskes_asal_id: 2, faskes_tujuan_id: 3 };
  expect(hasAccess(user, rujukan)).toBe(false);
});
```

### **2. Integration Tests**
```javascript
// Test upload flow
test('should upload file successfully', async () => {
  const file = createMockFile(1024);
  const response = await uploadFile(file, rujukanId);
  expect(response.status).toBe(201);
  expect(response.data.success).toBe(true);
});
```

### **3. E2E Tests**
```javascript
// Test complete user flow
test('user can upload and download document', async () => {
  await loginAsUser();
  await navigateToRujukan();
  await clickDokumenButton();
  await uploadFile('test.pdf');
  await downloadFile();
  expect(downloadedFile).toExist();
});
```

## 🚀 **Future Enhancements**

### **1. Advanced Features**
- **File Preview:** Preview PDF dan gambar langsung di browser
- **Bulk Operations:** Upload/download multiple files
- **File Versioning:** Version control untuk dokumen
- **OCR Integration:** Extract text dari gambar

### **2. Cloud Integration**
- **AWS S3:** Cloud storage untuk scalability
- **CDN:** Content delivery network untuk performance
- **Backup:** Automated backup ke cloud storage

### **3. Advanced Security**
- **File Encryption:** Encrypt file di storage
- **Virus Scanning:** Scan file untuk malware
- **Digital Signatures:** Digital signature untuk dokumen penting

## 📝 **Troubleshooting**

### **1. Common Issues**

**File Upload Fails**
```bash
# Check file permissions
chmod 755 uploads/dokumen

# Check disk space
df -h

# Check multer configuration
console.log('Upload config:', uploadConfig);
```

**Permission Denied**
```bash
# Check user role and faskes_id
SELECT role, faskes_id FROM users WHERE id = ?;

# Check rujukan permissions
SELECT faskes_asal_id, faskes_tujuan_id FROM rujukan WHERE id = ?;
```

**Database Connection Issues**
```bash
# Test database connection
node -e "require('./config/db').getConnection().then(console.log).catch(console.error)"
```

### **2. Log Analysis**
```bash
# Check upload logs
SELECT * FROM dokumen_logs WHERE aksi = 'upload' ORDER BY created_at DESC LIMIT 10;

# Check error logs
SELECT * FROM dokumen_logs WHERE aksi = 'failed' ORDER BY created_at DESC LIMIT 10;
```

## 📚 **API Documentation**

### **Complete API Reference**
```javascript
// All endpoints with examples
const apiDocs = {
  getDokumen: {
    url: '/api/dokumen/rujukan/:rujukanId',
    method: 'GET',
    headers: { Authorization: 'Bearer <token>' },
    response: { success: true, data: [...] }
  },
  uploadDokumen: {
    url: '/api/dokumen/upload',
    method: 'POST',
    headers: { 
      Authorization: 'Bearer <token>',
      'Content-Type': 'multipart/form-data'
    },
    body: {
      file: File,
      rujukan_id: Number,
      deskripsi: String,
      kategori: String
    }
  }
  // ... more endpoints
};
```

Fitur Upload Dokumen telah berhasil diimplementasikan dengan fitur lengkap untuk manajemen dokumen medis dalam sistem eSIR 2.0.
