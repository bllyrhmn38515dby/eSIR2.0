import React, { useState } from 'react';
import './FaskesPreview.css';

const FaskesPreview = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedFaskes, setSelectedFaskes] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Mock data faskes
  const faskes = [
    {
      id: 'FASKES-001',
      name: 'RSUD Kota Jakarta',
      type: 'rumah_sakit',
      level: 'A',
      address: 'Jl. Sudirman No. 123, Jakarta Pusat',
      phone: '021-1234567',
      email: 'info@rsudjakarta.go.id',
      status: 'active',
      bedCount: 250,
      availableBeds: 45,
      icuBeds: 15,
      availableIcuBeds: 3,
      specialties: ['Kardiologi', 'Neurologi', 'Orthopedi', 'Pediatri'],
      facilities: ['IGD', 'ICU', 'NICU', 'PICU', 'Hemodialisis', 'Radiologi'],
      coordinates: { lat: -6.2088, lng: 106.8456 },
      lastUpdate: '2024-01-26 14:30',
      contactPerson: 'Dr. Ahmad Suryadi',
      contactPhone: '0812-3456-7890'
    },
    {
      id: 'FASKES-002',
      name: 'RS Jantung Harapan',
      type: 'rumah_sakit',
      level: 'A',
      address: 'Jl. Gatot Subroto No. 456, Jakarta Selatan',
      phone: '021-2345678',
      email: 'info@rsjantung.go.id',
      status: 'active',
      bedCount: 180,
      availableBeds: 25,
      icuBeds: 20,
      availableIcuBeds: 2,
      specialties: ['Kardiologi', 'Bedah Jantung', 'Anestesi'],
      facilities: ['IGD', 'ICU', 'Cath Lab', 'Hemodialisis', 'Radiologi'],
      coordinates: { lat: -6.2297, lng: 106.8044 },
      lastUpdate: '2024-01-26 14:25',
      contactPerson: 'Dr. Budi Santoso',
      contactPhone: '0813-4567-8901'
    },
    {
      id: 'FASKES-003',
      name: 'Puskesmas Menteng',
      type: 'puskesmas',
      level: 'B',
      address: 'Jl. Menteng Raya No. 789, Jakarta Pusat',
      phone: '021-3456789',
      email: 'puskesmas.menteng@jakarta.go.id',
      status: 'active',
      bedCount: 20,
      availableBeds: 8,
      icuBeds: 0,
      availableIcuBeds: 0,
      specialties: ['Umum', 'KIA', 'Gigi'],
      facilities: ['IGD', 'Laboratorium', 'Apotek', 'Radiologi'],
      coordinates: { lat: -6.1944, lng: 106.8229 },
      lastUpdate: '2024-01-26 14:20',
      contactPerson: 'Dr. Siti Nurhaliza',
      contactPhone: '0814-5678-9012'
    },
    {
      id: 'FASKES-004',
      name: 'RS Stroke Nasional',
      type: 'rumah_sakit',
      level: 'A',
      address: 'Jl. Rasuna Said No. 321, Jakarta Selatan',
      phone: '021-4567890',
      email: 'info@rsstroke.go.id',
      status: 'maintenance',
      bedCount: 120,
      availableBeds: 0,
      icuBeds: 10,
      availableIcuBeds: 0,
      specialties: ['Neurologi', 'Rehabilitasi Medik', 'Fisioterapi'],
      facilities: ['IGD', 'ICU', 'Rehabilitasi', 'Radiologi'],
      coordinates: { lat: -6.2615, lng: 106.8106 },
      lastUpdate: '2024-01-26 14:15',
      contactPerson: 'Dr. Dedi Mulyadi',
      contactPhone: '0815-6789-0123'
    },
    {
      id: 'FASKES-005',
      name: 'Klinik Pratama Sehat',
      type: 'klinik',
      level: 'C',
      address: 'Jl. Thamrin No. 654, Jakarta Pusat',
      phone: '021-5678901',
      email: 'info@kliniksehat.com',
      status: 'active',
      bedCount: 5,
      availableBeds: 3,
      icuBeds: 0,
      availableIcuBeds: 0,
      specialties: ['Umum', 'Gigi'],
      facilities: ['IGD', 'Laboratorium', 'Apotek'],
      coordinates: { lat: -6.1751, lng: 106.8650 },
      lastUpdate: '2024-01-26 14:10',
      contactPerson: 'Dr. Eko Prasetyo',
      contactPhone: '0816-7890-1234'
    }
  ];

  const getTypeColor = (type) => {
    switch (type) {
      case 'rumah_sakit': return 'rumah_sakit';
      case 'puskesmas': return 'puskesmas';
      case 'klinik': return 'klinik';
      default: return 'neutral';
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'rumah_sakit': return 'Rumah Sakit';
      case 'puskesmas': return 'Puskesmas';
      case 'klinik': return 'Klinik';
      default: return type;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'active';
      case 'maintenance': return 'maintenance';
      case 'inactive': return 'inactive';
      default: return 'neutral';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'maintenance': return 'Maintenance';
      case 'inactive': return 'Tidak Aktif';
      default: return status;
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'A': return 'level_a';
      case 'B': return 'level_b';
      case 'C': return 'level_c';
      default: return 'neutral';
    }
  };

  const filteredFaskes = faskes.filter(faskes => {
    const matchesSearch = faskes.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faskes.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faskes.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || faskes.type === filterType;
    const matchesStatus = filterStatus === 'all' || faskes.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getFaskesStats = () => {
    const stats = {
      rumah_sakit: faskes.filter(f => f.type === 'rumah_sakit').length,
      puskesmas: faskes.filter(f => f.type === 'puskesmas').length,
      klinik: faskes.filter(f => f.type === 'klinik').length,
      active: faskes.filter(f => f.status === 'active').length,
      maintenance: faskes.filter(f => f.status === 'maintenance').length,
      total: faskes.length
    };
    return stats;
  };

  const stats = getFaskesStats();

  const getBedUtilization = (available, total) => {
    if (total === 0) return 0;
    return Math.round(((total - available) / total) * 100);
  };

  return (
    <div className={`faskes-preview ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      {/* Header */}
      <header className="preview-header">
        <div className="header-content">
          <div className="header-left">
            <button className="sidebar-toggle" onClick={toggleSidebar}>
              <i className="icon-menu">☰</i>
            </button>
            <h1 className="app-title">eSIR 2.0 - Preview Faskes</h1>
          </div>
          <div className="header-right">
            <button className="theme-toggle" onClick={toggleDarkMode}>
              <i className="icon-theme">{darkMode ? '☀️' : '🌙'}</i>
            </button>
            <div className="user-profile">
              <span className="user-name">Dr. Admin</span>
              <div className="user-avatar">A</div>
            </div>
          </div>
        </div>
      </header>

      <div className="preview-container">
        {/* Sidebar */}
        <aside className={`preview-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <nav className="sidebar-nav">
            <div className="nav-section">
              <h3 className="nav-title">Menu Utama</h3>
              <ul className="nav-list">
                <li className="nav-item">
                  <i className="nav-icon">🏠</i>
                  <span className="nav-text">Dashboard</span>
                </li>
                <li className="nav-item">
                  <i className="nav-icon">👥</i>
                  <span className="nav-text">Pasien</span>
                </li>
                <li className="nav-item active">
                  <i className="nav-icon">🏥</i>
                  <span className="nav-text">Faskes</span>
                </li>
                <li className="nav-item">
                  <i className="nav-icon">📋</i>
                  <span className="nav-text">Rujukan</span>
                </li>
                <li className="nav-item">
                  <i className="nav-icon">🚑</i>
                  <span className="nav-text">Ambulance</span>
                </li>
              </ul>
            </div>
            
            <div className="nav-section">
              <h3 className="nav-title">Pengaturan</h3>
              <ul className="nav-list">
                <li className="nav-item">
                  <i className="nav-icon">⚙️</i>
                  <span className="nav-text">Konfigurasi</span>
                </li>
                <li className="nav-item">
                  <i className="nav-icon">👤</i>
                  <span className="nav-text">Profil</span>
                </li>
              </ul>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="preview-main">
          <div className="main-content">
            {/* Breadcrumb */}
            <nav className="breadcrumb">
              <span className="breadcrumb-item">Dashboard</span>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-item active">Preview Faskes</span>
            </nav>

            {/* Page Header */}
            <div className="page-header">
              <h2 className="page-title">Preview Faskes eSIR 2.0</h2>
              <p className="page-description">
                Halaman ini menampilkan preview tampilan manajemen fasilitas kesehatan dengan desain yang sesuai dengan standar medis dan rumah sakit.
              </p>
            </div>

            {/* Faskes Statistics */}
            <div className="faskes-stats">
              <div className="stat-card rumah_sakit">
                <div className="stat-icon">🏥</div>
                <div className="stat-content">
                  <h3>Rumah Sakit</h3>
                  <p className="stat-number">{stats.rumah_sakit}</p>
                  <p className="stat-label">Faskes</p>
                </div>
              </div>
              <div className="stat-card puskesmas">
                <div className="stat-icon">🏢</div>
                <div className="stat-content">
                  <h3>Puskesmas</h3>
                  <p className="stat-number">{stats.puskesmas}</p>
                  <p className="stat-label">Faskes</p>
                </div>
              </div>
              <div className="stat-card klinik">
                <div className="stat-icon">🏪</div>
                <div className="stat-content">
                  <h3>Klinik</h3>
                  <p className="stat-number">{stats.klinik}</p>
                  <p className="stat-label">Faskes</p>
                </div>
              </div>
              <div className="stat-card active">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <h3>Aktif</h3>
                  <p className="stat-number">{stats.active}</p>
                  <p className="stat-label">Faskes</p>
                </div>
              </div>
              <div className="stat-card maintenance">
                <div className="stat-icon">🔧</div>
                <div className="stat-content">
                  <h3>Maintenance</h3>
                  <p className="stat-number">{stats.maintenance}</p>
                  <p className="stat-label">Faskes</p>
                </div>
              </div>
              <div className="stat-card total">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <h3>Total</h3>
                  <p className="stat-number">{stats.total}</p>
                  <p className="stat-label">Faskes</p>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="faskes-controls">
              <div className="search-section">
                <div className="search-input-group">
                  <i className="search-icon">🔍</i>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Cari faskes berdasarkan nama, alamat, atau ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="filter-section">
                <select
                  className="filter-select"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">Semua Tipe</option>
                  <option value="rumah_sakit">Rumah Sakit</option>
                  <option value="puskesmas">Puskesmas</option>
                  <option value="klinik">Klinik</option>
                </select>
                <select
                  className="filter-select"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">Semua Status</option>
                  <option value="active">Aktif</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inactive">Tidak Aktif</option>
                </select>
              </div>
            </div>

            {/* Faskes List */}
            <div className="faskes-list">
              <div className="list-header">
                <h3>Daftar Fasilitas Kesehatan</h3>
                <div className="list-actions">
                  <button className="btn btn-primary">
                    <i className="btn-icon">➕</i>
                    Tambah Faskes
                  </button>
                  <button className="btn btn-secondary">
                    <i className="btn-icon">📊</i>
                    Export Data
                  </button>
                  <button className="btn btn-info">
                    <i className="btn-icon">🗺️</i>
                    Peta Faskes
                  </button>
                </div>
              </div>

              <div className="faskes-grid">
                {filteredFaskes.map((faskes) => (
                  <div
                    key={faskes.id}
                    className={`faskes-card ${getTypeColor(faskes.type)}`}
                    onClick={() => setSelectedFaskes(faskes)}
                  >
                    <div className="faskes-header">
                      <div className="faskes-id">{faskes.id}</div>
                      <div className={`type-badge ${getTypeColor(faskes.type)}`}>
                        {getTypeText(faskes.type)}
                      </div>
                      <div className={`status-badge ${getStatusColor(faskes.status)}`}>
                        {getStatusText(faskes.status)}
                      </div>
                      <div className={`level-badge ${getLevelColor(faskes.level)}`}>
                        Level {faskes.level}
                      </div>
                    </div>
                    
                    <div className="faskes-info">
                      <h4 className="faskes-name">{faskes.name}</h4>
                      <div className="faskes-details">
                        <span className="detail-item">
                          <i className="detail-icon">📍</i>
                          {faskes.address}
                        </span>
                        <span className="detail-item">
                          <i className="detail-icon">📞</i>
                          {faskes.phone}
                        </span>
                        <span className="detail-item">
                          <i className="detail-icon">👤</i>
                          {faskes.contactPerson}
                        </span>
                      </div>
                    </div>

                    <div className="faskes-capacity">
                      <div className="capacity-row">
                        <div className="capacity-item">
                          <span className="capacity-label">Tempat Tidur</span>
                          <span className="capacity-value">
                            {faskes.availableBeds}/{faskes.bedCount}
                          </span>
                          <div className="capacity-bar">
                            <div 
                              className="capacity-fill"
                              style={{ width: `${getBedUtilization(faskes.availableBeds, faskes.bedCount)}%` }}
                            ></div>
                          </div>
                        </div>
                        {faskes.icuBeds > 0 && (
                          <div className="capacity-item">
                            <span className="capacity-label">ICU</span>
                            <span className="capacity-value">
                              {faskes.availableIcuBeds}/{faskes.icuBeds}
                            </span>
                            <div className="capacity-bar">
                              <div 
                                className="capacity-fill icu"
                                style={{ width: `${getBedUtilization(faskes.availableIcuBeds, faskes.icuBeds)}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="faskes-specialties">
                      <div className="specialties-label">Spesialisasi:</div>
                      <div className="specialties-list">
                        {faskes.specialties.slice(0, 3).map((specialty, index) => (
                          <span key={index} className="specialty-tag">
                            {specialty}
                          </span>
                        ))}
                        {faskes.specialties.length > 3 && (
                          <span className="specialty-more">
                            +{faskes.specialties.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="faskes-actions">
                      <button className="action-btn primary">
                        <i className="action-icon">👁️</i>
                        Detail
                      </button>
                      <button className="action-btn secondary">
                        <i className="action-icon">📞</i>
                        Call
                      </button>
                      <button className="action-btn success">
                        <i className="action-icon">📋</i>
                        Rujukan
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Faskes Detail Modal */}
            {selectedFaskes && (
              <div className="faskes-modal-overlay" onClick={() => setSelectedFaskes(null)}>
                <div className="faskes-modal" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3>Detail Faskes - {selectedFaskes.name}</h3>
                    <button className="modal-close" onClick={() => setSelectedFaskes(null)}>
                      ✕
                    </button>
                  </div>
                  <div className="modal-content">
                    <div className="modal-section">
                      <h4>Informasi Umum</h4>
                      <div className="info-grid">
                        <div className="info-item">
                          <label>ID Faskes:</label>
                          <span>{selectedFaskes.id}</span>
                        </div>
                        <div className="info-item">
                          <label>Nama:</label>
                          <span>{selectedFaskes.name}</span>
                        </div>
                        <div className="info-item">
                          <label>Tipe:</label>
                          <span className={`type-badge ${getTypeColor(selectedFaskes.type)}`}>
                            {getTypeText(selectedFaskes.type)}
                          </span>
                        </div>
                        <div className="info-item">
                          <label>Level:</label>
                          <span className={`level-badge ${getLevelColor(selectedFaskes.level)}`}>
                            Level {selectedFaskes.level}
                          </span>
                        </div>
                        <div className="info-item">
                          <label>Status:</label>
                          <span className={`status-badge ${getStatusColor(selectedFaskes.status)}`}>
                            {getStatusText(selectedFaskes.status)}
                          </span>
                        </div>
                        <div className="info-item">
                          <label>Alamat:</label>
                          <span>{selectedFaskes.address}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="modal-section">
                      <h4>Kontak</h4>
                      <div className="info-grid">
                        <div className="info-item">
                          <label>Telepon:</label>
                          <span>{selectedFaskes.phone}</span>
                        </div>
                        <div className="info-item">
                          <label>Email:</label>
                          <span>{selectedFaskes.email}</span>
                        </div>
                        <div className="info-item">
                          <label>Kontak Person:</label>
                          <span>{selectedFaskes.contactPerson}</span>
                        </div>
                        <div className="info-item">
                          <label>No. HP Kontak:</label>
                          <span>{selectedFaskes.contactPhone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="modal-section">
                      <h4>Kapasitas Tempat Tidur</h4>
                      <div className="capacity-details">
                        <div className="capacity-detail-item">
                          <span className="capacity-label">Tempat Tidur Umum:</span>
                          <span className="capacity-value">
                            {selectedFaskes.availableBeds}/{selectedFaskes.bedCount} tersedia
                          </span>
                          <div className="capacity-bar">
                            <div 
                              className="capacity-fill"
                              style={{ width: `${getBedUtilization(selectedFaskes.availableBeds, selectedFaskes.bedCount)}%` }}
                            ></div>
                          </div>
                        </div>
                        {selectedFaskes.icuBeds > 0 && (
                          <div className="capacity-detail-item">
                            <span className="capacity-label">Tempat Tidur ICU:</span>
                            <span className="capacity-value">
                              {selectedFaskes.availableIcuBeds}/{selectedFaskes.icuBeds} tersedia
                            </span>
                            <div className="capacity-bar">
                              <div 
                                className="capacity-fill icu"
                                style={{ width: `${getBedUtilization(selectedFaskes.availableIcuBeds, selectedFaskes.icuBeds)}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="modal-section">
                      <h4>Spesialisasi</h4>
                      <div className="specialties-grid">
                        {selectedFaskes.specialties.map((specialty, index) => (
                          <div key={index} className="specialty-item">
                            <i className="specialty-icon">⚕️</i>
                            <span>{specialty}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="modal-section">
                      <h4>Fasilitas</h4>
                      <div className="facilities-grid">
                        {selectedFaskes.facilities.map((facility, index) => (
                          <div key={index} className="facility-item">
                            <i className="facility-icon">🏥</i>
                            <span>{facility}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-primary">
                      <i className="btn-icon">📞</i>
                      Hubungi Faskes
                    </button>
                    <button className="btn btn-secondary">
                      <i className="btn-icon">🗺️</i>
                      Lihat di Peta
                    </button>
                    <button className="btn btn-success">
                      <i className="btn-icon">📋</i>
                      Buat Rujukan
                    </button>
                    <button className="btn btn-warning">
                      <i className="btn-icon">✏️</i>
                      Edit Data
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="preview-footer">
        <div className="footer-content">
          <div className="footer-left">
            <span>© 2024 eSIR 2.0 - Sistem Informasi Rujukan</span>
          </div>
          <div className="footer-right">
            <span>Preview Faskes v1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FaskesPreview;
