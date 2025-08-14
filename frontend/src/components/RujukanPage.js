import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from './Layout';
import './RujukanPage.css';

const RujukanPage = () => {
  const [rujukan, setRujukan] = useState([]);
  const [pasien, setPasien] = useState([]);
  const [faskes, setFaskes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
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
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
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
  };

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
      
      // Cari pasien berdasarkan NIK
      const response = await axios.get(`http://localhost:3001/api/pasien/search?nik=${searchNik}`, { headers });
      
      if (response.data.success && response.data.data) {
        // Pasien ditemukan
        const pasien = response.data.data;
        console.log('Pasien ditemukan:', pasien); // Debug log
        setFoundPasien(pasien);
        setIsNewPasien(false);
        
        // Auto-fill form dengan data pasien
        // Format tanggal jika diperlukan (dari MySQL date format ke HTML date input format)
        let formattedTanggalLahir = pasien.tanggal_lahir;
        if (pasien.tanggal_lahir && typeof pasien.tanggal_lahir === 'string') {
          // Jika tanggal dalam format YYYY-MM-DD, gunakan langsung
          // Jika dalam format lain, konversi ke YYYY-MM-DD
          const date = new Date(pasien.tanggal_lahir);
          if (!isNaN(date.getTime())) {
            formattedTanggalLahir = date.toISOString().split('T')[0];
          }
        }
        
        const updatedFormData = {
          ...formData,
          nik: pasien.nik,
          nama_pasien: pasien.nama_pasien,
          tanggal_lahir: formattedTanggalLahir,
          jenis_kelamin: pasien.jenis_kelamin,
          alamat: pasien.alamat,
          telepon: pasien.telepon || ''
        };
        console.log('Form data yang akan diupdate:', updatedFormData); // Debug log
        setFormData(updatedFormData);
      } else {
        // Pasien tidak ditemukan, mode tambah baru
        setFoundPasien(null);
        setIsNewPasien(true);
        
        // Reset form data pasien
        setFormData(prev => ({
          ...prev,
          nik: searchNik,
          nama_pasien: '',
          tanggal_lahir: '',
          jenis_kelamin: 'L',
          alamat: '',
          telepon: ''
        }));
      }
    } catch (error) {
      if (error.response?.status === 404) {
        // Pasien tidak ditemukan, mode tambah baru
        setFoundPasien(null);
        setIsNewPasien(true);
        
        setFormData(prev => ({
          ...prev,
          nik: searchNik,
          nama_pasien: '',
          tanggal_lahir: '',
          jenis_kelamin: 'L',
          alamat: '',
          telepon: ''
        }));
      } else {
        setError('Gagal mencari pasien');
        console.error('Error searching pasien:', error);
      }
    } finally {
      setIsSearching(false);
    }
  };

  const resetPasienSearch = () => {
    setSearchNik('');
    setFoundPasien(null);
    setIsNewPasien(false);
    setFormData(prev => ({
      ...prev,
      nik: '',
      nama_pasien: '',
      tanggal_lahir: '',
      jenis_kelamin: 'L',
      alamat: '',
      telepon: ''
    }));
  };

  const handleStatusChange = (e) => {
    setStatusData({
      ...statusData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      // Kirim data pasien dan rujukan sekaligus
      await axios.post('http://localhost:3001/api/rujukan/with-pasien', formData, { headers });
      fetchData();
      resetForm();
      resetPasienSearch();
      setShowForm(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      await axios.put(`http://localhost:3001/api/rujukan/${selectedRujukan.id}/status`, statusData, { headers });
      fetchData();
      setShowStatusModal(false);
      setSelectedRujukan(null);
      setStatusData({ status: 'diterima', catatan_tujuan: '' });
    } catch (error) {
      setError(error.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  const handleStatusUpdate = (rujukan) => {
    setSelectedRujukan(rujukan);
    setShowStatusModal(true);
  };

  const resetForm = () => {
    setFormData({
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
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { text: 'Menunggu', class: 'status-pending' },
      diterima: { text: 'Diterima', class: 'status-accepted' },
      ditolak: { text: 'Ditolak', class: 'status-rejected' },
      selesai: { text: 'Selesai', class: 'status-completed' }
    };
    
    const config = statusConfig[status] || { text: status, class: 'status-pending' };
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  const getFaskesName = (id) => {
    const faskesItem = faskes.find(f => f.id === id);
    return faskesItem ? faskesItem.nama_faskes : 'Unknown';
  };

  const getPasienName = (id) => {
    const pasienItem = pasien.find(p => p.id === id);
    return pasienItem ? pasienItem.nama_pasien : 'Unknown';
  };

  // Fungsi untuk mendapatkan nama pasien dari data rujukan (jika sudah ada nama_pasien)
  const getPasienNameFromRujukan = (rujukan) => {
    return rujukan.nama_pasien || getPasienName(rujukan.pasien_id);
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
          <button 
            className="btn-primary"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            + Buat Rujukan
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Form Modal untuk Buat Rujukan */}
        {showForm && (
          <div className="form-modal">
            <div className="form-content">
              <div className="form-header">
                <h2>Buat Rujukan Baru</h2>
                <button 
                  className="close-btn"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Pencarian Pasien */}
                <div className="form-section">
                  <h3>🔍 Pencarian Pasien</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>NIK Pasien</label>
                      <div className="search-container">
                        <input
                          type="text"
                          value={searchNik}
                          onChange={(e) => setSearchNik(e.target.value)}
                          placeholder="Masukkan 16 digit NIK"
                          maxLength="16"
                          pattern="[0-9]{16}"
                          title="NIK harus 16 digit angka"
                        />
                        <button
                          type="button"
                          className="btn-search"
                          onClick={handleSearchPasien}
                          disabled={isSearching}
                        >
                          {isSearching ? '🔍 Mencari...' : '🔍 Cari'}
                        </button>
                      </div>
                    </div>
                    <div className="form-group">
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={resetPasienSearch}
                      >
                        🔄 Reset
                      </button>
                    </div>
                  </div>

                  {/* Status Pencarian */}
                  {foundPasien && (
                    <div className="search-result success">
                      ✅ Pasien ditemukan: <strong>{foundPasien.nama_pasien}</strong> (NIK: {foundPasien.nik})
                    </div>
                  )}
                  {isNewPasien && (
                    <div className="search-result info">
                      ℹ️ Pasien baru akan dibuat dengan NIK: <strong>{searchNik}</strong>
                    </div>
                  )}
                </div>

                {/* Data Pasien */}
                <div className="form-section">
                  <h3>📋 Data Pasien</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>NIK *</label>
                      <input
                        type="text"
                        name="nik"
                        value={formData.nik}
                        onChange={handleInputChange}
                        required
                        placeholder="16 digit NIK"
                        maxLength="16"
                        pattern="[0-9]{16}"
                        title="NIK harus 16 digit angka"
                        readOnly={foundPasien !== null}
                      />
                    </div>
                    <div className="form-group">
                      <label>Nama Pasien *</label>
                      <input
                        type="text"
                        name="nama_pasien"
                        value={formData.nama_pasien}
                        onChange={handleInputChange}
                        required
                        placeholder="Nama lengkap pasien"
                      />
                    </div>
                  </div>

                  <div className="form-row">
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
                    <div className="form-group">
                      <label>Jenis Kelamin *</label>
                      <select
                        name="jenis_kelamin"
                        value={formData.jenis_kelamin}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="L">Laki-laki</option>
                        <option value="P">Perempuan</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Alamat *</label>
                      <textarea
                        name="alamat"
                        value={formData.alamat}
                        onChange={handleInputChange}
                        placeholder="Alamat lengkap"
                        rows="2"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Telepon</label>
                      <input
                        type="tel"
                        name="telepon"
                        value={formData.telepon}
                        onChange={handleInputChange}
                        placeholder="08123456789"
                      />
                    </div>
                  </div>
                </div>

                {/* Data Rujukan */}
                <div className="form-section">
                  <h3>📄 Data Rujukan</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Faskes Asal *</label>
                      <select
                        name="faskes_asal_id"
                        value={formData.faskes_asal_id}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Pilih Faskes Asal</option>
                        {console.log('🔍 Rendering faskes dropdown, count:', faskes.length, 'faskes:', faskes)}
                        {faskes && faskes.length > 0 ? (
                          faskes.map((f) => {
                            console.log('📋 Faskes item:', f);
                            return (
                              <option key={f.id} value={f.id}>
                                {f.nama_faskes} ({f.tipe})
                              </option>
                            );
                          })
                        ) : (
                          <option value="" disabled>Loading faskes...</option>
                        )}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Faskes Tujuan *</label>
                      <select
                        name="faskes_tujuan_id"
                        value={formData.faskes_tujuan_id}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Pilih Faskes Tujuan</option>
                        {faskes && faskes.length > 0 ? (
                          faskes.map((f) => (
                            <option key={f.id} value={f.id}>
                              {f.nama_faskes} ({f.tipe})
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>Loading faskes...</option>
                        )}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Diagnosa *</label>
                    <textarea
                      name="diagnosa"
                      value={formData.diagnosa}
                      onChange={handleInputChange}
                      placeholder="Masukkan diagnosa pasien"
                      rows="3"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Alasan Rujukan *</label>
                    <textarea
                      name="alasan_rujukan"
                      value={formData.alasan_rujukan}
                      onChange={handleInputChange}
                      placeholder="Alasan mengapa pasien dirujuk"
                      rows="3"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Catatan Asal</label>
                    <textarea
                      name="catatan_asal"
                      value={formData.catatan_asal}
                      onChange={handleInputChange}
                      placeholder="Catatan tambahan dari faskes asal"
                      rows="3"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}>
                    Batal
                  </button>
                  <button type="submit" className="btn-primary">
                    {foundPasien ? 'Update Pasien & Buat Rujukan' : 'Buat Pasien & Rujukan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal untuk Update Status */}
        {showStatusModal && selectedRujukan && (
          <div className="form-modal">
            <div className="form-content">
              <div className="form-header">
                <h2>Update Status Rujukan</h2>
                <button 
                  className="close-btn"
                  onClick={() => {
                    setShowStatusModal(false);
                    setSelectedRujukan(null);
                  }}
                >
                  ×
                </button>
              </div>

              <div className="rujukan-info">
                <p><strong>Nomor Rujukan:</strong> {selectedRujukan.nomor_rujukan}</p>
                <p><strong>Pasien:</strong> {getPasienNameFromRujukan(selectedRujukan)}</p>
                <p><strong>Faskes Tujuan:</strong> {selectedRujukan.faskes_tujuan_nama || getFaskesName(selectedRujukan.faskes_tujuan_id)}</p>
                <p><strong>Diagnosa:</strong> {selectedRujukan.diagnosa}</p>
              </div>

              <form onSubmit={handleStatusSubmit}>
                <div className="form-group">
                  <label>Status *</label>
                  <select
                    name="status"
                    value={statusData.status}
                    onChange={handleStatusChange}
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
                    name="catatan_tujuan"
                    value={statusData.catatan_tujuan}
                    onChange={handleStatusChange}
                    placeholder="Catatan dari faskes tujuan"
                    rows="3"
                  />
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => {
                    setShowStatusModal(false);
                    setSelectedRujukan(null);
                  }}>
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

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>No Rujukan</th>
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
               {console.log('🔍 Rendering rujukan table, count:', rujukan.length, 'data:', rujukan)}
               {rujukan.map((r) => (
                <tr key={r.id}>
                  <td>{r.nomor_rujukan}</td>
                  <td>{getPasienNameFromRujukan(r)}</td>
                  <td>{r.faskes_asal_nama || getFaskesName(r.faskes_asal_id)}</td>
                  <td>{r.faskes_tujuan_nama || getFaskesName(r.faskes_tujuan_id)}</td>
                  <td className="diagnosa-cell">{r.diagnosa}</td>
                  <td>{getStatusBadge(r.status)}</td>
                  <td>{formatDate(r.tanggal_rujukan)}</td>
                  <td>
                    <div className="action-buttons">
                      {r.status === 'pending' && (
                        <button 
                          className="btn-status"
                          onClick={() => handleStatusUpdate(r)}
                        >
                          Update Status
                        </button>
                      )}
                      <button 
                        className="btn-view"
                        onClick={() => {
                          setSelectedRujukan(r);
                          setShowStatusModal(true);
                        }}
                      >
                        Detail
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {rujukan.length === 0 && (
            <div className="empty-state">
              <p>Belum ada data rujukan</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default RujukanPage;
