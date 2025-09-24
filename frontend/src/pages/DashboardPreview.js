import React, { useState, useEffect } from 'react';
import './DashboardPreview.css';

const DashboardPreview = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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

  // Mock data untuk dashboard
  const dashboardStats = {
    totalPatients: 1247,
    activeReferrals: 23,
    availableAmbulances: 8,
    activeFaskes: 45,
    todayAdmissions: 67,
    todayDischarges: 52,
    emergencyCases: 12,
    pendingReferrals: 5
  };

  const recentActivities = [
    {
      id: 1,
      type: 'referral',
      title: 'Rujukan Baru',
      description: 'Pasien John Doe dirujuk ke RS Jantung Harapan',
      time: '14:30',
      status: 'pending',
      priority: 'high'
    },
    {
      id: 2,
      type: 'ambulance',
      title: 'Ambulance Berangkat',
      description: 'AMB-001 berangkat ke RS Stroke Nasional',
      time: '14:15',
      status: 'active',
      priority: 'critical'
    },
    {
      id: 3,
      type: 'patient',
      title: 'Pasien Masuk',
      description: 'Maria Garcia masuk ke IGD RSUD Kota',
      time: '14:00',
      status: 'completed',
      priority: 'medium'
    },
    {
      id: 4,
      type: 'faskes',
      title: 'Update Kapasitas',
      description: 'RS Jantung Harapan: 3 tempat tidur tersedia',
      time: '13:45',
      status: 'completed',
      priority: 'low'
    },
    {
      id: 5,
      type: 'referral',
      title: 'Rujukan Selesai',
      description: 'Rujukan Robert Johnson telah selesai',
      time: '13:30',
      status: 'completed',
      priority: 'medium'
    }
  ];

  const upcomingTasks = [
    {
      id: 1,
      title: 'Review Rujukan Pending',
      description: '5 rujukan menunggu persetujuan',
      dueTime: '15:00',
      priority: 'high',
      type: 'referral'
    },
    {
      id: 2,
      title: 'Update Status Ambulance',
      description: 'AMB-003 perlu update lokasi',
      dueTime: '15:30',
      priority: 'medium',
      type: 'ambulance'
    },
    {
      id: 3,
      title: 'Laporan Harian',
      description: 'Generate laporan aktivitas hari ini',
      dueTime: '16:00',
      priority: 'low',
      type: 'report'
    }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'referral': return '📋';
      case 'ambulance': return '🚑';
      case 'patient': return '👤';
      case 'faskes': return '🏥';
      default: return '📄';
    }
  };

  const getActivityColor = (status) => {
    switch (status) {
      case 'pending': return 'pending';
      case 'active': return 'active';
      case 'completed': return 'completed';
      default: return 'neutral';
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

  const getTaskIcon = (type) => {
    switch (type) {
      case 'referral': return '📋';
      case 'ambulance': return '🚑';
      case 'report': return '📊';
      default: return '📄';
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={`dashboard-preview ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      {/* Header */}
      <header className="preview-header">
        <div className="header-content">
          <div className="header-left">
            <button className="sidebar-toggle" onClick={toggleSidebar}>
              <i className="icon-menu">☰</i>
            </button>
            <h1 className="app-title">eSIR 2.0 - Preview Dashboard</h1>
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
                <li className="nav-item active">
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
              <span className="breadcrumb-item active">Dashboard</span>
            </nav>

            {/* Page Header */}
            <div className="page-header">
              <div className="header-info">
                <h2 className="page-title">Dashboard eSIR 2.0</h2>
                <p className="page-description">
                  Selamat datang di Sistem Informasi Rujukan eSIR 2.0. Monitor aktivitas sistem dan kelola rujukan pasien dengan efisien.
                </p>
                <div className="date-info">
                  <span className="current-date">{formatDate(currentTime)}</span>
                </div>
              </div>
              <div className="header-actions">
                <button className="btn btn-primary">
                  <i className="btn-icon">📊</i>
                  Generate Report
                </button>
                <button className="btn btn-secondary">
                  <i className="btn-icon">⚙️</i>
                  Settings
                </button>
              </div>
            </div>

            {/* Dashboard Statistics */}
            <div className="dashboard-stats">
              <div className="stat-card patients">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <h3>Total Pasien</h3>
                  <p className="stat-number">{dashboardStats.totalPatients.toLocaleString()}</p>
                  <p className="stat-label">Pasien Terdaftar</p>
                  <div className="stat-trend">
                    <span className="trend-up">↗ +12%</span>
                  </div>
                </div>
              </div>
              <div className="stat-card referrals">
                <div className="stat-icon">📋</div>
                <div className="stat-content">
                  <h3>Rujukan Aktif</h3>
                  <p className="stat-number">{dashboardStats.activeReferrals}</p>
                  <p className="stat-label">Dalam Proses</p>
                  <div className="stat-trend">
                    <span className="trend-down">↘ -3%</span>
                  </div>
                </div>
              </div>
              <div className="stat-card ambulances">
                <div className="stat-icon">🚑</div>
                <div className="stat-content">
                  <h3>Ambulance Tersedia</h3>
                  <p className="stat-number">{dashboardStats.availableAmbulances}</p>
                  <p className="stat-label">Siap Tugas</p>
                  <div className="stat-trend">
                    <span className="trend-up">↗ +2</span>
                  </div>
                </div>
              </div>
              <div className="stat-card faskes">
                <div className="stat-icon">🏥</div>
                <div className="stat-content">
                  <h3>Faskes Aktif</h3>
                  <p className="stat-number">{dashboardStats.activeFaskes}</p>
                  <p className="stat-label">Online</p>
                  <div className="stat-trend">
                    <span className="trend-stable">→ 0%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Stats */}
            <div className="secondary-stats">
              <div className="stat-card admissions">
                <div className="stat-icon">📥</div>
                <div className="stat-content">
                  <h3>Masuk Hari Ini</h3>
                  <p className="stat-number">{dashboardStats.todayAdmissions}</p>
                  <p className="stat-label">Pasien</p>
                </div>
              </div>
              <div className="stat-card discharges">
                <div className="stat-icon">📤</div>
                <div className="stat-content">
                  <h3>Keluar Hari Ini</h3>
                  <p className="stat-number">{dashboardStats.todayDischarges}</p>
                  <p className="stat-label">Pasien</p>
                </div>
              </div>
              <div className="stat-card emergency">
                <div className="stat-icon">🚨</div>
                <div className="stat-content">
                  <h3>Kasus Darurat</h3>
                  <p className="stat-number">{dashboardStats.emergencyCases}</p>
                  <p className="stat-label">Hari Ini</p>
                </div>
              </div>
              <div className="stat-card pending">
                <div className="stat-icon">⏳</div>
                <div className="stat-content">
                  <h3>Menunggu Persetujuan</h3>
                  <p className="stat-number">{dashboardStats.pendingReferrals}</p>
                  <p className="stat-label">Rujukan</p>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="dashboard-grid">
              {/* Recent Activities */}
              <div className="dashboard-card activities">
                <div className="card-header">
                  <h3 className="card-title">Aktivitas Terbaru</h3>
                  <button className="btn btn-sm btn-secondary">
                    <i className="btn-icon">🔄</i>
                    Refresh
                  </button>
                </div>
                <div className="card-content">
                  <div className="activities-list">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className={`activity-item ${getActivityColor(activity.status)}`}>
                        <div className="activity-icon">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="activity-content">
                          <div className="activity-header">
                            <h4 className="activity-title">{activity.title}</h4>
                            <span className="activity-time">{activity.time}</span>
                          </div>
                          <p className="activity-description">{activity.description}</p>
                          <div className="activity-meta">
                            <span className={`priority-badge ${getPriorityColor(activity.priority)}`}>
                              {activity.priority.toUpperCase()}
                            </span>
                            <span className={`status-badge ${getActivityColor(activity.status)}`}>
                              {activity.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Upcoming Tasks */}
              <div className="dashboard-card tasks">
                <div className="card-header">
                  <h3 className="card-title">Tugas Mendatang</h3>
                  <button className="btn btn-sm btn-primary">
                    <i className="btn-icon">➕</i>
                    Tambah
                  </button>
                </div>
                <div className="card-content">
                  <div className="tasks-list">
                    {upcomingTasks.map((task) => (
                      <div key={task.id} className={`task-item ${getPriorityColor(task.priority)}`}>
                        <div className="task-icon">
                          {getTaskIcon(task.type)}
                        </div>
                        <div className="task-content">
                          <div className="task-header">
                            <h4 className="task-title">{task.title}</h4>
                            <span className="task-time">{task.dueTime}</span>
                          </div>
                          <p className="task-description">{task.description}</p>
                          <div className="task-meta">
                            <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                              {task.priority.toUpperCase()}
                            </span>
                            <span className="task-type">{task.type.toUpperCase()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="dashboard-card quick-actions">
                <div className="card-header">
                  <h3 className="card-title">Aksi Cepat</h3>
                </div>
                <div className="card-content">
                  <div className="actions-grid">
                    <button className="action-card">
                      <div className="action-icon">👤</div>
                      <div className="action-content">
                        <h4>Pasien Baru</h4>
                        <p>Daftarkan pasien baru</p>
                      </div>
                    </button>
                    <button className="action-card">
                      <div className="action-icon">📋</div>
                      <div className="action-content">
                        <h4>Buat Rujukan</h4>
                        <p>Rujuk pasien ke faskes</p>
                      </div>
                    </button>
                    <button className="action-card">
                      <div className="action-icon">🚑</div>
                      <div className="action-content">
                        <h4>Assign Ambulance</h4>
                        <p>Atur jadwal ambulance</p>
                      </div>
                    </button>
                    <button className="action-card">
                      <div className="action-icon">🏥</div>
                      <div className="action-content">
                        <h4>Update Faskes</h4>
                        <p>Update kapasitas faskes</p>
                      </div>
                    </button>
                    <button className="action-card">
                      <div className="action-icon">📊</div>
                      <div className="action-content">
                        <h4>Generate Report</h4>
                        <p>Buat laporan harian</p>
                      </div>
                    </button>
                    <button className="action-card">
                      <div className="action-icon">⚙️</div>
                      <div className="action-content">
                        <h4>Settings</h4>
                        <p>Konfigurasi sistem</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* System Status */}
              <div className="dashboard-card system-status">
                <div className="card-header">
                  <h3 className="card-title">Status Sistem</h3>
                  <div className="status-indicator online">
                    <div className="status-dot"></div>
                    <span>Online</span>
                  </div>
                </div>
                <div className="card-content">
                  <div className="system-metrics">
                    <div className="metric-item">
                      <span className="metric-label">Server Response</span>
                      <span className="metric-value">45ms</span>
                      <div className="metric-bar">
                        <div className="metric-fill success" style={{ width: '95%' }}></div>
                      </div>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">Database Status</span>
                      <span className="metric-value">Healthy</span>
                      <div className="metric-bar">
                        <div className="metric-fill success" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">API Status</span>
                      <span className="metric-value">Active</span>
                      <div className="metric-bar">
                        <div className="metric-fill success" style={{ width: '98%' }}></div>
                      </div>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">Storage Usage</span>
                      <span className="metric-value">67%</span>
                      <div className="metric-bar">
                        <div className="metric-fill warning" style={{ width: '67%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
            <span>Preview Dashboard v1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardPreview;
