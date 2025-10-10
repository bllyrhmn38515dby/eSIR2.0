# 📊 DIAGRAM PENYESUAIAN STRUKTUR UCD
## Perbandingan Struktur Lama vs Struktur Baru (Sesuai Jurnal)

---

## 🔄 **PERBANDINGAN STRUKTUR UCD**

### **STRUKTUR LAMA (Yang Ada di Skripsi)**
```
BAB IV PENERAPAN METODE USER-CENTERED DESIGN

├── Analisis Kebutuhan Pengguna
│   ├── Kuesioner Analisis Kebutuhan
│   ├── Identifikasi Masalah
│   └── Kebutuhan Fitur
├── User Persona Development
│   ├── Persona 1: SPGDT
│   └── Persona 2: Tim PSC
├── User Journey Mapping
│   ├── Journey SPGDT
│   └── Journey Tim PSC
├── Wireframing dan Prototyping
│   ├── Low-fidelity Wireframe
│   └── High-fidelity Prototype
├── Usability Testing
│   ├── Task-based Testing
│   └── Performance Metrics
└── Evaluasi dan Iterasi
    ├── Feedback Analysis
    └── Improvement Plan
```

### **STRUKTUR BARU (Sesuai Jurnal 4 Tahap)**
```
BAB IV PENERAPAN METODE USER-CENTERED DESIGN

4.1 MEMAHAMI KONTEKS PENGGUNAAN
├── 4.1.1 Identifikasi Pengguna
│   ├── User Persona Development
│   ├── Profil Pengguna SPGDT
│   └── Profil Pengguna Tim PSC
├── 4.1.2 Analisis Konteks Penggunaan
│   ├── Situasi Penggunaan
│   ├── Lingkungan Operasional
│   └── Platform dan Perangkat
└── 4.1.3 Analisis Kebutuhan Dasar
    ├── Kuesioner Analisis Kebutuhan
    └── Identifikasi Masalah Awal

4.2 MENENTUKAN PERSYARATAN PENGGUNA
├── 4.2.1 Analisis Kebutuhan Fungsional
│   ├── Sistem Komunikasi Terintegrasi
│   ├── Informasi Real-time yang Akurat
│   ├── Dashboard yang Ideal
│   └── Fitur Aksesibilitas
├── 4.2.2 Analisis Kebutuhan Non-Fungsional
│   ├── Performance Requirements
│   ├── Usability Requirements
│   └── Security Requirements
└── 4.2.3 Identifikasi Pain Points
    ├── Masalah Navigasi
    ├── Form Input yang Tidak User-Friendly
    └── Informasi Real-time yang Tidak Akurat

4.3 MERANCANG SOLUSI DESAIN
├── 4.3.1 Desain Konseptual
│   ├── Arsitektur Sistem
│   ├── Integrasi GPS
│   └── Real-time Communication
├── 4.3.2 Desain Interface
│   ├── Prinsip Desain
│   ├── Komponen Utama
│   └── User Experience Design
└── 4.3.3 Wireframing dan Prototyping
    ├── Low-fidelity Wireframe
    ├── High-fidelity Prototype
    └── Interactive Prototype

4.4 EVALUASI TERHADAP PERSYARATAN
├── 4.4.1 Metode Evaluasi
│   ├── Usability Testing
│   ├── Heuristic Evaluation
│   └── Performance Testing
├── 4.4.2 Metrik Evaluasi
│   ├── Efisiensi
│   ├── Kepuasan Pengguna
│   └── Fungsionalitas
└── 4.4.3 Iterasi dan Perbaikan
    ├── Siklus Iterasi
    └── Rencana Perbaikan Berkelanjutan
```

---

## 📋 **MAPPING KONTEN LAMA KE STRUKTUR BARU**

### **Konten yang Sudah Ada → Struktur Baru**

| **Konten Lama** | **Struktur Baru** | **Penyesuaian** |
|------------------|-------------------|-----------------|
| Analisis Kebutuhan Pengguna | 4.1.3 + 4.2.1 | Pisahkan menjadi analisis dasar dan kebutuhan fungsional |
| User Persona Development | 4.1.1 | Tetap di tahap identifikasi pengguna |
| User Journey Mapping | 4.1.2 | Integrasikan ke analisis konteks |
| Wireframing dan Prototyping | 4.3.3 | Tetap di tahap desain |
| Usability Testing | 4.4.1 | Pindahkan ke tahap evaluasi |
| Evaluasi dan Iterasi | 4.4.3 | Tetap di tahap evaluasi |

### **Konten yang Perlu Ditambahkan**

