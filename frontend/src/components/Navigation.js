import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import './Navigation.css';

const Navigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <img 
          src="/esir20vlogo.png" 
          alt="eSIR 2.0 Logo" 
          className="nav-logo"
        />
      </div>
      
      <div className="nav-menu">
        <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>
          <i className="nav-icon">📊</i>
          <span>Dashboard</span>
        </Link>
        
        <div className="nav-dropdown" ref={dropdownRef}>
          <button 
            className={`nav-link dropdown-toggle ${isDropdownOpen ? 'active' : ''}`}
            onClick={toggleDropdown}
          >
            <i className="nav-icon">📋</i>
            <span>Menu</span>
            <i className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>▼</i>
          </button>
          
          {isDropdownOpen && (
            <>
              <div className="dropdown-backdrop" onClick={closeDropdown}></div>
              <div className="dropdown-menu">
                <Link to="/search" className={`dropdown-item ${isActive('/search')}`} onClick={closeDropdown}>
                  <i className="nav-icon">🔍</i>
                  <span>Pencarian</span>
                </Link>
                
                <Link to="/tracking" className={`dropdown-item ${isActive('/tracking')}`} onClick={closeDropdown}>
                  <i className="nav-icon">🛰️</i>
                  <span>Tracking</span>
                </Link>
                
                <Link to="/tracking-dashboard" className={`dropdown-item ${isActive('/tracking-dashboard')}`} onClick={closeDropdown}>
                  <i className="nav-icon">📊</i>
                  <span>Tracking Dashboard</span>
                </Link>
                
                <Link to="/ambulance-tracker" className={`dropdown-item ${isActive('/ambulance-tracker')}`} onClick={closeDropdown}>
                  <i className="nav-icon">🚑</i>
                  <span>Ambulance Tracker</span>
                </Link>
                
                {user?.role === 'sopir_ambulans' && (
                  <Link to="/driver" className={`dropdown-item ${isActive('/driver')}`} onClick={closeDropdown}>
                    <i className="nav-icon">🚗</i>
                    <span>Dashboard Sopir</span>
                  </Link>
                )}
                
                <Link to="/pasien" className={`dropdown-item ${isActive('/pasien')}`} onClick={closeDropdown}>
                  <i className="nav-icon">👥</i>
                  <span>Pasien</span>
                </Link>
                
                <Link to="/rujukan" className={`dropdown-item ${isActive('/rujukan')}`} onClick={closeDropdown}>
                  <i className="nav-icon">📋</i>
                  <span>Rujukan</span>
                </Link>
                
                <Link to="/rujukan-enhanced" className={`dropdown-item ${isActive('/rujukan-enhanced')}`} onClick={closeDropdown}>
                  <i className="nav-icon">🚀</i>
                  <span>Rujukan Enhanced</span>
                </Link>
                
                <Link to="/peta" className={`dropdown-item ${isActive('/peta')}`} onClick={closeDropdown}>
                  <i className="nav-icon">🗺️</i>
                  <span>Peta</span>
                </Link>
                
                <Link to="/tempat-tidur" className={`dropdown-item ${isActive('/tempat-tidur')}`} onClick={closeDropdown}>
                  <i className="nav-icon">🛏️</i>
                  <span>Tempat Tidur</span>
                </Link>
                
                <Link to="/laporan" className={`dropdown-item ${isActive('/laporan')}`} onClick={closeDropdown}>
                  <i className="nav-icon">📈</i>
                  <span>Laporan</span>
                </Link>
                
                {user?.role === 'admin_pusat' && (
                  <Link to="/faskes" className={`dropdown-item ${isActive('/faskes')}`} onClick={closeDropdown}>
                    <i className="nav-icon">🏥</i>
                    <span>Faskes</span>
                  </Link>
                )}
                
                <Link to="/design-system-demo" className={`dropdown-item ${isActive('/design-system-demo')}`} onClick={closeDropdown}>
                  <i className="nav-icon">🎨</i>
                  <span>Design System Demo</span>
                </Link>
              </div>
            </>
          )}
        </div>
        
        {user?.role === 'admin_pusat' && (
          <Link to="/user-management" className={`nav-link ${isActive('/user-management')}`}>
            <i className="nav-icon">👤</i>
            <span>Manajemen User</span>
          </Link>
        )}
      </div>
      
      <div className="nav-user">
        <NotificationBell />
        <div className="user-info">
          <span className="user-name">{user?.nama}</span>
          <span className="user-role">({user?.role === 'admin_pusat' ? 'Admin Pusat' : user?.role === 'admin_faskes' ? 'Admin Faskes' : 'User'})</span>
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
