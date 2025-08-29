import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Layout from './Layout';
import DokumenManager from './DokumenManager';
import { useAuth } from '../context/AuthContext';
import './RujukanPage.css';

const RujukanPage = () => {
  const { user } = useAuth();
  const [rujukan, setRujukan] = useState([]);
  const [, setPasien] = useState([]);
  const [faskes, setFaskes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDokumenModal, setShowDokumenModal] = useState(false);
  const [selectedRujukan, setSelectedRujukan] = useState(null);
  const [formData, setFormData] = useState({
    // Data Pasien
    nik: '',
    nama_pasien: '',
    tanggal_lahir: '',
    jenis_kelamin: 'L',
    alamat: '',
    telepon: '',
    // Data Rujukan
    faskes_asal_id: '',
    faskes_tujuan_id: '',
    diagnosa: '',
    alasan_rujukan: '',
    catatan_asal: ''
  });
  const [searchNik, setSearchNik] = useState('');
  const [foundPasien, setFoundPasien] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isNewPasien, setIsNewPasien] = useState(false);
  const [statusData, setStatusData] = useState({
    status: 'diterima',
    catatan_tujuan: ''
  });
  const [cancelData, setCancelData] = useState({
    alasan_pembatalan: ''
  });
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      console.log('Fetching data with token:', token ? 'Token exists' : 'No token');
      
      // Fetch faskes terpisah untuk debugging
      try {
        const faskesRes = await axios.get('http://localhost:3001/api/faskes', { headers });
        console.log('Faskes response:', faskesRes.data);
        if (faskesRes.data.success) {
          setFaskes(faskesRes.data.data);
          console.log('✅ Faskes data set:', faskesRes.data.data);
        } else {
          console.error('❌ Faskes API error:', faskesRes.data.message);
        }
      } catch (faskesError) {
        console.error('❌ Error fetching faskes:', faskesError.response?.data || faskesError.message);
      }
      
      // Fetch rujukan terpisah untuk debugging
      try {
        console.log('🔍 Fetching rujukan data...');
        const rujukanRes = await axios.get('http://localhost:3001/api/rujukan', { headers });
        console.log('📡 Rujukan response status:', rujukanRes.status);
        console.log('📡 Rujukan response data:', rujukanRes.data);
        
        if (rujukanRes.data.success) {
          console.log('✅ Rujukan API success');
          console.log('📊 Rujukan data length:', rujukanRes.data.data ? rujukanRes.data.data.length : 'null');
          console.log('📋 Rujukan data:', rujukanRes.data.data);
          
          setRujukan(rujukanRes.data.data || []);
          console.log('✅ Rujukan state set successfully');
        } else {
          console.error('❌ Rujukan API error:', rujukanRes.data.message);
          setRujukan([]);
        }
      } catch (rujukanError) {
        console.error('❌ Error fetching rujukan:', rujukanError);
        console.error('❌ Error response:', rujukanError.response?.data);
        console.error('❌ Error status:', rujukanError.response?.status);
        setRujukan([]);
      }
      
      // Fetch pasien
      try {
        const pasienRes = await axios.get('http://localhost:3001/api/pasien', { headers });
        console.log('Pasien response:', pasienRes.data);
        if (pasienRes.data.success) {
          setPasien(pasienRes.data.data);
          console.log('✅ Pasien data set:', pasienRes.data.data);
        } else {
          console.error('❌ Pasien API error:', pasienRes.data.message);
        }
      } catch (pasienError) {
        console.error('❌ Error fetching pasien:', pasienError.response?.data || pasienError.message);
      }
    } catch (error) {
      setError('Gagal memuat data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSearchPasien = async () => {
    if (!searchNik || searchNik.length !== 16) {
      setError('NIK harus 16 digit');
      return;
    }

    setIsSearching(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await axios.get(`http://localhost:3001/api/pasien/search?nik=${searchNik}`, { headers });
      
      if (response.data.success && response.data.data) {
        const pasien = response.data.data;
        setFoundPasien(pasien);
        setIsNewPasien(false);
        
        // Auto-fill form dengan data pasien yang ditemukan
        setFormData({
          ...formData,
          nik: pasien.nik,
          nama_pasien: pasien.nama_lengkap,
          tanggal_lahir: pasien.tanggal_lahir,
          jenis_kelamin: pasien.jenis_kelamin,
          alamat: pasien.alamat,
          telepon: pasien.telepon || ''
        });
      } else {
        setFoundPasien(null);
        setIsNewPasien(true);
        
        // Set NIK untuk pasien baru
        setFormData({
          ...formData,
          nik: searchNik
        });
      }
    } catch (error) {
      console.error('Error searching pasien:', error);
      setFoundPasien(null);
      setIsNewPasien(true);
      
      // Set NIK untuk pasien baru
      setFormData({
        ...formData,
        nik: searchNik
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Frontend validation
    const requiredFields = {
      nik: 'NIK',
      nama_pasien: 'Nama Pasien',
      tanggal_lahir: 'Tanggal Lahir',
      jenis_kelamin: 'Jenis Kelamin',
      alamat: 'Alamat',
      faskes_tujuan_id: 'Faskes Tujuan',
      diagnosa: 'Diagnosa',
      alasan_rujukan: 'Alasan Rujukan'
    };

    // Tambahkan faskes_asal_id untuk admin pusat
    if (user && user.role === 'admin_pusat') {
      requiredFields.faskes_asal_id = 'Faskes Asal';
    }

    const missingFields = [];
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field] || formData[field].toString().trim() === '') {
        missingFields.push(label);
      }
    }

    if (missingFields.length > 0) {
      setError(`Field berikut wajib diisi: ${missingFields.join(', ')}`);
      return;
    }

    // Validate NIK
    if (formData.nik.length !== 16) {
      setError('NIK harus 16 digit');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await axios.post('http://localhost:3001/api/rujukan/with-pasien', formData, { headers });
      
      if (response.data.success) {
        setShowForm(false);
        resetForm();
        fetchData();
        // Show success message
        alert('Rujukan berhasil dibuat!');
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error creating rujukan:', error);
      setError(error.response?.data?.message || 'Gagal membuat rujukan');
    }
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await axios.put(
        `http://localhost:3001/api/rujukan/${selectedRujukan.id}/status`,
        statusData,
        { headers }
      );
      
      if (response.data.success) {
        setShowStatusModal(false);
        setSelectedRujukan(null);
        setStatusData({ status: 'diterima', catatan_tujuan: '' });
        fetchData();
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setError(error.response?.data?.message || 'Gagal mengupdate status');
    }
  };

  const handleCancelSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await axios.put(
        `http://localhost:3001/api/rujukan/${selectedRujukan.id}/cancel`,
        cancelData,
        { headers }
      );
      
      if (response.data.success) {
        setShowCancelModal(false);
        setSelectedRujukan(null);
        setCancelData({ alasan_pembatalan: '' });
        fetchData();
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error cancelling rujukan:', error);
      setError(error.response?.data?.message || 'Gagal membatalkan rujukan');
    }
  };

  const resetForm = () => {
    setFormData({
      nik: '',
      nama_pasien: '',
      tanggal_lahir: '',
      jenis_kelamin: 'L',
      alamat: '',
      telepon: '',
      faskes_asal_id: '',
      faskes_tujuan_id: '',
      diagnosa: '',
      alasan_rujukan: '',
      catatan_asal: ''
    });
    setSearchNik('');
    setFoundPasien(null);
    setIsNewPasien(false);
  };

  const getStatusBadge = (status) => {
    const badges = {
      'pending': 'badge-warning',
      'diterima': 'badge-success',
      'ditolak': 'badge-danger',
      'selesai': 'badge-info',
      'dibatalkan': 'badge-secondary'
    };
    return badges[status] || 'badge-secondary';
  };

  const getStatusText = (status) => {
    const texts = {
      'pending': 'Menunggu',
      'diterima': 'Diterima',
      'ditolak': 'Ditolak',
      'selesai': 'Selesai',
      'dibatalkan': 'Dibatalkan'
    };
    return texts[status] || status;
  };

  const canCancel = (rujukan) => {
    // Hanya rujukan dengan status pending yang bisa dibatalkan
    return rujukan.status === 'pending';
  };

  const canUpdateStatus = (rujukan) => {
    // Hanya rujukan dengan status pending yang bisa diupdate
    return rujukan.status === 'pending';
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading">Memuat data rujukan...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="rujukan-page">
        <div className="page-header">
          <h1>Manajemen Rujukan</h1>
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            + Buat Rujukan Baru
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>No. Rujukan</th>
                <th>Pasien</th>
                <th>Faskes Asal</th>
                <th>Faskes Tujuan</th>
                <th>Diagnosa</th>
                <th>Status</th>
                <th>Tanggal</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rujukan.map((r) => (
                <tr key={r.id}>
                  <td>{r.nomor_rujukan}</td>
                  <td>
                    <div>
                      <strong>{r.nama_pasien}</strong>
                      <br />
                      <small>NIK: {r.nik_pasien}</small>
                    </div>
                  </td>
                  <td>{r.faskes_asal_nama}</td>
                  <td>{r.faskes_tujuan_nama}</td>
                  <td className="diagnosa-cell">{r.diagnosa}</td>
                  <td>
                    <span className={`badge ${getStatusBadge(r.status)}`}>
                      {getStatusText(r.status)}
                    </span>
                  </td>
                  <td>
                    {new Date(r.tanggal_rujukan).toLocaleDateString('id-ID')}
                  </td>
                  <td>
                    <div className="action-buttons">
                      {canUpdateStatus(r) && (
                        <button 
                          className="btn-edit"
                          onClick={() => {
                            setSelectedRujukan(r);
                            setShowStatusModal(true);
                          }}
                        >
                          Update Status
                        </button>
                      )}
                      {canCancel(r) && (
                        <button 
                          className="btn-cancel"
                          onClick={() => {
                            setSelectedRujukan(r);
                            setShowCancelModal(true);
                          }}
                        >
                          Batalkan
                        </button>
                      )}
                      <button 
                        className="btn-view"
                        onClick={() => {
                          setSelectedRujukan(r);
                          // Show detail modal
                        }}
                      >
                        Detail
                      </button>
                      <button 
                        className="btn-dokumen"
                        onClick={() => {
                          setSelectedRujukan(r);
                          setShowDokumenModal(true);
                        }}
                      >
                        📁 Dokumen
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {rujukan.length === 0 && (
            <div className="no-data">
              <p>Tidak ada data rujukan</p>
            </div>
          )}
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Buat Rujukan Baru</h2>
                <button className="modal-close" onClick={() => setShowForm(false)}>×</button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="form-section">
                  <h3>Data Pasien</h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>NIK</label>
                      <div className="search-container">
                        <input
                          type="text"
                          value={searchNik}
                          onChange={(e) => setSearchNik(e.target.value)}
                          placeholder="Masukkan NIK (16 digit)"
                          maxLength={16}
                        />
                        <button 
                          type="button" 
                          onClick={handleSearchPasien}
                          disabled={isSearching}
                        >
                          {isSearching ? 'Mencari...' : 'Cari'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {foundPasien && (
                    <div className="found-pasien">
                      <p>✅ Pasien ditemukan: <strong>{foundPasien.nama_lengkap}</strong></p>
                      <button 
                        type="button" 
                        onClick={() => {
                          setFormData({
                            ...formData,
                            nik: foundPasien.nik,
                            nama_pasien: foundPasien.nama_lengkap,
                            tanggal_lahir: foundPasien.tanggal_lahir,
                            jenis_kelamin: foundPasien.jenis_kelamin,
                            alamat: foundPasien.alamat,
                            telepon: foundPasien.telepon || ''
                          });
                        }}
                        className="btn-secondary"
                      >
                        Gunakan Data Pasien Ini
                      </button>
                    </div>
                  )}

                  {(isNewPasien || foundPasien) && (
                    <div className="new-pasien-form">
                      <div className="form-row">
                        <div className="form-group">
                          <label>Nama Pasien *</label>
                          <input
                            type="text"
                            name="nama_pasien"
                            value={formData.nama_pasien}
                            onChange={handleInputChange}
                            required
                            placeholder="Masukkan nama lengkap pasien"
                          />
                        </div>
                        <div className="form-group">
                          <label>Tanggal Lahir *</label>
                          <input
                            type="date"
                            name="tanggal_lahir"
                            value={formData.tanggal_lahir}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="form-row">
                        <div className="form-group">
                          <label>Jenis Kelamin *</label>
                          <select
                            name="jenis_kelamin"
                            value={formData.jenis_kelamin}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Pilih Jenis Kelamin</option>
                            <option value="L">Laki-laki</option>
                            <option value="P">Perempuan</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Telepon</label>
                          <input
                            type="tel"
                            name="telepon"
                            value={formData.telepon}
                            onChange={handleInputChange}
                            placeholder="Nomor telepon (opsional)"
                          />
                        </div>
                      </div>
                      
                      <div className="form-group">
                        <label>Alamat *</label>
                        <textarea
                          name="alamat"
                          value={formData.alamat}
                          onChange={handleInputChange}
                          required
                          placeholder="Masukkan alamat lengkap pasien"
                          rows="3"
                        />
                      </div>
                    </div>
                  )}

                  <div className="form-section">
                    <h3>Data Rujukan</h3>
                    
                    <div className="form-row">
                      {/* Field faskes asal hanya untuk admin pusat */}
                      {user && user.role === 'admin_pusat' && (
                        <div className="form-group">
                          <label>Faskes Asal *</label>
                          <select
                            name="faskes_asal_id"
                            value={formData.faskes_asal_id}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Pilih Faskes Asal</option>
                            {faskes.map((f) => (
                              <option key={f.id} value={f.id}>
                                {f.nama_faskes} ({f.tipe})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      
                      <div className="form-group">
                        <label>Faskes Tujuan *</label>
                        <select
                          name="faskes_tujuan_id"
                          value={formData.faskes_tujuan_id}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Pilih Faskes Tujuan</option>
                          {faskes.map((f) => (
                            <option key={f.id} value={f.id}>
                              {f.nama_faskes} ({f.tipe})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label>Diagnosa *</label>
                      <textarea
                        name="diagnosa"
                        value={formData.diagnosa}
                        onChange={handleInputChange}
                        required
                        placeholder="Masukkan diagnosa pasien"
                        rows="3"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Alasan Rujukan *</label>
                      <textarea
                        name="alasan_rujukan"
                        value={formData.alasan_rujukan}
                        onChange={handleInputChange}
                        required
                        placeholder="Masukkan alasan rujukan"
                        rows="3"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Catatan Asal</label>
                      <textarea
                        name="catatan_asal"
                        value={formData.catatan_asal}
                        onChange={handleInputChange}
                        placeholder="Catatan tambahan (opsional)"
                        rows="2"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button type="button" onClick={() => setShowForm(false)}>
                    Batal
                  </button>
                  <button type="submit" className="btn-primary">
                    Buat Rujukan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Status Update Modal */}
        {showStatusModal && selectedRujukan && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Update Status Rujukan</h2>
                <button className="modal-close" onClick={() => setShowStatusModal(false)}>×</button>
              </div>
              
              <div className="rujukan-info">
                <p><strong>No. Rujukan:</strong> {selectedRujukan.nomor_rujukan}</p>
                <p><strong>Pasien:</strong> {selectedRujukan.nama_pasien}</p>
                <p><strong>Faskes Tujuan:</strong> {selectedRujukan.faskes_tujuan_nama}</p>
              </div>
              
              <form onSubmit={handleStatusSubmit}>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={statusData.status}
                    onChange={(e) => setStatusData({...statusData, status: e.target.value})}
                    required
                  >
                    <option value="diterima">Diterima</option>
                    <option value="ditolak">Ditolak</option>
                    <option value="selesai">Selesai</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Catatan Tujuan</label>
                  <textarea
                    value={statusData.catatan_tujuan}
                    onChange={(e) => setStatusData({...statusData, catatan_tujuan: e.target.value})}
                    placeholder="Catatan dari faskes tujuan..."
                  />
                </div>
                
                <div className="modal-footer">
                  <button type="button" onClick={() => setShowStatusModal(false)}>
                    Batal
                  </button>
                  <button type="submit" className="btn-primary">
                    Update Status
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Cancel Rujukan Modal */}
        {showCancelModal && selectedRujukan && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Batalkan Rujukan</h2>
                <button className="modal-close" onClick={() => setShowCancelModal(false)}>×</button>
              </div>
              
              <div className="rujukan-info">
                <p><strong>No. Rujukan:</strong> {selectedRujukan.nomor_rujukan}</p>
                <p><strong>Pasien:</strong> {selectedRujukan.nama_pasien}</p>
                <p><strong>Faskes Tujuan:</strong> {selectedRujukan.faskes_tujuan_nama}</p>
                <p><strong>Status Saat Ini:</strong> {getStatusText(selectedRujukan.status)}</p>
              </div>
              
              <form onSubmit={handleCancelSubmit}>
                <div className="form-group">
                  <label>Alasan Pembatalan *</label>
                  <textarea
                    value={cancelData.alasan_pembatalan}
                    onChange={(e) => setCancelData({...cancelData, alasan_pembatalan: e.target.value})}
                    placeholder="Masukkan alasan pembatalan rujukan..."
                    required
                  />
                </div>
                
                <div className="warning-message">
                  <p>⚠️ <strong>Peringatan:</strong> Pembatalan rujukan tidak dapat dibatalkan kembali.</p>
                </div>
                
                <div className="modal-footer">
                  <button type="button" onClick={() => setShowCancelModal(false)}>
                    Batal
                  </button>
                  <button type="submit" className="btn-danger">
                    Batalkan Rujukan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Dokumen Manager Modal */}
        {showDokumenModal && selectedRujukan && (
          <div className="modal-overlay dokumen-modal-overlay">
            <DokumenManager 
              rujukanId={selectedRujukan.id}
              onClose={() => setShowDokumenModal(false)}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RujukanPage;
