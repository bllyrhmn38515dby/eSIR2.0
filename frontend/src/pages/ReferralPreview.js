import React, { useState } from 'react';
import './ReferralPreview.css';

const ReferralPreview = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Mock data rujukan
  const referrals = [
    {
      id: 'R001',
      patientName: 'John Doe',
      patientId: 'P001',
      fromFacility: 'RS Umum Kota',
      toFacility: 'RS Jantung Harapan',
      diagnosis: 'Chest Pain',
      status: 'pending',
      priority: 'P1',
      requestTime: '14:30',
      estimatedArrival: '15:00',
      ambulanceId: 'AMB-001',
      driverName: 'Ahmad Suryadi',
      notes: 'Pasien mengalami nyeri dada akut, memerlukan pemeriksaan jantung segera',
      vitalSigns: {
        bp: '140/90',
        hr: '95',
        temp: '37.2°C',
        spo2: '98%'
      }
    },
    {
      id: 'R002',
      patientName: 'Jane Smith',
      patientId: 'P002',
      fromFacility: 'Puskesmas Sentral',
      toFacility: 'RS Orthopedi',
      diagnosis: 'Fracture Arm',
      status: 'in_transit',
      priority: 'P3',
      requestTime: '15:15',
      estimatedArrival: '16:00',
      ambulanceId: 'AMB-002',
      driverName: 'Budi Santoso',
      notes: 'Fraktur lengan kanan, memerlukan tindakan operasi',
      vitalSigns: {
        bp: '120/80',
        hr: '78',
        temp: '36.8°C',
        spo2: '99%'
      }
    },
    {
      id: 'R003',
      patientName: 'Robert Johnson',
      patientId: 'P003',
      fromFacility: 'RS Umum Kota',
      toFacility: 'RS Stroke Nasional',
      diagnosis: 'Stroke',
      status: 'completed',
      priority: 'P1',
      requestTime: '16:00',
      estimatedArrival: '16:30',
      ambulanceId: 'AMB-003',
      driverName: 'Siti Nurhaliza',
      notes: 'Stroke akut, golden time window masih terbuka',
      vitalSigns: {
        bp: '160/95',
        hr: '110',
        temp: '37.5°C',
        spo2: '95%'
      }
    },
    {
      id: 'R004',
      patientName: 'Maria Garcia',
      patientId: 'P004',
      fromFacility: 'Klinik Sehat',
      toFacility: 'RS Bedah Umum',
      diagnosis: 'Appendicitis',
      status: 'pending',
      priority: 'P2',
      requestTime: '16:45',
      estimatedArrival: '17:30',
      ambulanceId: 'AMB-004',
      driverName: 'Dedi Mulyadi',
      notes: 'Appendisitis akut, memerlukan operasi darurat',
      vitalSigns: {
        bp: '115/75',
        hr: '85',
        temp: '37.0°C',
        spo2: '97%'
      }
    },
    {
      id: 'R005',
      patientName: 'David Wilson',
      patientId: 'P005',
      fromFacility: 'RS Umum Kota',
      toFacility: 'RS Mata Sejahtera',
      diagnosis: 'Eye Trauma',
      status: 'cancelled',
      priority: 'P3',
      requestTime: '17:00',
      estimatedArrival: '17:45',
      ambulanceId: 'AMB-005',
      driverName: 'Eko Prasetyo',
      notes: 'Trauma mata akibat kecelakaan kerja',
      vitalSigns: {
        bp: '130/85',
        hr: '88',
        temp: '36.9°C',
        spo2: '96%'
      }
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'pending';
      case 'in_transit': return 'in_transit';
      case 'completed': return 'completed';
      case 'cancelled': return 'cancelled';
      default: return 'neutral';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'P1': return 'p1';
      case 'P2': return 'p2';
      case 'P3': return 'p3';
      case 'P4': return 'p4';
      default: return 'neutral';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Menunggu';
      case 'in_transit': return 'Dalam Perjalanan';
      case 'completed': return 'Selesai';
      case 'cancelled': return 'Dibatalkan';
      default: return status;
    }
  };

  const filteredReferrals = referrals.filter(referral => {
    const matchesSearch = referral.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         referral.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         referral.fromFacility.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         referral.toFacility.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatusFilter = filterStatus === 'all' || referral.status === filterStatus;
    const matchesPriorityFilter = filterPriority === 'all' || referral.priority === filterPriority;
    return matchesSearch && matchesStatusFilter && matchesPriorityFilter;
  });

  const getStatusStats = () => {
    const stats = {
      pending: referrals.filter(r => r.status === 'pending').length,
      in_transit: referrals.filter(r => r.status === 'in_transit').length,
      completed: referrals.filter(r => r.status === 'completed').length,
      cancelled: referrals.filter(r => r.status === 'cancelled').length,
      total: referrals.length
    };
    return stats;
  };

  const stats = getStatusStats();

  return (
    <div className={`referral-preview ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      {/* Header */}
      <header className="preview-header">
        <div className="header-content">
          <div className="header-left">
            <button className="sidebar-toggle" onClick={toggleSidebar}>
              <i className="icon-menu">☰</i>
            </button>
            <h1 className="app-title">eSIR 2.0 - Preview Menu Rujukan</h1>
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
                <li className="nav-item">
                  <i className="nav-icon">🏥</i>
                  <span className="nav-text">Faskes</span>
                </li>
                <li className="nav-item active">
                  <i className="nav-icon">📋</i>
                  <span className="nav-text">Rujukan</span>
                </li>
                <li className="nav-item">
                  <i className="nav-icon">📊</i>
                  <span className="nav-text">Laporan</span>
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
              <span className="breadcrumb-item active">Preview Menu Rujukan</span>
            </nav>

            {/* Page Header */}
            <div className="page-header">
              <h2 className="page-title">Preview Menu Rujukan eSIR 2.0</h2>
              <p className="page-description">
                Halaman ini menampilkan preview tampilan menu rujukan dengan desain yang sesuai dengan standar medis dan rumah sakit.
              </p>
            </div>

            {/* Referral Statistics */}
            <div className="referral-stats">
              <div className="stat-card pending">
                <div className="stat-icon">⏳</div>
                <div className="stat-content">
                  <h3>Menunggu</h3>
                  <p className="stat-number">{stats.pending}</p>
                  <p className="stat-label">Rujukan</p>
                </div>
              </div>
              <div className="stat-card in_transit">
                <div className="stat-icon">🚑</div>
                <div className="stat-content">
                  <h3>Dalam Perjalanan</h3>
                  <p className="stat-number">{stats.in_transit}</p>
                  <p className="stat-label">Rujukan</p>
                </div>
              </div>
              <div className="stat-card completed">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <h3>Selesai</h3>
                  <p className="stat-number">{stats.completed}</p>
                  <p className="stat-label">Rujukan</p>
                </div>
              </div>
              <div className="stat-card cancelled">
                <div className="stat-icon">❌</div>
                <div className="stat-content">
                  <h3>Dibatalkan</h3>
                  <p className="stat-number">{stats.cancelled}</p>
                  <p className="stat-label">Rujukan</p>
                </div>
              </div>
              <div className="stat-card total">
                <div className="stat-icon">📋</div>
                <div className="stat-content">
                  <h3>Total</h3>
                  <p className="stat-number">{stats.total}</p>
                  <p className="stat-label">Rujukan</p>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="referral-controls">
              <div className="search-section">
                <div className="search-input-group">
                  <i className="search-icon">🔍</i>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Cari rujukan berdasarkan pasien, ID, atau faskes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="filter-section">
                <select
                  className="filter-select"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">Semua Status</option>
                  <option value="pending">Menunggu</option>
                  <option value="in_transit">Dalam Perjalanan</option>
                  <option value="completed">Selesai</option>
                  <option value="cancelled">Dibatalkan</option>
                </select>
                <select
                  className="filter-select"
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                >
                  <option value="all">Semua Prioritas</option>
                  <option value="P1">P1 - Resusitasi</option>
                  <option value="P2">P2 - Darurat</option>
                  <option value="P3">P3 - Urgent</option>
                  <option value="P4">P4 - Standar</option>
                </select>
              </div>
            </div>

            {/* Referral List */}
            <div className="referral-list">
              <div className="list-header">
                <h3>Daftar Rujukan</h3>
                <div className="list-actions">
                  <button className="btn btn-primary">
                    <i className="btn-icon">➕</i>
                    Buat Rujukan
                  </button>
                  <button className="btn btn-secondary">
                    <i className="btn-icon">📊</i>
                    Export Data
                  </button>
                  <button className="btn btn-info">
                    <i className="btn-icon">🗺️</i>
                    Tracking Map
                  </button>
                </div>
              </div>

              <div className="referral-grid">
                {filteredReferrals.map((referral) => (
                  <div
                    key={referral.id}
                    className={`referral-card ${getStatusColor(referral.status)}`}
                    onClick={() => setSelectedReferral(referral)}
                  >
                    <div className="referral-header">
                      <div className="referral-id">{referral.id}</div>
                      <div className={`priority-badge ${getPriorityColor(referral.priority)}`}>
                        {referral.priority}
                      </div>
                      <div className={`status-badge ${getStatusColor(referral.status)}`}>
                        {getStatusText(referral.status)}
                      </div>
                    </div>
                    
                    <div className="referral-info">
                      <h4 className="patient-name">{referral.patientName}</h4>
                      <div className="referral-details">
                        <span className="detail-item">
                          <i className="detail-icon">🩺</i>
                          {referral.diagnosis}
                        </span>
                        <span className="detail-item">
                          <i className="detail-icon">🏥</i>
                          {referral.fromFacility} → {referral.toFacility}
                        </span>
                        <span className="detail-item">
                          <i className="detail-icon">🚑</i>
                          {referral.ambulanceId} - {referral.driverName}
                        </span>
                        <span className="detail-item">
                          <i className="detail-icon">⏰</i>
                          Request: {referral.requestTime} | ETA: {referral.estimatedArrival}
                        </span>
                      </div>
                    </div>

                    <div className="referral-notes">
                      <h5>Catatan Rujukan</h5>
                      <p>{referral.notes}</p>
                    </div>

                    <div className="referral-actions">
                      <button className="action-btn primary">
                        <i className="action-icon">👁️</i>
                        Detail
                      </button>
                      <button className="action-btn secondary">
                        <i className="action-icon">✏️</i>
                        Edit
                      </button>
                      {referral.status === 'pending' && (
                        <button className="action-btn success">
                          <i className="action-icon">🚑</i>
                          Kirim
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Referral Detail Modal */}
            {selectedReferral && (
              <div className="referral-modal-overlay" onClick={() => setSelectedReferral(null)}>
                <div className="referral-modal" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3>Detail Rujukan - {selectedReferral.patientName}</h3>
                    <button className="modal-close" onClick={() => setSelectedReferral(null)}>
                      ✕
                    </button>
                  </div>
                  <div className="modal-content">
                    <div className="modal-section">
                      <h4>Informasi Pasien</h4>
                      <div className="info-grid">
                        <div className="info-item">
                          <label>ID Rujukan:</label>
                          <span>{selectedReferral.id}</span>
                        </div>
                        <div className="info-item">
                          <label>ID Pasien:</label>
                          <span>{selectedReferral.patientId}</span>
                        </div>
                        <div className="info-item">
                          <label>Nama Pasien:</label>
                          <span>{selectedReferral.patientName}</span>
                        </div>
                        <div className="info-item">
                          <label>Diagnosa:</label>
                          <span>{selectedReferral.diagnosis}</span>
                        </div>
                        <div className="info-item">
                          <label>Status:</label>
                          <span className={`status-badge ${getStatusColor(selectedReferral.status)}`}>
                            {getStatusText(selectedReferral.status)}
                          </span>
                        </div>
                        <div className="info-item">
                          <label>Prioritas:</label>
                          <span className={`priority-badge ${getPriorityColor(selectedReferral.priority)}`}>
                            {selectedReferral.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="modal-section">
                      <h4>Informasi Rujukan</h4>
                      <div className="info-grid">
                        <div className="info-item">
                          <label>Dari Faskes:</label>
                          <span>{selectedReferral.fromFacility}</span>
                        </div>
                        <div className="info-item">
                          <label>Ke Faskes:</label>
                          <span>{selectedReferral.toFacility}</span>
                        </div>
                        <div className="info-item">
                          <label>Waktu Request:</label>
                          <span>{selectedReferral.requestTime}</span>
                        </div>
                        <div className="info-item">
                          <label>Estimasi Tiba:</label>
                          <span>{selectedReferral.estimatedArrival}</span>
                        </div>
                      </div>
                    </div>

                    <div className="modal-section">
                      <h4>Informasi Ambulance</h4>
                      <div className="info-grid">
                        <div className="info-item">
                          <label>ID Ambulance:</label>
                          <span>{selectedReferral.ambulanceId}</span>
                        </div>
                        <div className="info-item">
                          <label>Nama Driver:</label>
                          <span>{selectedReferral.driverName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="modal-section">
                      <h4>Vital Signs</h4>
                      <div className="vitals-detail">
                        <div className="vital-detail-item">
                          <span className="vital-label">Tekanan Darah:</span>
                          <span className="vital-value">{selectedReferral.vitalSigns.bp}</span>
                        </div>
                        <div className="vital-detail-item">
                          <span className="vital-label">Denyut Jantung:</span>
                          <span className="vital-value">{selectedReferral.vitalSigns.hr} bpm</span>
                        </div>
                        <div className="vital-detail-item">
                          <span className="vital-label">Suhu Tubuh:</span>
                          <span className="vital-value">{selectedReferral.vitalSigns.temp}</span>
                        </div>
                        <div className="vital-detail-item">
                          <span className="vital-label">Oksigen:</span>
                          <span className="vital-value">{selectedReferral.vitalSigns.spo2}</span>
                        </div>
                      </div>
                    </div>

                    <div className="modal-section">
                      <h4>Catatan Rujukan</h4>
                      <div className="notes-content">
                        <p>{selectedReferral.notes}</p>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-primary">
                      <i className="btn-icon">✏️</i>
                      Edit Rujukan
                    </button>
                    <button className="btn btn-secondary">
                      <i className="btn-icon">📋</i>
                      Cetak Rujukan
                    </button>
                    {selectedReferral.status === 'pending' && (
                      <button className="btn btn-success">
                        <i className="btn-icon">🚑</i>
                        Kirim Ambulance
                      </button>
                    )}
                    {selectedReferral.status === 'in_transit' && (
                      <button className="btn btn-warning">
                        <i className="btn-icon">📍</i>
                        Update Status
                      </button>
                    )}
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
            <span>Preview Menu Rujukan v1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ReferralPreview;
