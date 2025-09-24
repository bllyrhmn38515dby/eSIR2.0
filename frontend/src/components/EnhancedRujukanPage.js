import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Layout from './Layout';
import DokumenManager from './DokumenManager';
import { MultiStepReferralForm } from './medical';
import { useAuth } from '../context/AuthContext';
import './EnhancedRujukanPage.css';

const EnhancedRujukanPage = () => {
  // eslint-disable-next-line no-unused-vars
  const { user } = useAuth();
  const [rujukan, setRujukan] = useState([]);
  const [pasien, setPasien] = useState([]);
  const [faskes, setFaskes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDokumenModal, setShowDokumenModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRujukan, setSelectedRujukan] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch rujukan data
      try {
        const rujukanResponse = await axios.get('http://localhost:3001/api/rujukan', { headers });
        if (rujukanResponse.data.success) {
          setRujukan(rujukanResponse.data.data);
        }
      } catch (error) {
        console.log('No rujukan data available, using empty array');
        setRujukan([]);
      }

      // Fetch pasien data
      try {
        const pasienResponse = await axios.get('http://localhost:3001/api/pasien', { headers });
        if (pasienResponse.data.success) {
          setPasien(pasienResponse.data.data);
        }
      } catch (error) {
        console.log('No pasien data available, using empty array');
        setPasien([]);
      }

      // Fetch faskes data
      try {
        const faskesResponse = await axios.get('http://localhost:3001/api/faskes', { headers });
        if (faskesResponse.data.success) {
          setFaskes(faskesResponse.data.data);
        }
      } catch (error) {
        console.log('No faskes data available, using empty array');
        setFaskes([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFormSubmit = async (formData) => {
    try {
      console.log('handleFormSubmit called with:', formData);
      setError('');
      setSuccessMessage('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token tidak ditemukan. Silakan login kembali.');
        return;
      }
      
      const headers = { Authorization: `Bearer ${token}` };

      // Transform form data to match API expectations
      const apiData = {
        // Data Pasien - gunakan data dari formData untuk pasien baru atau selectedPatient untuk pasien lama
        nik: formData.pasienId,
        nama_pasien: formData.namaPasien,
        tanggal_lahir: formData.tanggalLahirPasien || formData.selectedPatient?.tanggalLahir || '',
        jenis_kelamin: formData.jenisKelaminPasien || 'L',
        alamat: formData.alamatPasien || formData.selectedPatient?.alamat || '',
        telepon: formData.teleponPasien || formData.selectedPatient?.telepon || '',
        
        // Data Rujukan - sesuai dengan yang diharapkan backend
        faskes_asal_id: formData.faskesPengirim,
        faskes_tujuan_id: formData.faskesPenerima,
        diagnosa: formData.diagnosis,
        alasan_rujukan: formData.keluhan,
        catatan_asal: formData.pemeriksaanFisik || '', // Gunakan pemeriksaan fisik sebagai catatan
        transport_type: formData.jenisTransportasi === 'ambulance' ? 'pickup' : 'delivery'
      };

      // Validasi data sebelum dikirim
      const requiredFields = ['nik', 'nama_pasien', 'tanggal_lahir', 'jenis_kelamin', 'alamat', 'faskes_tujuan_id', 'diagnosa', 'alasan_rujukan'];
      const missingFields = requiredFields.filter(field => !apiData[field] || apiData[field].toString().trim() === '');
      
      if (missingFields.length > 0) {
        const errorMsg = `Field berikut wajib diisi: ${missingFields.join(', ')}`;
        console.error('Missing required fields:', missingFields);
        console.error('API data:', apiData);
        setError(errorMsg);
        alert(`❌ ${errorMsg}`);
        return;
      }

      console.log('Sending API data:', apiData);
      console.log('API URL:', 'http://localhost:3001/api/rujukan/with-pasien');
      console.log('Headers:', headers);
      console.log('Form data received:', formData);
      console.log('Selected patient:', formData.selectedPatient);
      console.log('Is new patient:', formData.isNewPasien);
      console.log('Faskes Pengirim:', formData.faskesPengirim, 'Type:', typeof formData.faskesPengirim);
      console.log('Faskes Penerima:', formData.faskesPenerima, 'Type:', typeof formData.faskesPenerima);

      const response = await axios.post('http://localhost:3001/api/rujukan/with-pasien', apiData, { headers });
      
      console.log('API Response:', response.data);
      
      if (response.data.success) {
        setShowForm(false);
        setSuccessMessage('✅ Rujukan berhasil dibuat!');
        setTimeout(() => setSuccessMessage(''), 5000);
        fetchData();
        // Show success alert
        alert('✅ Rujukan berhasil dibuat!');
      } else {
        const errorMsg = response.data.message || 'Gagal membuat rujukan';
        setError(errorMsg);
        alert(`❌ ${errorMsg}`);
      }
    } catch (error) {
      console.error('Error creating rujukan:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.response?.headers);
      
      let errorMsg = 'Gagal membuat rujukan';
      
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMsg = 'Data yang dikirim tidak valid. Periksa kembali semua field yang wajib diisi.';
      } else if (error.response?.status === 401) {
        errorMsg = 'Sesi telah berakhir. Silakan login kembali.';
        // Redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else if (error.response?.status === 404) {
        errorMsg = 'Endpoint tidak ditemukan. Periksa konfigurasi server.';
      } else if (error.response?.status === 500) {
        errorMsg = 'Terjadi kesalahan server. Silakan coba lagi.';
      } else if (error.code === 'NETWORK_ERROR') {
        errorMsg = 'Tidak dapat terhubung ke server. Periksa koneksi internet.';
      }
      
      setError(errorMsg);
      alert(`❌ ${errorMsg}`);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setError('');
  };

  const handleStatusUpdate = async (rujukanId, statusData) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await axios.put(`http://localhost:3001/api/rujukan/${rujukanId}/status`, statusData, { headers });
      
      if (response.data.success) {
        setShowStatusModal(false);
        setSuccessMessage('Status rujukan berhasil diperbarui!');
        setTimeout(() => setSuccessMessage(''), 5000);
        fetchData();
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setError(error.response?.data?.message || 'Gagal memperbarui status');
    }
  };

  const handleCancelRujukan = async (rujukanId, cancelData) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await axios.put(`http://localhost:3001/api/rujukan/${rujukanId}/cancel`, cancelData, { headers });
      
      if (response.data.success) {
        setShowCancelModal(false);
        setSuccessMessage('Rujukan berhasil dibatalkan!');
        setTimeout(() => setSuccessMessage(''), 5000);
        fetchData();
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error canceling rujukan:', error);
      setError(error.response?.data?.message || 'Gagal membatalkan rujukan');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { text: 'Menunggu', class: 'status-menunggu' },
      'diterima': { text: 'Diterima', class: 'status-diterima' },
      'ditolak': { text: 'Ditolak', class: 'status-ditolak' },
      'selesai': { text: 'Selesai', class: 'status-selesai' },
      'dibatalkan': { text: 'Dibatalkan', class: 'status-dibatalkan' }
    };
    
    const config = statusConfig[status] || { text: status, class: 'status-menunggu' };
    return <span className={config.class}>{config.text}</span>;
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      'P1': { text: 'P1', class: 'p1' },
      'P2': { text: 'P2', class: 'p2' },
      'P3': { text: 'P3', class: 'p3' },
      'P4': { text: 'P4', class: 'p4' }
    };
    
    const config = priorityConfig[priority] || { text: 'P4', class: 'p4' };
    return <span className={`prioritas ${config.class}`}>{config.text}</span>;
  };

  if (loading) {
    return (
      <Layout>
        <div className="enhanced-rujukan-page">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Memuat data rujukan...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="enhanced-rujukan-page">
        <div className="header-card">
          <div>
            <h1>🏥 Manajemen Rujukan</h1>
            <p>Sistem rujukan medis dengan multi-step form</p>
          </div>
          <button 
            className="btn-primary"
            onClick={() => setShowForm(true)}
          >
            📋 Buat Rujukan Baru
          </button>
        </div>

         {error && (
           <div className="alert alert-error">
             <span className="alert-icon">⚠️</span>
             <span className="alert-message">{error}</span>
             <button className="alert-close" onClick={() => setError('')}>×</button>
           </div>
         )}

         {(pasien.length === 0 || faskes.length === 0) && (
           <div className="alert alert-info">
             <span className="alert-icon">ℹ️</span>
             <span className="alert-message">
               <strong>Demo Mode:</strong> Tidak ada data pasien atau faskes tersedia. 
               <br />
               <strong>Opsi Demo yang tersedia:</strong>
               <br />
               • <strong>Pasien:</strong> Demo Patient - Ahmad Susanto (L, 35 tahun)
               <br />
               • <strong>Faskes Pengirim:</strong> Demo Puskesmas - Puskesmas Jakarta  
               <br />
               • <strong>Faskes Penerima:</strong> Demo RS - RS Jantung Harapan
             </span>
             <button className="alert-close" onClick={() => {}}>×</button>
           </div>
         )}

        {successMessage && (
          <div className="alert alert-success">
            <span className="alert-icon">✅</span>
            <span className="alert-message">{successMessage}</span>
            <button className="alert-close" onClick={() => setSuccessMessage('')}>×</button>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="stat-container">
          <div className="stat-card stat-total">
            <div className="icon">📋</div>
            <h2>{rujukan.length}</h2>
            <p>Total Rujukan</p>
          </div>
          
          <div className="stat-card stat-menunggu">
            <div className="icon">⏳</div>
            <h2>{rujukan.filter(r => r.status === 'pending').length}</h2>
            <p>Menunggu</p>
          </div>
          
          <div className="stat-card stat-selesai">
            <div className="icon">✅</div>
            <h2>{rujukan.filter(r => r.status === 'selesai').length}</h2>
            <p>Selesai</p>
          </div>
          
          <div className="stat-card stat-ambulans">
            <div className="icon">🚑</div>
            <h2>{rujukan.filter(r => r.transport_type === 'pickup').length}</h2>
            <p>Ambulans</p>
          </div>
        </div>

        {/* Rujukan Table */}
        <div className="table-container">
          <div className="table-header">
            <h2>Daftar Rujukan</h2>
            <div className="table-actions">
              <button className="btn btn-secondary" onClick={fetchData}>
                🔄 Refresh
              </button>
            </div>
          </div>
          
          <div className="table-wrapper">
            {loading ? (
              <div className="table-loading">
                <div className="loading-spinner"></div>
                <p>Memuat data rujukan...</p>
              </div>
            ) : (
              <table className="table-rujukan">
                <thead>
                  <tr>
                    <th>No. Rujukan</th>
                    <th>Pasien</th>
                    <th>Faskes Asal</th>
                    <th>Faskes Tujuan</th>
                    <th>Diagnosa</th>
                    <th>Prioritas</th>
                    <th>Status</th>
                    <th>Tanggal</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {rujukan.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="empty-state">
                        <div className="empty-content">
                          <div className="empty-icon">📋</div>
                          <h3>Belum ada rujukan</h3>
                          <p>Klik "Buat Rujukan Baru" untuk membuat rujukan pertama</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                  rujukan.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="rujukan-id">
                          <strong>#{item.id}</strong>
                        </div>
                      </td>
                      <td>
                        <div className="patient-info">
                          <div className="patient-name">{item.nama_pasien}</div>
                          <div className="patient-details">
                            {item.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'} • {item.nik}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="faskes-info">
                          <div className="faskes-name">{item.faskes_asal_nama || item.faskes_asal?.nama || 'N/A'}</div>
                          <div className="faskes-type">{item.faskes_asal?.tipe || 'Faskes'}</div>
                        </div>
                      </td>
                      <td>
                        <div className="faskes-info">
                          <div className="faskes-name">{item.faskes_tujuan_nama || item.faskes_tujuan?.nama || 'N/A'}</div>
                          <div className="faskes-type">{item.faskes_tujuan?.tipe || 'Faskes'}</div>
                        </div>
                      </td>
                      <td>
                        <div className="diagnosis-info">
                          <div className="diagnosis-text" title={item.diagnosa || 'N/A'}>
                            {item.diagnosa ? (item.diagnosa.length > 50 ? `${item.diagnosa.substring(0, 50)}...` : item.diagnosa) : 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td>
                        {getPriorityBadge(item.prioritas || 'P4')}
                      </td>
                      <td>
                        {getStatusBadge(item.status)}
                      </td>
                      <td>
                        <div className="date-info">
                          <div className="date-text">
                            {new Date(item.created_at).toLocaleDateString('id-ID')}
                          </div>
                          <div className="time-text">
                            {new Date(item.created_at).toLocaleTimeString('id-ID', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => {
                              setSelectedRujukan(item);
                              setShowDetailModal(true);
                            }}
                            title="Lihat Detail"
                          >
                            👁️
                          </button>
                          
                          {item.status === 'pending' && (
                            <>
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => {
                                  setSelectedRujukan(item);
                                  setShowStatusModal(true);
                                }}
                                title="Update Status"
                              >
                                ✅
                              </button>
                              
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => {
                                  setSelectedRujukan(item);
                                  setShowCancelModal(true);
                                }}
                                title="Batalkan"
                              >
                                ❌
                              </button>
                            </>
                          )}
                          
                          <button
                            className="btn btn-sm btn-info"
                            onClick={() => {
                              setSelectedRujukan(item);
                              setShowDokumenModal(true);
                            }}
                            title="Kelola Dokumen"
                          >
                            📄
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Multi-Step Referral Form Modal */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content modal-large">
              <div className="modal-header">
                <h2>📋 Buat Rujukan Baru</h2>
                <button 
                  className="modal-close"
                  onClick={handleFormCancel}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <MultiStepReferralForm
                  mode="create"
                  patients={pasien}
                  faskes={faskes}
                  onSubmit={handleFormSubmit}
                  onCancel={handleFormCancel}
                />
              </div>
            </div>
          </div>
        )}

        {/* Status Update Modal */}
        {showStatusModal && selectedRujukan && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Update Status Rujukan</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowStatusModal(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <StatusUpdateForm
                  rujukan={selectedRujukan}
                  onSubmit={(data) => handleStatusUpdate(selectedRujukan.id, data)}
                  onCancel={() => setShowStatusModal(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Cancel Rujukan Modal */}
        {showCancelModal && selectedRujukan && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Batalkan Rujukan</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowCancelModal(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <CancelRujukanForm
                  rujukan={selectedRujukan}
                  onSubmit={(data) => handleCancelRujukan(selectedRujukan.id, data)}
                  onCancel={() => setShowCancelModal(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedRujukan && (
          <div className="modal-overlay">
            <div className="modal-content modal-large">
              <div className="modal-header">
                <h2>Detail Rujukan #{selectedRujukan.id}</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowDetailModal(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <RujukanDetailView rujukan={selectedRujukan} />
              </div>
            </div>
          </div>
        )}

        {/* Dokumen Manager Modal */}
        {showDokumenModal && selectedRujukan && (
          <div className="modal-overlay">
            <div className="modal-content modal-large">
              <div className="modal-header">
                <h2>Kelola Dokumen - #{selectedRujukan.id}</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowDokumenModal(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <DokumenManager rujukanId={selectedRujukan.id} />
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

// Status Update Form Component
const StatusUpdateForm = ({ rujukan, onSubmit, onCancel }) => {
  const [statusData, setStatusData] = useState({
    status: 'diterima',
    catatan_tujuan: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(statusData);
  };

  return (
    <form onSubmit={handleSubmit} className="status-form">
      <div className="form-group">
        <label>Status Baru</label>
        <select
          value={statusData.status}
          onChange={(e) => setStatusData(prev => ({ ...prev, status: e.target.value }))}
          required
        >
          <option value="diterima">Diterima</option>
          <option value="ditolak">Ditolak</option>
          <option value="selesai">Selesai</option>
        </select>
      </div>
      
      <div className="form-group">
        <label>Catatan</label>
        <textarea
          value={statusData.catatan_tujuan}
          onChange={(e) => setStatusData(prev => ({ ...prev, catatan_tujuan: e.target.value }))}
          rows="3"
          placeholder="Masukkan catatan untuk perubahan status..."
        />
      </div>
      
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Batal
        </button>
        <button type="submit" className="btn btn-primary">
          Update Status
        </button>
      </div>
    </form>
  );
};

// Cancel Rujukan Form Component
const CancelRujukanForm = ({ rujukan, onSubmit, onCancel }) => {
  const [cancelData, setCancelData] = useState({
    alasan_pembatalan: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(cancelData);
  };

  return (
    <form onSubmit={handleSubmit} className="cancel-form">
      <div className="form-group">
        <label>Alasan Pembatalan</label>
        <textarea
          value={cancelData.alasan_pembatalan}
          onChange={(e) => setCancelData(prev => ({ ...prev, alasan_pembatalan: e.target.value }))}
          rows="3"
          placeholder="Masukkan alasan pembatalan rujukan..."
          required
        />
      </div>
      
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Batal
        </button>
        <button type="submit" className="btn btn-danger">
          Batalkan Rujukan
        </button>
      </div>
    </form>
  );
};

// Rujukan Detail View Component
const RujukanDetailView = ({ rujukan }) => {
  return (
    <div className="rujukan-detail">
      <div className="detail-section">
        <h3>📋 Informasi Rujukan</h3>
        <div className="detail-grid">
          <div className="detail-item">
            <label>No. Rujukan:</label>
            <span>#{rujukan.id}</span>
          </div>
          <div className="detail-item">
            <label>Status:</label>
            <span className={`status-badge status-${rujukan.status}`}>
              {rujukan.status}
            </span>
          </div>
          <div className="detail-item">
            <label>Tanggal Dibuat:</label>
            <span>{new Date(rujukan.created_at).toLocaleString('id-ID')}</span>
          </div>
          <div className="detail-item">
            <label>Transportasi:</label>
            <span>{rujukan.transport_type}</span>
          </div>
        </div>
      </div>
      
      <div className="detail-section">
        <h3>👤 Data Pasien</h3>
        <div className="detail-grid">
          <div className="detail-item">
            <label>Nama:</label>
            <span>{rujukan.nama_pasien}</span>
          </div>
          <div className="detail-item">
            <label>NIK:</label>
            <span>{rujukan.nik}</span>
          </div>
          <div className="detail-item">
            <label>Jenis Kelamin:</label>
            <span>{rujukan.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
          </div>
          <div className="detail-item">
            <label>Telepon:</label>
            <span>{rujukan.telepon}</span>
          </div>
        </div>
      </div>
      
      <div className="detail-section">
        <h3>🏥 Data Medis</h3>
        <div className="detail-grid">
          <div className="detail-item full-width">
            <label>Diagnosa:</label>
            <span>{rujukan.diagnosa}</span>
          </div>
          <div className="detail-item full-width">
            <label>Alasan Rujukan:</label>
            <span>{rujukan.alasan_rujukan}</span>
          </div>
          <div className="detail-item full-width">
            <label>Catatan:</label>
            <span>{rujukan.catatan_asal || 'Tidak ada catatan'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedRujukanPage;
