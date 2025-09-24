import React, { useState, useEffect } from 'react';
import './AmbulanceTrackerPreview.css';

const AmbulanceTrackerPreview = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedAmbulance, setSelectedAmbulance] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date());

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock data ambulance
  const ambulances = [
    {
      id: 'AMB-001',
      driverName: 'Ahmad Suryadi',
      driverPhone: '0812-3456-7890',
      status: 'on_duty',
      currentLocation: 'Jl. Sudirman No. 123',
      destination: 'RS Jantung Harapan',
      patientName: 'John Doe',
      estimatedArrival: '15:00',
      distance: '2.5 km',
      speed: '45 km/h',
      fuelLevel: 85,
      lastUpdate: '14:45',
      coordinates: { lat: -6.2088, lng: 106.8456 },
      emergencyLevel: 'high',
      equipment: ['Defibrillator', 'Oxygen Tank', 'Stretcher', 'First Aid Kit']
    },
    {
      id: 'AMB-002',
      driverName: 'Budi Santoso',
      driverPhone: '0813-4567-8901',
      status: 'available',
      currentLocation: 'Jl. Thamrin No. 456',
      destination: null,
      patientName: null,
      estimatedArrival: null,
      distance: null,
      speed: '0 km/h',
      fuelLevel: 92,
      lastUpdate: '14:50',
      coordinates: { lat: -6.1944, lng: 106.8229 },
      emergencyLevel: null,
      equipment: ['Defibrillator', 'Oxygen Tank', 'Stretcher', 'First Aid Kit', 'IV Set']
    },
    {
      id: 'AMB-003',
      driverName: 'Siti Nurhaliza',
      driverPhone: '0814-5678-9012',
      status: 'on_duty',
      currentLocation: 'Jl. Gatot Subroto No. 789',
      destination: 'RS Stroke Nasional',
      patientName: 'Robert Johnson',
      estimatedArrival: '16:30',
      distance: '1.8 km',
      speed: '38 km/h',
      fuelLevel: 67,
      lastUpdate: '14:48',
      coordinates: { lat: -6.2297, lng: 106.8044 },
      emergencyLevel: 'critical',
      equipment: ['Defibrillator', 'Oxygen Tank', 'Stretcher', 'First Aid Kit', 'Cardiac Monitor']
    },
    {
      id: 'AMB-004',
      driverName: 'Dedi Mulyadi',
      driverPhone: '0815-6789-0123',
      status: 'maintenance',
      currentLocation: 'Workshop RS Umum',
      destination: null,
      patientName: null,
      estimatedArrival: null,
      distance: null,
      speed: '0 km/h',
      fuelLevel: 45,
      lastUpdate: '14:30',
      coordinates: { lat: -6.1751, lng: 106.8650 },
      emergencyLevel: null,
      equipment: ['Defibrillator', 'Oxygen Tank', 'Stretcher', 'First Aid Kit']
    },
    {
      id: 'AMB-005',
      driverName: 'Eko Prasetyo',
      driverPhone: '0816-7890-1234',
      status: 'on_duty',
      currentLocation: 'Jl. Rasuna Said No. 321',
      destination: 'RS Bedah Umum',
      patientName: 'Maria Garcia',
      estimatedArrival: '17:30',
      distance: '3.2 km',
      speed: '42 km/h',
      fuelLevel: 78,
      lastUpdate: '14:52',
      coordinates: { lat: -6.2615, lng: 106.8106 },
      emergencyLevel: 'medium',
      equipment: ['Defibrillator', 'Oxygen Tank', 'Stretcher', 'First Aid Kit', 'Surgical Kit']
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'on_duty': return 'on_duty';
      case 'available': return 'available';
      case 'maintenance': return 'maintenance';
      case 'offline': return 'offline';
      default: return 'neutral';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'on_duty': return 'Dalam Tugas';
      case 'available': return 'Tersedia';
      case 'maintenance': return 'Maintenance';
      case 'offline': return 'Offline';
      default: return status;
    }
  };

  const getEmergencyColor = (level) => {
    switch (level) {
      case 'critical': return 'critical';
      case 'high': return 'high';
      case 'medium': return 'medium';
      case 'low': return 'low';
      default: return 'neutral';
    }
  };

  const getEmergencyText = (level) => {
    switch (level) {
      case 'critical': return 'Kritis';
      case 'high': return 'Tinggi';
      case 'medium': return 'Sedang';
      case 'low': return 'Rendah';
      default: return 'Normal';
    }
  };

  const filteredAmbulances = ambulances.filter(ambulance => {
    const matchesSearch = ambulance.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ambulance.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ambulance.currentLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || ambulance.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusStats = () => {
    const stats = {
      on_duty: ambulances.filter(a => a.status === 'on_duty').length,
      available: ambulances.filter(a => a.status === 'available').length,
      maintenance: ambulances.filter(a => a.status === 'maintenance').length,
      offline: ambulances.filter(a => a.status === 'offline').length,
      total: ambulances.length
    };
    return stats;
  };

  const stats = getStatusStats();

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className={`ambulance-tracker-preview ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      {/* Header */}
      <header className="preview-header">
        <div className="header-content">
          <div className="header-left">
            <button className="sidebar-toggle" onClick={toggleSidebar}>
              <i className="icon-menu">☰</i>
            </button>
            <h1 className="app-title">eSIR 2.0 - Preview Ambulance Tracker</h1>
          </div>
          <div className="header-right">
            <div className="current-time">
              <i className="time-icon">🕐</i>
              <span className="time-text">{formatTime(currentTime)}</span>
            </div>
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
                <li className="nav-item">
                  <i className="nav-icon">📋</i>
                  <span className="nav-text">Rujukan</span>
                </li>
                <li className="nav-item active">
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
              <span className="breadcrumb-item active">Preview Ambulance Tracker</span>
            </nav>

            {/* Page Header */}
            <div className="page-header">
              <h2 className="page-title">Preview Ambulance Tracker eSIR 2.0</h2>
              <p className="page-description">
                Halaman ini menampilkan preview tampilan tracking ambulance dengan desain yang sesuai dengan standar medis dan rumah sakit.
              </p>
            </div>

            {/* Ambulance Statistics */}
            <div className="ambulance-stats">
              <div className="stat-card on_duty">
                <div className="stat-icon">🚑</div>
                <div className="stat-content">
                  <h3>Dalam Tugas</h3>
                  <p className="stat-number">{stats.on_duty}</p>
                  <p className="stat-label">Ambulance</p>
                </div>
              </div>
              <div className="stat-card available">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <h3>Tersedia</h3>
                  <p className="stat-number">{stats.available}</p>
                  <p className="stat-label">Ambulance</p>
                </div>
              </div>
              <div className="stat-card maintenance">
                <div className="stat-icon">🔧</div>
                <div className="stat-content">
                  <h3>Maintenance</h3>
                  <p className="stat-number">{stats.maintenance}</p>
                  <p className="stat-label">Ambulance</p>
                </div>
              </div>
              <div className="stat-card offline">
                <div className="stat-icon">❌</div>
                <div className="stat-content">
                  <h3>Offline</h3>
                  <p className="stat-number">{stats.offline}</p>
                  <p className="stat-label">Ambulance</p>
                </div>
              </div>
              <div className="stat-card total">
                <div className="stat-icon">🚗</div>
                <div className="stat-content">
                  <h3>Total</h3>
                  <p className="stat-number">{stats.total}</p>
                  <p className="stat-label">Ambulance</p>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="ambulance-controls">
              <div className="search-section">
                <div className="search-input-group">
                  <i className="search-icon">🔍</i>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Cari ambulance berdasarkan ID, driver, atau lokasi..."
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
                  <option value="on_duty">Dalam Tugas</option>
                  <option value="available">Tersedia</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
            </div>

            {/* Ambulance List */}
            <div className="ambulance-list">
              <div className="list-header">
                <h3>Daftar Ambulance</h3>
                <div className="list-actions">
                  <button className="btn btn-primary">
                    <i className="btn-icon">➕</i>
                    Tambah Ambulance
                  </button>
                  <button className="btn btn-secondary">
                    <i className="btn-icon">📊</i>
                    Export Data
                  </button>
                  <button className="btn btn-info">
                    <i className="btn-icon">🗺️</i>
                    Live Map
                  </button>
                </div>
              </div>

              <div className="ambulance-grid">
                {filteredAmbulances.map((ambulance) => (
                  <div
                    key={ambulance.id}
                    className={`ambulance-card ${getStatusColor(ambulance.status)}`}
                    onClick={() => setSelectedAmbulance(ambulance)}
                  >
                    <div className="ambulance-header">
                      <div className="ambulance-id">{ambulance.id}</div>
                      <div className={`status-badge ${getStatusColor(ambulance.status)}`}>
                        {getStatusText(ambulance.status)}
                      </div>
                      {ambulance.emergencyLevel && (
                        <div className={`emergency-badge ${getEmergencyColor(ambulance.emergencyLevel)}`}>
                          {getEmergencyText(ambulance.emergencyLevel)}
                        </div>
                      )}
                    </div>
                    
                    <div className="ambulance-info">
                      <h4 className="driver-name">{ambulance.driverName}</h4>
                      <div className="ambulance-details">
                        <span className="detail-item">
                          <i className="detail-icon">📱</i>
                          {ambulance.driverPhone}
                        </span>
                        <span className="detail-item">
                          <i className="detail-icon">📍</i>
                          {ambulance.currentLocation}
                        </span>
                        {ambulance.destination && (
                          <span className="detail-item">
                            <i className="detail-icon">🎯</i>
                            Ke: {ambulance.destination}
                          </span>
                        )}
                        {ambulance.patientName && (
                          <span className="detail-item">
                            <i className="detail-icon">👤</i>
                            Pasien: {ambulance.patientName}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="ambulance-metrics">
                      <div className="metric-row">
                        <div className="metric-item">
                          <span className="metric-label">Kecepatan</span>
                          <span className="metric-value">{ambulance.speed}</span>
                        </div>
                        <div className="metric-item">
                          <span className="metric-label">Bahan Bakar</span>
                          <span className="metric-value">{ambulance.fuelLevel}%</span>
                        </div>
                      </div>
                      {ambulance.distance && (
                        <div className="metric-row">
                          <div className="metric-item">
                            <span className="metric-label">Jarak</span>
                            <span className="metric-value">{ambulance.distance}</span>
                          </div>
                          <div className="metric-item">
                            <span className="metric-label">ETA</span>
                            <span className="metric-value">{ambulance.estimatedArrival}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="ambulance-actions">
                      <button className="action-btn primary">
                        <i className="action-icon">👁️</i>
                        Detail
                      </button>
                      <button className="action-btn secondary">
                        <i className="action-icon">📞</i>
                        Call
                      </button>
                      {ambulance.status === 'available' && (
                        <button className="action-btn success">
                          <i className="action-icon">🚑</i>
                          Assign
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ambulance Detail Modal */}
            {selectedAmbulance && (
              <div className="ambulance-modal-overlay" onClick={() => setSelectedAmbulance(null)}>
                <div className="ambulance-modal" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3>Detail Ambulance - {selectedAmbulance.id}</h3>
                    <button className="modal-close" onClick={() => setSelectedAmbulance(null)}>
                      ✕
                    </button>
                  </div>
                  <div className="modal-content">
                    <div className="modal-section">
                      <h4>Informasi Driver</h4>
                      <div className="info-grid">
                        <div className="info-item">
                          <label>ID Ambulance:</label>
                          <span>{selectedAmbulance.id}</span>
                        </div>
                        <div className="info-item">
                          <label>Nama Driver:</label>
                          <span>{selectedAmbulance.driverName}</span>
                        </div>
                        <div className="info-item">
                          <label>No. Telepon:</label>
                          <span>{selectedAmbulance.driverPhone}</span>
                        </div>
                        <div className="info-item">
                          <label>Status:</label>
                          <span className={`status-badge ${getStatusColor(selectedAmbulance.status)}`}>
                            {getStatusText(selectedAmbulance.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="modal-section">
                      <h4>Informasi Lokasi</h4>
                      <div className="info-grid">
                        <div className="info-item">
                          <label>Lokasi Saat Ini:</label>
                          <span>{selectedAmbulance.currentLocation}</span>
                        </div>
                        {selectedAmbulance.destination && (
                          <div className="info-item">
                            <label>Tujuan:</label>
                            <span>{selectedAmbulance.destination}</span>
                          </div>
                        )}
                        {selectedAmbulance.patientName && (
                          <div className="info-item">
                            <label>Nama Pasien:</label>
                            <span>{selectedAmbulance.patientName}</span>
                          </div>
                        )}
                        <div className="info-item">
                          <label>Update Terakhir:</label>
                          <span>{selectedAmbulance.lastUpdate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="modal-section">
                      <h4>Status Kendaraan</h4>
                      <div className="vehicle-metrics">
                        <div className="metric-detail-item">
                          <span className="metric-label">Kecepatan:</span>
                          <span className="metric-value">{selectedAmbulance.speed}</span>
                        </div>
                        <div className="metric-detail-item">
                          <span className="metric-label">Bahan Bakar:</span>
                          <span className="metric-value">{selectedAmbulance.fuelLevel}%</span>
                        </div>
                        {selectedAmbulance.distance && (
                          <div className="metric-detail-item">
                            <span className="metric-label">Jarak ke Tujuan:</span>
                            <span className="metric-value">{selectedAmbulance.distance}</span>
                          </div>
                        )}
                        {selectedAmbulance.estimatedArrival && (
                          <div className="metric-detail-item">
                            <span className="metric-label">Estimasi Tiba:</span>
                            <span className="metric-value">{selectedAmbulance.estimatedArrival}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="modal-section">
                      <h4>Peralatan Medis</h4>
                      <div className="equipment-list">
                        {selectedAmbulance.equipment.map((item, index) => (
                          <div key={index} className="equipment-item">
                            <i className="equipment-icon">⚕️</i>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-primary">
                      <i className="btn-icon">📞</i>
                      Hubungi Driver
                    </button>
                    <button className="btn btn-secondary">
                      <i className="btn-icon">🗺️</i>
                      Lihat di Map
                    </button>
                    {selectedAmbulance.status === 'available' && (
                      <button className="btn btn-success">
                        <i className="btn-icon">🚑</i>
                        Assign Tugas
                      </button>
                    )}
                    {selectedAmbulance.status === 'on_duty' && (
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
            <span>Preview Ambulance Tracker v1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AmbulanceTrackerPreview;
