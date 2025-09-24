import React, { useState, useEffect } from 'react';
import { Button, Card, Input, StatusIndicator } from '../ui';
import './ReferralForm.css';

const ReferralForm = ({ 
  referral = null,
  patients = [],
  faskes = [],
  onSubmit,
  onCancel,
  mode = 'create', // 'create' | 'edit' | 'view'
  className = '',
  ...props 
}) => {
  const [formData, setFormData] = useState({
    // Data Rujukan
    id: '',
    tanggalRujukan: '',
    waktuRujukan: '',
    
    // Data Pasien
    pasienId: '',
    namaPasien: '',
    umurPasien: '',
    jenisKelaminPasien: '',
    
    // Data Pengirim
    faskesPengirim: '',
    dokterPengirim: '',
    teleponPengirim: '',
    
    // Data Penerima
    faskesPenerima: '',
    dokterPenerima: '',
    teleponPenerima: '',
    
    // Data Medis
    diagnosis: '',
    keluhan: '',
    pemeriksaanFisik: '',
    hasilLaboratorium: '',
    tindakanYangDilakukan: '',
    obatYangDiberikan: '',
    
    // Data Transportasi
    jenisTransportasi: 'ambulance',
    kondisiPasien: 'stable',
    prioritas: 'P3',
    estimasiWaktu: '',
    
    // Data Status
    status: 'pending',
    catatan: '',
    lampiran: []
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedFaskesPenerima, setSelectedFaskesPenerima] = useState(null);

  // Load referral data if editing
  useEffect(() => {
    if (referral && mode === 'edit') {
      setFormData(prev => ({
        ...prev,
        ...referral
      }));
      
      // Find selected patient
      const patient = patients.find(p => p.id === referral.pasienId);
      if (patient) {
        setSelectedPatient(patient);
      }
      
      // Find selected faskes
      const faskesData = faskes.find(f => f.id === referral.faskesPenerima);
      if (faskesData) {
        setSelectedFaskesPenerima(faskesData);
      }
    }
  }, [referral, mode, patients, faskes]);

  // Auto-generate referral ID
  useEffect(() => {
    if (mode === 'create') {
      setFormData(prev => {
        if (!prev.id) {
          const timestamp = Date.now().toString().slice(-6);
          const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
          return {
            ...prev,
            id: `R${timestamp}${randomNum}`,
            tanggalRujukan: new Date().toISOString().split('T')[0],
            waktuRujukan: new Date().toTimeString().slice(0, 5)
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

  const handlePatientSelect = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      setSelectedPatient(patient);
      setFormData(prev => ({
        ...prev,
        pasienId: patient.id,
        namaPasien: patient.nama,
        umurPasien: calculateAge(patient.tanggalLahir),
        jenisKelaminPasien: patient.jenisKelamin
      }));
    }
  };

  const handleFaskesSelect = (faskesId) => {
    const faskesData = faskes.find(f => f.id === faskesId);
    if (faskesData) {
      setSelectedFaskesPenerima(faskesData);
      setFormData(prev => ({
        ...prev,
        faskesPenerima: faskesData.id,
        dokterPenerima: faskesData.dokterKontak || '',
        teleponPenerima: faskesData.teleponKontak || ''
      }));
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return '';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    const requiredFields = {
      pasienId: 'Pasien',
      faskesPengirim: 'Faskes pengirim',
      faskesPenerima: 'Faskes penerima',
      diagnosis: 'Diagnosis',
      keluhan: 'Keluhan'
    };

    Object.entries(requiredFields).forEach(([field, label]) => {
      if (!formData[field] || formData[field].trim() === '') {
        newErrors[field] = `${label} harus diisi`;
      }
    });

    // Phone validation
    if (formData.teleponPengirim && !/^(\+62|62|0)[0-9]{9,13}$/.test(formData.teleponPengirim.replace(/\s/g, ''))) {
      newErrors.teleponPengirim = 'Format nomor telepon tidak valid';
    }

    if (formData.teleponPenerima && !/^(\+62|62|0)[0-9]{9,13}$/.test(formData.teleponPenerima.replace(/\s/g, ''))) {
      newErrors.teleponPenerima = 'Format nomor telepon tidak valid';
    }

    // Priority validation
    if (formData.prioritas === 'P1' && formData.jenisTransportasi !== 'ambulance') {
      newErrors.jenisTransportasi = 'Pasien P1 (Resusitasi) harus menggunakan ambulance';
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
      const submitData = {
        ...formData,
        createdAt: mode === 'create' ? new Date().toISOString() : formData.createdAt,
        updatedAt: new Date().toISOString(),
        patient: selectedPatient,
        faskesPenerimaData: selectedFaskesPenerima
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting referral:', error);
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
  const formTitle = mode === 'create' ? 'Buat Rujukan Baru' : 
                   mode === 'edit' ? 'Edit Data Rujukan' : 
                   'Detail Rujukan';


  return (
    <div className={`referral-form ${className}`} {...props}>
      <Card variant="medical">
        <Card.Header>
          <Card.Title>{formTitle}</Card.Title>
          {mode === 'view' && (
            <StatusIndicator 
              status={formData.status} 
              priority={formData.prioritas}
              animated={formData.status === 'pending'}
            />
          )}
        </Card.Header>

        <Card.Body>
          <form onSubmit={handleSubmit} className="referral-form-content">
            {/* Data Rujukan */}
            <section className="form-section">
              <h3 className="section-title">
                <span className="section-icon">📋</span>
                Data Rujukan
              </h3>
              
              <div className="form-grid">
                <Input
                  label="ID Rujukan"
                  value={formData.id || ''}
                  disabled
                  help="ID otomatis generated"
                />
                
                <Input
                  label="Tanggal Rujukan"
                  type="date"
                  value={formData.tanggalRujukan}
                  onChange={(e) => handleInputChange('tanggalRujukan', e.target.value)}
                  disabled={isReadOnly}
                  required
                />
                
                <Input
                  label="Waktu Rujukan"
                  type="time"
                  value={formData.waktuRujukan}
                  onChange={(e) => handleInputChange('waktuRujukan', e.target.value)}
                  disabled={isReadOnly}
                  required
                />
              </div>
            </section>

            {/* Data Pasien */}
            <section className="form-section">
              <h3 className="section-title">
                <span className="section-icon">👤</span>
                Data Pasien
              </h3>
              
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Pilih Pasien</label>
                  <select
                    className="form-input"
                    value={formData.pasienId}
                    onChange={(e) => handlePatientSelect(e.target.value)}
                    disabled={isReadOnly}
                    required
                  >
                    <option value="">Pilih pasien...</option>
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>
                        {patient.id} - {patient.nama} ({patient.jenisKelamin}, {calculateAge(patient.tanggalLahir)} tahun)
                      </option>
                    ))}
                  </select>
                  {errors.pasienId && (
                    <div className="form-error">{errors.pasienId}</div>
                  )}
                </div>
                
                {selectedPatient && (
                  <>
                    <Input
                      label="Nama Pasien"
                      value={formData.namaPasien}
                      disabled
                    />
                    
                    <Input
                      label="Umur"
                      value={formData.umurPasien}
                      disabled
                    />
                    
                    <Input
                      label="Jenis Kelamin"
                      value={formData.jenisKelaminPasien}
                      disabled
                    />
                  </>
                )}
              </div>
            </section>

            {/* Data Pengirim */}
            <section className="form-section">
              <h3 className="section-title">
                <span className="section-icon">🏥</span>
                Data Pengirim
              </h3>
              
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Faskes Pengirim</label>
                  <select
                    className="form-input"
                    value={formData.faskesPengirim}
                    onChange={(e) => handleInputChange('faskesPengirim', e.target.value)}
                    disabled={isReadOnly}
                    required
                  >
                    <option value="">Pilih faskes pengirim...</option>
                    {faskes.map(faskesData => (
                      <option key={faskesData.id} value={faskesData.id}>
                        {faskesData.nama} - {faskesData.tipe}
                      </option>
                    ))}
                  </select>
                  {errors.faskesPengirim && (
                    <div className="form-error">{errors.faskesPengirim}</div>
                  )}
                </div>
                
                <Input
                  label="Dokter Pengirim"
                  placeholder="Masukkan nama dokter..."
                  value={formData.dokterPengirim}
                  onChange={(e) => handleInputChange('dokterPengirim', e.target.value)}
                  disabled={isReadOnly}
                />
                
                <Input
                  label="Telepon Pengirim"
                  type="tel"
                  placeholder="+62 812-3456-7890"
                  value={formData.teleponPengirim}
                  onChange={(e) => handleInputChange('teleponPengirim', e.target.value)}
                  error={errors.teleponPengirim}
                  disabled={isReadOnly}
                />
              </div>
            </section>

            {/* Data Penerima */}
            <section className="form-section">
              <h3 className="section-title">
                <span className="section-icon">🏥</span>
                Data Penerima
              </h3>
              
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Faskes Penerima</label>
                  <select
                    className="form-input"
                    value={formData.faskesPenerima}
                    onChange={(e) => handleFaskesSelect(e.target.value)}
                    disabled={isReadOnly}
                    required
                  >
                    <option value="">Pilih faskes penerima...</option>
                    {faskes.map(faskesData => (
                      <option key={faskesData.id} value={faskesData.id}>
                        {faskesData.nama} - {faskesData.tipe}
                      </option>
                    ))}
                  </select>
                  {errors.faskesPenerima && (
                    <div className="form-error">{errors.faskesPenerima}</div>
                  )}
                </div>
                
                <Input
                  label="Dokter Penerima"
                  placeholder="Masukkan nama dokter..."
                  value={formData.dokterPenerima}
                  onChange={(e) => handleInputChange('dokterPenerima', e.target.value)}
                  disabled={isReadOnly}
                />
                
                <Input
                  label="Telepon Penerima"
                  type="tel"
                  placeholder="+62 812-3456-7890"
                  value={formData.teleponPenerima}
                  onChange={(e) => handleInputChange('teleponPenerima', e.target.value)}
                  error={errors.teleponPenerima}
                  disabled={isReadOnly}
                />
              </div>
            </section>

            {/* Data Medis */}
            <section className="form-section">
              <h3 className="section-title">
                <span className="section-icon">🩺</span>
                Data Medis
              </h3>
              
              <div className="form-grid">
                <div className="form-group full-width">
                  <label className="form-label">Diagnosis</label>
                  <textarea
                    className="form-input form-textarea"
                    placeholder="Masukkan diagnosis..."
                    value={formData.diagnosis}
                    onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                    disabled={isReadOnly}
                    required
                    rows={3}
                  />
                  {errors.diagnosis && (
                    <div className="form-error">{errors.diagnosis}</div>
                  )}
                </div>
                
                <div className="form-group full-width">
                  <label className="form-label">Keluhan</label>
                  <textarea
                    className="form-input form-textarea"
                    placeholder="Masukkan keluhan pasien..."
                    value={formData.keluhan}
                    onChange={(e) => handleInputChange('keluhan', e.target.value)}
                    disabled={isReadOnly}
                    required
                    rows={3}
                  />
                  {errors.keluhan && (
                    <div className="form-error">{errors.keluhan}</div>
                  )}
                </div>
                
                <div className="form-group full-width">
                  <label className="form-label">Pemeriksaan Fisik</label>
                  <textarea
                    className="form-input form-textarea"
                    placeholder="Masukkan hasil pemeriksaan fisik..."
                    value={formData.pemeriksaanFisik}
                    onChange={(e) => handleInputChange('pemeriksaanFisik', e.target.value)}
                    disabled={isReadOnly}
                    rows={3}
                  />
                </div>
                
                <div className="form-group full-width">
                  <label className="form-label">Hasil Laboratorium</label>
                  <textarea
                    className="form-input form-textarea"
                    placeholder="Masukkan hasil laboratorium..."
                    value={formData.hasilLaboratorium}
                    onChange={(e) => handleInputChange('hasilLaboratorium', e.target.value)}
                    disabled={isReadOnly}
                    rows={3}
                  />
                </div>
                
                <div className="form-group full-width">
                  <label className="form-label">Tindakan yang Dilakukan</label>
                  <textarea
                    className="form-input form-textarea"
                    placeholder="Masukkan tindakan yang telah dilakukan..."
                    value={formData.tindakanYangDilakukan}
                    onChange={(e) => handleInputChange('tindakanYangDilakukan', e.target.value)}
                    disabled={isReadOnly}
                    rows={3}
                  />
                </div>
                
                <div className="form-group full-width">
                  <label className="form-label">Obat yang Diberikan</label>
                  <textarea
                    className="form-input form-textarea"
                    placeholder="Masukkan obat yang telah diberikan..."
                    value={formData.obatYangDiberikan}
                    onChange={(e) => handleInputChange('obatYangDiberikan', e.target.value)}
                    disabled={isReadOnly}
                    rows={3}
                  />
                </div>
              </div>
            </section>

            {/* Data Transportasi */}
            <section className="form-section">
              <h3 className="section-title">
                <span className="section-icon">🚑</span>
                Data Transportasi
              </h3>
              
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Jenis Transportasi</label>
                  <select
                    className="form-input"
                    value={formData.jenisTransportasi}
                    onChange={(e) => handleInputChange('jenisTransportasi', e.target.value)}
                    disabled={isReadOnly}
                  >
                    <option value="ambulance">Ambulance</option>
                    <option value="mobil_pribadi">Mobil Pribadi</option>
                    <option value="motor">Motor</option>
                    <option value="ojek">Ojek</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                  {errors.jenisTransportasi && (
                    <div className="form-error">{errors.jenisTransportasi}</div>
                  )}
                </div>
                
                <div className="form-group">
                  <label className="form-label">Kondisi Pasien</label>
                  <select
                    className="form-input"
                    value={formData.kondisiPasien}
                    onChange={(e) => handleInputChange('kondisiPasien', e.target.value)}
                    disabled={isReadOnly}
                  >
                    <option value="stable">Stabil</option>
                    <option value="urgent">Darurat</option>
                    <option value="critical">Kritis</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Prioritas</label>
                  <select
                    className="form-input"
                    value={formData.prioritas}
                    onChange={(e) => handleInputChange('prioritas', e.target.value)}
                    disabled={isReadOnly}
                  >
                    <option value="P4">P4 - Standar</option>
                    <option value="P3">P3 - Urgent</option>
                    <option value="P2">P2 - Darurat</option>
                    <option value="P1">P1 - Resusitasi</option>
                  </select>
                </div>
                
                <Input
                  label="Estimasi Waktu"
                  placeholder="Contoh: 30 menit"
                  value={formData.estimasiWaktu}
                  onChange={(e) => handleInputChange('estimasiWaktu', e.target.value)}
                  disabled={isReadOnly}
                />
              </div>
            </section>

            {/* Data Status (untuk edit/view) */}
            {(mode === 'edit' || mode === 'view') && (
              <section className="form-section">
                <h3 className="section-title">
                  <span className="section-icon">📊</span>
                  Status Rujukan
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
                      <option value="pending">Menunggu</option>
                      <option value="accepted">Diterima</option>
                      <option value="rejected">Ditolak</option>
                      <option value="completed">Selesai</option>
                    </select>
                  </div>
                  
                  <div className="form-group full-width">
                    <label className="form-label">Catatan</label>
                    <textarea
                      className="form-input form-textarea"
                      placeholder="Masukkan catatan tambahan..."
                      value={formData.catatan}
                      onChange={(e) => handleInputChange('catatan', e.target.value)}
                      disabled={isReadOnly}
                      rows={3}
                    />
                  </div>
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
                icon="📋"
                loading={isSubmitting}
                onClick={handleSubmit}
              >
                {mode === 'create' ? 'Buat Rujukan' : 'Update Rujukan'}
              </Button>
            </div>
          </Card.Footer>
        )}
      </Card>
    </div>
  );
};

export default ReferralForm;
