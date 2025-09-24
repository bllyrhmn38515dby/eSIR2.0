import React, { useState } from 'react';
import './ReportsPreview.css';

const ReportsPreview = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('all');

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Mock data reports
  const reports = [
    {
      id: 'RPT-001',
      title: 'Laporan Harian Rujukan',
      type: 'daily',
      period: '2024-01-26',
      status: 'completed',
      generatedBy: 'Dr. Admin',
      generatedAt: '2024-01-26 16:00',
      fileSize: '2.3 MB',
      format: 'PDF',
      summary: {
        totalReferrals: 23,
        completedReferrals: 18,
        pendingReferrals: 5,
        cancelledReferrals: 0,
        averageResponseTime: '12 menit',
        totalPatients: 45,
        emergencyCases: 8
      },
      charts: ['referral-trend', 'status-distribution', 'response-time'],
      description: 'Laporan harian aktivitas rujukan pasien dengan analisis trend dan performa sistem.'
    },
    {
      id: 'RPT-002',
      title: 'Laporan Bulanan Faskes',
      type: 'monthly',
      period: '2024-01',
      status: 'completed',
      generatedBy: 'Dr. Admin',
      generatedAt: '2024-01-26 15:30',
      fileSize: '5.7 MB',
      format: 'Excel',
      summary: {
        totalFaskes: 45,
        activeFaskes: 42,
        maintenanceFaskes: 2,
        offlineFaskes: 1,
        totalCapacity: 1250,
        utilizationRate: '78%',
        averageWaitTime: '8 menit'
      },
      charts: ['capacity-utilization', 'faskes-performance', 'wait-time-trend'],
      description: 'Laporan bulanan performa fasilitas kesehatan dengan analisis kapasitas dan utilisasi.'
    },
    {
      id: 'RPT-003',
      title: 'Laporan Ambulance Fleet',
      type: 'weekly',
      period: '2024-W04',
      status: 'completed',
      generatedBy: 'Dr. Admin',
      generatedAt: '2024-01-26 15:00',
      fileSize: '3.1 MB',
      format: 'PDF',
      summary: {
        totalAmbulances: 8,
        activeAmbulances: 6,
        maintenanceAmbulances: 1,
        offlineAmbulances: 1,
        totalTrips: 156,
        averageTripTime: '25 menit',
        fuelConsumption: '450L'
      },
      charts: ['fleet-utilization', 'trip-efficiency', 'fuel-consumption'],
      description: 'Laporan mingguan performa fleet ambulance dengan analisis efisiensi dan konsumsi bahan bakar.'
    },
    {
      id: 'RPT-004',
      title: 'Laporan Kinerja Sistem',
      type: 'system',
      period: '2024-01-26',
      status: 'generating',
      generatedBy: 'System',
      generatedAt: '2024-01-26 16:15',
      fileSize: 'N/A',
      format: 'JSON',
      summary: {
        uptime: '99.8%',
        responseTime: '45ms',
        errorRate: '0.02%',
        activeUsers: 24,
        totalRequests: 1847,
        dataProcessed: '2.3 GB'
      },
      charts: ['system-performance', 'error-trend', 'user-activity'],
      description: 'Laporan kinerja sistem dengan metrik uptime, response time, dan error rate.'
    },
    {
      id: 'RPT-005',
      title: 'Laporan Audit Keamanan',
      type: 'audit',
      period: '2024-01',
      status: 'completed',
      generatedBy: 'Security Admin',
      generatedAt: '2024-01-26 14:45',
      fileSize: '1.8 MB',
      format: 'PDF',
      summary: {
        totalLogins: 1247,
        failedLogins: 23,
        securityAlerts: 2,
        dataAccess: 3456,
        complianceScore: '98%',
        lastBackup: '2024-01-26 02:00'
      },
      charts: ['login-activity', 'security-events', 'compliance-metrics'],
      description: 'Laporan audit keamanan sistem dengan analisis login, akses data, dan compliance.'
    },
    {
      id: 'RPT-006',
      title: 'Laporan Kualitas Data',
      type: 'quality',
      period: '2024-01-26',
      status: 'completed',
      generatedBy: 'Data Admin',
      generatedAt: '2024-01-26 14:30',
      fileSize: '2.9 MB',
      format: 'Excel',
      summary: {
        totalRecords: 15678,
        validRecords: 15432,
        invalidRecords: 246,
        duplicateRecords: 12,
        completenessRate: '98.4%',
        accuracyRate: '99.2%'
      },
      charts: ['data-quality-metrics', 'validation-results', 'completeness-trend'],
      description: 'Laporan kualitas data dengan analisis validasi, kelengkapan, dan akurasi data.'
    }
  ];

  const getTypeColor = (type) => {
    switch (type) {
      case 'daily': return 'daily';
      case 'monthly': return 'monthly';
      case 'weekly': return 'weekly';
      case 'system': return 'system';
      case 'audit': return 'audit';
      case 'quality': return 'quality';
      default: return 'neutral';
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'daily': return 'Harian';
      case 'monthly': return 'Bulanan';
      case 'weekly': return 'Mingguan';
      case 'system': return 'Sistem';
      case 'audit': return 'Audit';
      case 'quality': return 'Kualitas';
      default: return type;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'completed';
      case 'generating': return 'generating';
      case 'failed': return 'failed';
      default: return 'neutral';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Selesai';
      case 'generating': return 'Generating';
      case 'failed': return 'Gagal';
      default: return status;
    }
  };

  const getFormatIcon = (format) => {
    switch (format) {
      case 'PDF': return '📄';
      case 'Excel': return '📊';
      case 'JSON': return '📋';
      default: return '📄';
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || report.type === filterType;
    const matchesPeriod = filterPeriod === 'all' || report.period.includes(filterPeriod);
    return matchesSearch && matchesType && matchesPeriod;
  });

  const getReportStats = () => {
    const stats = {
      completed: reports.filter(r => r.status === 'completed').length,
      generating: reports.filter(r => r.status === 'generating').length,
      failed: reports.filter(r => r.status === 'failed').length,
      total: reports.length
    };
    return stats;
  };

  const stats = getReportStats();

  const getTotalFileSize = () => {
    return reports
      .filter(r => r.status === 'completed')
      .reduce((total, report) => {
        const size = parseFloat(report.fileSize.replace(' MB', ''));
        return total + size;
      }, 0)
      .toFixed(1);
  };

  return (
    <div className={`reports-preview ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      {/* Header */}
      <header className="preview-header">
        <div className="header-content">
          <div className="header-left">
            <button className="sidebar-toggle" onClick={toggleSidebar}>
              <i className="icon-menu">☰</i>
            </button>
            <h1 className="app-title">eSIR 2.0 - Preview Reports</h1>
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
                <li className="nav-item active">
                  <i className="nav-icon">📊</i>
                  <span className="nav-text">Reports</span>
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
              <span className="breadcrumb-item active">Preview Reports</span>
            </nav>

            {/* Page Header */}
            <div className="page-header">
              <h2 className="page-title">Preview Reports eSIR 2.0</h2>
              <p className="page-description">
                Halaman ini menampilkan preview tampilan laporan sistem dengan desain yang sesuai dengan standar medis dan rumah sakit.
              </p>
            </div>

            {/* Report Statistics */}
            <div className="report-stats">
              <div className="stat-card completed">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <h3>Selesai</h3>
                  <p className="stat-number">{stats.completed}</p>
                  <p className="stat-label">Laporan</p>
                </div>
              </div>
              <div className="stat-card generating">
                <div className="stat-icon">⏳</div>
                <div className="stat-content">
                  <h3>Generating</h3>
                  <p className="stat-number">{stats.generating}</p>
                  <p className="stat-label">Laporan</p>
                </div>
              </div>
              <div className="stat-card failed">
                <div className="stat-icon">❌</div>
                <div className="stat-content">
                  <h3>Gagal</h3>
                  <p className="stat-number">{stats.failed}</p>
                  <p className="stat-label">Laporan</p>
                </div>
              </div>
              <div className="stat-card total">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <h3>Total</h3>
                  <p className="stat-number">{stats.total}</p>
                  <p className="stat-label">Laporan</p>
                </div>
              </div>
              <div className="stat-card storage">
                <div className="stat-icon">💾</div>
                <div className="stat-content">
                  <h3>Storage</h3>
                  <p className="stat-number">{getTotalFileSize()}</p>
                  <p className="stat-label">MB</p>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="report-controls">
              <div className="search-section">
                <div className="search-input-group">
                  <i className="search-icon">🔍</i>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Cari laporan berdasarkan judul, ID, atau deskripsi..."
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
                  <option value="daily">Harian</option>
                  <option value="weekly">Mingguan</option>
                  <option value="monthly">Bulanan</option>
                  <option value="system">Sistem</option>
                  <option value="audit">Audit</option>
                  <option value="quality">Kualitas</option>
                </select>
                <select
                  className="filter-select"
                  value={filterPeriod}
                  onChange={(e) => setFilterPeriod(e.target.value)}
                >
                  <option value="all">Semua Periode</option>
                  <option value="2024-01-26">Hari Ini</option>
                  <option value="2024-W04">Minggu Ini</option>
                  <option value="2024-01">Bulan Ini</option>
                </select>
              </div>
            </div>

            {/* Report List */}
            <div className="report-list">
              <div className="list-header">
                <h3>Daftar Laporan</h3>
                <div className="list-actions">
                  <button className="btn btn-primary">
                    <i className="btn-icon">➕</i>
                    Generate Report
                  </button>
                  <button className="btn btn-secondary">
                    <i className="btn-icon">📊</i>
                    Export All
                  </button>
                  <button className="btn btn-info">
                    <i className="btn-icon">⚙️</i>
                    Settings
                  </button>
                </div>
              </div>

              <div className="report-grid">
                {filteredReports.map((report) => (
                  <div
                    key={report.id}
                    className={`report-card ${getTypeColor(report.type)}`}
                    onClick={() => setSelectedReport(report)}
                  >
                    <div className="report-header">
                      <div className="report-id">{report.id}</div>
                      <div className={`type-badge ${getTypeColor(report.type)}`}>
                        {getTypeText(report.type)}
                      </div>
                      <div className={`status-badge ${getStatusColor(report.status)}`}>
                        {getStatusText(report.status)}
                      </div>
                    </div>
                    
                    <div className="report-info">
                      <h4 className="report-title">{report.title}</h4>
                      <div className="report-details">
                        <span className="detail-item">
                          <i className="detail-icon">📅</i>
                          Periode: {report.period}
                        </span>
                        <span className="detail-item">
                          <i className="detail-icon">👤</i>
                          Oleh: {report.generatedBy}
                        </span>
                        <span className="detail-item">
                          <i className="detail-icon">🕐</i>
                          {report.generatedAt}
                        </span>
                        <span className="detail-item">
                          <i className="detail-icon">{getFormatIcon(report.format)}</i>
                          {report.format} - {report.fileSize}
                        </span>
                      </div>
                    </div>

                    <div className="report-summary">
                      <div className="summary-label">Ringkasan:</div>
                      <div className="summary-items">
                        {Object.entries(report.summary).slice(0, 4).map(([key, value]) => (
                          <div key={key} className="summary-item">
                            <span className="summary-key">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                            <span className="summary-value">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="report-charts">
                      <div className="charts-label">Charts:</div>
                      <div className="charts-list">
                        {report.charts.map((chart, index) => (
                          <span key={index} className="chart-tag">
                            {chart.replace(/-/g, ' ')}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="report-actions">
                      <button className="action-btn primary">
                        <i className="action-icon">👁️</i>
                        View
                      </button>
                      <button className="action-btn secondary">
                        <i className="action-icon">⬇️</i>
                        Download
                      </button>
                      {report.status === 'completed' && (
                        <button className="action-btn success">
                          <i className="action-icon">📧</i>
                          Email
                        </button>
                      )}
                      {report.status === 'generating' && (
                        <button className="action-btn warning">
                          <i className="action-icon">🔄</i>
                          Refresh
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Report Detail Modal */}
            {selectedReport && (
              <div className="report-modal-overlay" onClick={() => setSelectedReport(null)}>
                <div className="report-modal" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3>Detail Laporan - {selectedReport.title}</h3>
                    <button className="modal-close" onClick={() => setSelectedReport(null)}>
                      ✕
                    </button>
                  </div>
                  <div className="modal-content">
                    <div className="modal-section">
                      <h4>Informasi Umum</h4>
                      <div className="info-grid">
                        <div className="info-item">
                          <label>ID Laporan:</label>
                          <span>{selectedReport.id}</span>
                        </div>
                        <div className="info-item">
                          <label>Judul:</label>
                          <span>{selectedReport.title}</span>
                        </div>
                        <div className="info-item">
                          <label>Tipe:</label>
                          <span className={`type-badge ${getTypeColor(selectedReport.type)}`}>
                            {getTypeText(selectedReport.type)}
                          </span>
                        </div>
                        <div className="info-item">
                          <label>Periode:</label>
                          <span>{selectedReport.period}</span>
                        </div>
                        <div className="info-item">
                          <label>Status:</label>
                          <span className={`status-badge ${getStatusColor(selectedReport.status)}`}>
                            {getStatusText(selectedReport.status)}
                          </span>
                        </div>
                        <div className="info-item">
                          <label>Format:</label>
                          <span>{selectedReport.format}</span>
                        </div>
                        <div className="info-item">
                          <label>Ukuran File:</label>
                          <span>{selectedReport.fileSize}</span>
                        </div>
                        <div className="info-item">
                          <label>Dibuat Oleh:</label>
                          <span>{selectedReport.generatedBy}</span>
                        </div>
                        <div className="info-item">
                          <label>Dibuat Pada:</label>
                          <span>{selectedReport.generatedAt}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="modal-section">
                      <h4>Deskripsi</h4>
                      <div className="description-content">
                        <p>{selectedReport.description}</p>
                      </div>
                    </div>

                    <div className="modal-section">
                      <h4>Ringkasan Data</h4>
                      <div className="summary-grid">
                        {Object.entries(selectedReport.summary).map(([key, value]) => (
                          <div key={key} className="summary-detail-item">
                            <span className="summary-label">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                            <span className="summary-value">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="modal-section">
                      <h4>Charts & Visualisasi</h4>
                      <div className="charts-grid">
                        {selectedReport.charts.map((chart, index) => (
                          <div key={index} className="chart-item">
                            <i className="chart-icon">📊</i>
                            <span>{chart.replace(/-/g, ' ')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-primary">
                      <i className="btn-icon">👁️</i>
                      Lihat Laporan
                    </button>
                    <button className="btn btn-secondary">
                      <i className="btn-icon">⬇️</i>
                      Download
                    </button>
                    <button className="btn btn-success">
                      <i className="btn-icon">📧</i>
                      Kirim Email
                    </button>
                    <button className="btn btn-warning">
                      <i className="btn-icon">🔄</i>
                      Regenerate
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
            <span>Preview Reports v1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ReportsPreview;
