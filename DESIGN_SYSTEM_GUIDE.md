# eSIR 2.0 Design System Guide

## Berdasarkan Hasil Penelitian User (22 Responden dari 3 Rumah Sakit)

### 🎯 **Tujuan Design System**
Design system ini dibuat berdasarkan hasil wawancara mendalam dan kuesioner terhadap 22 responden dari 3 rumah sakit untuk memastikan aplikasi eSIR 2.0 sesuai dengan kebutuhan pengguna medis.

---

## 🎨 **Palet Warna Medis**

### **Warna Primer**
```css
--primary-500: #1E40AF;  /* Biru Medis Profesional - 68.2% responden memilih */
--secondary-500: #059669; /* Hijau Medis Tenang - 45.5% responden memilih */
--accent-500: #DC2626;   /* Merah Darurat - 27.3% responden memilih */
--neutral-500: #64748B;  /* Abu-abu Profesional - 36.4% responden memilih */
--surface-white: #FFFFFF; /* Putih Steril - 54.5% responden memilih */
```

### **Status Medis**
```css
--status-critical: #DC2626;   /* P1 - Resusitasi */
--status-urgent: #F59E0B;     /* P2 - Darurat */
--status-stable: #059669;     /* P3 - Urgent */
--status-discharged: #64748B; /* P4 - Standar */
```

### **Rasional Pemilihan Warna**
- **Biru**: Memberikan kesan profesional dan tenang, cocok untuk lingkungan medis
- **Hijau**: Identik dengan kesehatan dan penyembuhan
- **Merah**: Untuk indikator darurat dan peringatan
- **Putih**: Bersih dan mudah dibaca, sesuai standar medis

---

## 📝 **Tipografi**

### **Font Family**
```css
--font-family-primary: 'Inter', 'Arial', 'Helvetica', sans-serif;
```
**81.8% responden memilih sans-serif** karena lebih mudah dibaca dalam kondisi terburu-buru.

### **Ukuran Font**
```css
--font-size-xs: 12px;    /* Caption */
--font-size-sm: 14px;    /* Small text */
--font-size-base: 16px;  /* Body text - 45.5% responden memilih */
--font-size-lg: 18px;    /* H3 */
--font-size-xl: 20px;   /* H2 */
--font-size-2xl: 24px;  /* H1 */
```

### **Font Weights**
```css
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

---

## 🧩 **Komponen UI**

### **1. Button Component**
```jsx
import { Button } from './components/ui';

// Variants
<Button variant="primary">Primary Button</Button>
<Button variant="secondary">Secondary Button</Button>
<Button variant="success">Success Button</Button>
<Button variant="danger">Danger Button</Button>
<Button variant="warning">Warning Button</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="ghost">Ghost Button</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// With Icons
<Button icon="🏥" loading={false}>Medical Action</Button>
```

### **2. Card Component**
```jsx
import { Card } from './components/ui';

// Basic Card
<Card>
  <Card.Header>
    <Card.Title>Card Title</Card.Title>
  </Card.Header>
  <Card.Body>
    Card content here
  </Card.Body>
  <Card.Footer>
    Card footer
  </Card.Footer>
</Card>

// Medical Card Variants
<Card variant="medical">Medical Card</Card>
<Card variant="emergency">Emergency Card</Card>
<Card variant="patient">Patient Card</Card>
<Card variant="stats">Statistics Card</Card>

// Patient Card
<Card.Patient 
  patient={{
    id: 'P001',
    name: 'John Doe',
    status: 'critical',
    priority: 'P1',
    vitalSigns: { bp: '140/90', hr: '95', temp: '37.2°C', spo2: '98%' }
  }}
/>

// Stat Card
<Card.Stat 
  title="Total Pasien"
  value="1,247"
  icon="👥"
  trend={12}
/>
```

### **3. Input Component**
```jsx
import { Input } from './components/ui';

// Basic Input
<Input 
  label="Nama Pasien"
  placeholder="Masukkan nama pasien..."
  required
/>

// Medical Input
<Input.Medical 
  label="Email"
  type="email"
  placeholder="email@rumahsakit.com"
/>

// Vital Signs Input
<Input.VitalSigns 
  label="Tekanan Darah"
  value="140/90"
  unit="mmHg"
/>

// Search Input
<Input.Search 
  placeholder="Cari pasien..."
  value={searchTerm}
  onChange={setSearchTerm}
