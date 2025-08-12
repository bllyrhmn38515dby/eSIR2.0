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
    pasien_id: '',
    faskes_tujuan_id: '',
    diagnosa: '',
    alasan_rujukan: '',
    catatan_asal: ''
  });
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
      
      const [rujukanRes, pasienRes, faskesRes] = await Promise.all([
        axios.get('http://localhost:3001/api/rujukan', { headers }),
        axios.get('http://localhost:3001/api/pasien', { headers }),
        axios.get('http://localhost:3001/api/faskes', { headers })
      ]);

      setRujukan(rujukanRes.data.data);
      setPasien(pasienRes.data.data);
      setFaskes(faskesRes.data.data);
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
      
      await axios.post('http://localhost:3001/api/rujukan', formData, { headers });
      fetchData();
      resetForm();
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
      pasien_id: '',
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
                <div className="form-row">
                  <div className="form-group">
                    <label>Pasien *</label>
                    <select
                      name="pasien_id"
                      value={formData.pasien_id}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Pilih Pasien</option>
                      {pasien.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.no_rm} - {p.nama_pasien}
                        </option>
                      ))}
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

                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}>
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
                <p><strong>Pasien:</strong> {getPasienName(selectedRujukan.pasien_id)}</p>
                <p><strong>Faskes Tujuan:</strong> {getFaskesName(selectedRujukan.faskes_tujuan_id)}</p>
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
              {rujukan.map((r) => (
                <tr key={r.id}>
                  <td>{r.nomor_rujukan}</td>
                  <td>{getPasienName(r.pasien_id)}</td>
                  <td>{getFaskesName(r.faskes_asal_id)}</td>
                  <td>{getFaskesName(r.faskes_tujuan_id)}</td>
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
