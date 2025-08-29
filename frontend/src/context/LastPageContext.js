import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const LastPageContext = createContext();

export const useLastPage = () => {
  const context = useContext(LastPageContext);
  if (!context) {
    throw new Error('useLastPage must be used within a LastPageProvider');
  }
  return context;
};

export const LastPageProvider = ({ children }) => {
  const [lastPage, setLastPage] = useState('/dashboard');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const location = useLocation();

  // Save current page to localStorage whenever location changes
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Don't save login, forgot-password, or reset-password pages
    if (!['/login', '/forgot-password', '/reset-password'].includes(currentPath)) {
      localStorage.setItem('lastPage', currentPath);
      setLastPage(currentPath);
      console.log('📍 Last page saved:', currentPath);
    }
  }, [location]);

  // Load last page from localStorage on mount
  useEffect(() => {
    const savedLastPage = localStorage.getItem('lastPage');
    if (savedLastPage && savedLastPage !== '/login') {
      setLastPage(savedLastPage);
      console.log('📍 Last page loaded from storage:', savedLastPage);
    }
  }, []);

  const getLastPage = () => {
    const savedLastPage = localStorage.getItem('lastPage');
    return savedLastPage && savedLastPage !== '/login' ? savedLastPage : '/dashboard';
  };

  const clearLastPage = () => {
    localStorage.removeItem('lastPage');
    setLastPage('/dashboard');
  };

  const setRedirecting = (status) => {
    setIsRedirecting(status);
  };

  const value = {
    lastPage,
    getLastPage,
    setLastPage,
    clearLastPage,
    isRedirecting,
    setRedirecting
  };

  return (
    <LastPageContext.Provider value={value}>
      {children}
    </LastPageContext.Provider>
  );
};
