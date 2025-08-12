import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from './Layout';
import './TempatTidurPage.css';

const TempatTidurPage = () => {
  const [tempatTidur, setTempatTidur] = useState([]);
  const [statistik, setStatistik] = useState([]);
  const [faskes, setFaskes] = useState([]);
  const [pasien, setPasien] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [editingBed, setEditingBed] = useState(null);
  const [statusBed, setStatusBed] = useState(null);
  const [error, setError] = useState('');
  const [filterFaskes, setFilterFaskes] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterTipe, setFilterTipe] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [tempatTidurRes, statistikRes, faskesRes, pasienRes] = await Promise.all([
        axios.get('http://localhost:3001/api/tempat-tidur', { headers }),
        axios.get('http://localhost:3001/api/tempat-tidur/statistik', { headers }),
        axios.get('http://localhost:3001/api/faskes', { headers }),
        axios.get('http://localhost:3001/api/pasien', { headers })
      ]);

      setTempatTidur(tempatTidurRes.data.data);
      setStatistik(statistikRes.data.data);
      setFaskes(faskesRes.data.data);
      setPasien(pasienRes.data.data);
    } catch (error) {
      setError('Gagal memuat data tempat tidur');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBed = () => {
    setEditingBed({
      faskes_id: '',
      nomor_kamar: '',
      nomor_bed: '',
      tipe_kamar: '',
      catatan: ''
    });
    setShowModal(true);
  };

  const handleEditBed = (bed) => {
    setEditingBed({
      id: bed.id,
      faskes_id: bed.faskes_id,
      nomor_kamar: bed.nomor_kamar,
      nomor_bed: bed.nomor_bed,
      tipe_kamar: bed.tipe_kamar,
      catatan: bed.catatan
    });
    setShowModal(true);
  };

  const handleStatusChange = (bed) => {
    setStatusBed({
      id: bed.id,
      status: bed.status,
      pasien_id: bed.pasien_id || '',
      tanggal_masuk: bed.tanggal_masuk || '',
      catatan: bed.catatan || ''
    });
    setShowStatusModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      if (editingBed.id) {
        // Update
        await axios.put(`http://localhost:3001/api/tempat-tidur/${editingBed.id}`, editingBed, { headers });
      } else {
        // Create
        await axios.post('http://localhost:3001/api/tempat-tidur', editingBed, { headers });
      }
      
      setShowModal(false);
      setEditingBed(null);
      fetchData();
    } catch (error) {
      setError(error.response?.data?.message || 'Gagal menyimpan data');
    }
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      await axios.put(`http://localhost:3001/api/tempat-tidur/${statusBed.id}/status`, statusBed, { headers });
      
      setShowStatusModal(false);
      setStatusBed(null);
      fetchData();
    } catch (error) {
      setError(error.response?.data?.message || 'Gagal mengupdate status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus tempat tidur ini?')) {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        
        await axios.delete(`http://localhost:3001/api/tempat-tidur/${id}`, { headers });
        fetchData();
      } catch (error) {
        setError(error.response?.data?.message || 'Gagal menghapus data');
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'tersedia': 'badge-success',
      'terisi': 'badge-danger',
      'maintenance': 'badge-warning',
      'reserved': 'badge-info'
    };
    return badges[status] || 'badge-secondary';
  };

  const getTipeBadge = (tipe) => {
    const badges = {
      'VIP': 'badge-vip',
      'Kelas 1': 'badge-kelas1',
      'Kelas 2': 'badge-kelas2',
      'Kelas 3': 'badge-kelas3',
      'ICU': 'badge-icu',
      'NICU': 'badge-nicu',
      'PICU': 'badge-picu'
    };
    return badges[tipe] || 'badge-secondary';
  };

  const filteredTempatTidur = tempatTidur.filter(bed => {
    const faskesMatch = !filterFaskes || bed.faskes_id == filterFaskes;
    const statusMatch = !filterStatus || bed.status === filterStatus;
    const tipeMatch = !filterTipe || bed.tipe_kamar === filterTipe;
    return faskesMatch && statusMatch && tipeMatch;
  });

  if (loading) {
    return (
      <Layout>
        <div className="loading">Memuat data tempat tidur...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="tempat-tidur-page">
        <div className="page-header">
          <h1>Manajemen Tempat Tidur</h1>
          <button className="btn btn-primary" onClick={handleAddBed}>
            <i className="icon">➕</i>
            Tambah Tempat Tidur
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        {/* Statistik */}
        <div className="statistik-section">
          <h2>Statistik Ketersediaan Tempat Tidur</h2>
          <div className="statistik-grid">
            {statistik.map((stat) => (
              <div key={stat.nama_faskes} className="statistik-card">
                <h3>{stat.nama_faskes}</h3>
                <div className="statistik-details">
                  <div className="stat-item">
                    <span className="label">Total:</span>
                    <span className="value">{stat.total_bed}</span>
                  </div>
                  <div className="stat-item">
                    <span className="label">Tersedia:</span>
                    <span className="value success">{stat.tersedia}</span>
                  </div>
                  <div className="stat-item">
                    <span className="label">Terisi:</span>
                    <span className="value danger">{stat.terisi}</span>
                  </div>
                  <div className="stat-item">
                    <span className="label">Maintenance:</span>
                    <span className="value warning">{stat.maintenance}</span>
                  </div>
                  <div className="stat-item">
                    <span className="label">Reserved:</span>
                    <span className="value info">{stat.reserved}</span>
                  </div>
                  <div className="stat-item">
                    <span className="label">Persentase Tersedia:</span>
                    <span className="value">{stat.persentase_tersedia}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter */}
        <div className="filter-section">
          <h2>Daftar Tempat Tidur</h2>
          <div className="filter-controls">
            <select 
              value={filterFaskes} 
              onChange={(e) => setFilterFaskes(e.target.value)}
              className="filter-select"
            >
              <option value="">Semua Faskes</option>
              {faskes.map(f => (
                <option key={f.id} value={f.id}>{f.nama_faskes}</option>
              ))}
            </select>
            
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="">Semua Status</option>
              <option value="tersedia">Tersedia</option>
              <option value="terisi">Terisi</option>
              <option value="maintenance">Maintenance</option>
              <option value="reserved">Reserved</option>
            </select>
            
            <select 
              value={filterTipe} 
              onChange={(e) => setFilterTipe(e.target.value)}
              className="filter-select"
            >
              <option value="">Semua Tipe</option>
              <option value="VIP">VIP</option>
              <option value="Kelas 1">Kelas 1</option>
              <option value="Kelas 2">Kelas 2</option>
              <option value="Kelas 3">Kelas 3</option>
              <option value="ICU">ICU</option>
              <option value="NICU">NICU</option>
              <option value="PICU">PICU</option>
            </select>
          </div>
        </div>

        {/* Tabel Tempat Tidur */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Faskes</th>
                <th>Kamar</th>
                <th>Bed</th>
                <th>Tipe</th>
                <th>Status</th>
                <th>Pasien</th>
                <th>Tanggal Masuk</th>
                <th>Catatan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredTempatTidur.map((bed) => (
                <tr key={bed.id}>
                  <td>{bed.nama_faskes}</td>
                  <td>{bed.nomor_kamar}</td>
                  <td>{bed.nomor_bed}</td>
                  <td>
                    <span className={`badge ${getTipeBadge(bed.tipe_kamar)}`}>
                      {bed.tipe_kamar}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadge(bed.status)}`}>
                      {bed.status}
                    </span>
                  </td>
                  <td>
                    {bed.pasien_id ? (
                      <div>
                        <div>{bed.nama_pasien}</div>
                        <small>{bed.no_rm}</small>
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    {bed.tanggal_masuk ? 
                      new Date(bed.tanggal_masuk).toLocaleDateString('id-ID') : 
                      '-'
                    }
                  </td>
                  <td>{bed.catatan || '-'}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleStatusChange(bed)}
                        title="Update Status"
                      >
                        🔄
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handleEditBed(bed)}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(bed.id)}
                        title="Hapus"
                        disabled={bed.status === 'terisi'}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Form */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>{editingBed.id ? 'Edit Tempat Tidur' : 'Tambah Tempat Tidur'}</h3>
                <button onClick={() => setShowModal(false)}>×</button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Faskes *</label>
                  <select 
                    value={editingBed.faskes_id} 
                    onChange={(e) => setEditingBed({...editingBed, faskes_id: e.target.value})}
                    required
                    disabled={!!editingBed.id}
                  >
                    <option value="">Pilih Faskes</option>
                    {faskes.map(f => (
                      <option key={f.id} value={f.id}>{f.nama_faskes}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Nomor Kamar *</label>
                    <input 
                      type="text" 
                      value={editingBed.nomor_kamar}
                      onChange={(e) => setEditingBed({...editingBed, nomor_kamar: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Nomor Bed *</label>
                    <input 
                      type="text" 
                      value={editingBed.nomor_bed}
                      onChange={(e) => setEditingBed({...editingBed, nomor_bed: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Tipe Kamar *</label>
                  <select 
                    value={editingBed.tipe_kamar} 
                    onChange={(e) => setEditingBed({...editingBed, tipe_kamar: e.target.value})}
                    required
                  >
                    <option value="">Pilih Tipe</option>
                    <option value="VIP">VIP</option>
                    <option value="Kelas 1">Kelas 1</option>
                    <option value="Kelas 2">Kelas 2</option>
                    <option value="Kelas 3">Kelas 3</option>
                    <option value="ICU">ICU</option>
                    <option value="NICU">NICU</option>
                    <option value="PICU">PICU</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Catatan</label>
                  <textarea 
                    value={editingBed.catatan}
                    onChange={(e) => setEditingBed({...editingBed, catatan: e.target.value})}
                    rows="3"
                  />
                </div>
                
                <div className="modal-actions">
                  <button type="button" onClick={() => setShowModal(false)}>
                    Batal
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingBed.id ? 'Update' : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Status */}
        {showStatusModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>Update Status Tempat Tidur</h3>
                <button onClick={() => setShowStatusModal(false)}>×</button>
              </div>
              <form onSubmit={handleStatusSubmit}>
                <div className="form-group">
                  <label>Status *</label>
                  <select 
                    value={statusBed.status} 
                    onChange={(e) => setStatusBed({...statusBed, status: e.target.value})}
                    required
                  >
                    <option value="">Pilih Status</option>
                    <option value="tersedia">Tersedia</option>
                    <option value="terisi">Terisi</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="reserved">Reserved</option>
                  </select>
                </div>
                
                {statusBed.status === 'terisi' && (
                  <>
                    <div className="form-group">
                      <label>Pasien</label>
                      <select 
                        value={statusBed.pasien_id} 
                        onChange={(e) => setStatusBed({...statusBed, pasien_id: e.target.value})}
                      >
                        <option value="">Pilih Pasien</option>
                        {pasien.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.nama_pasien} - {p.no_rm}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Tanggal Masuk</label>
                      <input 
                        type="datetime-local" 
                        value={statusBed.tanggal_masuk ? statusBed.tanggal_masuk.slice(0, 16) : ''}
                        onChange={(e) => setStatusBed({...statusBed, tanggal_masuk: e.target.value})}
                      />
                    </div>
                  </>
                )}
                
                <div className="form-group">
                  <label>Catatan</label>
                  <textarea 
                    value={statusBed.catatan}
                    onChange={(e) => setStatusBed({...statusBed, catatan: e.target.value})}
                    rows="3"
                  />
                </div>
                
                <div className="modal-actions">
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
      </div>
    </Layout>
  );
};

export default TempatTidurPage;
