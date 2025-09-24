import React, { useState } from 'react';
import './PatientPreview.css';

const PatientPreview = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Mock data pasien
  const patients = [
    {
      id: 'P001',
      name: 'John Doe',
      age: 45,
      gender: 'Laki-laki',
      status: 'critical',
      diagnosis: 'Chest Pain',
      room: 'IGD A-01',
      admissionTime: '14:30',
      priority: 'P1',
      vitalSigns: {
        bp: '140/90',
        hr: '95',
        temp: '37.2°C',
        spo2: '98%'
      }
    },
    {
      id: 'P002',
      name: 'Jane Smith',
      age: 32,
      gender: 'Perempuan',
      status: 'stable',
      diagnosis: 'Fracture Arm',
      room: 'IGD B-02',
      admissionTime: '15:15',
      priority: 'P3',
      vitalSigns: {
        bp: '120/80',
        hr: '78',
        temp: '36.8°C',
        spo2: '99%'
      }
    },
    {
      id: 'P003',
      name: 'Robert Johnson',
      age: 67,
      gender: 'Laki-laki',
      status: 'urgent',
      diagnosis: 'Stroke',
      room: 'IGD A-03',
      admissionTime: '16:00',
      priority: 'P2',
      vitalSigns: {
        bp: '160/95',
        hr: '110',
        temp: '37.5°C',
        spo2: '95%'
      }
    },
    {
      id: 'P004',
      name: 'Maria Garcia',
      age: 28,
      gender: 'Perempuan',
      status: 'stable',
      diagnosis: 'Appendicitis',
      room: 'IGD C-01',
      admissionTime: '16:45',
      priority: 'P3',
      vitalSigns: {
        bp: '115/75',
        hr: '85',
        temp: '37.0°C',
        spo2: '97%'
      }
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'critical';
      case 'urgent': return 'urgent';
      case 'stable': return 'stable';
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

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || patient.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className={`patient-preview ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      {/* Header */}
      <header className="preview-header">
        <div className="header-content">
          <div className="header-left">
            <button className="sidebar-toggle" onClick={toggleSidebar}>
              <i className="icon-menu">☰</i>
            </button>
            <h1 className="app-title">eSIR 2.0 - Preview Menu Pasien</h1>
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
                <li className="nav-item active">
                  <i className="nav-icon">👥</i>
                  <span className="nav-text">Pasien</span>
                </li>
                <li className="nav-item">
                  <i className="nav-icon">🏥</i>
                  <span className="nav-text">Faskes</span>
                </li>
                <li className="nav-item">
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
              <span className="breadcrumb-item active">Preview Menu Pasien</span>
            </nav>

            {/* Page Header */}
            <div className="page-header">
              <h2 className="page-title">Preview Menu Pasien eSIR 2.0</h2>
              <p className="page-description">
                Halaman ini menampilkan preview tampilan menu pasien dengan desain yang sesuai dengan standar medis dan rumah sakit.
              </p>
            </div>

            {/* Patient Statistics */}
            <div className="patient-stats">
              <div className="stat-card critical">
                <div className="stat-icon">🚨</div>
                <div className="stat-content">
                  <h3>Kritis</h3>
                  <p className="stat-number">1</p>
                  <p className="stat-label">Pasien</p>
                </div>
              </div>
              <div className="stat-card urgent">
                <div className="stat-icon">⚠️</div>
                <div className="stat-content">
                  <h3>Darurat</h3>
                  <p className="stat-number">1</p>
                  <p className="stat-label">Pasien</p>
                </div>
              </div>
              <div className="stat-card stable">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <h3>Stabil</h3>
                  <p className="stat-number">2</p>
                  <p className="stat-label">Pasien</p>
                </div>
              </div>
              <div className="stat-card total">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <h3>Total</h3>
                  <p className="stat-number">4</p>
                  <p className="stat-label">Pasien</p>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="patient-controls">
              <div className="search-section">
                <div className="search-input-group">
                  <i className="search-icon">🔍</i>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Cari pasien berdasarkan nama atau ID..."
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
                  <option value="critical">Kritis</option>
                  <option value="urgent">Darurat</option>
                  <option value="stable">Stabil</option>
                </select>
              </div>
            </div>

            {/* Patient List */}
            <div className="patient-list">
              <div className="list-header">
                <h3>Daftar Pasien IGD</h3>
                <div className="list-actions">
                  <button className="btn btn-primary">
                    <i className="btn-icon">➕</i>
                    Tambah Pasien
                  </button>
                  <button className="btn btn-secondary">
                    <i className="btn-icon">📊</i>
                    Export Data
                  </button>
                </div>
              </div>

              <div className="patient-grid">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className={`patient-card ${getStatusColor(patient.status)}`}
                    onClick={() => setSelectedPatient(patient)}
                  >
                    <div className="patient-header">
                      <div className="patient-id">{patient.id}</div>
                      <div className={`priority-badge ${getPriorityColor(patient.priority)}`}>
                        {patient.priority}
                      </div>
                    </div>
                    
                    <div className="patient-info">
                      <h4 className="patient-name">{patient.name}</h4>
                      <div className="patient-details">
                        <span className="detail-item">
                          <i className="detail-icon">👤</i>
                          {patient.age} tahun, {patient.gender}
                        </span>
                        <span className="detail-item">
                          <i className="detail-icon">🩺</i>
                          {patient.diagnosis}
                        </span>
                        <span className="detail-item">
                          <i className="detail-icon">🏥</i>
                          {patient.room}
                        </span>
                        <span className="detail-item">
                          <i className="detail-icon">⏰</i>
                          Masuk: {patient.admissionTime}
                        </span>
                      </div>
                    </div>

                    <div className="vital-signs">
                      <h5>Vital Signs</h5>
                      <div className="vitals-grid">
                        <div className="vital-item">
                          <span className="vital-label">BP</span>
                          <span className="vital-value">{patient.vitalSigns.bp}</span>
                        </div>
                        <div className="vital-item">
                          <span className="vital-label">HR</span>
                          <span className="vital-value">{patient.vitalSigns.hr}</span>
                        </div>
                        <div className="vital-item">
                          <span className="vital-label">Temp</span>
                          <span className="vital-value">{patient.vitalSigns.temp}</span>
                        </div>
                        <div className="vital-item">
                          <span className="vital-label">SpO2</span>
                          <span className="vital-value">{patient.vitalSigns.spo2}</span>
                        </div>
                      </div>
                    </div>

                    <div className="patient-actions">
                      <button className="action-btn primary">
                        <i className="action-icon">👁️</i>
                        Lihat Detail
                      </button>
                      <button className="action-btn secondary">
                        <i className="action-icon">✏️</i>
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Patient Detail Modal */}
            {selectedPatient && (
              <div className="patient-modal-overlay" onClick={() => setSelectedPatient(null)}>
                <div className="patient-modal" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3>Detail Pasien - {selectedPatient.name}</h3>
                    <button className="modal-close" onClick={() => setSelectedPatient(null)}>
                      ✕
                    </button>
                  </div>
                  <div className="modal-content">
                    <div className="modal-section">
                      <h4>Informasi Pasien</h4>
                      <div className="info-grid">
                        <div className="info-item">
                          <label>ID Pasien:</label>
                          <span>{selectedPatient.id}</span>
                        </div>
                        <div className="info-item">
                          <label>Nama:</label>
                          <span>{selectedPatient.name}</span>
                        </div>
                        <div className="info-item">
                          <label>Usia:</label>
                          <span>{selectedPatient.age} tahun</span>
                        </div>
                        <div className="info-item">
                          <label>Jenis Kelamin:</label>
                          <span>{selectedPatient.gender}</span>
                        </div>
                        <div className="info-item">
                          <label>Status:</label>
                          <span className={`status-badge ${getStatusColor(selectedPatient.status)}`}>
                            {selectedPatient.status}
                          </span>
                        </div>
                        <div className="info-item">
                          <label>Prioritas:</label>
                          <span className={`priority-badge ${getPriorityColor(selectedPatient.priority)}`}>
                            {selectedPatient.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="modal-section">
                      <h4>Informasi Medis</h4>
                      <div className="info-grid">
                        <div className="info-item">
                          <label>Diagnosa:</label>
                          <span>{selectedPatient.diagnosis}</span>
                        </div>
                        <div className="info-item">
                          <label>Ruang:</label>
                          <span>{selectedPatient.room}</span>
                        </div>
                        <div className="info-item">
                          <label>Waktu Masuk:</label>
                          <span>{selectedPatient.admissionTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="modal-section">
                      <h4>Vital Signs Terkini</h4>
                      <div className="vitals-detail">
                        <div className="vital-detail-item">
                          <span className="vital-label">Tekanan Darah:</span>
                          <span className="vital-value">{selectedPatient.vitalSigns.bp}</span>
                        </div>
                        <div className="vital-detail-item">
                          <span className="vital-label">Denyut Jantung:</span>
                          <span className="vital-value">{selectedPatient.vitalSigns.hr} bpm</span>
                        </div>
                        <div className="vital-detail-item">
                          <span className="vital-label">Suhu Tubuh:</span>
                          <span className="vital-value">{selectedPatient.vitalSigns.temp}</span>
                        </div>
                        <div className="vital-detail-item">
                          <span className="vital-label">Oksigen:</span>
                          <span className="vital-value">{selectedPatient.vitalSigns.spo2}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-primary">
                      <i className="btn-icon">✏️</i>
                      Edit Data
                    </button>
                    <button className="btn btn-secondary">
                      <i className="btn-icon">📋</i>
                      Cetak Laporan
                    </button>
                    <button className="btn btn-danger">
                      <i className="btn-icon">🚨</i>
                      Tandai Darurat
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
            <span>Preview Menu Pasien v1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PatientPreview;
