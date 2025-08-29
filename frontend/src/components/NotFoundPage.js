import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLastPage } from '../context/LastPageContext';
import './NotFoundPage.css';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const { getLastPage, setRedirecting } = useLastPage();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    setRedirecting(true);
    
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          const lastPage = getLastPage();
          console.log('🔄 Redirecting to last page:', lastPage);
          navigate(lastPage, { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      setRedirecting(false);
    };
  }, [navigate, getLastPage, setRedirecting]);

  const handleGoNow = () => {
    const lastPage = getLastPage();
    navigate(lastPage, { replace: true });
  };

  const handleGoDashboard = () => {
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-icon">
          <span>🔍</span>
        </div>
        
        <h1>404</h1>
        <h2>Halaman Tidak Ditemukan</h2>
        
        <p className="not-found-description">
          Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.
        </p>
        
        <div className="redirect-info">
          <p>
            Anda akan dialihkan ke halaman terakhir dalam <strong>{countdown}</strong> detik...
          </p>
        </div>
        
        <div className="not-found-actions">
          <button 
            className="btn-primary"
            onClick={handleGoNow}
          >
            Kembali Sekarang
          </button>
          
          <button 
            className="btn-secondary"
            onClick={handleGoDashboard}
          >
            Ke Dashboard
          </button>
        </div>
        
        <div className="help-links">
          <p>Atau Anda dapat mencoba:</p>
          <ul>
            <li>
              <button 
                className="link-btn"
                onClick={() => navigate('/rujukan')}
              >
                Halaman Rujukan
              </button>
            </li>
            <li>
              <button 
                className="link-btn"
                onClick={() => navigate('/pasien')}
              >
                Halaman Pasien
              </button>
            </li>
            <li>
              <button 
                className="link-btn"
                onClick={() => navigate('/peta')}
              >
                Halaman Peta
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
