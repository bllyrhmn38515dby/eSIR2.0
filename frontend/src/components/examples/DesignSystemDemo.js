import React, { useState } from 'react';
import { Button, Card, Input, StatusIndicator } from '../ui';
import { PatientForm, ReferralForm, MultiStepReferralForm, VitalSignsMonitor } from '../medical';
import './DesignSystemDemo.css';

const DesignSystemDemo = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    oxygenSaturation: ''
  });

  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  // Mock data untuk demo
  const patients = [
    {
      id: 'P001',
      name: 'John Doe',
      age: 45,
      gender: 'Laki-laki',
      status: 'critical',
      diagnosis: 'Chest Pain',
      room: 'IGD A-01',
      admissionTime: '14:30',
      priority: 'P1',
      vitalSigns: {
        bp: '140/90',
        hr: '95',
        temp: '37.2°C',
        spo2: '98%'
      }
    },
    {
      id: 'P002',
      name: 'Jane Smith',
      age: 32,
      gender: 'Perempuan',
      status: 'stable',
      diagnosis: 'Fracture Arm',
      room: 'IGD B-02',
      admissionTime: '15:15',
      priority: 'P3',
      vitalSigns: {
        bp: '120/80',
        hr: '78',
        temp: '36.8°C',
        spo2: '99%'
      }
    },
    {
      id: 'P003',
      name: 'Robert Johnson',
      age: 67,
      gender: 'Laki-laki',
      status: 'urgent',
      diagnosis: 'Stroke',
      room: 'IGD A-03',
      admissionTime: '16:00',
      priority: 'P2',
      vitalSigns: {
        bp: '160/95',
        hr: '110',
        temp: '37.5°C',
        spo2: '95%'
      }
    }
  ];

  const stats = [
    { title: 'Total Pasien', value: '1,247', icon: '👥', trend: 12 },
    { title: 'Rujukan Aktif', value: '23', icon: '📋', trend: -3 },
    { title: 'Ambulance Tersedia', value: '8', icon: '🚑', trend: 2 },
    { title: 'Faskes Aktif', value: '45', icon: '🏥', trend: 0 }
  ];

  return (
    <div className="design-system-demo">
      <div className="demo-header">
        <h1>eSIR 2.0 Design System Demo</h1>
        <p>Implementasi komponen UI berdasarkan hasil penelitian user (22 responden dari 3 rumah sakit)</p>
      </div>

      {/* Button Examples */}
      <section className="demo-section">
        <h2>Button Components</h2>
        <div className="button-examples">
          <div className="button-group">
            <h3>Variants</h3>
            <Button variant="primary" icon="🏥">Primary</Button>
            <Button variant="secondary" icon="📋">Secondary</Button>
            <Button variant="success" icon="✅">Success</Button>
            <Button variant="danger" icon="🚨">Danger</Button>
            <Button variant="warning" icon="⚠️">Warning</Button>
            <Button variant="outline" icon="📄">Outline</Button>
            <Button variant="ghost" icon="👻">Ghost</Button>
          </div>
          
          <div className="button-group">
            <h3>Sizes</h3>
            <Button size="sm" icon="🔍">Small</Button>
            <Button size="md" icon="📊">Medium</Button>
            <Button size="lg" icon="🚀">Large</Button>
          </div>
          
          <div className="button-group">
            <h3>States</h3>
            <Button icon="💾" loading={false}>Normal</Button>
            <Button icon="⏳" loading={true}>Loading</Button>
            <Button icon="🚫" disabled>Disabled</Button>
          </div>
        </div>
      </section>

      {/* Status Indicator Examples */}
      <section className="demo-section">
        <h2>Status Indicators</h2>
        <div className="status-examples">
          <div className="status-group">
            <h3>Patient Status</h3>
            <StatusIndicator status="critical" priority="P1" animated />
            <StatusIndicator status="urgent" priority="P2" />
            <StatusIndicator status="stable" priority="P3" />
            <StatusIndicator status="discharged" priority="P4" />
          </div>
          
          <div className="status-group">
            <h3>System Status</h3>
            <StatusIndicator.System isOnline={true} />
            <StatusIndicator.System isOnline={false} />
          </div>
          
          <div className="status-group">
            <h3>Sizes</h3>
            <StatusIndicator status="critical" size="sm" />
            <StatusIndicator status="critical" size="md" />
            <StatusIndicator status="critical" size="lg" />
          </div>
        </div>
      </section>

      {/* Input Examples */}
      <section className="demo-section">
        <h2>Input Components</h2>
        <div className="input-examples">
          <div className="input-group">
            <h3>Basic Inputs</h3>
            <Input 
              label="Nama Pasien"
              placeholder="Masukkan nama lengkap..."
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
            <Input 
              label="Email"
              type="email"
              placeholder="email@rumahsakit.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
            <Input 
              label="Telepon"
              type="tel"
              placeholder="+62 812-3456-7890"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
          </div>
          
          <div className="input-group">
            <h3>Medical Inputs</h3>
            <Input.Medical 
              label="Tanggal Lahir"
              type="date"
              value={formData.birthDate}
              onChange={(e) => handleInputChange('birthDate', e.target.value)}
            />
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
          </div>
          
          <div className="input-group">
            <h3>Search Input</h3>
            <Input.Search 
              placeholder="Cari pasien berdasarkan nama atau ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClear={handleClearSearch}
            />
          </div>
        </div>
      </section>

      {/* Card Examples */}
      <section className="demo-section">
        <h2>Card Components</h2>
        <div className="card-examples">
          <div className="card-group">
            <h3>Stat Cards</h3>
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <Card.Stat
                  key={index}
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  trend={stat.trend}
                />
              ))}
            </div>
          </div>
          
          <div className="card-group">
            <h3>Patient Cards</h3>
            <div className="patients-grid">
              {patients.map((patient) => (
                <Card.Patient
                  key={patient.id}
                  patient={patient}
                  onClick={() => console.log('Patient clicked:', patient)}
                />
              ))}
            </div>
          </div>
          
          <div className="card-group">
            <h3>Form Card</h3>
            <Card variant="medical">
              <Card.Header>
                <Card.Title>Form Data Pasien</Card.Title>
              </Card.Header>
              <Card.Body>
                <form onSubmit={handleSubmit}>
                  <Input 
                    label="Nama Lengkap"
                    placeholder="Masukkan nama lengkap..."
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                  <Input 
                    label="Email"
                    type="email"
                    placeholder="email@rumahsakit.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                  <Input.VitalSigns 
                    label="Tekanan Darah"
                    value={formData.bloodPressure}
                    onChange={(e) => handleInputChange('bloodPressure', e.target.value)}
                    unit="mmHg"
                  />
                </form>
              </Card.Body>
              <Card.Footer>
                <Button variant="primary" icon="💾" type="submit">
                  Simpan Data
                </Button>
                <Button variant="secondary">
                  Batal
                </Button>
              </Card.Footer>
            </Card>
          </div>
        </div>
      </section>

      {/* Color Palette Demo */}
      <section className="demo-section">
        <h2>Color Palette</h2>
        <div className="color-palette-demo">
          <div className="color-group">
            <h3>Primary Colors</h3>
            <div className="color-swatches">
              <div className="color-swatch primary-500">
                <span className="color-name">Primary</span>
                <span className="color-code">#1E40AF</span>
              </div>
              <div className="color-swatch secondary-500">
                <span className="color-name">Secondary</span>
                <span className="color-code">#059669</span>
              </div>
              <div className="color-swatch accent-500">
                <span className="color-name">Accent</span>
                <span className="color-code">#DC2626</span>
              </div>
            </div>
          </div>
          
          <div className="color-group">
            <h3>Status Colors</h3>
            <div className="color-swatches">
              <div className="color-swatch status-critical">
                <span className="color-name">Critical</span>
                <span className="color-code">#DC2626</span>
              </div>
              <div className="color-swatch status-urgent">
                <span className="color-name">Urgent</span>
                <span className="color-code">#F59E0B</span>
              </div>
              <div className="color-swatch status-stable">
                <span className="color-name">Stable</span>
                <span className="color-code">#059669</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Medical Components Demo */}
      <section className="demo-section">
        <h2>Medical Components</h2>
        <div className="medical-components-demo">
          <div className="medical-component-group">
            <h3>Patient Form</h3>
            <PatientForm
              mode="create"
              onSubmit={(data) => console.log('Patient submitted:', data)}
              onCancel={() => console.log('Patient form cancelled')}
            />
          </div>
          
          <div className="medical-component-group">
            <h3>Multi-Step Referral Form</h3>
            <MultiStepReferralForm
              mode="create"
              patients={patients}
              faskes={[
                { id: 'F001', nama: 'RS Jantung Harapan', tipe: 'Rumah Sakit', dokterKontak: 'Dr. Ahmad', teleponKontak: '021-1234567' },
                { id: 'F002', nama: 'Puskesmas Jakarta', tipe: 'Puskesmas', dokterKontak: 'Dr. Siti', teleponKontak: '021-7654321' }
              ]}
              onSubmit={(data) => console.log('Multi-step referral submitted:', data)}
              onCancel={() => console.log('Multi-step referral form cancelled')}
            />
          </div>
          
          <div className="medical-component-group">
            <h3>Traditional Referral Form</h3>
            <ReferralForm
              mode="create"
              patients={patients}
              faskes={[
                { id: 'F001', nama: 'RS Jantung Harapan', tipe: 'Rumah Sakit', dokterKontak: 'Dr. Ahmad', teleponKontak: '021-1234567' },
                { id: 'F002', nama: 'Puskesmas Jakarta', tipe: 'Puskesmas', dokterKontak: 'Dr. Siti', teleponKontak: '021-7654321' }
              ]}
              onSubmit={(data) => console.log('Referral submitted:', data)}
              onCancel={() => console.log('Referral form cancelled')}
            />
          </div>
          
          <div className="medical-component-group">
            <h3>Vital Signs Monitor</h3>
            <VitalSignsMonitor
              patientId="P001"
              vitalSigns={{
                bloodPressure: { systolic: 140, diastolic: 90 },
                heartRate: 95,
                temperature: 37.2,
                oxygenSaturation: 98,
                respiratoryRate: 18,
                bloodSugar: 120,
                weight: 70,
                height: 170
              }}
              realTime={true}
              onUpdate={(vitals) => console.log('Vitals updated:', vitals)}
            />
          </div>
        </div>
      </section>

      {/* Typography Demo */}
      <section className="demo-section">
        <h2>Typography</h2>
        <div className="typography-demo">
          <h1 className="font-h1">Heading 1 (24px)</h1>
          <h2 className="font-h2">Heading 2 (20px)</h2>
          <h3 className="font-h3">Heading 3 (18px)</h3>
          <p className="font-body">Body Text (16px) - Sans-serif font family dengan readability yang optimal untuk aplikasi medis.</p>
          <span className="font-caption">Caption Text (14px)</span>
        </div>
      </section>
    </div>
  );
};

export default DesignSystemDemo;
