# Use Case Diagram - Sistem eSIR

## Gambaran Umum
Use Case Diagram ini menggambarkan interaksi antara berbagai aktor dengan sistem eSIR (Emergency System Information & Referral) yang mencakup semua fitur utama sistem.

## Aktor (Actors)

### 1. Admin
- **Deskripsi**: Administrator sistem yang memiliki akses penuh
- **Peran**: Mengelola user, faskes, dan sistem secara keseluruhan
- **Fitur Utama**: 
  - Manajemen user dan password
  - Pengelolaan fasilitas kesehatan
  - Generate laporan dan statistik
  - Monitoring sistem

### 2. Dokter
- **Deskripsi**: Tenaga medis yang menggunakan sistem untuk rujukan
- **Peran**: Membuat dan mengelola rujukan pasien
- **Fitur Utama**:
  - Manajemen pasien
  - Pembuatan rujukan
  - Upload dokumen medis
  - Tracking status rujukan

### 3. Pasien
- **Deskripsi**: Pengguna akhir yang menerima layanan rujukan
- **Peran**: Melihat status rujukan dan dokumen
- **Fitur Utama**:
  - Melihat status rujukan
  - Download dokumen
  - Real-time tracking
  - Live chat

### 4. Ambulans Driver
- **Deskripsi**: Pengemudi ambulans yang melakukan transportasi
- **Peran**: Melakukan tracking dan update status transportasi
- **Fitur Utama**:
  - GPS tracking
  - Update status transportasi
  - Real-time communication

### 5. Faskes (Fasilitas Kesehatan)
- **Deskripsi**: Rumah sakit atau klinik yang menerima rujukan
- **Peran**: Mengelola tempat tidur dan menerima pasien
- **Fitur Utama**:
  - Manajemen tempat tidur
  - Update status ketersediaan
  - Terima notifikasi rujukan

### 6. Sistem Notifikasi
- **Deskripsi**: Sistem otomatis untuk mengirim notifikasi
- **Peran**: Mengirim notifikasi ke semua aktor
- **Fitur Utama**:
  - Notifikasi real-time
  - Update status notifikasi

## Use Cases (Fitur Utama)

### Authentication & User Management
- **UC1**: Login - Autentikasi pengguna
- **UC2**: Logout - Keluar dari sistem
- **UC3**: Refresh Token - Perpanjangan sesi
- **UC4**: Kelola User - Manajemen pengguna
- **UC5**: Reset Password - Reset kata sandi

### Patient Management
- **UC6**: Daftar Pasien - Melihat semua pasien
- **UC7**: Tambah Pasien - Menambah data pasien baru
- **UC8**: Edit Pasien - Mengubah data pasien
- **UC9**: Hapus Pasien - Menghapus data pasien
- **UC10**: Cari Pasien - Pencarian pasien

### Referral Management
- **UC11**: Buat Rujukan - Membuat rujukan baru
- **UC12**: Lihat Rujukan - Melihat detail rujukan
- **UC13**: Update Status Rujukan - Mengubah status
- **UC14**: Cancel Rujukan - Membatalkan rujukan
- **UC15**: Tracking Rujukan - Melacak progress

### Document Management
- **UC16**: Upload Dokumen - Mengunggah file
- **UC17**: Download Dokumen - Mengunduh file
- **UC18**: Lihat Dokumen - Melihat file
- **UC19**: Hapus Dokumen - Menghapus file

### Bed Management
- **UC20**: Kelola Tempat Tidur - Manajemen bed
- **UC21**: Cek Ketersediaan Bed - Cek status bed
- **UC22**: Update Status Bed - Update ketersediaan

### Facility Management
- **UC23**: Kelola Faskes - Manajemen fasilitas
- **UC24**: Tambah Faskes - Tambah fasilitas baru
- **UC25**: Edit Faskes - Edit data fasilitas

### Reporting
- **UC26**: Generate Laporan - Membuat laporan
- **UC27**: Lihat Statistik - Melihat statistik
- **UC28**: Export Data - Export data

### Notification System
- **UC29**: Kirim Notifikasi - Mengirim notifikasi
- **UC30**: Terima Notifikasi - Menerima notifikasi
- **UC31**: Update Status Notifikasi - Update status

### Real-time Features
- **UC32**: Real-time Tracking - Tracking real-time
- **UC33**: Live Chat - Chat langsung
- **UC34**: GPS Tracking - Tracking GPS

### Search & Analytics
- **UC35**: Pencarian Lanjutan - Pencarian advanced
- **UC36**: Analisis Data - Analisis data
- **UC37**: Filter Data - Filter data

## Relasi Antar Use Case

### Include Relationships (<<include>>)
- **UC11** (Buat Rujukan) membutuhkan:
  - UC6 (Daftar Pasien)
  - UC20 (Kelola Tempat Tidur)
  - UC29 (Kirim Notifikasi)

- **UC13** (Update Status Rujukan) membutuhkan UC29 (Kirim Notifikasi)
- **UC14** (Cancel Rujukan) membutuhkan UC29 (Kirim Notifikasi)
- **UC16** (Upload Dokumen) membutuhkan UC6 (Daftar Pasien)
- **UC26** (Generate Laporan) membutuhkan UC6 dan UC12
- **UC32** (Real-time Tracking) membutuhkan UC34 (GPS Tracking)

### Extend Relationships (<<extend>>)
- **UC35** (Pencarian Lanjutan) memperluas UC6 dan UC12
- **UC36** (Analisis Data) memperluas UC26
- **UC37** (Filter Data) memperluas UC35

## Catatan Teknis

- **Authentication**: Menggunakan JWT (JSON Web Token)
- **Real-time**: Implementasi menggunakan WebSocket
- **GPS Tracking**: Khusus untuk tracking ambulans
- **File Upload**: Support berbagai format dokumen
- **Database**: Menggunakan MySQL dengan struktur yang sudah dioptimasi

## Cara Menggunakan Diagram

1. **Buka file PlantUML**: `use-case-diagram-esir.puml`
2. **Gunakan PlantUML viewer** atau online PlantUML editor
3. **Generate diagram** untuk melihat visualisasi lengkap
4. **Gunakan sebagai referensi** untuk development dan testing

## Manfaat Use Case Diagram Ini

1. **Komunikasi Tim**: Memudahkan komunikasi antar developer
2. **Analisis Kebutuhan**: Memastikan semua fitur tercakup
3. **Testing**: Basis untuk membuat test case
4. **Dokumentasi**: Referensi untuk maintenance
5. **Onboarding**: Memudahkan developer baru memahami sistem
