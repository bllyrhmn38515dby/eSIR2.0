# 🚑 USE CASE DIAGRAM SISTEM eSIR 2.0 - PANDUAN LENGKAP

## 📋 **OVERVIEW**

Dokumen ini berisi **Use Case Diagram lengkap** untuk sistem eSIR 2.0 yang telah dibuat berdasarkan analisis mendalam terhadap sistem yang ada.

## 📁 **FILE YANG TERSEDIA**

### **1. `USE_CASE_DIAGRAM_ESIR2.md`**
- **Deskripsi:** Use Case Diagram utama dengan penjelasan lengkap
- **Isi:** 
  - Overview sistem
  - Daftar aktor dan use case
  - Diagram visual ASCII
  - Detail per aktor
  - Relationships dan dependencies

### **2. `USE_CASE_DETAILED_DIAGRAM.md`**
- **Deskripsi:** Diagram detail dengan flow dan matrix
- **Isi:**
  - Diagram visual lengkap
  - Relationship diagram
  - Mobile use case flow
  - Priority matrix
  - Actor responsibility matrix
  - System interaction flow

### **3. `USE_CASE_PLANTUML.puml`**
- **Deskripsi:** File PlantUML untuk generate diagram visual
- **Isi:**
  - Kode PlantUML lengkap
  - Semua aktor dan use case
  - Relationships (include, extend, generalization)
  - Styling dan theming

## 🎯 **AKTOR-AKTOR SISTEM**

### **Primary Actors (Pengguna Utama):**

1. **👨‍💼 Admin Pusat**
   - **Deskripsi:** Administrator pusat dengan akses penuh
   - **Tanggung Jawab:** Manajemen sistem, user management, reporting
   - **Use Cases:** 16 use cases utama

2. **🏥 Admin Faskes**
   - **Deskripsi:** Administrator fasilitas kesehatan
   - **Tanggung Jawab:** Manajemen rujukan, tempat tidur, dokumen
   - **Use Cases:** 25 use cases utama

3. **🚑 Sopir Ambulans**
   - **Deskripsi:** Pengemudi ambulans
   - **Tanggung Jawab:** Tracking ambulans, update status, navigasi
   - **Use Cases:** 19 use cases utama

4. **👤 Pasien**
   - **Deskripsi:** Penerima layanan rujukan
   - **Tanggung Jawab:** Melihat status rujukan, menerima notifikasi
   - **Use Cases:** 5 use cases utama

### **Secondary Actors (Sistem Eksternal):**

1. **💾 Database System**
   - **Fungsi:** Penyimpanan data
   - **Use Cases:** 7 use cases storage

2. **📧 Email Service**
   - **Fungsi:** Layanan email
   - **Use Cases:** 4 use cases email

3. **📍 GPS System**
   - **Fungsi:** Sistem lokasi
   - **Use Cases:** 3 use cases location

4. **🔔 Push Notification Service**
   - **Fungsi:** Layanan notifikasi
   - **Use Cases:** 2 use cases notification

## 🔄 **KATEGORI USE CASE**

### **1. Authentication & Security**
- Login/Logout
- Reset Password
- Session Management
- Role-based Access Control

### **2. User Management**
- Create User
- Read User Data
- Update User
- Delete User
- Assign Roles

### **3. Faskes Management**
- Create Faskes
- Read Faskes Data
- Update Faskes
- Delete Faskes

### **4. Referral Management**
- Create Referral
- Read Referral Data
- Update Referral Status
- Cancel Referral
- Add Referral Notes

### **5. Bed Management**
- View Bed Availability
- Update Bed Status
- Reserve Bed
- Assign Patient to Bed

### **6. Document Management**
- Upload Documents
- Download Documents
- Delete Documents
- View Document History

### **7. Ambulance Tracking**
- Real-time Location Tracking
- Journey Status Monitoring
- ETA Updates
- Route Optimization
- Start/Stop Tracking Session

### **8. Notification System**
- Send Notifications
- Receive Notifications
- Push Notifications
- Emergency Alerts