| **Tahap** | **Konten yang Kurang** | **Sumber Data** |
|-----------|------------------------|-----------------|
| 4.1.2 | Analisis Konteks Penggunaan | Kuesioner + Observasi |
| 4.2.2 | Kebutuhan Non-Fungsional | Analisis Sistem + Literatur |
| 4.3.1 | Desain Konseptual | Arsitektur Sistem |
| 4.3.2 | Prinsip Desain | Guidelines UI/UX |
| 4.4.2 | Metrik Evaluasi | Standar Usability |

---

## 🎯 **REKOMENDASI IMPLEMENTASI**

### **1. Reorganisasi Konten**
- **Pindahkan** User Persona ke 4.1.1
- **Pisahkan** analisis kebutuhan menjadi 4.1.3 dan 4.2.1
- **Integrasikan** User Journey ke 4.1.2
- **Pindahkan** Usability Testing ke 4.4.1

### **2. Penambahan Konten**
- **4.1.2**: Tambahkan analisis konteks penggunaan yang detail
- **4.2.2**: Tambahkan kebutuhan non-fungsional (performance, security)
- **4.3.1**: Tambahkan desain konseptual dan arsitektur sistem
- **4.3.2**: Tambahkan prinsip desain dan komponen UI

### **3. Konsistensi Terminologi**
- Gunakan terminologi yang sama dengan jurnal referensi
- Sesuaikan dengan standar metodologi UCD
- Pastikan referensi yang tepat

---

## 📊 **DIAGRAM ALIR PROSES UCD**

```
START
  ↓
4.1 MEMAHAMI KONTEKS PENGGUNAAN
  ├── Identifikasi Pengguna (Persona)
  ├── Analisis Konteks Penggunaan
  └── Analisis Kebutuhan Dasar
  ↓
4.2 MENENTUKAN PERSYARATAN PENGGUNA
  ├── Kebutuhan Fungsional
  ├── Kebutuhan Non-Fungsional
  └── Identifikasi Pain Points
  ↓
4.3 MERANCANG SOLUSI DESAIN
  ├── Desain Konseptual
  ├── Desain Interface
  └── Wireframing & Prototyping
  ↓
4.4 EVALUASI TERHADAP PERSYARATAN
  ├── Metode Evaluasi
  ├── Metrik Evaluasi
  └── Iterasi & Perbaikan
  ↓
EVALUASI HASIL
  ├── Apakah memenuhi persyaratan?
  │   ├── YA → IMPLEMENTASI
  │   └── TIDAK → ITERASI (kembali ke 4.3)
  └── Monitoring Berkelanjutan
```

---

## 🔍 **CHECKLIST PENYESUAIAN**

### **Tahap 1: Memahami Konteks Penggunaan**
- [ ] User Persona sudah lengkap (SPGDT + Tim PSC)
- [ ] Analisis konteks penggunaan sudah detail
- [ ] Kebutuhan dasar sudah teridentifikasi
- [ ] Data kuesioner sudah dianalisis

### **Tahap 2: Menentukan Persyaratan Pengguna**
- [ ] Kebutuhan fungsional sudah diprioritaskan
- [ ] Kebutuhan non-fungsional sudah didefinisikan
- [ ] Pain points sudah teridentifikasi dengan jelas
- [ ] Persyaratan sudah terdokumentasi

### **Tahap 3: Merancang Solusi Desain**
- [ ] Desain konseptual sudah dibuat
- [ ] Arsitektur sistem sudah didefinisikan
- [ ] Prinsip desain sudah ditetapkan
- [ ] Wireframe dan prototype sudah dibuat

### **Tahap 4: Evaluasi Terhadap Persyaratan**
- [ ] Metode evaluasi sudah ditentukan
- [ ] Metrik evaluasi sudah didefinisikan
- [ ] Proses iterasi sudah direncanakan
- [ ] Rencana perbaikan sudah dibuat

---

## 📚 **REFERENSI DAN SUMBER**

1. **Jurnal Referensi**: [Penerapan Metode User Centered Design dalam Perancangan Ulang Desain Website MAN 1 Pasuruan](https://ejournal.unesa.ac.id/index.php/JEISBI/article/view/46197/38955)

2. **Data Skripsi**: 
   - Analisis Kuesioner (10 responden)
   - User Persona Development
   - Feedback Analysis
   - Usability Testing Results

3. **Standar UCD**: 
   - ISO 9241-210:2019 (Human-centred design for interactive systems)
   - Nielsen's Usability Heuristics
   - Medical Interface Guidelines

---

*Diagram ini dibuat untuk memudahkan pemahaman penyesuaian struktur UCD dalam skripsi sesuai dengan standar 4 tahap dari jurnal referensi.*
