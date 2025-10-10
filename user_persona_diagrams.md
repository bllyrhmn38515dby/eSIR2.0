# User Persona Visualization - eSIR 2.0

## Diagram 1: User Persona Overview

```mermaid
graph TD
    A[User Persona eSIR 2.0] --> B[Persona 1: SPGDT]
    A --> C[Persona 2: Tim PSC]
    
    B --> B1[Sarah - Koordinator Rujukan]
    B --> B2[Usia: 28-35 tahun]
    B --> B3[Pengalaman: 3-5 tahun]
    B --> B4[Fokus: Koordinasi & Komunikasi]
    B --> B5[Platform: Desktop + Mobile]
    B --> B6[Frekuensi: 15-20x/hari]
    
    C --> C1[Budi - Input Data Pasien]
    C --> C2[Usia: 25-40 tahun]
    C --> C3[Pengalaman: 2-4 tahun]
    C --> C4[Fokus: Input Data & Navigasi]
    C --> C5[Platform: Desktop + Tablet]
    C --> C6[Frekuensi: 10-15x/hari]
```

## Diagram 2: Needs & Pain Points Analysis

```mermaid
graph LR
    subgraph SPGDT["Persona 1: SPGDT"]
        A1[Kebutuhan Utama]
        A2[Pain Points]
        A3[Prioritas]
        
        A1 --> A11[Real-time tracking]
        A1 --> A12[Auto notifications]
        A1 --> A13[Coordination dashboard]
        A1 --> A14[Efficient communication]
        
        A2 --> A21[Sulit melacak status]
        A2 --> A22[Komunikasi tidak real-time]
        A2 --> A23[Informasi tidak akurat]
        A2 --> A24[Koordinasi tidak efisien]
        
        A3 --> A31[Efisiensi koordinasi]
    end
    
    subgraph PSC["Persona 2: Tim PSC"]
        B1[Kebutuhan Utama]
        B2[Pain Points]
        B3[Prioritas]
        
        B1 --> B11[User-friendly forms]
        B1 --> B12[Intuitive navigation]
        B1 --> B13[Auto validation]
        B1 --> B14[Informative dashboard]
        
        B2 --> B21[Form terlalu panjang]
        B2 --> B22[Navigasi membingungkan]
        B2 --> B23[Sering terjadi kesalahan]
        B2 --> B24[Interface tidak intuitif]
        
        B3 --> B31[Kemudahan input data]
    end
```

## Diagram 3: User Journey Comparison

```mermaid
journey
    title User Journey Comparison
    section SPGDT Journey
      Terima permintaan rujukan: 5: SPGDT
      Cek ketersediaan faskes: 4: SPGDT
      Kirim rujukan: 5: SPGDT
      Tunggu konfirmasi: 2: SPGDT
      Update status: 3: SPGDT
      Koordinasi ambulans: 4: SPGDT
    section Tim PSC Journey
      Buka sistem: 5: PSC
      Isi form data pasien: 2: PSC
      Validasi data: 4: PSC
      Submit rujukan: 5: PSC
      Monitor status: 4: PSC
      Update informasi: 3: PSC
```

## Diagram 4: Feature Priority Matrix

```mermaid
quadrantChart
    title Feature Priority Matrix
    x-axis Low Impact --> High Impact
    y-axis Low Effort --> High Effort
    
    quadrant-1 High Impact, Low Effort
    quadrant-2 High Impact, High Effort
    quadrant-3 Low Impact, High Effort
    quadrant-4 Low Impact, Low Effort
    
    Real-time tracking: [0.8, 0.3]
    Auto notifications: [0.7, 0.4]
    User-friendly forms: [0.9, 0.2]
    Intuitive navigation: [0.8, 0.3]
    Coordination dashboard: [0.6, 0.5]
    Auto validation: [0.7, 0.4]
    Mobile optimization: [0.5, 0.6]
    Dark mode: [0.3, 0.7]
    Custom themes: [0.2, 0.8]
    System integration: [0.4, 0.9]
```