### **9. Reporting & Analytics**
- Generate Reports
- View Statistics
- Export Data
- Dashboard Analytics

### **10. Search & Filter**
- Search Patients
- Search Referrals
- Filter by Status
- Advanced Search

### **11. Mobile Features**
- GPS Tracking
- Background Tracking
- Voice Commands
- Offline Mode
- Battery Optimization
- Device Information

## 🔗 **RELATIONSHIPS**

### **Include Relationships (Wajib):**
- **Login** ⟶ **Session Management**
- **Create Referral** ⟶ **Upload Documents**
- **Start Tracking** ⟶ **Provide Location Data**
- **Send Notifications** ⟶ **Store User Data**

### **Extend Relationships (Opsional):**
- **Emergency Alerts** ⟵ **Push Notifications**
- **Voice Commands** ⟵ **GPS Tracking**
- **Offline Mode** ⟵ **GPS Tracking**
- **Battery Optimization** ⟵ **GPS Tracking**

### **Generalization (Inheritance):**
- **Admin Pusat** ⟶ **Admin Faskes**

## 📱 **MOBILE-SPECIFIC FEATURES**

### **Advanced Mobile Use Cases:**
1. **Background Tracking** - Tracking GPS di background
2. **Voice Commands** - Kontrol aplikasi dengan suara
3. **Offline Mode** - Bekerja tanpa internet
4. **Battery Optimization** - Optimasi penggunaan baterai
5. **Device Information** - Informasi perangkat
6. **Push Notifications** - Notifikasi real-time
7. **Emergency Alerts** - Alert darurat
8. **Location Sharing** - Berbagi lokasi

## 🛠️ **CARA MENGGUNAKAN DIAGRAM**

### **1. Untuk Development:**
- Gunakan sebagai **blueprint** untuk implementasi
- Referensi untuk **API design**
- Basis untuk **test case development**
- Panduan untuk **database design**

### **2. Untuk Documentation:**
- **Stakeholder communication**
- **System requirements**
- **User training materials**
- **System maintenance guide**

### **3. Untuk Testing:**
- **Test case generation**
- **User acceptance testing**
- **Integration testing**
- **System testing**

## 📊 **PRIORITY MATRIX**

| Priority | Use Cases | Description |
|----------|-----------|-------------|
| **High** | Login/Logout, Create Referral, Track Ambulance | Core functionality, critical for system operation |
| **Medium** | Upload Document, Push Notifications | Important features, enhance user experience |
| **Low** | Voice Commands, Offline Mode, Battery Optimization | Nice-to-have features, advanced capabilities |

## 🎯 **BENEFITS**

### **Untuk Development Team:**
✅ **Clear Requirements** - Semua kebutuhan tercakup
✅ **Implementation Guide** - Panduan implementasi
✅ **Testing Framework** - Basis untuk testing
✅ **Documentation** - Dokumentasi sistem

### **Untuk Stakeholders:**
✅ **System Understanding** - Pemahaman sistem
✅ **Feature Overview** - Overview fitur
✅ **User Roles** - Peran pengguna
✅ **Business Process** - Proses bisnis

### **Untuk Users:**
✅ **Feature Discovery** - Penemuan fitur
✅ **User Guide** - Panduan pengguna
✅ **Training Material** - Materi pelatihan
✅ **Support Reference** - Referensi support

## 📝 **NOTES**

- Diagram ini **100% sesuai** dengan sistem eSIR 2.0 yang ada
- **Mobile features** khusus untuk aplikasi React Native
- **Real-time features** menggunakan Socket.IO
- **Security** diimplementasikan dengan JWT authentication
- **Scalability** mempertimbangkan pertumbuhan sistem

## 🔄 **UPDATE LOG**

- **v1.0** - Initial Use Case Diagram creation
- **v1.1** - Added mobile-specific features
- **v1.2** - Added PlantUML diagram
- **v1.3** - Added priority matrix and relationships
- **v1.4** - Added detailed flow diagrams

---

**📧 Contact:** Untuk pertanyaan atau saran, silakan hubungi tim development eSIR 2.0
