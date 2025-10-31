import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Layout from './Layout';
import './FaskesPage.css';

const FaskesPage = () => {
  const [faskes, setFaskes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFaskes, setEditingFaskes] = useState(null);
  const [formData, setFormData] = useState({
    nama_faskes: '',
    alamat: '',
    tipe: 'Puskesmas',
    telepon: '',
    latitude: '',
    longitude: ''
  });
  const [error, setError] = useState('');
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipe, setFilterTipe] = useState('all');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchFaskes = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await axios.get('/api/faskes', { headers });
      setFaskes(response.data.data);
    } catch (error) {
      setError('Gagal memuat data faskes');
      console.error('Error fetching faskes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFaskes();
  }, [fetchFaskes]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      if (editingFaskes) {
        await axios.put(`/api/faskes/${editingFaskes.id}`, formData, { headers });
      } else {
        await axios.post('/api/faskes', formData, { headers });
      }
      
      fetchFaskes();
      resetForm();
      setShowForm(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  const handleEdit = (faskes) => {
    setEditingFaskes(faskes);
    setFormData({
      nama_faskes: faskes.nama_faskes,
      alamat: faskes.alamat,
      tipe: faskes.tipe,
      telepon: faskes.telepon || '',
      latitude: faskes.latitude || '',
      longitude: faskes.longitude || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus faskes ini?')) {
      try {
        const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      await axios.delete(`/api/faskes/${id}`, { headers });
        fetchFaskes();
      } catch (error) {
        setError(error.response?.data?.message || 'Gagal menghapus faskes');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nama_faskes: '',
      alamat: '',
      tipe: 'Puskesmas',
      telepon: '',
      latitude: '',
      longitude: ''
    });
    setEditingFaskes(null);
  };

  // Filter logic
  const filteredFaskes = faskes.filter(faskes => {
    const matchesSearch = faskes.nama_faskes.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faskes.alamat.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (faskes.telepon && faskes.telepon.includes(searchTerm));
    
    const matchesTipe = filterTipe === 'all' || faskes.tipe === filterTipe;
    
    return matchesSearch && matchesTipe;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredFaskes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedFaskes = filteredFaskes.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterTipe, itemsPerPage]);

  const getTipeBadge = (tipe) => {
    const tipeConfig = {
      'RSUD': { text: 'RSUD', class: 'tipe-rsud' },
      'Puskesmas': { text: 'Puskesmas', class: 'tipe-puskesmas' },
      'Klinik': { text: 'Klinik', class: 'tipe-klinik' },
      'RS Swasta': { text: 'RS Swasta', class: 'tipe-rs-swasta' }
    };
    
    const config = tipeConfig[tipe] || { text: tipe, class: 'tipe-default' };
    return <span className={`tipe-badge ${config.class}`}>{config.text}</span>;
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading">Memuat data faskes...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="faskes-page">
        <div className="page-header">
          <h1>Manajemen Faskes</h1>
          <button 
            className="btn-primary"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            + Tambah Faskes
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Filter Section */}
        <div className="filter-section">
          <div className="filter-controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="Cari berdasarkan nama, alamat, atau telepon..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-dropdown">
              <select
                value={filterTipe}
                onChange={(e) => setFilterTipe(e.target.value)}
                className="filter-select"
              >
                <option value="all">Semua Tipe</option>
                <option value="RSUD">RSUD</option>
                <option value="Puskesmas">Puskesmas</option>
                <option value="Klinik">Klinik</option>
                <option value="RS Swasta">RS Swasta</option>
              </select>
            </div>
            
            <div className="items-per-page">
              <label htmlFor="itemsPerPage">Tampilkan:</label>
              <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="items-select"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            
            <div className="filter-info">
              <span className="result-count">
                Menampilkan {startIndex + 1}-{Math.min(endIndex, filteredFaskes.length)} dari {filteredFaskes.length} faskes
              </span>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="form-modal">
            <div className="form-content">
              <div className="form-header">
                <h2>{editingFaskes ? 'Edit Faskes' : 'Tambah Faskes Baru'}</h2>
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
                    <label>Nama Faskes *</label>
                    <input
                      type="text"
                      name="nama_faskes"
                      value={formData.nama_faskes}
                      onChange={handleInputChange}
                      required
                      placeholder="Contoh: RSUD Dr. Soetomo"
                    />
                  </div>
                  <div className="form-group">
                    <label>Tipe Faskes *</label>
                    <select
                      name="tipe"
                      value={formData.tipe}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="RSUD">RSUD</option>
                      <option value="Puskesmas">Puskesmas</option>
                      <option value="Klinik">Klinik</option>
                      <option value="RS Swasta">RS Swasta</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Alamat *</label>
                  <textarea
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleInputChange}
                    placeholder="Alamat lengkap faskes"
                    rows="3"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Telepon</label>
                    <input
                      type="tel"
                      name="telepon"
                      value={formData.telepon}
                      onChange={handleInputChange}
                      placeholder="031-1234567"
                    />
                  </div>
                  <div className="form-group">
                    <label>Latitude</label>
                    <input
                      type="number"
                      step="any"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      placeholder="-7.2575"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Longitude</label>
                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    placeholder="112.7521"
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
                    {editingFaskes ? 'Update' : 'Simpan'}
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
                <th>Nama Faskes</th>
                <th>Tipe</th>
                <th>Alamat</th>
                <th>Telepon</th>
                <th>Koordinat</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedFaskes.map((f) => (
                <tr key={f.id}>
                  <td>{f.nama_faskes}</td>
                  <td>{getTipeBadge(f.tipe)}</td>
                  <td className="alamat-cell">{f.alamat}</td>
                  <td>{f.telepon || '-'}</td>
                  <td>
                    {f.latitude && f.longitude ? (
                      <span className="coordinates">
                        {f.latitude}, {f.longitude}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-edit"
                        onClick={() => handleEdit(f)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDelete(f.id)}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredFaskes.length === 0 && faskes.length > 0 && (
            <div className="empty-state">
              <p>Tidak ada faskes yang sesuai dengan filter</p>
            </div>
          )}
          
          {faskes.length === 0 && (
            <div className="empty-state">
              <p>Belum ada data faskes</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredFaskes.length > 0 && totalPages > 1 && (
          <div className="pagination-container">
            <div className="pagination-info">
              <span>
                Halaman {currentPage} dari {totalPages}
              </span>
            </div>
            
            <div className="pagination-controls">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                ««
              </button>
              
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                «
              </button>
              
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                »
              </button>
              
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                »»
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FaskesPage;
