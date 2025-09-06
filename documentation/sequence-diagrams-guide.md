# Panduan Sequence Diagrams eSIR

## Overview
Dokumen ini menjelaskan sequence diagrams untuk fitur utama sistem eSIR.

## Sequence Diagrams yang Tersedia

### 1. **Proses Rujukan** (`sequence-diagram-rujukan.puml`)
- **Alur**: Login → Cari Pasien → Cek Bed → Buat Rujukan → Konfirmasi
- **Komponen**: Dokter, Frontend, API, Database, Faskes, Notifikasi
- **Fitur**: Validasi bed, notifikasi otomatis, tracking status

### 2. **Tracking Ambulans** (`sequence-diagram-tracking.puml`)
- **Alur**: Start Tracking → GPS Updates → Status Updates → Chat → Complete
- **Komponen**: Pasien, Driver, Mobile, API, WebSocket, Database
- **Fitur**: Real-time GPS, WebSocket communication, status updates

### 3. **Upload Dokumen** (`sequence-diagram-upload-dokumen.puml`)
- **Alur**: Upload → Validate → Store → View → Download → Delete
- **Komponen**: Dokter, Frontend, API, Storage, Database
- **Fitur**: File validation, compression, download logging

## Cara Menggunakan

### **Generate Diagram**
1. Buka file `.puml` di PlantUML editor
2. Generate diagram untuk melihat visualisasi
3. Export ke format PNG/SVG jika diperlukan

### **Untuk Development**
- Gunakan sebagai referensi API design
- Pahami alur data antar komponen
- Identifikasi titik-titik error handling

### **Untuk Testing**
- Buat test case berdasarkan alur diagram
- Test integrasi antar komponen
- Test real-time features

## Teknologi Utama

- **Backend**: Node.js + Express
- **Real-time**: WebSocket/Socket.io
- **Database**: MySQL
- **File Storage**: Local storage
- **Authentication**: JWT
- **Mobile**: React Native

## Manfaat

1. **Pemahaman Alur**: Memahami interaksi antar komponen
2. **API Design**: Merancang endpoint yang konsisten
3. **Testing**: Basis untuk test case design
4. **Documentation**: Referensi untuk tim development
5. **Maintenance**: Memudahkan troubleshooting
