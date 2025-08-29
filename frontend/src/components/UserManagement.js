import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';
import './UserManagement.css';

const UserManagement = () => {
  const { token, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [faskes, setFaskes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    email: '',
    password: '',
    role: 'admin_faskes',
    faskes_id: '',
    telepon: ''
  });

  // Check if user has admin access
  const hasAdminAccess = user?.role === 'admin_pusat' || user?.role === 'admin_faskes';
  const isAdminPusat = user?.role === 'admin_pusat';

  const fetchUsers = useCallback(async () => {
    try {
      setError('');
      console.log('🔍 Fetching users...');
      
      const response = await axios.get('http://localhost:3001/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setUsers(response.data.data);
        console.log('✅ Users loaded successfully:', response.data.data.length, 'users');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      
      if (error.response?.status === 403) {
        setError('Anda tidak memiliki akses untuk melihat data user');
      } else if (error.response?.status === 500) {
        setError('Terjadi kesalahan server. Silakan coba lagi.');
      } else {
        setError('Gagal mengambil data user. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchFaskes = useCallback(async () => {
    try {
      console.log('🔍 Fetching faskes...');
      
      const response = await axios.get('http://localhost:3001/api/faskes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setFaskes(response.data.data);
        console.log('✅ Faskes loaded successfully:', response.data.data.length, 'faskes');
      }
    } catch (error) {
      console.error('❌ Error fetching faskes:', error);
      // Don't show error for faskes, it's not critical
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
    fetchFaskes();
  }, [fetchUsers, fetchFaskes]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setFormData({
      nama_lengkap: '',
      email: '',
      password: '',
      role: 'admin_faskes',
      faskes_id: '',
      telepon: ''
    });
    setEditingUser(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      // Prepare data
      const submitData = { ...formData };
      
      // Handle faskes_id - convert to number or null
      if (submitData.faskes_id === '' || submitData.role === 'admin_pusat') {
        submitData.faskes_id = null;
      } else {
        submitData.faskes_id = parseInt(submitData.faskes_id);
      }
      
      if (editingUser) {
        // Update user
        if (!submitData.password) {
          delete submitData.password; // Don't update password if empty
        }
        
        console.log('Updating user with data:', submitData);
        await axios.put(`http://localhost:3001/api/auth/users/${editingUser.id}`, submitData, { headers });
        setSuccess('User berhasil diperbarui!');
      } else {
        // Create new user
        console.log('Creating user with data:', submitData);
        await axios.post('http://localhost:3001/api/auth/users', submitData, { headers });
        setSuccess('User berhasil ditambahkan!');
      }
      
      fetchUsers();
      resetForm();
    } catch (error) {
      console.error('Error saving user:', error.response?.data || error);
      setError(error.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      nama_lengkap: user.nama_lengkap || '',
      email: user.email || '',
      password: '', // Don't show password
      role: user.role || 'admin_faskes',
      faskes_id: user.faskes_id ? user.faskes_id.toString() : '',
      telepon: user.telepon || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3001/api/auth/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('User berhasil dihapus!');
      fetchUsers();
    } catch (error) {
      setError(error.response?.data?.message || 'Gagal menghapus user');
      console.error('Error deleting user:', error);
    }
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      'admin_pusat': { text: 'Admin Pusat', class: 'role-admin-pusat' },
      'admin_faskes': { text: 'Admin Faskes', class: 'role-admin-faskes' },
      'sopir_ambulans': { text: 'Sopir Ambulans', class: 'role-sopir-ambulans' }
    };
    
    const config = roleConfig[role] || { text: role, class: 'role-default' };
    return <span className={`role-badge ${config.class}`}>{config.text}</span>;
  };

  const getStatusBadge = (user) => {
    if (user.is_active === false) {
      return <span className="status-badge inactive">Nonaktif</span>;
    }
    return <span className="status-badge active">Aktif</span>;
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Memuat data user...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="user-management-page">
        <div className="page-header">
          <h1>👥 Manajemen User</h1>
          <p>Kelola data pengguna sistem eSIR 2.0</p>
        </div>

        {/* Access Control Check */}
        {!hasAdminAccess && (
          <div className="access-denied">
            <div className="access-denied-content">
              <div className="access-denied-icon">🚫</div>
              <h2>Akses Ditolak</h2>
              <p>Anda tidak memiliki izin untuk mengakses halaman ini.</p>
              <p>Hanya admin yang dapat mengelola data user.</p>
            </div>
          </div>
        )}

        {hasAdminAccess && (
          <>
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                <span className="error-text">{error}</span>
                <button onClick={fetchUsers} className="retry-button">
                  🔄 Coba Lagi
                </button>
              </div>
            )}

            {success && (
              <div className="success-message">
                <span className="success-icon">✅</span>
                <span className="success-text">{success}</span>
              </div>
            )}

            {/* User Form Modal */}
            {showForm && (
              <div className="form-modal">
                <div className="form-content">
                  <div className="form-header">
                    <h2>{editingUser ? 'Edit User' : 'Tambah User Baru'}</h2>
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
                        <label>Nama Lengkap *</label>
                        <input
                          type="text"
                          name="nama_lengkap"
                          value={formData.nama_lengkap}
                          onChange={handleInputChange}
                          required
                          placeholder="Masukkan nama lengkap"
                        />
                      </div>
                      <div className="form-group">
                        <label>Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="user@example.com"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Password {!editingUser && '*'}</label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required={!editingUser}
                          placeholder={editingUser ? "Kosongkan jika tidak ingin mengubah password" : "Masukkan password"}
                        />
                      </div>
                      <div className="form-group">
                        <label>Role *</label>
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="admin_pusat">Admin Pusat</option>
                          <option value="admin_faskes">Admin Faskes</option>
                          <option value="sopir_ambulans">Sopir Ambulans</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Faskes</label>
                        <select
                          name="faskes_id"
                          value={formData.faskes_id}
                          onChange={handleInputChange}
                          disabled={formData.role === 'admin_pusat'}
                        >
                          <option value="">Pilih Faskes</option>
                          {faskes.map(faskes => (
                            <option key={faskes.id} value={faskes.id}>
                              {faskes.nama_faskes}
                            </option>
                          ))}
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

                    <div className="form-actions">
                      <button type="button" className="btn-secondary" onClick={() => {
                        setShowForm(false);
                        resetForm();
                      }}>
                        Batal
                      </button>
                      <button type="submit" className="btn-primary">
                        {editingUser ? 'Update' : 'Simpan'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="user-management-content">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-content">
                    <h3>Total User</h3>
                    <p className="stat-number">{users.length}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">👑</div>
                  <div className="stat-content">
                    <h3>Admin Pusat</h3>
                    <p className="stat-number">{users.filter(u => u.role === 'admin_pusat').length}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🏥</div>
                  <div className="stat-content">
                    <h3>Admin Faskes</h3>
                    <p className="stat-number">{users.filter(u => u.role === 'admin_faskes').length}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🚑</div>
                  <div className="stat-content">
                    <h3>Sopir Ambulans</h3>
                    <p className="stat-number">{users.filter(u => u.role === 'sopir_ambulans').length}</p>
                  </div>
                </div>
              </div>

              <div className="users-table-container">
                <div className="table-header">
                  <h3>📋 Daftar User</h3>
                  <div className="table-actions">
                    {isAdminPusat && (
                      <button className="add-btn" onClick={() => setShowForm(true)}>
                        ➕ Tambah User
                      </button>
                    )}
                    <button className="refresh-btn" onClick={fetchUsers}>
                      🔄 Refresh
                    </button>
                  </div>
                </div>
                
                <div className="table-wrapper">
                  <table className="users-table">
                    <thead>
                      <tr>
                        <th>Nama Lengkap</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Faskes</th>
                        <th>Telepon</th>
                        <th>Status</th>
                        <th>Terakhir Login</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="no-data">
                            <div className="no-data-content">
                              <span className="no-data-icon">📭</span>
                              <p>Tidak ada data user</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        users.map(user => (
                          <tr key={user.id}>
                            <td>
                              <div className="user-info">
                                <div className="user-avatar">
                                  {user.nama_lengkap?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <div className="user-details">
                                  <span className="user-name">{user.nama_lengkap}</span>
                                  <span className="user-id">ID: {user.id}</span>
                                </div>
                              </div>
                            </td>
                            <td>{user.email}</td>
                            <td>{getRoleBadge(user.role)}</td>
                            <td>{user.nama_faskes || '-'}</td>
                            <td>{user.telepon || '-'}</td>
                            <td>{getStatusBadge(user)}</td>
                            <td>
                              {user.last_login 
                                ? new Date(user.last_login).toLocaleDateString('id-ID')
                                : 'Belum pernah login'
                              }
                            </td>
                            <td>
                              <div className="action-buttons">
                                {isAdminPusat && (
                                  <>
                                    <button 
                                      className="edit-btn"
                                      onClick={() => handleEdit(user)}
                                      title="Edit User"
                                    >
                                      ✏️
                                    </button>
                                    <button 
                                      className="delete-btn"
                                      onClick={() => handleDelete(user.id)}
                                      title="Hapus User"
                                    >
                                      🗑️
                                    </button>
                                  </>
                                )}
                                {!isAdminPusat && (
                                  <span className="view-only">👁️ Lihat Saja</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default UserManagement;
