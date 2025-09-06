import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import './DriverLayout.css';

const DriverLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="driver-layout">
      <header className="driver-header">
        <div className="header-content">
          <div className="header-left">
            <Link to="/driver" className="logo">
              <span className="logo-icon">🚑</span>
              <span className="logo-text">eSIR Driver</span>
            </Link>
          </div>
          
          <div className="header-center">
            <nav className="driver-nav">
              <Link to="/driver" className={`nav-item ${isActive('/driver')}`}>
                <span className="nav-icon">🏠</span>
                <span className="nav-text">Dashboard</span>
              </Link>
            </nav>
          </div>
          
          <div className="header-right">
            <div className="user-info">
              <span className="user-name">{user?.nama_lengkap}</span>
              <span className="user-role">Sopir Ambulans</span>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              <span className="logout-icon">🚪</span>
              <span className="logout-text">Keluar</span>
            </button>
          </div>
        </div>
      </header>
      
      <main className="driver-main">
        {children}
      </main>
    </div>
  );
};

export default DriverLayout;
