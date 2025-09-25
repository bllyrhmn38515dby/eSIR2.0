# Analisis Penempatan Vital Signs pada Form Rujukan Enhanced

## Situasi Saat Ini

### **Design System Demo:**
- ✅ **VitalSignsMonitor**: Komponen lengkap untuk monitoring vital signs
- ✅ **Input.VitalSigns**: Input khusus untuk vital signs dengan unit
- ✅ **Vital Signs Display**: Tampilan grid untuk multiple vital signs

### **Form Rujukan Enhanced:**
- ❌ **Tidak Ada Vital Signs**: Field vital signs belum diimplementasikan
- ✅ **Step 4 Data Medis**: Tempat yang logis untuk vital signs
- ✅ **Struktur Siap**: Form sudah memiliki struktur yang mendukung

## Rekomendasi Penempatan Vital Signs

### **1. Lokasi Utama: Step 4 - Data Medis**

#### **Alasan Penempatan:**
- ✅ **Logis Medis**: Vital signs adalah bagian dari data medis
- ✅ **Workflow**: Setelah diagnosis dan keluhan, sebelum tindakan
- ✅ **Komprehensif**: Melengkapi informasi medis yang sudah ada

#### **Struktur yang Disarankan:**
```
Step 4: Data Medis
├── Diagnosis (existing)
├── Keluhan (existing)
├── 🆕 Vital Signs Section
│   ├── Tekanan Darah
│   ├── Denyut Jantung
│   ├── Suhu Tubuh
│   ├── Saturasi Oksigen
│   └── Laju Pernapasan
├── Pemeriksaan Fisik (existing)
├── Hasil Laboratorium (existing)
├── Tindakan yang Dilakukan (existing)
└── Obat yang Diberikan (existing)
```

### **2. Implementasi yang Disarankan**

#### **Opsi A: VitalSignsMonitor Component**
```javascript
// Menggunakan komponen VitalSignsMonitor yang sudah ada
<VitalSignsMonitor
  patientId={formData.pasienId}
  vitalSigns={formData.vitalSigns}
  onUpdate={(vitals) => handleInputChange('vitalSigns', vitals)}
  realTime={false}
/>
```

#### **Opsi B: Individual Input Fields**
```javascript
// Menggunakan Input.VitalSigns untuk setiap vital sign
<div className="vital-signs-section">
  <h3>🩺 Vital Signs</h3>
  <div className="vital-signs-grid">
    <Input.VitalSigns 
      label="Tekanan Darah"
      value={formData.bloodPressure}
      onChange={(e) => handleInputChange('bloodPressure', e.target.value)}
      unit="mmHg"
    />
    <Input.VitalSigns 
      label="Denyut Jantung"
      value={formData.heartRate}
      onChange={(e) => handleInputChange('heartRate', e.target.value)}
      unit="bpm"
    />
    <Input.VitalSigns 
      label="Suhu Tubuh"
      value={formData.temperature}
      onChange={(e) => handleInputChange('temperature', e.target.value)}
      unit="°C"
    />
    <Input.VitalSigns 
      label="Saturasi Oksigen"
      value={formData.oxygenSaturation}
      onChange={(e) => handleInputChange('oxygenSaturation', e.target.value)}
      unit="%"
    />
  </div>
</div>
```

### **3. Field Vital Signs yang Disarankan**

#### **Essential Vital Signs:**
- ✅ **Tekanan Darah** (mmHg) - Systolic/Diastolic
- ✅ **Denyut Jantung** (bpm) - Heart Rate
- ✅ **Suhu Tubuh** (°C) - Temperature
- ✅ **Saturasi Oksigen** (%) - SpO2
- ✅ **Laju Pernapasan** (rpm) - Respiratory Rate

#### **Optional Vital Signs:**
- 🔸 **Gula Darah** (mg/dL) - Blood Sugar
- 🔸 **Berat Badan** (kg) - Weight
- 🔸 **Tinggi Badan** (cm) - Height
- 🔸 **Skala Nyeri** (1-10) - Pain Scale

### **4. Layout dan Styling**

