import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Layout from './Layout';
import './PasienPage.css';

const PasienPage = () => {
  const [pasien, setPasien] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPasien, setEditingPasien] = useState(null);
  const [formData, setFormData] = useState({
    no_rm: '',
    nama_pasien: '',
    nik: '',
    tanggal_lahir: '',
    jenis_kelamin: 'L',
    alamat: '',
    telepon: '',
    nama_wali: '',
    telepon_wali: ''
  });
  const [error, setError] = useState('');

  const fetchPasien = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await axios.get('/api/pasien', { headers });
      setPasien(response.data.data);
    } catch (error) {
      setError('Gagal memuat data pasien');
      console.error('Error fetching pasien:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPasien();
  }, [fetchPasien]);

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
      
      if (editingPasien) {
        await axios.put(`/api/pasien/${editingPasien.id}`, formData, { headers });
      } else {
        await axios.post('/api/pasien', formData, { headers });
      }
      
      fetchPasien();
      resetForm();
      setShowForm(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  const handleEdit = (pasien) => {
    setEditingPasien(pasien);
    setFormData({
      no_rm: pasien.no_rm || '',
      nama_pasien: pasien.nama_pasien || '',
      nik: pasien.nik || '',
      tanggal_lahir: pasien.tanggal_lahir || '',
      jenis_kelamin: pasien.jenis_kelamin || 'L',
      alamat: pasien.alamat || '',
      telepon: pasien.telepon || '',
      nama_wali: pasien.nama_wali || '',
      telepon_wali: pasien.telepon_wali || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pasien ini?')) {
      try {
        const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      await axios.delete(`/api/pasien/${id}`, { headers });
        fetchPasien();
      } catch (error) {
        setError(error.response?.data?.message || 'Gagal menghapus pasien');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      no_rm: '',
      nama_pasien: '',
      nik: '',
      tanggal_lahir: '',
      jenis_kelamin: 'L',
      alamat: '',
      telepon: '',
      nama_wali: '',
      telepon_wali: ''
    });
    setEditingPasien(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading">Memuat data pasien...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pasien-page">
        <div className="page-header">
          <h1>Manajemen Pasien</h1>
          <button 
            className="btn-primary"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            + Tambah Pasien
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {showForm && (
          <div className="form-modal">
            <div className="form-content">
              <div className="form-header">
                <h2>{editingPasien ? 'Edit Pasien' : 'Tambah Pasien Baru'}</h2>
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
                    <label>No RM *</label>
                    <input
                      type="text"
                      name="no_rm"
                      value={formData.no_rm}
                      onChange={handleInputChange}
                      required
                      placeholder="Contoh: RM001"
                    />
                  </div>
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
                    />
                  </div>
                </div>

                <div className="form-row">
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
                      placeholder="08123456789"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Alamat *</label>
                  <textarea
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleInputChange}
                    placeholder="Alamat lengkap"
                    rows="3"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Nama Wali</label>
                    <input
                      type="text"
                      name="nama_wali"
                      value={formData.nama_wali}
                      onChange={handleInputChange}
                      placeholder="Nama wali/pendamping"
                    />
                  </div>
                  <div className="form-group">
                    <label>Telepon Wali</label>
                    <input
                      type="tel"
                      name="telepon_wali"
                      value={formData.telepon_wali}
                      onChange={handleInputChange}
                      placeholder="08123456788"
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
                    {editingPasien ? 'Update' : 'Simpan'}
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
                <th>No RM</th>
                <th>NIK</th>
                <th>Nama Pasien</th>
                <th>Tanggal Lahir</th>
                <th>Jenis Kelamin</th>
                <th>Telepon</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pasien.map((p) => (
                <tr key={p.id}>
                  <td>{p.no_rm}</td>
                  <td>{p.nik}</td>
                  <td>{p.nama_pasien}</td>
                  <td>{formatDate(p.tanggal_lahir)}</td>
                  <td>{p.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                  <td>{p.telepon || '-'}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-edit"
                        onClick={() => handleEdit(p)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDelete(p.id)}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {pasien.length === 0 && (
            <div className="empty-state">
              <p>Belum ada data pasien</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PasienPage;
