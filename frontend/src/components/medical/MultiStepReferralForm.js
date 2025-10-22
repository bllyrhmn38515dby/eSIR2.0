import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Button, Card, Input, StatusIndicator } from '../ui';
import './MultiStepReferralForm.css';

const MultiStepReferralForm = ({ 
  referral = null,
  patients = [],
  faskes = [],
  onSubmit,
  onCancel,
  mode = 'create', // 'create' | 'edit' | 'view'
  className = '',
  ...props 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps] = useState(5);
  const [formData, setFormData] = useState({
    // Step 1: Data Rujukan
    id: '',
    tanggalRujukan: '',
    waktuRujukan: '',
    
    // Step 2: Data Pasien
    pasienId: '',
    namaPasien: '',
    umurPasien: '',
    jenisKelaminPasien: '',
    tanggalLahirPasien: '',
    alamatPasien: '',
    teleponPasien: '',
    
    // Step 3: Data Pengirim & Penerima
    faskesPengirim: '',
    dokterPengirim: '',
    teleponPengirim: '',
    faskesPenerima: '',
    dokterPenerima: '',
    teleponPenerima: '',
    
    // Step 4: Data Medis
    diagnosis: '',
    keluhan: '',
    pemeriksaanFisik: '',
    hasilLaboratorium: '',
    tindakanYangDilakukan: '',
    obatYangDiberikan: '',
    
    // Step 5: Data Transportasi & Status
    jenisTransportasi: 'ambulance',
    kondisiPasien: 'stable',
    prioritas: 'P3',
    estimasiWaktu: '',
    status: 'pending',
    catatan: '',
    lampiran: []
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedFaskesPenerima, setSelectedFaskesPenerima] = useState(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved');
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // State untuk pencarian NIK
  const [searchNik, setSearchNik] = useState('');
  const [foundPasien, setFoundPasien] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isNewPasien, setIsNewPasien] = useState(false);

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

  // Auto-generate referral ID and set current time
  useEffect(() => {
    if (mode === 'create') {
      setFormData(prev => {
        const now = new Date();
        const currentDate = now.toISOString().split('T')[0];
        const currentTime = now.toTimeString().slice(0, 5);
        
        return {
          ...prev,
          id: prev.id || `R${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
          tanggalRujukan: prev.tanggalRujukan || currentDate,
          waktuRujukan: prev.waktuRujukan || currentTime
        };
      });
    }
  }, [mode]);

  // Update waktu rujukan to current time when form is opened (only if not manually set)
  useEffect(() => {
    if (mode === 'create' && !formData.waktuRujukan) {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5);
      setFormData(prev => ({
        ...prev,
        waktuRujukan: currentTime
      }));
    }
  }, [mode, formData.waktuRujukan]);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (mode === 'create' && Object.keys(formData).some(key => formData[key])) {
        localStorage.setItem('rujukanFormData', JSON.stringify(formData));
        setAutoSaveStatus('saving');
        setTimeout(() => setAutoSaveStatus('saved'), 1000);
      }
    }, 30000); // Auto-save every 30 seconds

    return () => {
      clearInterval(autoSaveInterval);
      if (window.autoSaveTimeout) {
        clearTimeout(window.autoSaveTimeout);
      }
    };
  }, [formData, mode]);

  // Load saved data on mount
  useEffect(() => {
    if (mode === 'create') {
      const savedData = localStorage.getItem('rujukanFormData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setFormData(prev => ({ ...prev, ...parsedData }));
      }
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

    // Auto-save indicator with debounce
    setAutoSaveStatus('saving');
    if (window.autoSaveTimeout) {
      clearTimeout(window.autoSaveTimeout);
    }
    const timeout = setTimeout(() => {
      if (mode === 'create') {
        localStorage.setItem('rujukanFormData', JSON.stringify({
          ...formData,
          [field]: value
        }));
      }
      setAutoSaveStatus('saved');
    }, 1000);
    
    // Store timeout reference for cleanup
    window.autoSaveTimeout = timeout;
  };

  // Fungsi pencarian pasien berdasarkan NIK
  const handleSearchPasien = async () => {
    if (!searchNik || searchNik.length !== 16) {
      setErrors(prev => ({ ...prev, searchNik: 'NIK harus 16 digit' }));
      return;
    }

    setIsSearching(true);
    setErrors(prev => ({ ...prev, searchNik: null }));

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await axios.get(`/api/pasien/search?nik=${searchNik}`, { headers });
      
      if (response.data.success && response.data.data) {
        const pasien = response.data.data;
        setFoundPasien(pasien);
        setIsNewPasien(false);
        
        // Auto-fill form dengan data pasien yang ditemukan
        setFormData(prev => ({
          ...prev,
          pasienId: searchNik, // Gunakan NIK sebagai pasienId untuk konsistensi
          namaPasien: pasien.nama_pasien, // Perbaiki field name dari nama_lengkap ke nama_pasien
          tanggalLahirPasien: pasien.tanggal_lahir,
          jenisKelaminPasien: pasien.jenis_kelamin,
          alamatPasien: pasien.alamat,
          teleponPasien: pasien.telepon || ''
        }));
        
        // Set selected patient untuk UI
        setSelectedPatient({
          id: pasien.id,
          nama: pasien.nama_pasien, // Perbaiki field name dari nama_lengkap ke nama_pasien
          tanggalLahir: pasien.tanggal_lahir,
          jenisKelamin: pasien.jenis_kelamin,
          alamat: pasien.alamat,
          telepon: pasien.telepon
        });
      } else {
        setFoundPasien(null);
        setIsNewPasien(true);
        
        // Set NIK untuk pasien baru
        setFormData(prev => ({
          ...prev,
          pasienId: searchNik // Gunakan NIK sebagai ID sementara
        }));
        
        setSelectedPatient(null);
      }
    } catch (error) {
      console.error('Error searching pasien:', error);
      setFoundPasien(null);
      setIsNewPasien(true);
      
      setFormData(prev => ({
        ...prev,
        pasienId: searchNik
      }));
      
      setSelectedPatient(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePatientSelect = (patientId) => {
    if (patientId === 'demo-patient') {
      // Demo patient data
      const demoPatient = {
        id: 'demo-patient',
        nik: '1234567890123456', // Tambahkan NIK untuk demo
        nama: 'Ahmad Susanto',
        tanggalLahir: '1989-01-15',
        jenisKelamin: 'L',
        alamat: 'Jl. Demo No. 123, Jakarta',
        telepon: '081234567890'
      };
      
      setSelectedPatient(demoPatient);
      setFormData(prev => ({
        ...prev,
        pasienId: demoPatient.nik, // Gunakan NIK sebagai pasienId
        namaPasien: demoPatient.nama,
        umurPasien: calculateAge(demoPatient.tanggalLahir),
        jenisKelaminPasien: demoPatient.jenisKelamin,
        tanggalLahirPasien: demoPatient.tanggalLahir,
        alamatPasien: demoPatient.alamat,
        teleponPasien: demoPatient.telepon
      }));
    } else {
      const patient = patients.find(p => p.id === patientId);
      if (patient) {
        setSelectedPatient(patient);
        setFormData(prev => ({
          ...prev,
          pasienId: patient.nik || patient.id, // Gunakan NIK jika ada, fallback ke ID
          namaPasien: patient.nama,
          umurPasien: calculateAge(patient.tanggalLahir),
          jenisKelaminPasien: patient.jenisKelamin,
          tanggalLahirPasien: patient.tanggalLahir,
          alamatPasien: patient.alamat,
          teleponPasien: patient.telepon
        }));
      }
    }
  };

  const handleFaskesSelect = (faskesId) => {
    console.log('handleFaskesSelect called with:', faskesId);
    
    const faskesData = faskes.find(f => f.id === parseInt(faskesId));
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

  const handleFaskesPengirimSelect = (faskesId) => {
    console.log('handleFaskesPengirimSelect called with:', faskesId);
    
    const faskesData = faskes.find(f => f.id === parseInt(faskesId));
    if (faskesData) {
      setFormData(prev => ({
        ...prev,
        faskesPengirim: faskesData.id,
        dokterPengirim: faskesData.dokterKontak || '',
        teleponPengirim: faskesData.teleponKontak || ''
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

  // Template data medis untuk demo
  const medicalDataTemplates = [
    {
      diagnosis: 'Hipertensi Esensial',
      keluhan: 'Sakit kepala, pusing, dan tekanan darah tinggi sejak 3 hari terakhir',
      pemeriksaanFisik: 'TD: 160/100 mmHg, HR: 88 bpm, RR: 20x/menit. Pasien tampak cemas, tidak ada edema, tidak ada tanda-tanda gagal jantung',
      hasilLaboratorium: 'Hb: 14.2 g/dL, Leukosit: 8.500/uL, Trombosit: 350.000/uL, Gula darah puasa: 95 mg/dL, Kreatinin: 1.0 mg/dL',
      tindakanYangDilakukan: 'Pemeriksaan fisik lengkap, pengukuran tekanan darah, konseling diet rendah garam',
      obatYangDiberikan: 'Amlodipine 5mg 1x1, Captopril 25mg 2x1, edukasi pola hidup sehat'
    },
    {
      diagnosis: 'Diabetes Mellitus Tipe 2',
      keluhan: 'Sering haus, sering buang air kecil, dan badan terasa lemas selama 1 minggu',
      pemeriksaanFisik: 'TD: 130/85 mmHg, HR: 92 bpm, RR: 18x/menit. Pasien tampak lemas, tidak ada tanda-tanda dehidrasi berat',
      hasilLaboratorium: 'Hb: 13.8 g/dL, Leukosit: 7.200/uL, Gula darah puasa: 180 mg/dL, HbA1c: 8.5%, Kreatinin: 0.9 mg/dL',
      tindakanYangDilakukan: 'Pemeriksaan fisik lengkap, pengukuran gula darah, konseling diet diabetes',
      obatYangDiberikan: 'Metformin 500mg 2x1, edukasi diet diabetes dan olahraga teratur'
    },
    {
      diagnosis: 'Pneumonia Komunitas',
      keluhan: 'Batuk berdahak kuning, demam, sesak napas, dan nyeri dada saat batuk selama 5 hari',
      pemeriksaanFisik: 'TD: 120/80 mmHg, HR: 110 bpm, RR: 24x/menit, Suhu: 38.5°C. Suara napas kasar di paru kanan bawah',
      hasilLaboratorium: 'Hb: 12.5 g/dL, Leukosit: 15.000/uL, Neutrofil: 85%, CRP: 45 mg/L, Prokalsitonin: 2.5 ng/mL',
      tindakanYangDilakukan: 'Pemeriksaan fisik lengkap, auskultasi paru, foto thorax, konseling istirahat',
      obatYangDiberikan: 'Amoxicillin 500mg 3x1, Paracetamol 500mg 3x1, Bromhexine 8mg 3x1'
    },
    {
      diagnosis: 'Gastritis Akut',
      keluhan: 'Nyeri perut bagian atas, mual, muntah, dan tidak nafsu makan selama 2 hari',
      pemeriksaanFisik: 'TD: 110/70 mmHg, HR: 85 bpm, RR: 16x/menit. Nyeri tekan di epigastrium, tidak ada tanda-tanda peritonitis',
      hasilLaboratorium: 'Hb: 13.0 g/dL, Leukosit: 9.500/uL, Amilase: 45 U/L, Lipase: 30 U/L, H. pylori: Positif',
      tindakanYangDilakukan: 'Pemeriksaan fisik lengkap, palpasi abdomen, konseling diet lambung',
      obatYangDiberikan: 'Omeprazole 20mg 1x1, Domperidone 10mg 3x1, edukasi diet lambung'
    },
    {
      diagnosis: 'Migrain',
      keluhan: 'Sakit kepala sebelah, mual, fotofobia, dan fonofobia sejak pagi hari',
      pemeriksaanFisik: 'TD: 125/80 mmHg, HR: 78 bpm, RR: 16x/menit. Pasien tampak kesakitan, tidak ada tanda-tanda neurologis fokal',
      hasilLaboratorium: 'Hb: 14.0 g/dL, Leukosit: 6.800/uL, Elektrolit dalam batas normal',
      tindakanYangDilakukan: 'Pemeriksaan fisik lengkap, pemeriksaan neurologis, konseling manajemen migrain',
      obatYangDiberikan: 'Sumatriptan 50mg saat serangan, Paracetamol 500mg 3x1, edukasi pemicu migrain'
    },
    {
      diagnosis: 'Bronkitis Akut',
      keluhan: 'Batuk kering berubah menjadi berdahak, demam ringan, dan badan pegal selama 4 hari',
      pemeriksaanFisik: 'TD: 115/75 mmHg, HR: 95 bpm, RR: 20x/menit, Suhu: 37.8°C. Suara napas vesikuler dengan ronki basah halus',
      hasilLaboratorium: 'Hb: 13.2 g/dL, Leukosit: 11.000/uL, Neutrofil: 70%, CRP: 25 mg/L',
      tindakanYangDilakukan: 'Pemeriksaan fisik lengkap, auskultasi paru, konseling istirahat dan hidrasi',
      obatYangDiberikan: 'Amoxicillin 500mg 3x1, Bromhexine 8mg 3x1, Paracetamol 500mg 3x1'
    },
    {
      diagnosis: 'Infeksi Saluran Kemih',
      keluhan: 'Nyeri saat buang air kecil, sering buang air kecil, dan nyeri perut bagian bawah selama 3 hari',
      pemeriksaanFisik: 'TD: 118/78 mmHg, HR: 88 bpm, RR: 18x/menit. Nyeri tekan di suprapubik, tidak ada tanda-tanda peritonitis',
      hasilLaboratorium: 'Hb: 13.5 g/dL, Leukosit: 12.000/uL, Urinalisis: Leukosit +++, Eritrosit +, Nitrit positif',
      tindakanYangDilakukan: 'Pemeriksaan fisik lengkap, palpasi abdomen, konseling hidrasi',
      obatYangDiberikan: 'Ciprofloxacin 500mg 2x1, Paracetamol 500mg 3x1, edukasi kebersihan genital'
    },
    {
      diagnosis: 'Vertigo',
      keluhan: 'Pusing berputar, mual, muntah, dan tidak bisa berdiri tegak sejak pagi hari',
      pemeriksaanFisik: 'TD: 125/80 mmHg, HR: 85 bpm, RR: 16x/menit. Nystagmus horizontal, tes Romberg positif',
      hasilLaboratorium: 'Hb: 14.1 g/dL, Leukosit: 7.500/uL, Elektrolit dalam batas normal',
      tindakanYangDilakukan: 'Pemeriksaan fisik lengkap, tes neurologis, konseling posisi kepala',
      obatYangDiberikan: 'Betahistine 8mg 3x1, Domperidone 10mg 3x1, edukasi manajemen vertigo'
    },
    {
      diagnosis: 'Dermatitis Kontak',
      keluhan: 'Ruam kemerahan, gatal, dan kulit mengelupas di tangan dan kaki selama 1 minggu',
      pemeriksaanFisik: 'TD: 120/75 mmHg, HR: 82 bpm, RR: 16x/menit. Eritema, papula, dan skuama di ekstremitas',
      hasilLaboratorium: 'Hb: 13.8 g/dL, Leukosit: 8.200/uL, Eosinofil: 5%',
      tindakanYangDilakukan: 'Pemeriksaan fisik lengkap, pemeriksaan kulit, konseling alergen',
      obatYangDiberikan: 'Hydrocortisone cream 2x1, Cetirizine 10mg 1x1, edukasi pemicu alergi'
    },
    {
      diagnosis: 'Konjungtivitis',
      keluhan: 'Mata merah, berair, gatal, dan kelopak mata bengkak selama 2 hari',
      pemeriksaanFisik: 'TD: 115/70 mmHg, HR: 80 bpm, RR: 16x/menit. Konjungtiva hiperemis, sekret mukoid',
      hasilLaboratorium: 'Hb: 14.0 g/dL, Leukosit: 7.800/uL, Tidak ada tanda-tanda infeksi sistemik',
      tindakanYangDilakukan: 'Pemeriksaan fisik lengkap, pemeriksaan mata, konseling kebersihan mata',
      obatYangDiberikan: 'Chloramphenicol eye drops 4x1, edukasi kebersihan mata dan tangan'
    }
  ];

  // Fungsi untuk mendapatkan data medis demo secara acak
  const getRandomMedicalData = () => {
    const randomIndex = Math.floor(Math.random() * medicalDataTemplates.length);
    return medicalDataTemplates[randomIndex];
  };

  const validateAllSteps = useCallback(() => {
    const newErrors = {};
    
    console.log('Validating all steps for preview');
    console.log('Current form data:', formData);
    
    // Step 1: Data Rujukan
    if (!formData.tanggalRujukan) {
      newErrors.tanggalRujukan = 'Tanggal rujukan harus diisi';
      console.log('❌ tanggalRujukan is empty:', formData.tanggalRujukan);
    } else {
      console.log('✅ tanggalRujukan:', formData.tanggalRujukan);
    }
    
    if (!formData.waktuRujukan) {
      newErrors.waktuRujukan = 'Waktu rujukan harus diisi';
      console.log('❌ waktuRujukan is empty:', formData.waktuRujukan);
    } else {
      console.log('✅ waktuRujukan:', formData.waktuRujukan);
    }
    
    // Validate date is not in the past
    if (formData.tanggalRujukan) {
      const selectedDate = new Date(formData.tanggalRujukan);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.tanggalRujukan = 'Tanggal rujukan tidak boleh di masa lalu';
      }
    }
    
    // Step 2: Data Pasien
    if (!formData.pasienId) {
      newErrors.pasienId = 'Pasien harus dipilih';
      console.log('❌ pasienId is empty:', formData.pasienId);
    } else {
      console.log('✅ pasienId:', formData.pasienId);
    }
    
    // Validasi NIK jika menggunakan pencarian NIK
    if (searchNik && searchNik.length !== 16) {
      newErrors.searchNik = 'NIK harus 16 digit';
    }
    
    // Validasi data pasien baru (jika isNewPasien = true)
    if (isNewPasien) {
      if (!formData.namaPasien || formData.namaPasien.trim().length < 2) {
        newErrors.namaPasien = 'Nama pasien harus diisi minimal 2 karakter';
        console.log('❌ namaPasien is empty or too short:', formData.namaPasien);
      } else {
        console.log('✅ namaPasien:', formData.namaPasien);
      }
      
      if (!formData.tanggalLahirPasien) {
        newErrors.tanggalLahirPasien = 'Tanggal lahir harus diisi';
        console.log('❌ tanggalLahirPasien is empty:', formData.tanggalLahirPasien);
      } else {
        console.log('✅ tanggalLahirPasien:', formData.tanggalLahirPasien);
      }
      
      if (!formData.jenisKelaminPasien) {
        newErrors.jenisKelaminPasien = 'Jenis kelamin harus dipilih';
        console.log('❌ jenisKelaminPasien is empty:', formData.jenisKelaminPasien);
      } else {
        console.log('✅ jenisKelaminPasien:', formData.jenisKelaminPasien);
      }
      
      if (!formData.alamatPasien || formData.alamatPasien.trim().length < 5) {
        newErrors.alamatPasien = 'Alamat harus diisi minimal 5 karakter';
        console.log('❌ alamatPasien is empty or too short:', formData.alamatPasien);
      } else {
        console.log('✅ alamatPasien:', formData.alamatPasien);
      }
      
      // Telepon tidak wajib untuk pasien baru
      if (formData.teleponPasien && formData.teleponPasien.trim() !== '') {
        const phoneRegex = /^(\+62|62|0)[0-9\s\-()]{9,15}$/;
        if (!phoneRegex.test(formData.teleponPasien.trim())) {
          newErrors.teleponPasien = 'Format nomor telepon tidak valid';
          console.log('❌ teleponPasien format invalid:', formData.teleponPasien);
        } else {
          console.log('✅ teleponPasien:', formData.teleponPasien);
        }
      }
    }
    
    // Step 3: Data Pengirim & Penerima
    if (!formData.faskesPengirim || formData.faskesPengirim === '') {
      newErrors.faskesPengirim = 'Faskes pengirim harus dipilih';
      console.log('❌ faskesPengirim is empty:', formData.faskesPengirim);
    } else {
      console.log('✅ faskesPengirim:', formData.faskesPengirim);
    }
    
    if (!formData.faskesPenerima || formData.faskesPenerima === '') {
      newErrors.faskesPenerima = 'Faskes penerima harus dipilih';
      console.log('❌ faskesPenerima is empty:', formData.faskesPenerima);
    } else {
      console.log('✅ faskesPenerima:', formData.faskesPenerima);
    }
    
    // Validate faskes pengirim and penerima are different
    if (formData.faskesPengirim && formData.faskesPenerima && 
        formData.faskesPengirim !== '' && formData.faskesPenerima !== '' &&
        formData.faskesPengirim === formData.faskesPenerima) {
      newErrors.faskesPenerima = 'Faskes penerima harus berbeda dengan faskes pengirim';
    }
    
    // Validate phone numbers
    const phoneRegex = /^(\+62|62|0)[0-9\s\-()]{9,15}$/;
    
    if (formData.teleponPengirim && formData.teleponPengirim.trim() !== '' && 
        !phoneRegex.test(formData.teleponPengirim.trim())) {
      newErrors.teleponPengirim = 'Format nomor telepon tidak valid (contoh: +62 812-3456-7890, 08123456789)';
    }
    if (formData.teleponPenerima && formData.teleponPenerima.trim() !== '' && 
        !phoneRegex.test(formData.teleponPenerima.trim())) {
      newErrors.teleponPenerima = 'Format nomor telepon tidak valid (contoh: +62 812-3456-7890, 08123456789)';
    }
    
    // Step 4: Data Medis
    if (!formData.diagnosis || formData.diagnosis.trim().length < 3) {
      newErrors.diagnosis = 'Diagnosis harus diisi minimal 3 karakter';
      console.log('❌ diagnosis is empty or too short:', formData.diagnosis);
    } else {
      console.log('✅ diagnosis:', formData.diagnosis);
    }
    
    if (!formData.keluhan || formData.keluhan.trim().length < 3) {
      newErrors.keluhan = 'Keluhan harus diisi minimal 3 karakter';
      console.log('❌ keluhan is empty or too short:', formData.keluhan);
    } else {
      console.log('✅ keluhan:', formData.keluhan);
    }
    
    if (!formData.pemeriksaanFisik || formData.pemeriksaanFisik.trim().length < 5) {
      newErrors.pemeriksaanFisik = 'Pemeriksaan fisik harus diisi minimal 5 karakter';
      console.log('❌ pemeriksaanFisik is empty or too short:', formData.pemeriksaanFisik);
    } else {
      console.log('✅ pemeriksaanFisik:', formData.pemeriksaanFisik);
    }
    
    if (!formData.hasilLaboratorium || formData.hasilLaboratorium.trim().length < 5) {
      newErrors.hasilLaboratorium = 'Hasil laboratorium harus diisi minimal 5 karakter';
      console.log('❌ hasilLaboratorium is empty or too short:', formData.hasilLaboratorium);
    } else {
      console.log('✅ hasilLaboratorium:', formData.hasilLaboratorium);
    }
    
    if (!formData.tindakanYangDilakukan || formData.tindakanYangDilakukan.trim().length < 5) {
      newErrors.tindakanYangDilakukan = 'Tindakan yang dilakukan harus diisi minimal 5 karakter';
      console.log('❌ tindakanYangDilakukan is empty or too short:', formData.tindakanYangDilakukan);
    } else {
      console.log('✅ tindakanYangDilakukan:', formData.tindakanYangDilakukan);
    }
    
    if (!formData.obatYangDiberikan || formData.obatYangDiberikan.trim().length < 5) {
      newErrors.obatYangDiberikan = 'Obat yang diberikan harus diisi minimal 5 karakter';
      console.log('❌ obatYangDiberikan is empty or too short:', formData.obatYangDiberikan);
    } else {
      console.log('✅ obatYangDiberikan:', formData.obatYangDiberikan);
    }
    
    // Step 5: Data Transportasi
    if (!formData.jenisTransportasi) {
      newErrors.jenisTransportasi = 'Jenis transportasi harus dipilih';
      console.log('❌ jenisTransportasi is empty:', formData.jenisTransportasi);
    } else {
      console.log('✅ jenisTransportasi:', formData.jenisTransportasi);
    }
    
    if (!formData.kondisiPasien) {
      newErrors.kondisiPasien = 'Kondisi pasien harus dipilih';
      console.log('❌ kondisiPasien is empty:', formData.kondisiPasien);
    } else {
      console.log('✅ kondisiPasien:', formData.kondisiPasien);
    }
    
    if (!formData.prioritas) {
      newErrors.prioritas = 'Prioritas harus dipilih';
      console.log('❌ prioritas is empty:', formData.prioritas);
    } else {
      console.log('✅ prioritas:', formData.prioritas);
    }
    
    if (!formData.estimasiWaktu) {
      newErrors.estimasiWaktu = 'Estimasi waktu harus diisi';
      console.log('❌ estimasiWaktu is empty:', formData.estimasiWaktu);
    } else {
      console.log('✅ estimasiWaktu:', formData.estimasiWaktu);
    }
    
    // Validasi khusus untuk P1
    if (formData.prioritas === 'P1' && formData.jenisTransportasi !== 'ambulance') {
      newErrors.jenisTransportasi = 'Pasien P1 (Resusitasi) harus menggunakan ambulance';
    }
    
    // Validate estimasi waktu format
    if (formData.estimasiWaktu && !/^\d+\s*(menit|jam|hari)$/i.test(formData.estimasiWaktu.trim())) {
      newErrors.estimasiWaktu = 'Format estimasi waktu tidak valid (contoh: 30 menit, 2 jam)';
    }
    
    setErrors(newErrors);
    console.log('All steps validation errors:', newErrors);
    console.log('All steps valid:', Object.keys(newErrors).length === 0);
    return Object.keys(newErrors).length === 0;
  }, [formData, searchNik, isNewPasien]);

  const validateCurrentStep = useCallback(() => {
    const newErrors = {};
    
    console.log('Validating step:', currentStep, 'Form data:', formData);
    
    switch (currentStep) {
      case 1: // Data Rujukan
        if (!formData.tanggalRujukan) newErrors.tanggalRujukan = 'Tanggal rujukan harus diisi';
        if (!formData.waktuRujukan) newErrors.waktuRujukan = 'Waktu rujukan harus diisi';
        
        // Validate date is not in the past
        if (formData.tanggalRujukan) {
          const selectedDate = new Date(formData.tanggalRujukan);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (selectedDate < today) {
            newErrors.tanggalRujukan = 'Tanggal rujukan tidak boleh di masa lalu';
          }
        }
        break;
        
      case 2: // Data Pasien
        if (!formData.pasienId) newErrors.pasienId = 'Pasien harus dipilih';
        
        // Validasi NIK jika menggunakan pencarian NIK
        if (searchNik && searchNik.length !== 16) {
          newErrors.searchNik = 'NIK harus 16 digit';
        }
        break;
        
      case 3: // Data Pengirim & Penerima
        console.log('Step 3 validation - faskesPengirim:', formData.faskesPengirim, 'faskesPenerima:', formData.faskesPenerima);
        
        // Check if faskes pengirim is selected (not empty string)
        if (!formData.faskesPengirim || formData.faskesPengirim === '') {
          newErrors.faskesPengirim = 'Faskes pengirim harus dipilih';
        }
        
        // Check if faskes penerima is selected (not empty string)
        if (!formData.faskesPenerima || formData.faskesPenerima === '') {
          newErrors.faskesPenerima = 'Faskes penerima harus dipilih';
        }
        
        // Validate faskes pengirim and penerima are different
        if (formData.faskesPengirim && formData.faskesPenerima && 
            formData.faskesPengirim !== '' && formData.faskesPenerima !== '' &&
            formData.faskesPengirim === formData.faskesPenerima) {
          newErrors.faskesPenerima = 'Faskes penerima harus berbeda dengan faskes pengirim';
        }
        
        // Validate phone numbers (make optional for demo mode)
        // Allow various Indonesian phone number formats
        const phoneRegex = /^(\+62|62|0)[0-9\s\-()]{9,15}$/;
        
        console.log('Phone validation - teleponPengirim:', formData.teleponPengirim, 'matches:', phoneRegex.test(formData.teleponPengirim?.trim() || ''));
        console.log('Phone validation - teleponPenerima:', formData.teleponPenerima, 'matches:', phoneRegex.test(formData.teleponPenerima?.trim() || ''));
        
        if (formData.teleponPengirim && formData.teleponPengirim.trim() !== '' && 
            !phoneRegex.test(formData.teleponPengirim.trim())) {
          newErrors.teleponPengirim = 'Format nomor telepon tidak valid (contoh: +62 812-3456-7890, 08123456789)';
        }
        if (formData.teleponPenerima && formData.teleponPenerima.trim() !== '' && 
            !phoneRegex.test(formData.teleponPenerima.trim())) {
          newErrors.teleponPenerima = 'Format nomor telepon tidak valid (contoh: +62 812-3456-7890, 08123456789)';
        }
        break;
        
      case 4: // Data Medis
        if (!formData.diagnosis || formData.diagnosis.trim().length < 3) {
          newErrors.diagnosis = 'Diagnosis harus diisi minimal 3 karakter';
        }
        if (!formData.keluhan || formData.keluhan.trim().length < 3) {
          newErrors.keluhan = 'Keluhan harus diisi minimal 3 karakter';
        }
        break;
        
      case 5: // Data Transportasi
        if (formData.prioritas === 'P1' && formData.jenisTransportasi !== 'ambulance') {
          newErrors.jenisTransportasi = 'Pasien P1 (Resusitasi) harus menggunakan ambulance';
        }
        
        // Validate estimasi waktu format
        if (formData.estimasiWaktu && !/^\d+\s*(menit|jam|hari)$/i.test(formData.estimasiWaktu.trim())) {
          newErrors.estimasiWaktu = 'Format estimasi waktu tidak valid (contoh: 30 menit, 2 jam)';
        }
        break;
        
      default:
        // No validation needed for unknown steps
        break;
    }
    
    setErrors(newErrors);
    console.log('Validation errors:', newErrors);
    console.log('Is valid:', Object.keys(newErrors).length === 0);
    return Object.keys(newErrors).length === 0;
  }, [currentStep, formData, searchNik]);

  const nextStep = useCallback(() => {
    console.log('nextStep called, currentStep:', currentStep, 'totalSteps:', totalSteps);
    console.log('Form data before validation:', formData);
    
    if (validateCurrentStep()) {
      console.log('Validation passed, proceeding to next step');
      setIsLoading(true);
      setTimeout(() => {
        if (currentStep < totalSteps) {
          setCurrentStep(prev => prev + 1);
        } else {
          // Show preview on last step
          setShowPreview(true);
        }
        setIsLoading(false);
      }, 300);
    } else {
      console.log('Validation failed, cannot proceed');
    }
  }, [currentStep, totalSteps, validateCurrentStep, formData]);

  const prevStep = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      if (showPreview) {
        setShowPreview(false);
      } else if (currentStep > 1) {
        setCurrentStep(prev => prev - 1);
      }
      setIsLoading(false);
    }, 300);
  }, [showPreview, currentStep]);

  const goToStep = (stepNumber) => {
    if (stepNumber >= 1 && stepNumber <= totalSteps && stepNumber <= currentStep) {
      setIsLoading(true);
      setTimeout(() => {
        setCurrentStep(stepNumber);
        setIsLoading(false);
      }, 300);
    }
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    console.log('handleSubmit called, showPreview:', showPreview, 'currentStep:', currentStep);
    console.log('Form data:', formData);
    
    // For preview mode, validate all steps
    if (showPreview) {
      console.log('Validating all steps for preview submission');
      if (!validateAllSteps()) {
        console.log('Not all steps are valid, cannot submit');
        return;
      }
    } else {
      if (!validateCurrentStep()) {
        console.log('Current step validation failed');
        return;
      }
    }

    setIsSubmitting(true);
    setIsLoading(true);
    
    try {
      const submitData = {
        ...formData,
        createdAt: mode === 'create' ? new Date().toISOString() : formData.createdAt,
        updatedAt: new Date().toISOString(),
        patient: selectedPatient,
        faskesPenerimaData: selectedFaskesPenerima
      };

      console.log('Submitting data:', submitData);
      await onSubmit(submitData);
      
      // Clear saved data on successful submit
      if (mode === 'create') {
        localStorage.removeItem('rujukanFormData');
      }
    } catch (error) {
      console.error('Error submitting referral:', error);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  }, [formData, mode, selectedPatient, selectedFaskesPenerima, onSubmit, validateCurrentStep, validateAllSteps, showPreview, currentStep]);

  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
  }, [onCancel]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            prevStep();
            break;
          case 'ArrowRight':
            e.preventDefault();
            if (!showPreview) {
              nextStep();
            }
            break;
          case 'Enter':
            if (showPreview) {
              e.preventDefault();
              handleSubmit(e);
            }
            break;
          case 'Escape':
            e.preventDefault();
            if (showPreview) {
              setShowPreview(false);
            } else {
              handleCancel();
            }
            break;
          default:
            // No action for other keys
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, showPreview, prevStep, nextStep, handleSubmit, handleCancel]);

  const isReadOnly = mode === 'view';
  const formTitle = mode === 'create' ? 'Buat Rujukan Baru' : 
                   mode === 'edit' ? 'Edit Data Rujukan' : 
                   'Detail Rujukan';

  const getStepTitle = (step) => {
    const titles = {
      1: 'Data Rujukan',
      2: 'Data Pasien', 
      3: 'Data Pengirim & Penerima',
      4: 'Data Medis',
      5: 'Data Transportasi & Status'
    };
    return titles[step] || '';
  };

  const getStepIcon = (step) => {
    const icons = {
      1: '📋',
      2: '👤',
      3: '🏥',
      4: '🩺',
      5: '🚑'
    };
    return icons[step] || '';
  };

  // Helper function to get faskes name from ID
  const getFaskesName = (faskesId) => {
    if (!faskesId) return 'Belum dipilih';
    const faskesData = faskes.find(f => f.id === parseInt(faskesId));
    if (faskesData) {
      return `${faskesData.nama_faskes || faskesData.nama} (ID: ${faskesId})`;
    }
    return `ID: ${faskesId}`;
  };

  const renderPreview = () => {
    return (
      <div className="form-step">
        <div className="step-header">
          <h2>📋 Preview Rujukan</h2>
          <p>Review data sebelum mengirim rujukan</p>
          <div className="step-actions">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                console.log('🔍 Validasi Data button clicked');
                console.log('Current form data:', formData);
                console.log('isNewPasien:', isNewPasien);
                console.log('searchNik:', searchNik);
                const isValid = validateAllSteps();
                console.log('Preview validation result:', isValid);
                
                if (isValid) {
                  alert('✅ Semua data sudah valid dan siap dikirim!');
                } else {
                  const errorFields = Object.keys(errors);
                  const errorMessages = errorFields.map(field => `${field}: ${errors[field]}`).join('\n');
                  alert(`❌ Masih ada data yang perlu dilengkapi:\n\n${errorMessages}\n\nSilakan periksa kembali.`);
                }
              }}
              disabled={isSubmitting}
            >
              🔍 Validasi Data
            </Button>
          </div>
        </div>
        
        <div className="preview-container">
          <div className="preview-section">
            <h3>📋 Data Rujukan</h3>
            <div className="preview-grid">
              <div className="preview-item">
                <label>ID Rujukan:</label>
                <span>{formData.id}</span>
              </div>
              <div className="preview-item">
                <label>Tanggal:</label>
                <span>{formData.tanggalRujukan}</span>
              </div>
              <div className="preview-item">
                <label>Waktu:</label>
                <span>{formData.waktuRujukan}</span>
              </div>
            </div>
          </div>
          
          <div className="preview-section">
            <h3>👤 Data Pasien</h3>
            <div className="preview-grid">
              <div className="preview-item">
                <label>NIK:</label>
                <span>{formData.pasienId}</span>
              </div>
              <div className="preview-item">
                <label>Nama:</label>
                <span>{formData.namaPasien}</span>
              </div>
              <div className="preview-item">
                <label>Tanggal Lahir:</label>
                <span>{formData.tanggalLahirPasien || selectedPatient?.tanggalLahir || 'Belum diisi'}</span>
              </div>
              <div className="preview-item">
                <label>Jenis Kelamin:</label>
                <span>{formData.jenisKelaminPasien === 'L' ? 'Laki-laki' : formData.jenisKelaminPasien === 'P' ? 'Perempuan' : 'Belum diisi'}</span>
              </div>
              <div className="preview-item">
                <label>Alamat:</label>
                <span>{formData.alamatPasien || selectedPatient?.alamat || 'Belum diisi'}</span>
              </div>
              <div className="preview-item">
                <label>Telepon:</label>
                <span>{formData.teleponPasien || selectedPatient?.telepon || 'Belum diisi'}</span>
              </div>
              <div className="preview-item">
                <label>Status:</label>
                <span className={`status-badge ${isNewPasien ? 'new-patient' : 'existing-patient'}`}>
                  {isNewPasien ? '🆕 Pasien Baru' : '✅ Pasien Terdaftar'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="preview-section">
            <h3>🏥 Data Faskes</h3>
            <div className="preview-grid">
              <div className="preview-item">
                <label>Faskes Pengirim:</label>
                <span>{getFaskesName(formData.faskesPengirim)}</span>
              </div>
              <div className="preview-item">
                <label>Dokter Pengirim:</label>
                <span>{formData.dokterPengirim}</span>
              </div>
              <div className="preview-item">
                <label>Faskes Penerima:</label>
                <span>{getFaskesName(formData.faskesPenerima)}</span>
              </div>
              <div className="preview-item">
                <label>Dokter Penerima:</label>
                <span>{formData.dokterPenerima}</span>
              </div>
            </div>
          </div>
          
          <div className="preview-section">
            <h3>🩺 Data Medis</h3>
            <div className="preview-grid">
              <div className="preview-item full-width">
                <label>Diagnosis:</label>
                <span>{formData.diagnosis}</span>
              </div>
              <div className="preview-item full-width">
                <label>Keluhan:</label>
                <span>{formData.keluhan}</span>
              </div>
            </div>
          </div>
          
          <div className="preview-section">
            <h3>🚑 Data Transportasi</h3>
            <div className="preview-grid">
              <div className="preview-item">
                <label>Jenis Transportasi:</label>
                <span>{formData.jenisTransportasi}</span>
              </div>
              <div className="preview-item">
                <label>Kondisi Pasien:</label>
                <span>{formData.kondisiPasien}</span>
              </div>
              <div className="preview-item">
                <label>Prioritas:</label>
                <span className={`priority-badge priority-${formData.prioritas.toLowerCase()}`}>
                  {formData.prioritas}
                </span>
              </div>
              <div className="preview-item">
                <label>Estimasi Waktu:</label>
                <span>{formData.estimasiWaktu}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="form-tips">
          <div className="tip-icon">✅</div>
          <div className="tip-content">
            <strong>Konfirmasi:</strong> Pastikan semua data sudah benar sebelum mengirim rujukan
          </div>
        </div>
      </div>
    );
  };

  const renderStep = () => {
    if (showPreview) {
      return renderPreview();
    }
    
    switch (currentStep) {
      case 1:
        return (
          <div className="form-step">
            <div className="step-header">
              <h2>{getStepIcon(1)} Data Rujukan</h2>
              <p>Informasi dasar rujukan</p>
            </div>
            
            <div className="form-grid">
              <Input
                label="ID Rujukan"
                value={formData.id || ''}
                disabled
                help="ID otomatis generated"
              />
              
              <div className="form-row">
                <div className="form-col">
                  <Input
                    label="Tanggal Rujukan"
                    type="date"
                    value={formData.tanggalRujukan}
                    onChange={(e) => handleInputChange('tanggalRujukan', e.target.value)}
                    error={errors.tanggalRujukan}
                    disabled={isReadOnly}
                    required
                  />
                </div>
                
                <div className="form-col">
                  <div className="time-input-group">
                    <Input
                      label="Waktu Rujukan"
                      type="time"
                      value={formData.waktuRujukan}
                      onChange={(e) => handleInputChange('waktuRujukan', e.target.value)}
                      error={errors.waktuRujukan}
                      disabled={isReadOnly}
                      required
                    />
                    {!isReadOnly && (
                      <button
                        type="button"
                        className="time-update-btn"
                        onClick={() => {
                          const now = new Date();
                          const currentTime = now.toTimeString().slice(0, 5);
                          handleInputChange('waktuRujukan', currentTime);
                        }}
                        title="Set ke waktu sekarang"
                      >
                        <span className="time-icon">🕐</span>
                        <span className="time-text">Sekarang</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
             <div className="form-tips">
               <div className="tip-icon">💡</div>
               <div className="tip-content">
                 <strong>Tips:</strong> Tanggal dan waktu rujukan tersusun rapi dalam dua kolom
                 <br />
                 <strong>Waktu Otomatis:</strong> Waktu rujukan otomatis di-set ke waktu sekarang
                 <br />
                 <strong>Tombol "Sekarang":</strong> Klik untuk mengupdate waktu ke waktu terbaru
                 <br />
                 <strong>Keyboard Shortcuts:</strong> Ctrl+← (Sebelumnya), Ctrl+→ (Selanjutnya), Ctrl+Enter (Submit), Esc (Cancel)
               </div>
             </div>
          </div>
        );

       case 2:
         return (
           <div className="form-step">
             <div className="step-header">
               <h2>{getStepIcon(2)} Data Pasien</h2>
               <p>Pilih atau cari pasien berdasarkan NIK</p>
             </div>
             
             <div className="form-grid">
               {/* Input pencarian NIK */}
               <div className="form-group full-width">
                 <label className="form-label">Cari Pasien dengan NIK</label>
                 <div className="search-container">
                   <input
                     type="text"
                     className="form-input"
                     placeholder="Masukkan 16 digit NIK..."
                     value={searchNik}
                     onChange={(e) => setSearchNik(e.target.value)}
                     maxLength="16"
                     pattern="[0-9]{16}"
                     disabled={isReadOnly}
                   />
                   <button 
                     type="button"
                     className="btn btn-primary"
                     onClick={handleSearchPasien}
                     disabled={isSearching || searchNik.length !== 16 || isReadOnly}
                   >
                     {isSearching ? 'Mencari...' : 'Cari'}
                   </button>
                 </div>
                 {errors.searchNik && (
                   <div className="form-error">{errors.searchNik}</div>
                 )}
               </div>

               {/* Tampilkan hasil pencarian */}
               {foundPasien && (
                 <div className="form-group full-width">
                   <div className="patient-found">
                     <div className="found-icon">✅</div>
                     <div className="found-content">
                       <strong>Pasien ditemukan:</strong> {foundPasien.nama_pasien} 
                       ({foundPasien.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}, {calculateAge(foundPasien.tanggal_lahir)} tahun)
                     </div>
                   </div>
                 </div>
               )}

               {isNewPasien && searchNik && (
                 <div className="form-group full-width">
                   <div className="new-patient-info">
                     <div className="new-icon">🆕</div>
                     <div className="new-content">
                       <strong>Pasien baru:</strong> NIK {searchNik} belum terdaftar. Silakan lengkapi data pasien.
                     </div>
                   </div>
                   
                   {/* Form untuk pasien baru */}
                   <div className="new-patient-form">
                     <h4>Data Pasien Baru</h4>
                     <div className="form-grid">
                       <Input
                         label="NIK"
                         value={searchNik}
                         disabled
                         help="NIK sudah terisi dari pencarian"
                       />
                       
                       <Input
                         label="Nama Lengkap"
                         placeholder="Masukkan nama lengkap pasien..."
                         value={formData.namaPasien}
                         onChange={(e) => handleInputChange('namaPasien', e.target.value)}
                         disabled={isReadOnly}
                         required
                       />
                       
                       <Input
                         label="Tanggal Lahir"
                         type="date"
                         value={formData.tanggalLahirPasien}
                         onChange={(e) => handleInputChange('tanggalLahirPasien', e.target.value)}
                         disabled={isReadOnly}
                         required
                       />
                       
                       <div className="form-group">
                         <label className="form-label">Jenis Kelamin</label>
                         <select
                           className="form-input"
                           value={formData.jenisKelaminPasien}
                           onChange={(e) => handleInputChange('jenisKelaminPasien', e.target.value)}
                           disabled={isReadOnly}
                           required
                         >
                           <option value="">Pilih jenis kelamin...</option>
                           <option value="L">Laki-laki</option>
                           <option value="P">Perempuan</option>
                         </select>
                       </div>
                       
                       <Input
                         label="Alamat"
                         placeholder="Masukkan alamat lengkap..."
                         value={formData.alamatPasien}
                         onChange={(e) => handleInputChange('alamatPasien', e.target.value)}
                         disabled={isReadOnly}
                         required
                       />
                       
                       <Input
                         label="Telepon"
                         type="tel"
                         placeholder="+62 812-3456-7890"
                         value={formData.teleponPasien}
                         onChange={(e) => handleInputChange('teleponPasien', e.target.value)}
                         disabled={isReadOnly}
                       />
                     </div>
                   </div>
                 </div>
               )}

               {/* Dropdown pasien yang sudah ada (tetap ada sebagai opsi alternatif) */}
               <div className="form-group">
                 <label className="form-label">Atau Pilih dari Daftar Pasien</label>
                 <select
                   className="form-input"
                   value={formData.pasienId}
                   onChange={(e) => handlePatientSelect(e.target.value)}
                   disabled={isReadOnly}
                 >
                   <option value="">Pilih pasien...</option>
                   {patients.map(patient => (
                     <option key={patient.id} value={patient.id}>
                       {patient.id} - {patient.nama} ({patient.jenisKelamin}, {calculateAge(patient.tanggalLahir)} tahun)
                     </option>
                   ))}
                   <option value="demo-patient">Demo Patient - Ahmad Susanto (L, 35 tahun)</option>
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
               
               {patients.length === 0 && (
                 <div className="form-group full-width">
                   <div className="demo-patient-info">
                     <div className="demo-icon">ℹ️</div>
                     <div className="demo-content">
                       <strong>Demo Mode:</strong> Tidak ada data pasien tersedia. Anda dapat menggunakan "Demo Patient" untuk testing atau hubungi admin untuk menambahkan data pasien.
                     </div>
                   </div>
                 </div>
               )}
             </div>
             
             <div className="form-tips">
               <div className="tip-icon">👤</div>
               <div className="tip-content">
                 <strong>Info:</strong> Data pasien akan otomatis terisi setelah dipilih dari daftar
               </div>
             </div>
           </div>
         );

      case 3:
        return (
          <div className="form-step">
            <div className="step-header">
              <h2>{getStepIcon(3)} Data Pengirim & Penerima</h2>
              <p>Informasi faskes pengirim dan penerima</p>
            </div>
            
            <div className="form-grid">
               <div className="form-group">
                 <label className="form-label">Faskes Pengirim</label>
                 <select
                   className="form-input"
                   value={formData.faskesPengirim}
                   onChange={(e) => handleFaskesPengirimSelect(e.target.value)}
                   disabled={isReadOnly}
                   required
                 >
                   <option value="">Pilih faskes pengirim...</option>
                   {faskes.map(faskesData => (
                     <option key={faskesData.id} value={faskesData.id}>
                       {faskesData.nama_faskes || faskesData.nama} - {faskesData.tipe}
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
                placeholder="+62 812-3456-7890 (Opsional)"
                value={formData.teleponPengirim}
                onChange={(e) => handleInputChange('teleponPengirim', e.target.value)}
                disabled={isReadOnly}
              />
              
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
                       {faskesData.nama_faskes || faskesData.nama} - {faskesData.tipe}
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
                placeholder="+62 812-3456-7890 (Opsional)"
                value={formData.teleponPenerima}
                onChange={(e) => handleInputChange('teleponPenerima', e.target.value)}
                disabled={isReadOnly}
              />
            </div>
            
            <div className="form-tips">
              <div className="tip-icon">🏥</div>
              <div className="tip-content">
                <strong>Penting:</strong> Pastikan informasi kontak dokter sudah benar untuk komunikasi yang lancar
              </div>
            </div>
            
            {/* Validation Status */}
            {Object.keys(errors).length > 0 && (
              <div className="validation-status">
                <div className="validation-icon">⚠️</div>
                <div className="validation-content">
                  <strong>Perhatian:</strong> Silakan lengkapi field yang diperlukan:
                  <ul>
                    {Object.entries(errors).map(([field, message]) => (
                      <li key={field}>{message}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="form-step">
            <div className="step-header">
              <h2>{getStepIcon(4)} Data Medis</h2>
              <p>Informasi medis dan kondisi pasien</p>
              <div className="step-actions">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const randomData = getRandomMedicalData();
                    console.log('🎲 Generating random medical data:', randomData);
                    setFormData(prev => ({
                      ...prev,
                      diagnosis: randomData.diagnosis,
                      keluhan: randomData.keluhan,
                      pemeriksaanFisik: randomData.pemeriksaanFisik,
                      hasilLaboratorium: randomData.hasilLaboratorium,
                      tindakanYangDilakukan: randomData.tindakanYangDilakukan,
                      obatYangDiberikan: randomData.obatYangDiberikan
                    }));
                  }}
                  disabled={isReadOnly}
                >
                  🎲 Generate Data Demo
                </Button>
              </div>
            </div>
            
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
            
            <div className="form-tips">
              <div className="tip-icon">⚠️</div>
              <div className="tip-content">
                <strong>Penting:</strong> Informasi medis yang akurat sangat penting untuk keselamatan pasien
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="form-step">
            <div className="step-header">
              <h2>{getStepIcon(5)} Data Transportasi & Status</h2>
              <p>Informasi transportasi dan status rujukan</p>
            </div>
            
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
              
              {(mode === 'edit' || mode === 'view') && (
                <>
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
                </>
              )}
            </div>
            
            <div className="form-tips">
              <div className="tip-icon">✅</div>
              <div className="tip-content">
                <strong>Review:</strong> Pastikan semua informasi sudah benar sebelum mengirim rujukan
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`multi-step-referral-form ${className}`} {...props}>
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Memuat data...</p>
          </div>
        </div>
      )}
      <Card variant="medical">
        <Card.Header>
          <div className="form-header">
            <Card.Title>{formTitle}</Card.Title>
            <div className="header-actions">
              {mode === 'view' && (
                <StatusIndicator 
                  status={formData.status} 
                  priority={formData.prioritas}
                  animated={formData.status === 'pending'}
                />
              )}
              <div className={`auto-save-indicator ${autoSaveStatus === 'saving' ? 'saving' : ''}`}>
                <span className="save-icon">
                  {autoSaveStatus === 'saving' ? '💾' : '✅'}
                </span>
                <span className="save-text">
                  {autoSaveStatus === 'saving' ? 'Menyimpan...' : 'Tersimpan'}
                </span>
              </div>
            </div>
          </div>
        </Card.Header>

        <Card.Body>
          {/* Progress Indicator */}
          <div className="form-progress">
            <div className="progress-steps">
              {Array.from({ length: totalSteps }, (_, index) => {
                const stepNumber = index + 1;
                const isActive = stepNumber === currentStep;
                const isCompleted = stepNumber < currentStep;
                const isClickable = stepNumber <= currentStep;
                
                return (
                  <div 
                    key={stepNumber}
                    className={`step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isClickable ? 'clickable' : ''}`}
                    onClick={() => isClickable && goToStep(stepNumber)}
                  >
                    <div className="step-number">
                      {isCompleted ? '✓' : stepNumber}
                    </div>
                    <div className="step-label">{getStepTitle(stepNumber)}</div>
                  </div>
                );
              })}
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step Content */}
          <form onSubmit={handleSubmit} className="referral-form-content">
            {renderStep()}
          </form>
        </Card.Body>

        {!isReadOnly && (
          <Card.Footer>
            <div className="form-navigation">
               <Button
                 type="button"
                 variant="secondary"
                 onClick={prevStep}
                 disabled={currentStep === 1 && !showPreview}
                 icon="←"
               >
                 {showPreview ? 'Kembali ke Edit' : 'Sebelumnya'}
               </Button>
               
               <div className="nav-spacer"></div>
               
               {showPreview ? (
                 <Button
                   type="button"
                   variant="success"
                   icon="📋"
                   loading={isSubmitting}
                   onClick={handleSubmit}
                   disabled={isSubmitting}
                 >
                   {mode === 'create' ? 'Kirim Rujukan' : 'Update Rujukan'}
                 </Button>
               ) : currentStep < totalSteps ? (
                 <Button
                   type="button"
                   variant="primary"
                   onClick={nextStep}
                   icon="→"
                   disabled={isLoading}
                 >
                   {isLoading ? 'Memvalidasi...' : 'Selanjutnya'}
                 </Button>
               ) : (
                 <Button
                   type="button"
                   variant="primary"
                   onClick={nextStep}
                   icon="👁️"
                 >
                   Preview
                 </Button>
               )}
              
              <Button
                type="button"
                variant="neutral"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Batal
              </Button>
            </div>
          </Card.Footer>
        )}
      </Card>
    </div>
  );
};

export default MultiStepReferralForm;
