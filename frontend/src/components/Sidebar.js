import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ collapsed = false, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(collapsed);

  const handleToggle = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const menuItems = [
    {
      section: 'Menu Utama',
      items: [
        { path: '/dashboard', icon: '🏠', label: 'Dashboard', key: 'dashboard' },
        { path: '/pasien', icon: '👥', label: 'Pasien', key: 'pasien' },
        { path: '/faskes', icon: '🏥', label: 'Faskes', key: 'faskes' },
        { path: '/rujukan', icon: '📋', label: 'Rujukan', key: 'rujukan' },
        { path: '/enhanced-rujukan', icon: '✨', label: 'Enhanced Rujukan', key: 'enhanced-rujukan' },
        { path: '/tracking', icon: '📍', label: 'Tracking', key: 'tracking' },
        { path: '/tempat-tidur', icon: '🛏️', label: 'Tempat Tidur', key: 'tempat-tidur' },
        { path: '/laporan', icon: '📊', label: 'Laporan', key: 'laporan' }
      ]
    },
    {
      section: 'Pengaturan',
      items: [
        { path: '/profil', icon: '👤', label: 'Profil', key: 'profil' },
        { path: '/pengaturan', icon: '⚙️', label: 'Pengaturan', key: 'pengaturan' }
      ]
    }
  ];

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="brand-icon">🚑</div>
          {!isCollapsed && <span className="brand-text">eSIR 2.0</span>}
        </div>
        <button 
          className="sidebar-toggle"
          onClick={handleToggle}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span className="toggle-icon">
            {isCollapsed ? '▶' : '◀'}
          </span>
        </button>
      </div>

      {/* Sidebar Navigation */}
      <nav className="sidebar-nav">
        {menuItems.map((section, sectionIndex) => (
          <div key={sectionIndex} className="nav-section">
            {!isCollapsed && (
              <h3 className="nav-title">{section.section}</h3>
            )}
            <ul className="nav-list">
              {section.items.map((item) => (
                <li 
                  key={item.key}
                  className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => handleNavigation(item.path)}
                  title={isCollapsed ? item.label : ''}
                >
                  <i className="nav-icon">{item.icon}</i>
                  <span className="nav-text">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        {!isCollapsed && (
          <div className="footer-info">
            <div className="version-info">
              <span className="version-text">v2.0.0</span>
            </div>
            <div className="copyright-info">
              <span className="copyright-text">© 2024 eSIR</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