#### **Grid Layout:**
```css
.vital-signs-section {
  margin: var(--spacing-4) 0;
  padding: var(--spacing-4);
  background-color: var(--surface-light);
  border-radius: var(--radius-md);
  border: 1px solid var(--neutral-200);
}

.vital-signs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-3);
}

.vital-signs-section h3 {
  margin-bottom: var(--spacing-3);
  color: var(--primary-600);
  font-size: var(--font-size-lg);
}
```

### **5. Data Structure**

#### **Form Data Structure:**
```javascript
const formData = {
  // ... existing fields
  vitalSigns: {
    bloodPressure: {
      systolic: '',
      diastolic: ''
    },
    heartRate: '',
    temperature: '',
    oxygenSaturation: '',
    respiratoryRate: '',
    bloodSugar: '',
    weight: '',
    height: '',
    painScale: ''
  }
};
```

### **6. Validasi**

#### **Validasi Vital Signs:**
```javascript
// Validasi untuk vital signs
const validateVitalSigns = (vitals) => {
  const errors = {};
  
  // Tekanan Darah
  if (vitals.bloodPressure?.systolic && vitals.bloodPressure?.diastolic) {
    const systolic = parseInt(vitals.bloodPressure.systolic);
    const diastolic = parseInt(vitals.bloodPressure.diastolic);
    
    if (systolic < 70 || systolic > 250) {
      errors.bloodPressure = 'Tekanan darah sistolik tidak normal';
    }
    if (diastolic < 40 || diastolic > 150) {
      errors.bloodPressure = 'Tekanan darah diastolik tidak normal';
    }
  }
  
  // Denyut Jantung
  if (vitals.heartRate) {
    const hr = parseInt(vitals.heartRate);
    if (hr < 40 || hr > 200) {
      errors.heartRate = 'Denyut jantung tidak normal';
    }
  }
  
  // Suhu Tubuh
  if (vitals.temperature) {
    const temp = parseFloat(vitals.temperature);
    if (temp < 35 || temp > 42) {
      errors.temperature = 'Suhu tubuh tidak normal';
    }
  }
  
  return errors;
};
```

## Implementasi yang Disarankan

### **Phase 1: Basic Implementation**
1. ✅ **Tambahkan Section**: Vital Signs section di Step 4
2. ✅ **Essential Fields**: Tekanan Darah, Denyut Jantung, Suhu, SpO2
3. ✅ **Basic Validation**: Range validation untuk setiap field
4. ✅ **Preview Integration**: Tampilkan vital signs di preview

### **Phase 2: Enhanced Features**
1. 🔸 **VitalSignsMonitor**: Integrasi komponen monitor
2. 🔸 **Real-time Updates**: Update otomatis jika diperlukan
3. 🔸 **Alerts**: Peringatan untuk nilai abnormal
4. 🔸 **History**: Riwayat vital signs

### **Phase 3: Advanced Features**
1. 🔸 **Charts**: Grafik trend vital signs
2. 🔸 **Export**: Export data vital signs
3. 🔸 **Integration**: Integrasi dengan sistem monitoring
4. 🔸 **AI Analysis**: Analisis AI untuk prediksi

## Kesimpulan

### **Rekomendasi Utama:**
- ✅ **Lokasi**: Step 4 - Data Medis (setelah diagnosis dan keluhan)
- ✅ **Implementasi**: Individual Input Fields untuk fleksibilitas
- ✅ **Essential Fields**: 5 vital signs utama
- ✅ **Layout**: Grid responsive dengan styling yang konsisten

### **Manfaat Implementasi:**
- ✅ **Completeness**: Form rujukan yang lebih lengkap
- ✅ **Medical Accuracy**: Data medis yang lebih akurat
- ✅ **User Experience**: Interface yang lebih informatif
- ✅ **Data Quality**: Validasi yang lebih baik

### **Next Steps:**
1. **Implementasi**: Tambahkan vital signs section di Step 4
2. **Testing**: Test dengan data real dan edge cases
3. **Integration**: Integrasi dengan preview dan validasi
4. **Documentation**: Update dokumentasi form rujukan
