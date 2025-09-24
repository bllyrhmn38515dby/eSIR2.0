import React, { useState } from 'react';
import './DesignPreview.css';

const DesignPreview = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className={`design-preview ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      {/* Header */}
      <header className="preview-header">
        <div className="header-content">
          <div className="header-left">
            <button className="sidebar-toggle" onClick={toggleSidebar}>
              <i className="icon-menu">☰</i>
            </button>
            <h1 className="app-title">eSIR 2.0 - Preview Desain</h1>
          </div>
          <div className="header-right">
            <button className="theme-toggle" onClick={toggleDarkMode}>
              <i className="icon-theme">{darkMode ? '☀️' : '🌙'}</i>
            </button>
            <div className="user-profile">
              <span className="user-name">Admin</span>
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
              <span className="breadcrumb-item active">Preview Desain</span>
            </nav>

            {/* Page Header */}
            <div className="page-header">
              <h2 className="page-title">Preview Desain Aplikasi eSIR 2.0</h2>
              <p className="page-description">
                Halaman ini menampilkan implementasi spesifikasi desain berdasarkan hasil wawancara dan kuesioner pengguna.
              </p>
            </div>

            {/* Design Specifications Grid */}
            <div className="specifications-grid">
              {/* Color Palette */}
              <div className="spec-card">
                <h3 className="spec-title">Palet Warna</h3>
                <div className="color-palette">
                  <div className="color-item">
                    <div className="color-swatch primary"></div>
                    <div className="color-info">
                      <span className="color-name">Biru Medis Profesional</span>
                      <span className="color-code">#1E40AF</span>
                      <span className="color-description">Kepercayaan & Profesionalisme</span>
                    </div>
                  </div>
                  <div className="color-item">
                    <div className="color-swatch secondary"></div>
                    <div className="color-info">
                      <span className="color-name">Hijau Medis Tenang</span>
                      <span className="color-code">#059669</span>
                      <span className="color-description">Ketenangan & Penyembuhan</span>
                    </div>
                  </div>
                  <div className="color-item">
                    <div className="color-swatch accent"></div>
                    <div className="color-info">
                      <span className="color-name">Merah Darurat</span>
                      <span className="color-code">#DC2626</span>
                      <span className="color-description">Kegentingan & Peringatan</span>
                    </div>
                  </div>
                  <div className="color-item">
                    <div className="color-swatch neutral"></div>
                    <div className="color-info">
                      <span className="color-name">Abu-abu Profesional</span>
                      <span className="color-code">#64748B</span>
                      <span className="color-description">Netral & Bersih</span>
                    </div>
                  </div>
                  <div className="color-item">
                    <div className="color-swatch surface"></div>
                    <div className="color-info">
                      <span className="color-name">Putih Steril</span>
                      <span className="color-code">#FFFFFF</span>
                      <span className="color-description">Permukaan Bersih</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Typography */}
              <div className="spec-card">
                <h3 className="spec-title">Tipografi</h3>
                <div className="typography-demo">
                  <div className="font-sample">
                    <h1 className="font-h1">Heading 1 (24px)</h1>
                    <h2 className="font-h2">Heading 2 (20px)</h2>
                    <h3 className="font-h3">Heading 3 (18px)</h3>
                    <p className="font-body">Body Text (16px) - Sans-serif font family dengan readability yang optimal untuk aplikasi medis.</p>
                    <span className="font-caption">Caption Text (14px)</span>
                  </div>
                  <div className="font-info">
                    <p><strong>Font Family:</strong> Sans-serif (Arial/Helvetica/Inter)</p>
                    <p><strong>Preferensi:</strong> 81.8% responden</p>
                  </div>
                </div>
              </div>

              {/* UI Components */}
              <div className="spec-card">
                <h3 className="spec-title">Komponen UI</h3>
                <div className="components-demo">
                  <div className="button-group">
                    <button className="btn btn-primary">🏥 Dashboard Medis</button>
                    <button className="btn btn-secondary">📋 Data Pasien</button>
                    <button className="btn btn-success">✅ Status Stabil</button>
                    <button className="btn btn-danger">🚨 Darurat IGD</button>
                    <button className="btn btn-warning">⚠️ Perhatian</button>
                    <button className="btn btn-info">ℹ️ Informasi</button>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">📝 Data Pasien</label>
                    <input type="text" className="form-input" placeholder="Masukkan nama pasien..." />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">🏥 Ruang IGD</label>
                    <select className="form-input">
                      <option>IGD A - Darurat Kritis</option>
                      <option>IGD B - Trauma</option>
                      <option>IGD C - Non-Darurat</option>
                    </select>
                  </div>
                  
                  <div className="card-demo">
                    <div className="card medical-card">
                      <div className="card-header">
                        <h4 className="card-title">🏥 Status Pasien IGD</h4>
                        <span className="card-badge success">Stabil</span>
                      </div>
                      <div className="card-body">
                        <div className="medical-info">
                          <div className="info-row">
                            <span className="info-label">👤 Nama:</span>
                            <span className="info-value">John Doe</span>
                          </div>
                          <div className="info-row">
                            <span className="info-label">🩺 Diagnosa:</span>
                            <span className="info-value">Chest Pain</span>
                          </div>
                          <div className="info-row">
                            <span className="info-label">⏰ Waktu Masuk:</span>
                            <span className="info-value">14:30 WIB</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Layout Structure */}
              <div className="spec-card">
                <h3 className="spec-title">Struktur Layout</h3>
                <div className="layout-demo">
                  <div className="layout-visual">
                    <div className="layout-header">Header</div>
                    <div className="layout-body">
                      <div className="layout-sidebar">Sidebar Navigation</div>
                      <div className="layout-main">Main Content Area</div>
                    </div>
                    <div className="layout-footer">Footer</div>
                  </div>
                  <div className="layout-info">
                    <p><strong>Grid System:</strong> 12 kolom untuk konsistensi</p>
                    <p><strong>Preferensi:</strong> 54.5% responden memilih sidebar navigation</p>
                  </div>
                </div>
              </div>

              {/* Responsiveness */}
              <div className="spec-card">
                <h3 className="spec-title">Responsivitas</h3>
                <div className="responsiveness-demo">
                  <div className="device-breakpoints">
                    <div className="breakpoint desktop">
                      <div className="device-icon">🖥️</div>
                      <span className="device-name">Desktop</span>
                      <span className="device-percentage">81.8%</span>
                    </div>
                    <div className="breakpoint tablet">
                      <div className="device-icon">📱</div>
                      <span className="device-name">Tablet</span>
                      <span className="device-percentage">54.5%</span>
                    </div>
                    <div className="breakpoint mobile">
                      <div className="device-icon">📱</div>
                      <span className="device-name">Smartphone</span>
                      <span className="device-percentage">36.4%</span>
                    </div>
                  </div>
                  
                  <div className="accessibility-features">
                    <h4>Fitur Aksesibilitas</h4>
                    <ul className="feature-list">
                      <li>✅ Mode gelap/terang (68.2% responden)</li>
                      <li>✅ Zoom in/out (54.5% responden)</li>
                      <li>✅ Loading time &lt; 3 detik (72.7% responden)</li>
                      <li>✅ Keyboard navigation</li>
                      <li>✅ ARIA labels</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Medical Environment Elements */}
              <div className="spec-card medical-environment">
                <h3 className="spec-title">🏥 Elemen Lingkungan Medis</h3>
                <div className="medical-elements">
                  <div className="element-group">
                    <h4>Status Pasien</h4>
                    <div className="status-indicators">
                      <div className="status-item critical">
                        <div className="status-dot"></div>
                        <span>Kritis</span>
                      </div>
                      <div className="status-item urgent">
                        <div className="status-dot"></div>
                        <span>Darurat</span>
                      </div>
                      <div className="status-item stable">
                        <div className="status-dot"></div>
                        <span>Stabil</span>
                      </div>
                      <div className="status-item discharged">
                        <div className="status-dot"></div>
                        <span>Pulang</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="element-group">
                    <h4>Ruang IGD</h4>
                    <div className="room-layout">
                      <div className="room-item emergency">IGD A - Kritis</div>
                      <div className="room-item trauma">IGD B - Trauma</div>
                      <div className="room-item general">IGD C - Umum</div>
                    </div>
                  </div>
                  
                  <div className="element-group">
                    <h4>Prioritas Medis</h4>
                    <div className="priority-levels">
                      <div className="priority-item p1">P1 - Resusitasi</div>
                      <div className="priority-item p2">P2 - Darurat</div>
                      <div className="priority-item p3">P3 - Urgent</div>
                      <div className="priority-item p4">P4 - Standar</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Success Metrics */}
              <div className="spec-card">
                <h3 className="spec-title">Metrik Keberhasilan</h3>
                <div className="metrics-demo">
                  <div className="metric-item">
                    <div className="metric-icon">👥</div>
                    <div className="metric-content">
                      <h4>Usability</h4>
                      <p>Target 90% pengguna merasa desain mudah digunakan</p>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{width: '90%'}}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="metric-item">
                    <div className="metric-icon">⌨️</div>
                    <div className="metric-content">
                      <h4>Accessibility</h4>
                      <p>Target 100% fitur dapat diakses dengan keyboard</p>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{width: '100%'}}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="metric-item">
                    <div className="metric-icon">⚡</div>
                    <div className="metric-content">
                      <h4>Performance</h4>
                      <p>Target loading time &lt; 3 detik pada 95% kasus</p>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{width: '95%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-section">
              <button className="btn btn-primary btn-large">
                <i className="btn-icon">💾</i>
                Simpan Konfigurasi
              </button>
              <button className="btn btn-secondary btn-large">
                <i className="btn-icon">🔄</i>
                Reset ke Default
              </button>
              <button className="btn btn-success btn-large">
                <i className="btn-icon">🚀</i>
                Terapkan ke Produksi
              </button>
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
            <span>Versi Preview Desain v1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DesignPreview;
