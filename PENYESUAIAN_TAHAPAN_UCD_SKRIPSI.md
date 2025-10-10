# 📋 PENYESUAIAN TAHAPAN METODE USER-CENTERED DESIGN (UCD)
## Skripsi: PENERAPAN METODE USER-CENTERED DESIGN MENGGUNAKAN GPS PADA PENGEMBANGAN PELACAKAN PASIEN DALAM APLIKASI RUJUKAN ONLINE RUMAH SAKIT SECARA REAL-TIME

---

## 🎯 **REFERENSI JURNAL**
**Sumber**: [Jurnal JEISBI - Penerapan Metode User Centered Design dalam Perancangan Ulang Desain Website MAN 1 Pasuruan](https://ejournal.unesa.ac.id/index.php/JEISBI/article/view/46197/38955)

**Standar 4 Tahap UCD menurut Jurnal:**
1. **Memahami Konteks Penggunaan**
2. **Menentukan Persyaratan Pengguna** 
3. **Merancang Solusi Desain**
4. **Evaluasi Terhadap Persyaratan**

---

## 📊 **ANALISIS STRUKTUR UCD YANG ADA DALAM SKRIPSI**

Berdasarkan analisis dokumen skripsi dan file pendukung, struktur UCD yang sudah ada mencakup:

### **Struktur Saat Ini:**
- **Analisis Kebutuhan Pengguna** (berdasarkan kuesioner)
- **User Persona Development** (2 persona utama)
- **User Journey Mapping**
- **Wireframing dan Prototyping**
- **Usability Testing**
- **Evaluasi dan Iterasi**

### **Masalah yang Ditemukan:**
- Struktur tidak mengikuti standar 4 tahap UCD
- Beberapa tahap tercampur atau tidak terstruktur dengan jelas
- Kurangnya pemisahan yang jelas antara tahap analisis dan desain

---

## 🔄 **PENYESUAIAN STRUKTUR UCD SESUAI STANDAR 4 TAHAP**

### **TAHAP 1: MEMAHAMI KONTEKS PENGGUNAAN**
*Sesuai dengan analisis kebutuhan yang sudah ada*

#### **1.1 Identifikasi Pengguna**
**Berdasarkan User Persona yang sudah dibuat:**

**Persona 1: SPGDT (Sistem Penanggulangan Gawat Darurat Terpadu)**
- **Nama**: Sarah - Koordinator Rujukan
- **Usia**: 28-35 tahun
- **Pengalaman**: 3-5 tahun
- **Fokus**: Koordinasi & Komunikasi
- **Platform**: Desktop + Mobile
- **Frekuensi**: 15-20x/hari

**Persona 2: Tim PSC (Patient Service Center)**
- **Nama**: Budi - Input Data Pasien
- **Usia**: 25-40 tahun
- **Pengalaman**: 2-4 tahun
- **Fokus**: Input Data & Navigasi
- **Platform**: Desktop + Tablet
- **Frekuensi**: 10-15x/hari

#### **1.2 Konteks Penggunaan**
**Berdasarkan analisis kuesioner:**

**Situasi Penggunaan:**
- **Kondisi Darurat**: Sistem digunakan dalam situasi kritis
- **Jam Sibuk**: Banyak pengguna mengakses bersamaan
- **Multi-Platform**: Desktop, tablet, dan mobile
- **Lingkungan Medis**: Memerlukan akurasi tinggi dan kecepatan

**Konteks Operasional:**
- **RSUD Leuwiliang**: Fasilitas kesehatan utama
- **Koordinasi Multi-Faskes**: Antara rumah sakit dan puskesmas
- **Real-time Tracking**: Pelacakan pasien secara real-time
- **Komunikasi Terintegrasi**: Antara tim medis

---

### **TAHAP 2: MENENTUKAN PERSYARATAN PENGGUNA**
*Berdasarkan analisis kuesioner dan feedback*

#### **2.1 Kebutuhan Fungsional**

**Prioritas Tinggi (10/10 responden):**
- **Sistem Komunikasi Terintegrasi**
  - Chat internal antar faskes
  - Notifikasi real-time
  - Komunikasi dokter-pasien
  - Koordinasi tim medis

- **Informasi Real-time yang Akurat**
  - Ketersediaan fasilitas real-time
  - Status rujukan real-time
  - Tracking lokasi ambulans
  - Monitoring pasien

**Prioritas Sedang (8-9/10 responden):**
- **Dashboard yang Ideal**
  - Status rujukan aktif
  - Notifikasi penting
  - Statistik rujukan harian
  - Personalisasi tampilan

- **Fitur Aksesibilitas**
  - Mode gelap
  - Zoom dan kontras
  - Voice-to-text
  - Ukuran font yang dapat disesuaikan

#### **2.2 Kebutuhan Non-Fungsional**

**Performance Requirements:**
- **Loading Time**: Target < 3 detik (saat ini > 10 detik)
- **Response Time**: Target < 2 detik
- **Uptime**: Target > 99.5%
- **Data Accuracy**: Target > 98%

**Usability Requirements:**
- **User Satisfaction**: Target > 8/10 (saat ini 6.4/10)
- **Task Completion Rate**: Target > 95%
- **Error Rate**: Target < 2%

**Security Requirements:**
- **Data Protection**: Keamanan data pasien
- **Access Control**: Kontrol akses berdasarkan role
- **Audit Trail**: Pencatatan aktivitas pengguna

#### **2.3 Pain Points yang Harus Dipecahkan**

**Masalah Navigasi (100% responden):**
- Menu tidak terorganisir dengan baik
- Hierarki yang tidak jelas
- Menu sering berubah posisi
- Kesulitan menemukan fitur yang dibutuhkan

**Form Input yang Tidak User-Friendly (100% responden):**
- Form terlalu panjang
- Validasi yang tidak tepat
- Format tidak sesuai standar medis
- Tidak ada auto-save

**Informasi Real-time yang Tidak Akurat (100% responden):**
- Ketersediaan fasilitas sering tidak akurat
- Informasi tidak real-time
- Perlu konfirmasi manual
- Dampak pada keselamatan pasien

---

### **TAHAP 3: MERANCANG SOLUSI DESAIN**
*Berdasarkan wireframing dan prototyping yang sudah ada*

#### **3.1 Desain Konseptual**

**Arsitektur Sistem:**
- **Frontend**: React.js dengan responsive design
- **Backend**: Node.js dengan real-time capabilities
- **Database**: MySQL dengan optimasi untuk real-time
- **GPS Integration**: Google Maps API untuk tracking
- **Real-time Communication**: WebSocket untuk notifikasi

#### **3.2 Desain Interface**

**Prinsip Desain:**
- **User-Centered**: Berdasarkan kebutuhan pengguna yang sudah dianalisis
- **Consistency**: Konsistensi dalam navigasi dan elemen UI
- **Accessibility**: Mendukung berbagai kemampuan pengguna
- **Responsive**: Optimal di berbagai perangkat

**Komponen Utama:**
- **Dashboard Terintegrasi**: Status rujukan, notifikasi, statistik
- **Form Input yang User-Friendly**: Step-by-step, auto-save, validasi
- **Sistem Komunikasi**: Chat internal, notifikasi push
- **GPS Tracking**: Real-time location tracking

#### **3.3 Wireframing dan Prototyping**

**Wireframe Prioritas:**
1. **Dashboard Utama**: Layout yang terorganisir dengan baik
2. **Form Input Pasien**: Wizard form dengan validasi real-time
3. **Sistem Komunikasi**: Interface chat yang intuitif
4. **GPS Tracking**: Visualisasi tracking yang jelas

**Prototype Testing:**
- **Low-fidelity**: Sketsa dan wireframe
- **High-fidelity**: Mockup dengan interaksi
- **Interactive Prototype**: Prototype yang dapat diuji

---

### **TAHAP 4: EVALUASI TERHADAP PERSYARATAN**
*Berdasarkan usability testing dan feedback*

#### **4.1 Metode Evaluasi**

**Usability Testing:**
- **Task-based Testing**: Pengujian berdasarkan skenario nyata
- **Think-aloud Protocol**: Pengguna mengungkapkan pemikiran
- **Performance Metrics**: Waktu penyelesaian, error rate
- **Satisfaction Survey**: Kuesioner kepuasan pengguna

**Heuristic Evaluation:**
- **Nielsen's 10 Heuristics**: Evaluasi berdasarkan prinsip usability
- **Medical Interface Guidelines**: Evaluasi khusus untuk aplikasi medis
- **Accessibility Guidelines**: Evaluasi aksesibilitas

#### **4.2 Metrik Evaluasi**

**Efisiensi:**
- **Waktu Proses Rujukan**: Target < 5 menit (saat ini 8-20 menit)
- **Tingkat Kesalahan**: Target < 1% (saat ini 1-3 per minggu)
- **Loading Time**: Target < 3 detik (saat ini > 10 detik)

**Kepuasan Pengguna:**
- **User Satisfaction**: Target > 8/10 (saat ini 6.4/10)
- **Task Completion Rate**: Target > 95%
- **Error Rate**: Target < 2%

**Fungsionalitas:**
- **Uptime**: Target > 99.5%
- **Response Time**: Target < 2 detik
- **Data Accuracy**: Target > 98%

#### **4.3 Iterasi dan Perbaikan**

**Siklus Iterasi:**
1. **Identifikasi Masalah**: Dari hasil testing
2. **Prioritas Perbaikan**: Berdasarkan dampak dan effort
3. **Implementasi Perbaikan**: Pengembangan solusi
4. **Testing Ulang**: Validasi perbaikan
5. **Evaluasi Hasil**: Pengukuran improvement

**Rencana Perbaikan Berkelanjutan:**
- **Regular Feedback**: Koleksi feedback berkala
- **Performance Monitoring**: Monitoring performa sistem
- **User Training**: Pelatihan pengguna untuk fitur baru
- **System Updates**: Update sistem berdasarkan kebutuhan

---

## 📈 **IMPLEMENTASI PENYESUAIAN DALAM SKRIPSI**

### **Struktur Bab IV yang Disarankan:**

```
BAB IV PENERAPAN METODE USER-CENTERED DESIGN

4.1 Memahami Konteks Penggunaan
    4.1.1 Identifikasi Pengguna
    4.1.2 Analisis Konteks Penggunaan
    4.1.3 User Persona Development

4.2 Menentukan Persyaratan Pengguna
    4.2.1 Analisis Kebutuhan Fungsional
    4.2.2 Analisis Kebutuhan Non-Fungsional
    4.2.3 Identifikasi Pain Points

4.3 Merancang Solusi Desain
    4.3.1 Desain Konseptual
    4.3.2 Desain Interface
    4.3.3 Wireframing dan Prototyping

4.4 Evaluasi Terhadap Persyaratan
    4.4.1 Metode Evaluasi
    4.4.2 Metrik Evaluasi
    4.4.3 Iterasi dan Perbaikan
```

### **Penyesuaian Konten:**

**4.1 Memahami Konteks Penggunaan:**
- Gunakan user persona yang sudah dibuat
- Integrasikan hasil analisis kuesioner
- Tambahkan konteks penggunaan spesifik untuk aplikasi medis

**4.2 Menentukan Persyaratan Pengguna:**
- Reorganisasi kebutuhan berdasarkan prioritas
- Pisahkan kebutuhan fungsional dan non-fungsional
- Dokumentasikan pain points dengan jelas

**4.3 Merancang Solusi Desain:**
- Fokus pada solusi untuk pain points yang diidentifikasi
- Integrasikan GPS tracking sebagai fitur utama
- Desain yang sesuai dengan konteks medis

**4.4 Evaluasi Terhadap Persyaratan:**
- Gunakan metrik yang sudah ditetapkan
- Dokumentasikan proses iterasi
- Tunjukkan improvement yang dicapai

---

## 🎯 **REKOMENDASI IMPLEMENTASI**

### **1. Reorganisasi Konten Skripsi:**
- Sesuaikan struktur Bab IV dengan 4 tahap UCD
- Pindahkan konten yang sudah ada ke tahap yang sesuai
- Tambahkan konten yang kurang untuk melengkapi setiap tahap

### **2. Penambahan Konten:**
- **Tahap 1**: Tambahkan analisis konteks yang lebih detail
- **Tahap 2**: Dokumentasikan persyaratan dengan lebih sistematis
- **Tahap 3**: Fokus pada solusi GPS tracking
- **Tahap 4**: Tambahkan metrik evaluasi yang spesifik

### **3. Konsistensi dengan Jurnal Referensi:**
- Gunakan terminologi yang sama dengan jurnal
- Ikuti struktur metodologi yang sama
- Referensikan jurnal dengan tepat

---

## 📚 **KESIMPULAN**

Penyesuaian struktur UCD dalam skripsi Anda dengan standar 4 tahap dari jurnal referensi akan memberikan:

1. **Konsistensi Metodologi**: Mengikuti standar yang diakui dalam penelitian UCD
2. **Struktur yang Jelas**: Pemisahan yang jelas antara tahap analisis, desain, dan evaluasi
3. **Kredibilitas Akademik**: Menggunakan referensi jurnal yang valid
4. **Implementasi yang Sistematis**: Proses yang terstruktur dan dapat direplikasi

Dengan penyesuaian ini, skripsi Anda akan lebih sesuai dengan standar akademik dan metodologi UCD yang diakui secara internasional.

---

*Dokumen ini dibuat berdasarkan analisis dokumen skripsi yang ada dan referensi jurnal JEISBI untuk memastikan konsistensi metodologi User-Centered Design.*
