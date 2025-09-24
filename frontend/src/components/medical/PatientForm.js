import React, { useState, useEffect } from 'react';
import { Button, Card, Input, StatusIndicator } from '../ui';
import './PatientForm.css';

const PatientForm = ({ 
  patient = null,
  onSubmit,
  onCancel,
  mode = 'create', // 'create' | 'edit' | 'view'
  className = '',
  ...props 
}) => {
  const [formData, setFormData] = useState({
    // Data Pribadi
    nama: '',
    nik: '',
    tanggalLahir: '',
    jenisKelamin: '',
    alamat: '',
    telepon: '',
    email: '',
    
    // Data Medis
    golonganDarah: '',
    alergi: '',
    riwayatPenyakit: '',
    obatRutin: '',
    
    // Data Darurat
    namaKeluarga: '',
    teleponKeluarga: '',
    hubunganKeluarga: '',
    
    // Data Vital Signs
    tekananDarah: '',
    denyutJantung: '',
    suhuTubuh: '',
    saturasiOksigen: '',
    beratBadan: '',
    tinggiBadan: '',
    
    // Data Status
    status: 'stable',
    priority: 'P4',
    diagnosis: '',
    ruang: '',
    waktuMasuk: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load patient data if editing
  useEffect(() => {
    if (patient && mode === 'edit') {
      setFormData(prev => ({
        ...prev,
        ...patient
      }));
    }
  }, [patient, mode]);

  // Auto-generate patient ID
  useEffect(() => {
    if (mode === 'create') {
      setFormData(prev => {
        if (!prev.id) {
          const timestamp = Date.now().toString().slice(-6);
          const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
          return {
            ...prev,
            id: `P${timestamp}${randomNum}`
          };
        }
        return prev;
      });
    }
  }, [mode]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    const requiredFields = {
      nama: 'Nama lengkap',
      nik: 'NIK',
      tanggalLahir: 'Tanggal lahir',
      jenisKelamin: 'Jenis kelamin',
      telepon: 'Nomor telepon',
      alamat: 'Alamat'
    };

    Object.entries(requiredFields).forEach(([field, label]) => {
      if (!formData[field] || formData[field].trim() === '') {
        newErrors[field] = `${label} harus diisi`;
      }
    });

    // NIK validation (16 digits)
    if (formData.nik && !/^\d{16}$/.test(formData.nik)) {
      newErrors.nik = 'NIK harus terdiri dari 16 digit angka';
    }

    // Phone validation
    if (formData.telepon && !/^(\+62|62|0)[0-9]{9,13}$/.test(formData.telepon.replace(/\s/g, ''))) {
      newErrors.telepon = 'Format nomor telepon tidak valid';
    }

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    // Age validation
    if (formData.tanggalLahir) {
      const birthDate = new Date(formData.tanggalLahir);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 0 || age > 150) {
        newErrors.tanggalLahir = 'Tanggal lahir tidak valid';
      }
    }

    // Vital signs validation
    if (formData.tekananDarah && !/^\d{2,3}\/\d{2,3}$/.test(formData.tekananDarah)) {
      newErrors.tekananDarah = 'Format tekanan darah: sistolik/diastolik (contoh: 120/80)';
    }

    if (formData.denyutJantung && (isNaN(formData.denyutJantung) || formData.denyutJantung < 30 || formData.denyutJantung > 200)) {
      newErrors.denyutJantung = 'Denyut jantung harus antara 30-200 bpm';
    }

    if (formData.suhuTubuh && (isNaN(formData.suhuTubuh) || formData.suhuTubuh < 30 || formData.suhuTubuh > 45)) {
      newErrors.suhuTubuh = 'Suhu tubuh harus antara 30-45°C';
    }

    if (formData.saturasiOksigen && (isNaN(formData.saturasiOksigen) || formData.saturasiOksigen < 70 || formData.saturasiOksigen > 100)) {
      newErrors.saturasiOksigen = 'Saturasi oksigen harus antara 70-100%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Add timestamp for new patients
      const submitData = {
        ...formData,
        waktuMasuk: mode === 'create' ? new Date().toISOString() : formData.waktuMasuk,
        updatedAt: new Date().toISOString()
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const isReadOnly = mode === 'view';
  const formTitle = mode === 'create' ? 'Tambah Pasien Baru' : 
                   mode === 'edit' ? 'Edit Data Pasien' : 
                   'Detail Pasien';

  return (
    <div className={`patient-form ${className}`} {...props}>
      <Card variant="medical">
        <Card.Header>
          <Card.Title>{formTitle}</Card.Title>
          {mode === 'view' && (
            <StatusIndicator 
              status={formData.status} 
              priority={formData.priority}
              animated={formData.status === 'critical'}
            />
          )}
        </Card.Header>

        <Card.Body>
          <form onSubmit={handleSubmit} className="patient-form-content">
            {/* Data Pribadi */}
            <section className="form-section">
              <h3 className="section-title">
                <span className="section-icon">👤</span>
                Data Pribadi
              </h3>
              
              <div className="form-grid">
                <Input
                  label="ID Pasien"
                  value={formData.id || ''}
                  disabled
                  help="ID otomatis generated"
                />
                
                <Input
                  label="Nama Lengkap"
                  placeholder="Masukkan nama lengkap..."
                  value={formData.nama}
                  onChange={(e) => handleInputChange('nama', e.target.value)}
                  error={errors.nama}
                  required
                  disabled={isReadOnly}
                />
                
                <Input
                  label="NIK"
                  placeholder="Masukkan 16 digit NIK..."
                  value={formData.nik}
                  onChange={(e) => handleInputChange('nik', e.target.value)}
                  error={errors.nik}
                  required
                  disabled={isReadOnly}
                  maxLength={16}
                />
                
                <Input
                  label="Tanggal Lahir"
                  type="date"
                  value={formData.tanggalLahir}
                  onChange={(e) => handleInputChange('tanggalLahir', e.target.value)}
                  error={errors.tanggalLahir}
                  required
                  disabled={isReadOnly}
                />
                
                <div className="form-group">
                  <label className="form-label">Jenis Kelamin</label>
                  <select
                    className="form-input"
                    value={formData.jenisKelamin}
                    onChange={(e) => handleInputChange('jenisKelamin', e.target.value)}
                    disabled={isReadOnly}
                    required
                  >
                    <option value="">Pilih jenis kelamin</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                  {errors.jenisKelamin && (
                    <div className="form-error">{errors.jenisKelamin}</div>
                  )}
                </div>
                
                <Input
                  label="Nomor Telepon"
                  type="tel"
                  placeholder="+62 812-3456-7890"
                  value={formData.telepon}
                  onChange={(e) => handleInputChange('telepon', e.target.value)}
                  error={errors.telepon}
                  required
                  disabled={isReadOnly}
                />
                
                <Input
                  label="Email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={errors.email}
                  disabled={isReadOnly}
                />
                
                <div className="form-group full-width">
                  <label className="form-label">Alamat Lengkap</label>
                  <textarea
                    className="form-input form-textarea"
                    placeholder="Masukkan alamat lengkap..."
                    value={formData.alamat}
                    onChange={(e) => handleInputChange('alamat', e.target.value)}
                    disabled={isReadOnly}
                    required
                    rows={3}
                  />
                  {errors.alamat && (
                    <div className="form-error">{errors.alamat}</div>
                  )}
                </div>
              </div>
            </section>

            {/* Data Medis */}
            <section className="form-section">
              <h3 className="section-title">
                <span className="section-icon">🩺</span>
                Data Medis
              </h3>
              
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Golongan Darah</label>
                  <select
                    className="form-input"
                    value={formData.golonganDarah}
                    onChange={(e) => handleInputChange('golonganDarah', e.target.value)}
                    disabled={isReadOnly}
                  >
                    <option value="">Pilih golongan darah</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                
                <div className="form-group full-width">
                  <label className="form-label">Alergi</label>
                  <textarea
                    className="form-input form-textarea"
                    placeholder="Masukkan alergi yang diketahui (jika ada)..."
                    value={formData.alergi}
                    onChange={(e) => handleInputChange('alergi', e.target.value)}
                    disabled={isReadOnly}
                    rows={2}
                  />
                </div>
                
                <div className="form-group full-width">
                  <label className="form-label">Riwayat Penyakit</label>
                  <textarea
                    className="form-input form-textarea"
                    placeholder="Masukkan riwayat penyakit..."
                    value={formData.riwayatPenyakit}
                    onChange={(e) => handleInputChange('riwayatPenyakit', e.target.value)}
                    disabled={isReadOnly}
                    rows={2}
                  />
                </div>
                
                <div className="form-group full-width">
                  <label className="form-label">Obat Rutin</label>
                  <textarea
                    className="form-input form-textarea"
                    placeholder="Masukkan obat yang dikonsumsi rutin..."
                    value={formData.obatRutin}
                    onChange={(e) => handleInputChange('obatRutin', e.target.value)}
                    disabled={isReadOnly}
                    rows={2}
                  />
                </div>
              </div>
            </section>

            {/* Vital Signs */}
            <section className="form-section">
              <h3 className="section-title">
                <span className="section-icon">📊</span>
                Vital Signs
              </h3>
              
              <div className="form-grid">
                <Input.VitalSigns
                  label="Tekanan Darah"
                  placeholder="120/80"
                  value={formData.tekananDarah}
                  onChange={(e) => handleInputChange('tekananDarah', e.target.value)}
                  unit="mmHg"
                  error={errors.tekananDarah}
                  disabled={isReadOnly}
                />
                
                <Input.VitalSigns
                  label="Denyut Jantung"
                  placeholder="72"
                  value={formData.denyutJantung}
                  onChange={(e) => handleInputChange('denyutJantung', e.target.value)}
                  unit="bpm"
                  error={errors.denyutJantung}
                  disabled={isReadOnly}
                />
                
                <Input.VitalSigns
                  label="Suhu Tubuh"
                  placeholder="36.5"
                  value={formData.suhuTubuh}
                  onChange={(e) => handleInputChange('suhuTubuh', e.target.value)}
                  unit="°C"
                  error={errors.suhuTubuh}
                  disabled={isReadOnly}
                />
                
                <Input.VitalSigns
                  label="Saturasi Oksigen"
                  placeholder="98"
                  value={formData.saturasiOksigen}
                  onChange={(e) => handleInputChange('saturasiOksigen', e.target.value)}
                  unit="%"
                  error={errors.saturasiOksigen}
                  disabled={isReadOnly}
                />
                
                <Input.VitalSigns
                  label="Berat Badan"
                  placeholder="70"
                  value={formData.beratBadan}
                  onChange={(e) => handleInputChange('beratBadan', e.target.value)}
                  unit="kg"
                  disabled={isReadOnly}
                />
                
                <Input.VitalSigns
                  label="Tinggi Badan"
                  placeholder="170"
                  value={formData.tinggiBadan}
                  onChange={(e) => handleInputChange('tinggiBadan', e.target.value)}
                  unit="cm"
                  disabled={isReadOnly}
                />
              </div>
            </section>

            {/* Data Darurat */}
            <section className="form-section">
              <h3 className="section-title">
                <span className="section-icon">🚨</span>
                Kontak Darurat
              </h3>
              
              <div className="form-grid">
                <Input
                  label="Nama Keluarga"
                  placeholder="Masukkan nama keluarga..."
                  value={formData.namaKeluarga}
                  onChange={(e) => handleInputChange('namaKeluarga', e.target.value)}
                  disabled={isReadOnly}
                />
                
                <Input
                  label="Telepon Keluarga"
                  type="tel"
                  placeholder="+62 812-3456-7890"
                  value={formData.teleponKeluarga}
                  onChange={(e) => handleInputChange('teleponKeluarga', e.target.value)}
                  disabled={isReadOnly}
                />
                
                <div className="form-group">
                  <label className="form-label">Hubungan</label>
                  <select
                    className="form-input"
                    value={formData.hubunganKeluarga}
                    onChange={(e) => handleInputChange('hubunganKeluarga', e.target.value)}
                    disabled={isReadOnly}
                  >
                    <option value="">Pilih hubungan</option>
                    <option value="Suami/Istri">Suami/Istri</option>
                    <option value="Anak">Anak</option>
                    <option value="Orang Tua">Orang Tua</option>
                    <option value="Saudara">Saudara</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Data Status (untuk edit/view) */}
            {(mode === 'edit' || mode === 'view') && (
              <section className="form-section">
                <h3 className="section-title">
                  <span className="section-icon">📋</span>
                  Status Pasien
                </h3>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                      className="form-input"
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      disabled={isReadOnly}
                    >
                      <option value="stable">Stabil</option>
                      <option value="urgent">Darurat</option>
                      <option value="critical">Kritis</option>
                      <option value="discharged">Pulang</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Prioritas</label>
                    <select
                      className="form-input"
                      value={formData.priority}
                      onChange={(e) => handleInputChange('priority', e.target.value)}
                      disabled={isReadOnly}
                    >
                      <option value="P4">P4 - Standar</option>
                      <option value="P3">P3 - Urgent</option>
                      <option value="P2">P2 - Darurat</option>
                      <option value="P1">P1 - Resusitasi</option>
                    </select>
                  </div>
                  
                  <div className="form-group full-width">
                    <label className="form-label">Diagnosis</label>
                    <textarea
                      className="form-input form-textarea"
                      placeholder="Masukkan diagnosis..."
                      value={formData.diagnosis}
                      onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                      disabled={isReadOnly}
                      rows={2}
                    />
                  </div>
                  
                  <Input
                    label="Ruang"
                    placeholder="IGD A-01"
                    value={formData.ruang}
                    onChange={(e) => handleInputChange('ruang', e.target.value)}
                    disabled={isReadOnly}
                  />
                  
                  <Input
                    label="Waktu Masuk"
                    type="datetime-local"
                    value={formData.waktuMasuk ? new Date(formData.waktuMasuk).toISOString().slice(0, 16) : ''}
                    onChange={(e) => handleInputChange('waktuMasuk', e.target.value)}
                    disabled={isReadOnly}
                  />
                </div>
              </section>
            )}
          </form>
        </Card.Body>

        {!isReadOnly && (
          <Card.Footer>
            <div className="form-actions">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="primary"
                icon="💾"
                loading={isSubmitting}
                onClick={handleSubmit}
              >
                {mode === 'create' ? 'Simpan Pasien' : 'Update Pasien'}
              </Button>
            </div>
          </Card.Footer>
        )}
      </Card>
    </div>
  );
};

export default PatientForm;
