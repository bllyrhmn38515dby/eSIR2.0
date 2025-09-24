import React, { useState, useEffect } from 'react';
import './LiveMapPreview.css';

const LiveMapPreview = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mapView, setMapView] = useState('satellite'); // satellite, street, hybrid
  const [showTraffic, setShowTraffic] = useState(true);
  const [showFaskes, setShowFaskes] = useState(true);
  const [showAmbulances, setShowAmbulances] = useState(true);
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

  // Mock data untuk map markers
  const mapData = {
    ambulances: [
      {
        id: 'AMB-001',
        name: 'Ahmad Suryadi',
        status: 'on_duty',
        currentLocation: 'Jl. Sudirman No. 123',
        destination: 'RS Jantung Harapan',
        patientName: 'John Doe',
        coordinates: { lat: -6.2088, lng: 106.8456 },
        speed: '45 km/h',
        fuelLevel: 85,
        lastUpdate: '14:45',
        emergencyLevel: 'high',
        route: [
          { lat: -6.2088, lng: 106.8456 },
          { lat: -6.2100, lng: 106.8500 },
          { lat: -6.2120, lng: 106.8550 },
          { lat: -6.2140, lng: 106.8600 }
        ]
      },
      {
        id: 'AMB-002',
        name: 'Budi Santoso',
        status: 'available',
        currentLocation: 'Jl. Thamrin No. 456',
        destination: null,
        patientName: null,
        coordinates: { lat: -6.1944, lng: 106.8229 },
        speed: '0 km/h',
        fuelLevel: 92,
        lastUpdate: '14:50',
        emergencyLevel: null,
        route: []
      },
      {
        id: 'AMB-003',
        name: 'Siti Nurhaliza',
        status: 'on_duty',
        currentLocation: 'Jl. Gatot Subroto No. 789',
        destination: 'RS Stroke Nasional',
        patientName: 'Robert Johnson',
        coordinates: { lat: -6.2297, lng: 106.8044 },
        speed: '38 km/h',
        fuelLevel: 67,
        lastUpdate: '14:48',
        emergencyLevel: 'critical',
        route: [
          { lat: -6.2297, lng: 106.8044 },
          { lat: -6.2300, lng: 106.8100 },
          { lat: -6.2320, lng: 106.8150 }
        ]
      },
      {
        id: 'AMB-004',
        name: 'Dedi Mulyadi',
        status: 'maintenance',
        currentLocation: 'Workshop RS Umum',
        destination: null,
        patientName: null,
        coordinates: { lat: -6.1751, lng: 106.8650 },
        speed: '0 km/h',
        fuelLevel: 45,
        lastUpdate: '14:30',
        emergencyLevel: null,
        route: []
      },
      {
        id: 'AMB-005',
        name: 'Eko Prasetyo',
        status: 'on_duty',
        currentLocation: 'Jl. Rasuna Said No. 321',
        destination: 'RS Bedah Umum',
        patientName: 'Maria Garcia',
        coordinates: { lat: -6.2615, lng: 106.8106 },
        speed: '42 km/h',
        fuelLevel: 78,
        lastUpdate: '14:52',
        emergencyLevel: 'medium',
        route: [
          { lat: -6.2615, lng: 106.8106 },
          { lat: -6.2620, lng: 106.8150 },
          { lat: -6.2640, lng: 106.8200 }
        ]
      }
    ],
    faskes: [
      {
        id: 'FASKES-001',
        name: 'RSUD Kota Jakarta',
        type: 'rumah_sakit',
        level: 'A',
        coordinates: { lat: -6.2088, lng: 106.8456 },
        status: 'active',
        bedCount: 250,
        availableBeds: 45,
        icuBeds: 15,
        availableIcuBeds: 3,
        specialties: ['Kardiologi', 'Neurologi', 'Orthopedi', 'Pediatri']
      },
      {
        id: 'FASKES-002',
        name: 'RS Jantung Harapan',
        type: 'rumah_sakit',
        level: 'A',
        coordinates: { lat: -6.2140, lng: 106.8600 },
        status: 'active',
        bedCount: 180,
        availableBeds: 25,
        icuBeds: 20,
        availableIcuBeds: 2,
        specialties: ['Kardiologi', 'Bedah Jantung', 'Anestesi']
      },
      {
        id: 'FASKES-003',
        name: 'Puskesmas Menteng',
        type: 'puskesmas',
        level: 'B',
        coordinates: { lat: -6.1944, lng: 106.8229 },
        status: 'active',
        bedCount: 20,
        availableBeds: 8,
        icuBeds: 0,
        availableIcuBeds: 0,
        specialties: ['Umum', 'KIA', 'Gigi']
      },
      {
        id: 'FASKES-004',
        name: 'RS Stroke Nasional',
        type: 'rumah_sakit',
        level: 'A',
        coordinates: { lat: -6.2320, lng: 106.8150 },
        status: 'maintenance',
        bedCount: 120,
        availableBeds: 0,
        icuBeds: 10,
        availableIcuBeds: 0,
        specialties: ['Neurologi', 'Rehabilitasi Medik', 'Fisioterapi']
      },
      {
        id: 'FASKES-005',
        name: 'Klinik Pratama Sehat',
        type: 'klinik',
        level: 'C',
        coordinates: { lat: -6.1751, lng: 106.8650 },
        status: 'active',
        bedCount: 5,
        availableBeds: 3,
        icuBeds: 0,
        availableIcuBeds: 0,
        specialties: ['Umum', 'Gigi']
      }
    ],
    traffic: [
      {
        id: 'TRAFFIC-001',
        type: 'heavy',
        location: 'Jl. Sudirman - Bundaran HI',
        coordinates: { lat: -6.1944, lng: 106.8229 },
        description: 'Kemacetan berat - 2 km antrian'
      },
      {
        id: 'TRAFFIC-002',
        type: 'moderate',
        location: 'Jl. Gatot Subroto - Senayan',
        coordinates: { lat: -6.2297, lng: 106.8044 },
        description: 'Lalu lintas padat - 1 km antrian'
      },
      {
        id: 'TRAFFIC-003',
        type: 'light',
        location: 'Jl. Rasuna Said - Kuningan',
        coordinates: { lat: -6.2615, lng: 106.8106 },
        description: 'Lalu lintas lancar'
      }
    ]
  };

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

  const getTrafficColor = (type) => {
    switch (type) {
      case 'heavy': return 'heavy';
      case 'moderate': return 'moderate';
      case 'light': return 'light';
      default: return 'neutral';
    }
  };

  const getTrafficText = (type) => {
    switch (type) {
      case 'heavy': return 'Macet Berat';
      case 'moderate': return 'Padat';
      case 'light': return 'Lancar';
      default: return type;
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getMapStats = () => {
    const stats = {
      totalAmbulances: mapData.ambulances.length,
      activeAmbulances: mapData.ambulances.filter(a => a.status === 'on_duty').length,
      availableAmbulances: mapData.ambulances.filter(a => a.status === 'available').length,
      totalFaskes: mapData.faskes.length,
      activeFaskes: mapData.faskes.filter(f => f.status === 'active').length,
      trafficAlerts: mapData.traffic.filter(t => t.type === 'heavy').length
    };
    return stats;
  };

  const stats = getMapStats();

  return (
    <div className={`live-map-preview ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      {/* Header */}
      <header className="preview-header">
        <div className="header-content">
          <div className="header-left">
            <button className="sidebar-toggle" onClick={toggleSidebar}>
              <i className="icon-menu">☰</i>
            </button>
            <h1 className="app-title">eSIR 2.0 - Preview Live Map</h1>
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
                <li className="nav-item">
                  <i className="nav-icon">📍</i>
                  <span className="nav-text">Tracking</span>
                </li>
                <li className="nav-item">
                  <i className="nav-icon">📊</i>
                  <span className="nav-text">Reports</span>
                </li>
                <li className="nav-item active">
                  <i className="nav-icon">🗺️</i>
                  <span className="nav-text">Live Map</span>
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
              <span className="breadcrumb-item active">Preview Live Map</span>
            </nav>

            {/* Page Header */}
            <div className="page-header">
              <h2 className="page-title">Preview Live Map eSIR 2.0</h2>
              <p className="page-description">
                Halaman ini menampilkan preview tampilan live map dengan tracking real-time ambulance dan fasilitas kesehatan.
              </p>
            </div>

            {/* Map Statistics */}
            <div className="map-stats">
              <div className="stat-card ambulances">
                <div className="stat-icon">🚑</div>
                <div className="stat-content">
                  <h3>Total Ambulance</h3>
                  <p className="stat-number">{stats.totalAmbulances}</p>
                  <p className="stat-label">Unit</p>
                </div>
              </div>
              <div className="stat-card active">
                <div className="stat-icon">🟢</div>
                <div className="stat-content">
                  <h3>Aktif</h3>
                  <p className="stat-number">{stats.activeAmbulances}</p>
                  <p className="stat-label">Ambulance</p>
                </div>
              </div>
              <div className="stat-card available">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <h3>Tersedia</h3>
                  <p className="stat-number">{stats.availableAmbulances}</p>
                  <p className="stat-label">Ambulance</p>
                </div>
              </div>
              <div className="stat-card faskes">
                <div className="stat-icon">🏥</div>
                <div className="stat-content">
                  <h3>Faskes Aktif</h3>
                  <p className="stat-number">{stats.activeFaskes}</p>
                  <p className="stat-label">Faskes</p>
                </div>
              </div>
              <div className="stat-card traffic">
                <div className="stat-icon">🚨</div>
                <div className="stat-content">
                  <h3>Traffic Alert</h3>
                  <p className="stat-number">{stats.trafficAlerts}</p>
                  <p className="stat-label">Lokasi</p>
                </div>
              </div>
            </div>

            {/* Map Controls */}
            <div className="map-controls">
              <div className="control-group">
                <label className="control-label">Map View:</label>
                <select
                  className="control-select"
                  value={mapView}
                  onChange={(e) => setMapView(e.target.value)}
                >
                  <option value="satellite">Satellite</option>
                  <option value="street">Street</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div className="control-group">
                <label className="control-label">Layers:</label>
                <div className="control-checkboxes">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={showTraffic}
                      onChange={(e) => setShowTraffic(e.target.checked)}
                    />
                    <span className="checkbox-text">Traffic</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={showFaskes}
                      onChange={(e) => setShowFaskes(e.target.checked)}
                    />
                    <span className="checkbox-text">Faskes</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={showAmbulances}
                      onChange={(e) => setShowAmbulances(e.target.checked)}
                    />
                    <span className="checkbox-text">Ambulance</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Map Container */}
            <div className="map-container">
              <div className="map-header">
                <h3>Live Map - Jakarta Area</h3>
                <div className="map-actions">
                  <button className="btn btn-primary">
                    <i className="btn-icon">🔄</i>
                    Refresh
                  </button>
                  <button className="btn btn-secondary">
                    <i className="btn-icon">📍</i>
                    My Location
                  </button>
                  <button className="btn btn-info">
                    <i className="btn-icon">🔍</i>
                    Search
                  </button>
                </div>
              </div>
              
              {/* Mock Map Area */}
              <div className="mock-map">
                <div className="map-overlay">
                  <div className="map-legend">
                    <h4>Legend</h4>
                    <div className="legend-items">
                      <div className="legend-item">
                        <div className="legend-marker ambulance on_duty"></div>
                        <span>Ambulance Aktif</span>
                      </div>
                      <div className="legend-item">
                        <div className="legend-marker ambulance available"></div>
                        <span>Ambulance Tersedia</span>
                      </div>
                      <div className="legend-item">
                        <div className="legend-marker ambulance maintenance"></div>
                        <span>Ambulance Maintenance</span>
                      </div>
                      <div className="legend-item">
                        <div className="legend-marker faskes rumah_sakit"></div>
                        <span>Rumah Sakit</span>
                      </div>
                      <div className="legend-item">
                        <div className="legend-marker faskes puskesmas"></div>
                        <span>Puskesmas</span>
                      </div>
                      <div className="legend-item">
                        <div className="legend-marker faskes klinik"></div>
                        <span>Klinik</span>
                      </div>
                      <div className="legend-item">
                        <div className="legend-marker traffic heavy"></div>
                        <span>Traffic Macet</span>
                      </div>
                      <div className="legend-item">
                        <div className="legend-marker traffic moderate"></div>
                        <span>Traffic Padat</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mock Markers */}
                {showAmbulances && mapData.ambulances.map((ambulance) => (
                  <div
                    key={ambulance.id}
                    className={`map-marker ambulance ${getStatusColor(ambulance.status)} ${ambulance.emergencyLevel ? getEmergencyColor(ambulance.emergencyLevel) : ''}`}
                    style={{
                      left: `${(ambulance.coordinates.lng + 106.9) * 100}%`,
                      top: `${(ambulance.coordinates.lat + 6.3) * 100}%`
                    }}
                    onClick={() => setSelectedMarker(ambulance)}
                  >
                    <div className="marker-icon">🚑</div>
                    <div className="marker-pulse"></div>
                  </div>
                ))}

                {showFaskes && mapData.faskes.map((faskes) => (
                  <div
                    key={faskes.id}
                    className={`map-marker faskes ${getTypeColor(faskes.type)}`}
                    style={{
                      left: `${(faskes.coordinates.lng + 106.9) * 100}%`,
                      top: `${(faskes.coordinates.lat + 6.3) * 100}%`
                    }}
                    onClick={() => setSelectedMarker(faskes)}
                  >
                    <div className="marker-icon">🏥</div>
                  </div>
                ))}

                {showTraffic && mapData.traffic.map((traffic) => (
                  <div
                    key={traffic.id}
                    className={`map-marker traffic ${getTrafficColor(traffic.type)}`}
                    style={{
                      left: `${(traffic.coordinates.lng + 106.9) * 100}%`,
                      top: `${(traffic.coordinates.lat + 6.3) * 100}%`
                    }}
                    onClick={() => setSelectedMarker(traffic)}
                  >
                    <div className="marker-icon">🚦</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Marker Detail Modal */}
            {selectedMarker && (
              <div className="marker-modal-overlay" onClick={() => setSelectedMarker(null)}>
                <div className="marker-modal" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3>
                      {selectedMarker.id} - {selectedMarker.name || selectedMarker.location}
                    </h3>
                    <button className="modal-close" onClick={() => setSelectedMarker(null)}>
                      ✕
                    </button>
                  </div>
                  <div className="modal-content">
                    {selectedMarker.status && (
                      <div className="modal-section">
                        <h4>Informasi Ambulance</h4>
                        <div className="info-grid">
                          <div className="info-item">
                            <label>ID:</label>
                            <span>{selectedMarker.id}</span>
                          </div>
                          <div className="info-item">
                            <label>Driver:</label>
                            <span>{selectedMarker.name}</span>
                          </div>
                          <div className="info-item">
                            <label>Status:</label>
                            <span className={`status-badge ${getStatusColor(selectedMarker.status)}`}>
                              {getStatusText(selectedMarker.status)}
                            </span>
                          </div>
                          <div className="info-item">
                            <label>Lokasi:</label>
                            <span>{selectedMarker.currentLocation}</span>
                          </div>
                          <div className="info-item">
                            <label>Kecepatan:</label>
                            <span>{selectedMarker.speed}</span>
                          </div>
                          <div className="info-item">
                            <label>Bahan Bakar:</label>
                            <span>{selectedMarker.fuelLevel}%</span>
                          </div>
                          {selectedMarker.patientName && (
                            <div className="info-item">
                              <label>Pasien:</label>
                              <span>{selectedMarker.patientName}</span>
                            </div>
                          )}
                          {selectedMarker.destination && (
                            <div className="info-item">
                              <label>Tujuan:</label>
                              <span>{selectedMarker.destination}</span>
                            </div>
                          )}
                          {selectedMarker.emergencyLevel && (
                            <div className="info-item">
                              <label>Level Darurat:</label>
                              <span className={`priority-badge ${getEmergencyColor(selectedMarker.emergencyLevel)}`}>
                                {getEmergencyText(selectedMarker.emergencyLevel)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {selectedMarker.type && (
                      <div className="modal-section">
                        <h4>Informasi Faskes</h4>
                        <div className="info-grid">
                          <div className="info-item">
                            <label>ID:</label>
                            <span>{selectedMarker.id}</span>
                          </div>
                          <div className="info-item">
                            <label>Nama:</label>
                            <span>{selectedMarker.name}</span>
                          </div>
                          <div className="info-item">
                            <label>Tipe:</label>
                            <span className={`type-badge ${getTypeColor(selectedMarker.type)}`}>
                              {getTypeText(selectedMarker.type)}
                            </span>
                          </div>
                          <div className="info-item">
                            <label>Level:</label>
                            <span>Level {selectedMarker.level}</span>
                          </div>
                          <div className="info-item">
                            <label>Status:</label>
                            <span className={`status-badge ${selectedMarker.status === 'active' ? 'active' : 'maintenance'}`}>
                              {selectedMarker.status === 'active' ? 'Aktif' : 'Maintenance'}
                            </span>
                          </div>
                          <div className="info-item">
                            <label>Tempat Tidur:</label>
                            <span>{selectedMarker.availableBeds}/{selectedMarker.bedCount}</span>
                          </div>
                          {selectedMarker.icuBeds > 0 && (
                            <div className="info-item">
                              <label>ICU:</label>
                              <span>{selectedMarker.availableIcuBeds}/{selectedMarker.icuBeds}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {selectedMarker.type === 'heavy' || selectedMarker.type === 'moderate' || selectedMarker.type === 'light' ? (
                      <div className="modal-section">
                        <h4>Informasi Traffic</h4>
                        <div className="info-grid">
                          <div className="info-item">
                            <label>Lokasi:</label>
                            <span>{selectedMarker.location}</span>
                          </div>
                          <div className="info-item">
                            <label>Kondisi:</label>
                            <span className={`traffic-badge ${getTrafficColor(selectedMarker.type)}`}>
                              {getTrafficText(selectedMarker.type)}
                            </span>
                          </div>
                          <div className="info-item">
                            <label>Deskripsi:</label>
                            <span>{selectedMarker.description}</span>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-primary">
                      <i className="btn-icon">📍</i>
                      Lihat Detail
                    </button>
                    <button className="btn btn-secondary">
                      <i className="btn-icon">📞</i>
                      Hubungi
                    </button>
                    {selectedMarker.status === 'available' && (
                      <button className="btn btn-success">
                        <i className="btn-icon">🚑</i>
                        Assign
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
            <span>Preview Live Map v1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LiveMapPreview;
