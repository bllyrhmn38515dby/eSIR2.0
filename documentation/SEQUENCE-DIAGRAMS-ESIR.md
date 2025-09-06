# Sequence Diagrams - Sistem eSIR

## Gambaran Umum
Dokumen ini berisi sequence diagram untuk fitur-fitur utama sistem eSIR yang menggambarkan alur interaksi antar komponen sistem secara detail.

## Daftar Sequence Diagram

### 1. **Proses Rujukan** (`sequence-diagram-rujukan.puml`)
Diagram ini menggambarkan alur lengkap dari pembuatan rujukan hingga konfirmasi.

#### **Komponen yang Terlibat:**
- **Dokter**: Aktor utama yang membuat rujukan
- **Frontend Web**: Interface web untuk dokter
- **Backend API**: Server yang memproses request
- **Database**: Penyimpanan data
- **Faskes**: Fasilitas kesehatan tujuan
- **Sistem Notifikasi**: Pengirim notifikasi otomatis
- **Mobile App**: Aplikasi mobile untuk faskes

#### **Alur Proses:**
1. **Login**: Autentikasi dokter
2. **Pencarian Pasien**: Cari data pasien
3. **Cek Ketersediaan Bed**: Validasi bed di faskes
4. **Buat Rujukan**: Proses pembuatan rujukan
5. **Konfirmasi Faskes**: Konfirmasi dari faskes
6. **Update Status**: Monitoring status rujukan
7. **Tracking**: Real-time tracking

#### **Pesan API yang Digunakan:**
- `POST /auth/login` - Login dokter
- `GET /pasien/search` - Cari pasien
- `GET /faskes/{id}/bed/available` - Cek ketersediaan bed
- `POST /rujukan/create` - Buat rujukan
- `PUT /rujukan/{id}/confirm` - Konfirmasi rujukan
- `GET /rujukan/{id}/status` - Cek status rujukan
- `GET /rujukan/{id}/tracking` - Data tracking

### 2. **Tracking Ambulans** (`sequence-diagram-tracking.puml`)
Diagram ini menggambarkan proses real-time tracking ambulans dengan GPS.

#### **Komponen yang Terlibat:**
- **Pasien**: Melihat tracking ambulans
- **Driver**: Pengemudi ambulans
- **Mobile**: Aplikasi mobile driver
- **API**: Backend untuk tracking
- **WebSocket**: Real-time communication
- **Database**: Penyimpanan data tracking
- **Web**: Interface web untuk tracking

#### **Alur Proses:**
1. **Start Tracking**: Mulai tracking session
2. **GPS Updates**: Update lokasi setiap 10 detik
3. **Status Updates**: Update status transportasi
4. **Real-time Chat**: Komunikasi pasien-driver
5. **Complete Tracking**: Selesai tracking

#### **Fitur Real-time:**
- GPS tracking setiap 10 detik
- WebSocket untuk komunikasi real-time
- Status updates otomatis
- Chat real-time antara pasien dan driver

#### **Pesan API yang Digunakan:**
- `POST /tracking/start` - Mulai tracking
- `PUT /tracking/location` - Update lokasi
- `PUT /tracking/status` - Update status
- `POST /tracking/message` - Kirim pesan
- `PUT /tracking/complete` - Selesai tracking

### 3. **Upload Dokumen** (`sequence-diagram-upload-dokumen.puml`)
Diagram ini menggambarkan proses upload, view, download, dan delete dokumen medis.

#### **Komponen yang Terlibat:**
- **Dokter**: Pengguna yang mengelola dokumen
- **Frontend**: Interface web
- **Backend API**: Server untuk file management
- **File Storage**: Penyimpanan file
- **Database**: Metadata dokumen
- **Notification**: Notifikasi sistem

#### **Alur Proses:**
1. **Upload Dokumen**: Upload file dengan validasi
2. **View Dokumen**: Lihat daftar dokumen
3. **Download Dokumen**: Download file dengan logging
4. **Delete Dokumen**: Hapus file dan metadata

#### **Fitur Keamanan:**
- Validasi format file (PDF, JPG, PNG, DOC)
- Validasi ukuran file
- Generate unique filename
- Log download activity
- Permission-based access

#### **Pesan API yang Digunakan:**
- `POST /dokumen/upload` - Upload file
- `GET /dokumen` - List dokumen
- `GET /dokumen/{id}/download` - Download file
- `DELETE /dokumen/{id}` - Delete dokumen