## Diagram 5: Empathy Map

```mermaid
mindmap
  root((User Persona))
    SPGDT
      Think & Feel
        "Saya perlu sistem yang cepat"
        "Koordinasi harus efisien"
        "Informasi harus akurat"
      See
        Dashboard yang kompleks
        Status yang tidak update
        Komunikasi yang lambat
      Hear
        "Kapan statusnya update?"
        "Ambulans sudah sampai?"
        "Faskes tujuan siap?"
      Say & Do
        "Cek status terus-menerus"
        "Hubungi faskes manual"
        "Update status manual"
    Tim PSC
      Think & Feel
        "Form ini terlalu rumit"
        "Saya sering salah input"
        "Navigasi membingungkan"
      See
        Form yang panjang
        Menu yang tidak jelas
        Error yang sering muncul
      Hear
        "Form ini susah diisi"
        "Menu mana yang benar?"
        "Kenapa sering error?"
      Say & Do
        "Isi form dengan hati-hati"
        "Klik menu berkali-kali"
        "Koreksi input berulang"
```

## Diagram 6: Task Flow Comparison

```mermaid
flowchart TD
    Start([Mulai]) --> Decision{Persona Type}
    
    Decision -->|SPGDT| SPGDT_Flow[SPGDT Task Flow]
    Decision -->|Tim PSC| PSC_Flow[Tim PSC Task Flow]
    
    SPGDT_Flow --> SPGDT1[Terima permintaan rujukan]
    SPGDT1 --> SPGDT2[Cek ketersediaan faskes]
    SPGDT2 --> SPGDT3[Kirim rujukan]
    SPGDT3 --> SPGDT4[Tunggu konfirmasi]
    SPGDT4 --> SPGDT5[Update status]
    SPGDT5 --> SPGDT6[Koordinasi ambulans]
    SPGDT6 --> End1([Selesai])
    
    PSC_Flow --> PSC1[Buka sistem]
    PSC1 --> PSC2[Isi form data pasien]
    PSC2 --> PSC3[Validasi data]
    PSC3 --> PSC4[Submit rujukan]
    PSC4 --> PSC5[Monitor status]
    PSC5 --> PSC6[Update informasi]
    PSC6 --> End2([Selesai])
    
    style SPGDT_Flow fill:#e1f5fe
    style PSC_Flow fill:#f3e5f5
    style Start fill:#c8e6c9
    style End1 fill:#ffcdd2
    style End2 fill:#ffcdd2
```

## Panduan Implementasi Visual:

### 1. Tools yang Direkomendasikan:
- **Mermaid Live Editor** (https://mermaid.live/) - Untuk diagram teknis
- **Figma** - Untuk desain visual yang lebih menarik
- **Draw.io** - Untuk diagram yang lebih kompleks
- **Canva** - Untuk template yang sudah jadi

### 2. Elemen Visual yang Perlu Ditambahkan:
- **Ikon**: Gunakan ikon yang konsisten untuk setiap kategori
- **Warna**: Skema warna yang berbeda untuk setiap persona
- **Typography**: Font yang mudah dibaca dan profesional
- **Layout**: Struktur yang jelas dan terorganisir

### 3. Tips Desain:
- Gunakan warna yang kontras untuk readability
- Tambahkan ikon untuk setiap kategori
- Buat layout yang simetris dan seimbang
- Gunakan spacing yang konsisten
- Pastikan diagram mudah dipahami oleh pembaca

### 4. Format untuk Skripsi:
- Simpan sebagai gambar berkualitas tinggi (PNG/SVG)
- Pastikan resolusi minimal 300 DPI
- Gunakan nomor gambar yang konsisten (4.1, 4.2, dst.)
- Tambahkan caption yang menjelaskan isi diagram

Diagram ini akan menjadi **Gambar 4.X** dalam skripsi Anda dan akan mendukung pembahasan User Persona yang telah dibuat sebelumnya.