/>
```

### **4. Status Indicator**
```jsx
import { StatusIndicator } from './components/ui';

// Basic Status
<StatusIndicator status="critical" />
<StatusIndicator status="stable" />
<StatusIndicator status="urgent" />

// With Priority
<StatusIndicator 
  status="critical" 
  priority="P1" 
  animated 
/>

// Medical Specific
<StatusIndicator.Patient patient={patientData} />
<StatusIndicator.Referral referral={referralData} />
<StatusIndicator.Ambulance ambulance={ambulanceData} />
<StatusIndicator.System isOnline={true} />

// Status List
<StatusIndicator.List statuses={statusArray} />
```

### **5. Medical Components**
```jsx
import { PatientForm, ReferralForm, MultiStepReferralForm, VitalSignsMonitor } from './components/medical';

// Patient Form
<PatientForm
  mode="create" // 'create' | 'edit' | 'view'
  onSubmit={(data) => console.log('Patient submitted:', data)}
  onCancel={() => console.log('Cancelled')}
/>

// Traditional Referral Form
<ReferralForm
  mode="create"
  patients={patientsArray}
  faskes={faskesArray}
  onSubmit={(data) => console.log('Referral submitted:', data)}
  onCancel={() => console.log('Cancelled')}
/>

// Multi-Step Referral Form (Enhanced)
<MultiStepReferralForm
  mode="create"
  patients={patientsArray}
  faskes={faskesArray}
  onSubmit={(data) => console.log('Multi-step referral submitted:', data)}
  onCancel={() => console.log('Cancelled')}
/>

// Vital Signs Monitor
<VitalSignsMonitor
  patientId="P001"
  vitalSigns={{
    bloodPressure: { systolic: 120, diastolic: 80 },
    heartRate: 72,
    temperature: 36.5,
    oxygenSaturation: 98
  }}
  realTime={true}
  onUpdate={(vitals) => console.log('Vitals updated:', vitals)}
/>
```

### **6. Enhanced Features**

#### **Multi-Step Form dengan Progress Indicator**
- **5 Langkah**: Data Rujukan → Data Pasien → Data Pengirim & Penerima → Data Medis → Data Transportasi & Status
- **Progress Bar**: Visual indicator dengan step navigation
- **Auto-save**: Otomatis menyimpan setiap 30 detik
- **Form Validation**: Real-time validation per step
- **Click-to-Jump**: Navigasi antar step yang sudah dikunjungi

#### **Enhanced User Experience**
- **Tips & Guidance**: Tips kontekstual di setiap step
- **Status Indicators**: Auto-save status dan form state
- **Responsive Design**: Mobile-optimized dengan touch controls
- **Accessibility**: Keyboard navigation dan screen reader support

---

## 📱 **Responsive Design**

### **Breakpoints**
```css
/* Mobile First Approach */
@media (max-width: 768px) {
  /* Mobile styles */
}

@media (min-width: 769px) {
  /* Tablet styles */
}

@media (min-width: 1024px) {
  /* Desktop styles */
}
```

### **Platform Prioritas**
1. **Desktop/Laptop** (81.8% responden)
2. **Tablet** (54.5% responden)
3. **Smartphone** (36.4% responden)

---

## ♿ **Aksesibilitas**

### **Fitur Aksesibilitas yang Diimplementasikan**
- **Mode Gelap/Terang** (68.2% responden membutuhkan)
- **Zoom In/Out** (54.5% responden membutuhkan)
- **Keyboard Navigation**
- **ARIA Labels**
- **High Contrast Mode**
- **Screen Reader Support**

### **Standar Aksesibilitas**
- Kontras warna minimal 4.5:1
- Touch target minimal 44px (mobile: 48px)
- Focus states yang jelas
- Semantic HTML structure

---

## 🏥 **Komponen Medis Khusus**

### **Vital Signs Display**
```jsx
<div className="vital-signs">
  <div className="vital-item">
    <span className="vital-label">BP</span>
    <span className="vital-value">140/90</span>
  </div>
  <div className="vital-item">
    <span className="vital-label">HR</span>
    <span className="vital-value">95</span>
  </div>
  <div className="vital-item">
    <span className="vital-label">Temp</span>
    <span className="vital-value">37.2°C</span>
  </div>
  <div className="vital-item">
    <span className="vital-label">SpO2</span>
    <span className="vital-value">98%</span>
  </div>