## Teknologi yang Digunakan

### **Real-time Communication**
- **WebSocket**: Untuk notifikasi real-time
- **Socket.io**: Library WebSocket untuk Node.js
- **Event-driven**: Architecture untuk real-time updates

### **File Management**
- **Local Storage**: Penyimpanan file di server
- **File Validation**: Validasi format dan ukuran
- **Compression**: Kompresi file jika diperlukan
- **Backup System**: Backup file secara otomatis

### **Database Operations**
- **MySQL**: Database utama
- **Connection Pooling**: Optimasi koneksi database
- **Transaction**: Untuk operasi yang membutuhkan konsistensi
- **Indexing**: Optimasi query performance

### **Security Features**
- **JWT Authentication**: Token-based authentication
- **Role-based Access**: Kontrol akses berdasarkan role
- **File Validation**: Validasi file upload
- **SQL Injection Prevention**: Prepared statements

## Workflow Integration

### **Cross-Feature Dependencies**
1. **Rujukan → Tracking**: Setelah rujukan dibuat, tracking otomatis aktif
2. **Tracking → Notifikasi**: Setiap update status mengirim notifikasi
3. **Dokumen → Rujukan**: Dokumen terkait dengan rujukan tertentu
4. **Real-time → WebSocket**: Semua fitur real-time menggunakan WebSocket

### **Data Flow Patterns**
1. **Create → Validate → Store → Notify**: Pattern untuk operasi create
2. **Query → Filter → Return**: Pattern untuk operasi read
3. **Update → Validate → Store → Broadcast**: Pattern untuk operasi update
4. **Delete → Validate → Remove → Notify**: Pattern untuk operasi delete

## Monitoring dan Logging

### **Activity Logging**
- User login/logout
- File upload/download
- Status changes
- API calls
- Error occurrences

### **Performance Monitoring**
- Response time API
- Database query performance
- File upload/download speed
- WebSocket connection status
- Memory usage

### **Error Handling**
- Validation errors
- Database connection errors
- File storage errors
- WebSocket connection errors
- API timeout handling

## Cara Menggunakan Sequence Diagrams

### **Untuk Development**
1. **API Design**: Gunakan sebagai referensi untuk endpoint design
2. **Database Schema**: Pahami struktur data yang dibutuhkan
3. **Error Handling**: Identifikasi titik-titik yang perlu error handling
4. **Testing**: Buat test case berdasarkan alur diagram

### **Untuk Testing**
1. **Integration Testing**: Test interaksi antar komponen
2. **API Testing**: Test semua endpoint yang ada
3. **Real-time Testing**: Test WebSocket communication
4. **Performance Testing**: Test response time dan throughput

### **Untuk Documentation**
1. **API Documentation**: Referensi untuk API docs
2. **User Manual**: Panduan untuk pengguna
3. **System Architecture**: Pemahaman arsitektur sistem
4. **Troubleshooting**: Identifikasi masalah berdasarkan alur

## Manfaat Sequence Diagrams

### **Untuk Tim Development**
- **Pemahaman Alur**: Memahami interaksi antar komponen
- **API Design**: Merancang endpoint yang konsisten
- **Error Handling**: Identifikasi titik-titik kritis
- **Testing Strategy**: Merencanakan testing yang komprehensif

### **Untuk Project Manager**
- **Progress Tracking**: Memantau progress development
- **Resource Planning**: Merencanakan resource yang dibutuhkan
- **Timeline Estimation**: Estimasi waktu development
- **Risk Assessment**: Identifikasi risiko teknis

### **Untuk QA Team**
- **Test Case Design**: Merancang test case yang lengkap
- **Integration Testing**: Test antar komponen
- **Regression Testing**: Memastikan fitur tidak rusak
- **Performance Testing**: Test performa sistem

## Kesimpulan

Sequence diagrams ini memberikan gambaran lengkap tentang:
- **37 use cases** yang telah didefinisikan dalam use case diagram
- **Real-time capabilities** untuk tracking dan komunikasi
- **Security features** yang robust
- **Scalable architecture** untuk pengembangan masa depan

Dengan sequence diagrams ini, tim development dapat:
1. **Memahami alur sistem** dengan jelas
2. **Merancang API** yang konsisten dan efisien
3. **Mengimplementasikan fitur** sesuai spesifikasi
4. **Melakukan testing** yang komprehensif
5. **Maintain sistem** dengan mudah
