import React, { useState } from 'react';
import Navigation from './Navigation';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  return (
    <div className="layout">
      <Navigation />
      <div className="layout-content">
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggle={handleSidebarToggle}
        />
        <main className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
