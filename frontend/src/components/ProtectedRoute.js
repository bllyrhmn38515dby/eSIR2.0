import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLastPage } from '../context/LastPageContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const { setLastPage } = useLastPage();
  const location = useLocation();

  console.log('🔒 ProtectedRoute - Auth status:', { isAuthenticated, loading });

  // Save current page when user is not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log('🚫 Access denied, saving current page and redirecting to login');
      setLastPage(location.pathname);
    }
  }, [loading, isAuthenticated, location.pathname, setLastPage]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666',
        flexDirection: 'column'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }}></div>
        <p>Memeriksa autentikasi...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  console.log('✅ Access granted, rendering protected content');
  return children;
};

export default ProtectedRoute;
