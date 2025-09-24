import React, { useState, useEffect } from 'react';
import './TrackingPreview.css';

const TrackingPreview = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedTracking, setSelectedTracking] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
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

  // Mock data tracking rujukan
  const trackingData = [
    {
      id: 'TRK-001',
      referralId: 'REF-001',
      patientName: 'John Doe',
      patientId: 'P001',
      fromFaskes: 'RSUD Kota Jakarta',
      toFaskes: 'RS Jantung Harapan',
      ambulanceId: 'AMB-001',
      driverName: 'Ahmad Suryadi',
      driverPhone: '0812-3456-7890',
      status: 'in_transit',
      priority: 'critical',
      requestTime: '2024-01-26 14:00',
      pickupTime: '2024-01-26 14:15',
      estimatedArrival: '2024-01-26 14:45',
      actualArrival: null,
      distance: '2.5 km',
      currentLocation: 'Jl. Sudirman No. 123',
      progress: 65,
      vitalSigns: {
        bp: '140/90',
        hr: '95',
        temp: '37.2°C',
        spo2: '98%'
      },
      notes: 'Pasien membutuhkan penanganan kardiologi segera. Kondisi stabil selama perjalanan.',
      timeline: [
        { time: '14:00', event: 'Rujukan dibuat', status: 'completed' },
        { time: '14:05', event: 'Ambulance ditugaskan', status: 'completed' },
        { time: '14:15', event: 'Ambulance berangkat', status: 'completed' },
        { time: '14:20', event: 'Tiba di lokasi pasien', status: 'completed' },
        { time: '14:25', event: 'Pasien diambil', status: 'completed' },
        { time: '14:30', event: 'Dalam perjalanan', status: 'in_progress' },
        { time: '14:45', event: 'Estimasi tiba di tujuan', status: 'pending' }
      ]
    },
    {
      id: 'TRK-002',
      referralId: 'REF-002',
      patientName: 'Maria Garcia',
      patientId: 'P002',
      fromFaskes: 'Puskesmas Menteng',
      toFaskes: 'RS Stroke Nasional',
      ambulanceId: 'AMB-003',
      driverName: 'Siti Nurhaliza',
      driverPhone: '0814-5678-9012',
      status: 'completed',
      priority: 'high',
      requestTime: '2024-01-26 13:00',
      pickupTime: '2024-01-26 13:15',
      estimatedArrival: '2024-01-26 13:45',
      actualArrival: '2024-01-26 13:42',
      distance: '1.8 km',
      currentLocation: 'RS Stroke Nasional',
      progress: 100,
      vitalSigns: {
        bp: '120/80',
        hr: '88',
        temp: '36.8°C',
        spo2: '99%'
      },
      notes: 'Pasien telah tiba dengan selamat. Kondisi vital signs stabil.',
      timeline: [
        { time: '13:00', event: 'Rujukan dibuat', status: 'completed' },
        { time: '13:05', event: 'Ambulance ditugaskan', status: 'completed' },
        { time: '13:15', event: 'Ambulance berangkat', status: 'completed' },
        { time: '13:20', event: 'Tiba di lokasi pasien', status: 'completed' },
        { time: '13:25', event: 'Pasien diambil', status: 'completed' },
        { time: '13:30', event: 'Dalam perjalanan', status: 'completed' },
        { time: '13:42', event: 'Tiba di tujuan', status: 'completed' }
      ]
    },
    {
      id: 'TRK-003',
      referralId: 'REF-003',
      patientName: 'Robert Johnson',
      patientId: 'P003',
      fromFaskes: 'Klinik Pratama Sehat',
      toFaskes: 'RSUD Kota Jakarta',
      ambulanceId: 'AMB-002',
      driverName: 'Budi Santoso',
      driverPhone: '0813-4567-8901',
      status: 'pending',
      priority: 'medium',
      requestTime: '2024-01-26 15:00',
      pickupTime: null,
      estimatedArrival: '2024-01-26 15:30',
      actualArrival: null,
      distance: '3.2 km',
      currentLocation: 'Menunggu ambulance',
      progress: 20,
      vitalSigns: {
        bp: '130/85',
        hr: '92',
        temp: '37.0°C',
        spo2: '97%'
      },
      notes: 'Menunggu ambulance tersedia. Pasien dalam kondisi stabil.',
      timeline: [
        { time: '15:00', event: 'Rujukan dibuat', status: 'completed' },
        { time: '15:05', event: 'Ambulance ditugaskan', status: 'in_progress' },
        { time: '15:15', event: 'Ambulance berangkat', status: 'pending' },
        { time: '15:20', event: 'Tiba di lokasi pasien', status: 'pending' },
        { time: '15:25', event: 'Pasien diambil', status: 'pending' },
        { time: '15:30', event: 'Dalam perjalanan', status: 'pending' },
        { time: '15:45', event: 'Estimasi tiba di tujuan', status: 'pending' }
      ]
    },
    {
      id: 'TRK-004',
      referralId: 'REF-004',
      patientName: 'Sarah Wilson',
      patientId: 'P004',
      fromFaskes: 'RS Jantung Harapan',
      toFaskes: 'RS Stroke Nasional',
      ambulanceId: 'AMB-005',
      driverName: 'Eko Prasetyo',
      driverPhone: '0816-7890-1234',
      status: 'pickup',
      priority: 'high',
      requestTime: '2024-01-26 14:30',
      pickupTime: '2024-01-26 14:45',
      estimatedArrival: '2024-01-26 15:15',
      actualArrival: null,
      distance: '2.8 km',
      currentLocation: 'Jl. Gatot Subroto No. 456',
      progress: 40,
      vitalSigns: {
        bp: '150/95',
        hr: '105',
        temp: '37.5°C',
        spo2: '96%'
      },
      notes: 'Pasien sedang diambil dari RS Jantung Harapan. Kondisi memerlukan monitoring ketat.',
      timeline: [
        { time: '14:30', event: 'Rujukan dibuat', status: 'completed' },
        { time: '14:35', event: 'Ambulance ditugaskan', status: 'completed' },
        { time: '14:45', event: 'Ambulance berangkat', status: 'completed' },
        { time: '14:50', event: 'Tiba di lokasi pasien', status: 'completed' },
        { time: '14:55', event: 'Pasien diambil', status: 'in_progress' },
        { time: '15:00', event: 'Dalam perjalanan', status: 'pending' },
        { time: '15:15', event: 'Estimasi tiba di tujuan', status: 'pending' }
      ]
    },
    {
      id: 'TRK-005',
      referralId: 'REF-005',
      patientName: 'David Brown',
      patientId: 'P005',
      fromFaskes: 'RSUD Kota Jakarta',
      toFaskes: 'RS Jantung Harapan',
      ambulanceId: 'AMB-004',
      driverName: 'Dedi Mulyadi',
      driverPhone: '0815-6789-0123',
      status: 'cancelled',
      priority: 'low',
      requestTime: '2024-01-26 12:00',
      pickupTime: '2024-01-26 12:15',
      estimatedArrival: '2024-01-26 12:45',
      actualArrival: null,
      distance: '2.1 km',
      currentLocation: 'Dibatalkan',
      progress: 0,
      vitalSigns: {
        bp: '110/70',
        hr: '75',
        temp: '36.5°C',
        spo2: '99%'
      },
      notes: 'Rujukan dibatalkan karena pasien memilih untuk tidak dirujuk.',
      timeline: [
        { time: '12:00', event: 'Rujukan dibuat', status: 'completed' },
        { time: '12:05', event: 'Ambulance ditugaskan', status: 'completed' },
        { time: '12:15', event: 'Ambulance berangkat', status: 'completed' },
        { time: '12:20', event: 'Tiba di lokasi pasien', status: 'completed' },
        { time: '12:25', event: 'Pasien diambil', status: 'completed' },
        { time: '12:30', event: 'Dalam perjalanan', status: 'cancelled' },
        { time: '12:45', event: 'Estimasi tiba di tujuan', status: 'cancelled' }
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'pending';
      case 'pickup': return 'pickup';
      case 'in_transit': return 'in_transit';
      case 'completed': return 'completed';
      case 'cancelled': return 'cancelled';
      default: return 'neutral';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Menunggu';
      case 'pickup': return 'Mengambil Pasien';
      case 'in_transit': return 'Dalam Perjalanan';
      case 'completed': return 'Selesai';
      case 'cancelled': return 'Dibatalkan';
      default: return status;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'critical';
      case 'high': return 'high';
      case 'medium': return 'medium';
      case 'low': return 'low';
      default: return 'neutral';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'critical': return 'Kritis';
      case 'high': return 'Tinggi';
      case 'medium': return 'Sedang';
      case 'low': return 'Rendah';
      default: return priority;
    }
  };

  const getTimelineStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'completed';
      case 'in_progress': return 'in_progress';
      case 'pending': return 'pending';
      case 'cancelled': return 'cancelled';
      default: return 'neutral';
    }
  };

  const filteredTracking = trackingData.filter(tracking => {
    const matchesSearch = tracking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tracking.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tracking.fromFaskes.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tracking.toFaskes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || tracking.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || tracking.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getTrackingStats = () => {
    const stats = {
      pending: trackingData.filter(t => t.status === 'pending').length,
      pickup: trackingData.filter(t => t.status === 'pickup').length,
      in_transit: trackingData.filter(t => t.status === 'in_transit').length,
      completed: trackingData.filter(t => t.status === 'completed').length,
      cancelled: trackingData.filter(t => t.status === 'cancelled').length,
      total: trackingData.length
    };
    return stats;
  };

  const stats = getTrackingStats();

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className={`tracking-preview ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      {/* Header */}
      <header className="preview-header">
        <div className="header-content">
          <div className="header-left">
            <button className="sidebar-toggle" onClick={toggleSidebar}>
              <i className="icon-menu">☰</i>
            </button>
            <h1 className="app-title">eSIR 2.0 - Preview Tracking</h1>
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
                <li className="nav-item">
                  <i className="nav-icon">🚑</i>
                  <span className="nav-text">Ambulance</span>
                </li>
                <li className="nav-item active">
                  <i className="nav-icon">📍</i>
                  <span className="nav-text">Tracking</span>
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
              <span className="breadcrumb-item active">Preview Tracking</span>
            </nav>

            {/* Page Header */}
            <div className="page-header">
              <h2 className="page-title">Preview Tracking Rujukan eSIR 2.0</h2>
              <p className="page-description">
                Halaman ini menampilkan preview tampilan tracking rujukan dengan desain yang sesuai dengan standar medis dan rumah sakit.
              </p>
            </div>

            {/* Tracking Statistics */}
            <div className="tracking-stats">
              <div className="stat-card pending">
                <div className="stat-icon">⏳</div>
                <div className="stat-content">
                  <h3>Menunggu</h3>
                  <p className="stat-number">{stats.pending}</p>
                  <p className="stat-label">Tracking</p>
                </div>
              </div>
              <div className="stat-card pickup">
                <div className="stat-icon">🚑</div>
                <div className="stat-content">
                  <h3>Mengambil Pasien</h3>
                  <p className="stat-number">{stats.pickup}</p>
                  <p className="stat-label">Tracking</p>
                </div>
              </div>
              <div className="stat-card in_transit">
                <div className="stat-icon">🚗</div>
                <div className="stat-content">
                  <h3>Dalam Perjalanan</h3>
                  <p className="stat-number">{stats.in_transit}</p>
                  <p className="stat-label">Tracking</p>
                </div>
              </div>
              <div className="stat-card completed">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <h3>Selesai</h3>
                  <p className="stat-number">{stats.completed}</p>
                  <p className="stat-label">Tracking</p>
                </div>
              </div>
              <div className="stat-card cancelled">
                <div className="stat-icon">❌</div>
                <div className="stat-content">
                  <h3>Dibatalkan</h3>
                  <p className="stat-number">{stats.cancelled}</p>
                  <p className="stat-label">Tracking</p>
                </div>
              </div>
              <div className="stat-card total">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <h3>Total</h3>
                  <p className="stat-number">{stats.total}</p>
                  <p className="stat-label">Tracking</p>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="tracking-controls">
              <div className="search-section">
                <div className="search-input-group">
                  <i className="search-icon">🔍</i>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Cari tracking berdasarkan ID, pasien, atau faskes..."
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
                  <option value="pickup">Mengambil Pasien</option>
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
                  <option value="critical">Kritis</option>
                  <option value="high">Tinggi</option>
                  <option value="medium">Sedang</option>
                  <option value="low">Rendah</option>
                </select>
              </div>
            </div>

            {/* Tracking List */}
            <div className="tracking-list">
              <div className="list-header">
                <h3>Daftar Tracking Rujukan</h3>
                <div className="list-actions">
                  <button className="btn btn-primary">
                    <i className="btn-icon">➕</i>
                    Buat Tracking
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

              <div className="tracking-grid">
                {filteredTracking.map((tracking) => (
                  <div
                    key={tracking.id}
                    className={`tracking-card ${getStatusColor(tracking.status)}`}
                    onClick={() => setSelectedTracking(tracking)}
                  >
                    <div className="tracking-header">
                      <div className="tracking-id">{tracking.id}</div>
                      <div className={`status-badge ${getStatusColor(tracking.status)}`}>
                        {getStatusText(tracking.status)}
                      </div>
                      <div className={`priority-badge ${getPriorityColor(tracking.priority)}`}>
                        {getPriorityText(tracking.priority)}
                      </div>
                    </div>
                    
                    <div className="tracking-info">
                      <h4 className="patient-name">{tracking.patientName}</h4>
                      <div className="tracking-details">
                        <span className="detail-item">
                          <i className="detail-icon">🏥</i>
                          Dari: {tracking.fromFaskes}
                        </span>
                        <span className="detail-item">
                          <i className="detail-icon">🎯</i>
                          Ke: {tracking.toFaskes}
                        </span>
                        <span className="detail-item">
                          <i className="detail-icon">🚑</i>
                          {tracking.ambulanceId} - {tracking.driverName}
                        </span>
                        <span className="detail-item">
                          <i className="detail-icon">📍</i>
                          {tracking.currentLocation}
                        </span>
                      </div>
                    </div>

                    <div className="tracking-progress">
                      <div className="progress-header">
                        <span className="progress-label">Progress</span>
                        <span className="progress-percentage">{tracking.progress}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${tracking.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="tracking-metrics">
                      <div className="metric-row">
                        <div className="metric-item">
                          <span className="metric-label">Jarak</span>
                          <span className="metric-value">{tracking.distance}</span>
                        </div>
                        <div className="metric-item">
                          <span className="metric-label">ETA</span>
                          <span className="metric-value">
                            {tracking.estimatedArrival ? tracking.estimatedArrival.split(' ')[1] : 'N/A'}
                          </span>
                        </div>
                      </div>
                      <div className="metric-row">
                        <div className="metric-item">
                          <span className="metric-label">Request</span>
                          <span className="metric-value">
                            {tracking.requestTime.split(' ')[1]}
                          </span>
                        </div>
                        <div className="metric-item">
                          <span className="metric-label">Pickup</span>
                          <span className="metric-value">
                            {tracking.pickupTime ? tracking.pickupTime.split(' ')[1] : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="tracking-actions">
                      <button className="action-btn primary">
                        <i className="action-icon">👁️</i>
                        Detail
                      </button>
                      <button className="action-btn secondary">
                        <i className="action-icon">📞</i>
                        Call Driver
                      </button>
                      {tracking.status === 'pending' && (
                        <button className="action-btn success">
                          <i className="action-icon">🚑</i>
                          Assign
                        </button>
                      )}
                      {tracking.status === 'in_transit' && (
                        <button className="action-btn warning">
                          <i className="action-icon">📍</i>
                          Update
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tracking Detail Modal */}
            {selectedTracking && (
              <div className="tracking-modal-overlay" onClick={() => setSelectedTracking(null)}>
                <div className="tracking-modal" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3>Detail Tracking - {selectedTracking.id}</h3>
                    <button className="modal-close" onClick={() => setSelectedTracking(null)}>
                      ✕
                    </button>
                  </div>
                  <div className="modal-content">
                    <div className="modal-section">
                      <h4>Informasi Pasien</h4>
                      <div className="info-grid">
                        <div className="info-item">
                          <label>ID Tracking:</label>
                          <span>{selectedTracking.id}</span>
                        </div>
                        <div className="info-item">
                          <label>ID Rujukan:</label>
                          <span>{selectedTracking.referralId}</span>
                        </div>
                        <div className="info-item">
                          <label>Nama Pasien:</label>
                          <span>{selectedTracking.patientName}</span>
                        </div>
                        <div className="info-item">
                          <label>ID Pasien:</label>
                          <span>{selectedTracking.patientId}</span>
                        </div>
                        <div className="info-item">
                          <label>Status:</label>
                          <span className={`status-badge ${getStatusColor(selectedTracking.status)}`}>
                            {getStatusText(selectedTracking.status)}
                          </span>
                        </div>
                        <div className="info-item">
                          <label>Prioritas:</label>
                          <span className={`priority-badge ${getPriorityColor(selectedTracking.priority)}`}>
                            {getPriorityText(selectedTracking.priority)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="modal-section">
                      <h4>Informasi Rujukan</h4>
                      <div className="info-grid">
                        <div className="info-item">
                          <label>Dari Faskes:</label>
                          <span>{selectedTracking.fromFaskes}</span>
                        </div>
                        <div className="info-item">
                          <label>Ke Faskes:</label>
                          <span>{selectedTracking.toFaskes}</span>
                        </div>
                        <div className="info-item">
                          <label>Jarak:</label>
                          <span>{selectedTracking.distance}</span>
                        </div>
                        <div className="info-item">
                          <label>Lokasi Saat Ini:</label>
                          <span>{selectedTracking.currentLocation}</span>
                        </div>
                      </div>
                    </div>

                    <div className="modal-section">
                      <h4>Informasi Ambulance</h4>
                      <div className="info-grid">
                        <div className="info-item">
                          <label>ID Ambulance:</label>
                          <span>{selectedTracking.ambulanceId}</span>
                        </div>
                        <div className="info-item">
                          <label>Nama Driver:</label>
                          <span>{selectedTracking.driverName}</span>
                        </div>
                        <div className="info-item">
                          <label>No. Telepon:</label>
                          <span>{selectedTracking.driverPhone}</span>
                        </div>
                        <div className="info-item">
                          <label>Progress:</label>
                          <span>{selectedTracking.progress}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="modal-section">
                      <h4>Vital Signs</h4>
                      <div className="vital-signs-grid">
                        <div className="vital-item">
                          <span className="vital-label">Tekanan Darah:</span>
                          <span className="vital-value">{selectedTracking.vitalSigns.bp}</span>
                        </div>
                        <div className="vital-item">
                          <span className="vital-label">Detak Jantung:</span>
                          <span className="vital-value">{selectedTracking.vitalSigns.hr} bpm</span>
                        </div>
                        <div className="vital-item">
                          <span className="vital-label">Suhu:</span>
                          <span className="vital-value">{selectedTracking.vitalSigns.temp}</span>
                        </div>
                        <div className="vital-item">
                          <span className="vital-label">SpO2:</span>
                          <span className="vital-value">{selectedTracking.vitalSigns.spo2}</span>
                        </div>
                      </div>
                    </div>

                    <div className="modal-section">
                      <h4>Timeline Tracking</h4>
                      <div className="timeline">
                        {selectedTracking.timeline.map((event, index) => (
                          <div key={index} className={`timeline-item ${getTimelineStatusColor(event.status)}`}>
                            <div className="timeline-marker">
                              <div className="timeline-dot"></div>
                            </div>
                            <div className="timeline-content">
                              <div className="timeline-time">{event.time}</div>
                              <div className="timeline-event">{event.event}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="modal-section">
                      <h4>Catatan</h4>
                      <div className="notes-content">
                        <p>{selectedTracking.notes}</p>
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
                    {selectedTracking.status === 'pending' && (
                      <button className="btn btn-success">
                        <i className="btn-icon">🚑</i>
                        Assign Ambulance
                      </button>
                    )}
                    {selectedTracking.status === 'in_transit' && (
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
            <span>Preview Tracking v1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TrackingPreview;
