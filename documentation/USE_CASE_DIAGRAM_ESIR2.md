# 🚑 USE CASE DIAGRAM SISTEM eSIR 2.0

## 📋 **OVERVIEW**
Use Case Diagram ini menggambarkan interaksi antara aktor-aktor dalam sistem eSIR 2.0 dengan fitur-fitur yang tersedia.

## 🎯 **AKTOR-AKTOR SISTEM**

### **Primary Actors:**
1. **Admin Pusat** - Administrator pusat dengan akses penuh
2. **Admin Faskes** - Administrator fasilitas kesehatan
3. **Sopir Ambulans** - Pengemudi ambulans
4. **Pasien** - Penerima layanan rujukan

### **Secondary Actors:**
1. **Database System** - Penyimpanan data
2. **Email Service** - Layanan email
3. **GPS System** - Sistem lokasi
4. **Push Notification Service** - Layanan notifikasi

## 🔄 **USE CASE DIAGRAM**

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                        SISTEM eSIR 2.0                                                                         │
│                                                                                                                                 │
│  ┌─────────────────┐                                                                                                             │
│  │                 │                                                                                                             │
│  │   Admin Pusat   │────┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐ │
│  │                 │    │                                                                                                     │ │
│  └─────────────────┘    │  • Login/Logout                                                                                     │ │
│                         │  • Kelola Faskes (CRUD)                                                                             │ │
│  ┌─────────────────┐    │  • Kelola Users (CRUD)                                                                               │ │
│  │                 │    │  • Kelola Roles & Permissions                                                                       │ │
│  │   Admin Faskes  │────│  • Buat Rujukan Pasien                                                                              │ │
│  │                 │    │  • Kelola Tempat Tidur                                                                              │ │
│  └─────────────────┘    │  • Upload Dokumen                                                                                   │ │
│                         │  • Lihat & Update Status Rujukan                                                                    │ │
│  ┌─────────────────┐    │  • Tracking Ambulans Real-time                                                                      │ │
│  │                 │    │  • Terima & Kirim Notifikasi                                                                        │ │
│  │  Sopir Ambulans │────│  • Generate Laporan & Statistik                                                                     │ │
│  │                 │    │  • Search & Filter Data                                                                             │ │
│  └─────────────────┘    │  • Reset Password                                                                                   │ │
│                         │  • Manajemen Dokumen                                                                                │ │
│  ┌─────────────────┐    │  • GPS Tracking                                                                                     │ │
│  │                 │    │  • Background Tracking                                                                              │ │
│  │     Pasien      │────│  • Push Notifications                                                                               │ │
│  │                 │    │  • Voice Commands (Mobile)                                                                          │ │
│  └─────────────────┘    │  • Offline Mode (Mobile)                                                                            │ │
│                         │  • Battery Optimization (Mobile)                                                                    │ │
│                         │  • Device Info (Mobile)                                                                             │ │
│                         └─────────────────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                                                                 │
│  ┌─────────────────┐    ┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐ │
│  │                 │    │                                                                                                     │ │
│  │ Database System │◄───│  • Store User Data                                                                                  │ │
│  │                 │    │  • Store Patient Data                                                                               │ │
│  └─────────────────┘    │  • Store Referral Data                                                                              │ │
│                         │  • Store Tracking Data                                                                              │ │
│  ┌─────────────────┐    │  • Store Document Data                                                                              │ │
│  │                 │    │  • Store Bed Management Data                                                                        │ │
│  │ Email Service   │◄───│  • Store Search Logs                                                                                │ │
│  │                 │    │                                                                                                     │ │
│  └─────────────────┘    └─────────────────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                                                                 │
│  ┌─────────────────┐    ┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐ │
│  │                 │    │                                                                                                     │ │
│  │ GPS System      │◄───│  • Provide Location Data                                                                            │ │
│  │                 │    │  • Calculate Distance & ETA                                                                         │ │
│  └─────────────────┘    │  • Route Optimization                                                                               │ │
│                         │                                                                                                     │ │
│  ┌─────────────────┐    └─────────────────────────────────────────────────────────────────────────────────────────────────────┘ │
│  │                 │                                                                                                             │
│  │ Push Notification│◄───┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐ │
│  │ Service         │    │                                                                                                     │ │
│  └─────────────────┘    │  • Send Real-time Notifications                                                                     │ │
│                         │  • Background Notifications                                                                         │ │
│                         │  • Emergency Alerts                                                                                 │ │
│                         └─────────────────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

## 📊 **DETAIL USE CASE PER AKTOR**

### **1. ADMIN PUSAT**
```
┌─────────────────────────────────────────────────────────────────┐
│                        ADMIN PUSAT                              │
├─────────────────────────────────────────────────────────────────┤
│  🔐 Authentication:                                              │
│     • Login dengan username/password                            │
│     • Logout                                                    │
│     • Reset password                                            │
│                                                                 │
│  👥 User Management:                                            │
│     • Create user baru                                          │
│     • Read data semua users                                     │
│     • Update data user                                          │
│     • Delete user                                               │
│     • Assign role ke user                                       │
│                                                                 │
│  🏥 Faskes Management:                                          │
│     • Create faskes baru                                        │
│     • Read data semua faskes                                    │
│     • Update data faskes                                        │
│     • Delete faskes                                             │
│                                                                 │
│  📊 Reporting & Analytics:                                      │
│     • Generate laporan rujukan                                  │
│     • Lihat statistik faskes                                    │
│     • Export data ke Excel/PDF                                  │
│     • Dashboard analytics                                       │
└─────────────────────────────────────────────────────────────────┘
```

### **2. ADMIN FASKES**
```
┌─────────────────────────────────────────────────────────────────┐
│                       ADMIN FASKES                              │
├─────────────────────────────────────────────────────────────────┤
│  🔐 Authentication:                                              │
│     • Login dengan username/password                            │
│     • Logout                                                    │
│     • Reset password                                            │
│                                                                 │
│  📋 Referral Management:                                        │
│     • Create rujukan pasien                                     │
│     • Read rujukan dari faskes                                  │
│     • Update status rujukan                                     │
│     • Cancel rujukan                                            │
│     • Add catatan rujukan                                       │
│                                                                 │
│  🛏️ Bed Management:                                             │
│     • Lihat ketersediaan tempat tidur                           │
│     • Update status tempat tidur                                │
│     • Reserve tempat tidur                                      │
│     • Assign pasien ke tempat tidur                             │
│                                                                 │
│  📄 Document Management:                                         │
│     • Upload dokumen rujukan                                    │
│     • Download dokumen                                          │
│     • Delete dokumen                                            │
│     • View dokumen history                                      │
│                                                                 │
│  🚑 Ambulance Tracking:                                          │
│     • Lihat lokasi ambulans real-time                           │
│     • Monitor status perjalanan                                 │
│     • Terima notifikasi status                                  │
└─────────────────────────────────────────────────────────────────┘
```

### **3. SOPIR AMBULANS**
```
┌─────────────────────────────────────────────────────────────────┐
│                     SOPIR AMBULANS                              │
├─────────────────────────────────────────────────────────────────┤
│  🔐 Authentication:                                              │
│     • Login dengan username/password                            │
│     • Logout                                                    │
│     • Reset password                                            │
│                                                                 │
│  🚑 Ambulance Operations:                                        │
│     • Start tracking perjalanan                                 │
│     • Stop tracking perjalanan                                  │
│     • Update status perjalanan                                  │
│     • Lihat daftar rujukan                                      │
│     • Accept/Reject rujukan                                     │
│     • Update ETA                                                │
│                                                                 │
│  📱 Mobile Features:                                             │
│     • GPS tracking otomatis                                     │
│     • Background tracking                                       │
│     • Push notifications                                        │
│     • Voice commands                                            │
│     • Offline mode                                              │
│     • Battery optimization                                      │
│                                                                 │
│  📍 Location Services:                                           │
│     • Share lokasi real-time                                    │
│     • Get directions                                            │
│     • Calculate route                                           │
│     • Emergency location sharing                                │
└─────────────────────────────────────────────────────────────────┘
```

### **4. PASIEN**
```
┌─────────────────────────────────────────────────────────────────┐
│                          PASIEN                                 │
├─────────────────────────────────────────────────────────────────┤
│  📋 Referral Status:                                             │
│     • Lihat status rujukan                                      │
│     • Track progress rujukan                                    │
│     • Lihat estimasi waktu                                      │
│                                                                 │
│  🔔 Notifications:                                               │
│     • Terima notifikasi status                                  │
│     • Terima notifikasi jadwal                                  │
│     • Terima notifikasi emergency                               │
│                                                                 │
│  📱 Mobile Access:                                               │
│     • Akses via mobile app                                      │
│     • Push notifications                                        │
│     • Offline viewing                                           │
└─────────────────────────────────────────────────────────────────┘
```

## 🔗 **RELATIONSHIPS & DEPENDENCIES**

### **Include Relationships:**
- **Login** ⟶ **Authentication** (wajib)
- **Create Referral** ⟶ **Upload Document** (wajib)
- **Track Ambulance** ⟶ **GPS Location** (wajib)
- **Send Notification** ⟶ **Email Service** (wajib)

### **Extend Relationships:**
- **Emergency Alert** ⟵ **Push Notification** (opsional)
- **Voice Command** ⟵ **Mobile App** (opsional)
- **Offline Mode** ⟵ **Mobile App** (opsional)
- **Battery Optimization** ⟵ **Mobile App** (opsional)

### **Generalization:**
- **Admin Pusat** ⟶ **Admin Faskes** (inheritance)
- **All Users** ⟶ **Authentication** (inheritance)

## 📱 **MOBILE-SPECIFIC USE CASES**

### **Advanced Mobile Features:**
1. **Background Tracking** - Tracking GPS di background
2. **Voice Commands** - Kontrol aplikasi dengan suara
3. **Offline Mode** - Bekerja tanpa internet
4. **Battery Optimization** - Optimasi penggunaan baterai
5. **Device Info** - Informasi perangkat
6. **Push Notifications** - Notifikasi real-time
7. **Emergency Alerts** - Alert darurat
8. **Location Sharing** - Berbagi lokasi

## 🎯 **BENEFITS USE CASE DIAGRAM**

✅ **Clarity** - Jelas menunjukkan siapa dapat melakukan apa
✅ **Communication** - Memudahkan komunikasi dengan stakeholder
✅ **Requirements** - Memastikan semua kebutuhan tercakup
✅ **Testing** - Basis untuk test case development
✅ **Documentation** - Dokumentasi sistem yang mudah dipahami

## 📝 **NOTES**

- Diagram ini mencakup **semua fitur** yang ada di sistem eSIR 2.0
- **Mobile features** khusus untuk aplikasi React Native
- **Real-time features** menggunakan Socket.IO
- **Security** diimplementasikan dengan JWT authentication
- **Scalability** mempertimbangkan pertumbuhan sistem
