import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import './Navigation.css';

const Navigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <h2>eSIR 2.0</h2>
      </div>
      
      <div className="nav-menu">
        <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>
          <i className="nav-icon">📊</i>
          Dashboard
        </Link>
        
        <Link to="/search" className={`nav-link ${isActive('/search')}`}>
          <i className="nav-icon">🔍</i>
          Pencarian
        </Link>
        
        <Link to="/tracking" className={`nav-link ${isActive('/tracking')}`}>
          <i className="nav-icon">🛰️</i>
          Tracking
        </Link>
        
        <Link to="/ambulance-tracker" className={`nav-link ${isActive('/ambulance-tracker')}`}>
          <i className="nav-icon">🚑</i>
          Ambulance Tracker
        </Link>
        
        <Link to="/pasien" className={`nav-link ${isActive('/pasien')}`}>
          <i className="nav-icon">👥</i>
          Pasien
        </Link>
        
        <Link to="/rujukan" className={`nav-link ${isActive('/rujukan')}`}>
          <i className="nav-icon">📋</i>
          Rujukan
        </Link>
        
        <Link to="/peta" className={`nav-link ${isActive('/peta')}`}>
          <i className="nav-icon">🗺️</i>
          Peta
        </Link>
        
        <Link to="/tempat-tidur" className={`nav-link ${isActive('/tempat-tidur')}`}>
          <i className="nav-icon">🛏️</i>
          Tempat Tidur
        </Link>
        
        <Link to="/laporan" className={`nav-link ${isActive('/laporan')}`}>
          <i className="nav-icon">📈</i>
          Laporan
        </Link>
        
        {user?.role === 'admin' && (
          <Link to="/faskes" className={`nav-link ${isActive('/faskes')}`}>
            <i className="nav-icon">🏥</i>
            Faskes
          </Link>
        )}
      </div>
      
      <div className="nav-user">
        <NotificationBell />
        <div className="user-info">
          <span className="user-name">{user?.nama}</span>
          <span className="user-role">({user?.role === 'admin' ? 'Admin Pusat' : user?.role === 'puskesmas' ? 'Admin Puskesmas' : 'Admin RS'})</span>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          <i className="nav-icon">🚪</i>
          Keluar
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
