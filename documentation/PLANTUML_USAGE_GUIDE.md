# 🚑 PLANTUML USE CASE DIAGRAM - PANDUAN PENGGUNAAN

## 📋 **OVERVIEW**

Dokumen ini berisi **3 versi PlantUML code** untuk Use Case Diagram sistem eSIR 2.0 yang dapat digunakan sesuai kebutuhan.

## 📁 **FILE PLANTUML YANG TERSEDIA**

### **1. `USE_CASE_PLANTUML_COMPLETE.puml`**
- **Deskripsi:** Versi lengkap dengan semua detail
- **Fitur:**
  - Semua 60 use cases
  - 11 kategori use cases
  - Semua relationships
  - Notes dan dokumentasi
  - Styling lengkap
- **Kegunaan:** Dokumentasi lengkap, presentasi stakeholder

### **2. `USE_CASE_PLANTUML_SIMPLE.puml`**
- **Deskripsi:** Versi sederhana dan mudah dibaca
- **Fitur:**
  - Semua use cases tanpa grouping
  - Relationships yang penting
  - Styling minimal
- **Kegunaan:** Development reference, quick overview

### **3. `USE_CASE_PLANTUML_BY_ACTOR.puml`**
- **Deskripsi:** Versi yang dikelompokkan per aktor
- **Fitur:**
  - Use cases dikelompokkan per aktor
  - Focus pada peran masing-masing
  - Visual yang lebih terorganisir
- **Kegunaan:** Training material, role-based documentation

## 🛠️ **CARA MENGGUNAKAN PLANTUML**

### **1. Online PlantUML Editor**
```
1. Buka https://www.plantuml.com/plantuml/uml/
2. Copy-paste kode PlantUML
3. Diagram akan otomatis di-render
4. Download sebagai PNG/SVG/PDF
```

### **2. VS Code Extension**
```
1. Install extension "PlantUML"
2. Buat file dengan ekstensi .puml
3. Paste kode PlantUML
4. Preview dengan Alt+D
5. Export dengan Ctrl+Shift+P > PlantUML: Export
```

### **3. Command Line**
```bash
# Install PlantUML
java -jar plantuml.jar USE_CASE_PLANTUML_COMPLETE.puml

# Generate multiple formats
java -jar plantuml.jar -tpng USE_CASE_PLANTUML_COMPLETE.puml
java -jar plantuml.jar -tsvg USE_CASE_PLANTUML_COMPLETE.puml
java -jar plantuml.jar -tpdf USE_CASE_PLANTUML_COMPLETE.puml
```

### **4. IntelliJ IDEA Plugin**
```
1. Install "PlantUML integration" plugin
2. Buat file .puml
3. Paste kode PlantUML
4. Preview otomatis muncul
5. Export melalui menu
```

## 🎨 **CUSTOMIZATION OPTIONS**

### **1. Mengubah Warna**
```plantuml
skinparam usecase {
    BackgroundColor LightGreen    # Ganti warna background
    BorderColor DarkGreen         # Ganti warna border
    ArrowColor DarkGreen          # Ganti warna arrow
}
```

### **2. Mengubah Font**
```plantuml
skinparam usecase {
    FontSize 12                   # Ukuran font
    FontStyle bold               # Style font
}
```

### **3. Mengubah Theme**
```plantuml
!theme plain                     # Theme plain
!theme bluegray                 # Theme bluegray
!theme cerulean                 # Theme cerulean
!theme spacelab                 # Theme spacelab
```

### **4. Menambah Legend**
```plantuml
legend right
  |Color|Actor|
  |<#LightGreen>|Admin Pusat|
  |<#LightBlue>|Admin Faskes|
  |<#Orange>|Sopir Ambulans|
  |<#Pink>|Pasien|
endlegend
```

## 📊 **DIAGRAM STATISTICS**

### **Use Cases per Actor:**
- **Admin Pusat:** 15 use cases
- **Admin Faskes:** 23 use cases
- **Sopir Ambulans:** 16 use cases
- **Pasien:** 5 use cases
- **External Systems:** 19 use cases

### **Total Use Cases:** 78 use cases

### **Relationships:**
- **Include Relationships:** 6 relationships
- **Extend Relationships:** 5 relationships
- **Generalization:** 1 relationship
- **Actor Associations:** 78 relationships

## 🔧 **TROUBLESHOOTING**

### **1. Diagram Terlalu Besar**
```plantuml
' Tambahkan di awal file
skinparam maxMessageSize 100
skinparam maxAsynMessageSize 100
```

### **2. Font Terlalu Kecil**
```plantuml
skinparam defaultFontSize 12
skinparam usecase {
    FontSize 12
}
```

### **3. Warna Tidak Muncul**
```plantuml
' Pastikan menggunakan format yang benar
actor "Name" as ALIAS #ColorName
```

### **4. Diagram Tidak Render**
- Periksa syntax PlantUML
- Pastikan semua kurung kurawal tertutup
- Periksa nama alias yang unik

## 📱 **MOBILE FEATURES HIGHLIGHT**

### **Sopir Ambulans Mobile Features:**
- GPS Tracking
- Background Tracking
- Voice Commands
- Offline Mode
- Battery Optimization
- Device Information

### **Pasien Mobile Features:**
- Push Notifications
- Offline Mode
- Device Information

## 🎯 **BEST PRACTICES**

### **1. Untuk Development:**
- Gunakan versi **SIMPLE** untuk quick reference
- Fokus pada use cases yang sedang dikembangkan
- Update diagram saat ada perubahan requirements

### **2. Untuk Documentation:**
- Gunakan versi **COMPLETE** untuk dokumentasi lengkap
- Tambahkan notes untuk penjelasan detail
- Export dalam format PDF untuk sharing

### **3. Untuk Training:**
- Gunakan versi **BY_ACTOR** untuk role-based training
- Fokus pada use cases per aktor
- Tambahkan legend untuk pemahaman

### **4. Untuk Presentation:**
- Gunakan versi **COMPLETE** dengan styling yang menarik
- Export dalam format PNG/SVG untuk kualitas tinggi
- Tambahkan title dan notes yang informatif

## 📝 **UPDATE LOG**

### **v1.0 - Initial Release**
- Created 3 versions of PlantUML diagrams
- Added complete use case coverage
- Included all relationships and dependencies

### **v1.1 - Enhancement**
- Added color coding for actors
- Improved styling and theming
- Added notes and documentation

### **v1.2 - Organization**
- Grouped use cases by actor
- Added package structure
- Improved visual organization

## 🔗 **RELATED DOCUMENTS**

- `USE_CASE_DIAGRAM_ESIR2.md` - Dokumentasi lengkap
- `USE_CASE_DETAILED_DIAGRAM.md` - Diagram detail
- `USE_CASE_README.md` - Panduan penggunaan

## 📧 **SUPPORT**

Untuk pertanyaan atau bantuan terkait PlantUML diagrams:
- Periksa dokumentasi PlantUML resmi
- Gunakan PlantUML online editor untuk testing
- Konsultasi dengan tim development eSIR 2.0

---

**💡 Tips:** Gunakan PlantUML online editor untuk preview cepat sebelum mengimplementasikan di project Anda!