</div>
```

### **Medical Status Indicators**
```jsx
<div className="medical-status critical">
  <span className="status-icon">🚨</span>
  <span className="status-text">Kritis</span>
</div>
```

### **Room Layout Indicators**
```jsx
<div className="room-indicator room-emergency">
  IGD A - Kritis
</div>
<div className="room-indicator room-trauma">
  IGD B - Trauma
</div>
<div className="room-indicator room-general">
  IGD C - Umum
</div>
```

---

## 🎯 **Performance Requirements**

### **Target Performance**
- **Loading Time**: < 3 detik (72.7% responden mengharapkan)
- **Server Response**: Target 45ms
- **Database Status**: Real-time monitoring
- **API Status**: Active monitoring

---

## 📊 **Metrik Keberhasilan**

### **Target Metrics**
1. **Usability**: 90% pengguna merasa desain mudah digunakan
2. **Accessibility**: 100% fitur dapat diakses dengan keyboard
3. **Performance**: Loading time < 3 detik pada 95% kasus
4. **User Satisfaction**: Minimal 4.0 dari skala 5

---

## 🚀 **Cara Menggunakan Design System**

### **1. Import Design System**
```jsx
import './styles/design-system.css';
```

### **2. Import Komponen**
```jsx
import { Button, Card, Input, StatusIndicator } from './components/ui';
```

### **3. Gunakan Komponen**
```jsx
function PatientForm() {
  return (
    <Card variant="medical">
      <Card.Header>
        <Card.Title>Data Pasien Baru</Card.Title>
      </Card.Header>
      <Card.Body>
        <Input.Medical 
          label="Nama Lengkap"
          placeholder="Masukkan nama lengkap..."
          required
        />
        <Input.Medical 
          label="Tanggal Lahir"
          type="date"
        />
        <StatusIndicator 
          status="stable" 
          priority="P3"
        />
      </Card.Body>
      <Card.Footer>
        <Button variant="primary" icon="💾">
          Simpan Data
        </Button>
        <Button variant="secondary">
          Batal
        </Button>
      </Card.Footer>
    </Card>
  );
}
```

---

## 🔄 **Roadmap Perombakan Design**

### **Fase 1: Design System Foundation** ✅
- [x] Buat design system berdasarkan user research
- [x] Implementasi komponen UI dasar (Button, Card, Input, StatusIndicator)
- [x] Setup responsive design dan aksesibilitas

### **Fase 2: Komponen Medis Spesifik** ✅
- [x] Komponen PatientForm
- [x] Komponen ReferralForm
- [x] Komponen MultiStepReferralForm (Enhanced)
- [x] Komponen VitalSignsMonitor
- [ ] Komponen AmbulanceTracker

### **Fase 3: Layout dan Navigation** (Selanjutnya)
- [ ] Update Navigation component
- [ ] Implementasi sidebar navigation
- [ ] Breadcrumb navigation
- [ ] Mobile navigation

### **Fase 4: Dashboard Enhancement** (Selanjutnya)
- [ ] Update dashboard dengan komponen baru
- [ ] Implementasi real-time updates
- [ ] Chart dan grafik medis
- [ ] Notification system

### **Fase 5: Optimasi dan Testing** (Selanjutnya)
- [ ] Performance optimization
- [ ] User testing
- [ ] Accessibility audit
- [ ] Cross-browser testing

---

## 📚 **Referensi**

### **User Research**
- **Total Responden**: 22 orang dari 3 rumah sakit
- **Metode**: Wawancara mendalam + Kuesioner
- **Profil Responden**: Dokter Spesialis (8), Perawat (7), Admin Medis (4), Koordinator Rujukan (3)

### **Masalah Utama yang Ditemukan**
1. Navigasi Rumit (81.8% responden)
2. Informasi Tidak Real-time (72.7% responden)
3. Kesalahan Input Data (68.2% responden)
4. Tidak Ada Panduan Jelas (63.6% responden)
5. Ketidakpastian Lokasi Ambulans (59.1% responden)

### **Kebutuhan Prioritas Pengguna**
1. Antarmuka Sederhana
2. Navigasi yang Jelas
3. Informasi Real-time
4. Validasi Otomatis
5. Integrasi GPS

---

*Design system ini akan terus dikembangkan berdasarkan feedback pengguna dan kebutuhan medis yang berkembang.*
