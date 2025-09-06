import React, { useState, useEffect } from 'react';
import './PWAInstall.css';

const PWAInstall = () => {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    // Listen for online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Listen for app installed event
    const handleAppInstalled = () => {
      setShowInstallPrompt(false);
      console.log('🎉 PWA was installed successfully!');
    };

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallPrompt(false);
    }

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('✅ User accepted the install prompt');
    } else {
      console.log('❌ User dismissed the install prompt');
    }
    
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <>
      {/* PWA Install Prompt */}
      {showInstallPrompt && (
        <div className="pwa-install-prompt">
          <div className="pwa-install-content">
            <div className="pwa-install-info">
              <div className="pwa-install-icon">📱</div>
              <div className="pwa-install-text">
                <h4>Install eSIR 2.0</h4>
                <p>Akses lebih cepat dari home screen</p>
              </div>
            </div>
            <div className="pwa-install-actions">
              <button 
                className="pwa-install-btn"
                onClick={handleInstallClick}
              >
                Install
              </button>
              <button 
                className="pwa-dismiss-btn"
                onClick={handleDismiss}
              >
                Nanti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offline Status Indicator */}
      {!isOnline && (
        <div className="offline-indicator">
          <div className="offline-content">
            <span className="offline-icon">📡</span>
            <span className="offline-text">Tidak ada koneksi internet</span>
            <button 
              className="offline-refresh-btn"
              onClick={handleRefresh}
            >
              Refresh
            </button>
          </div>
        </div>
      )}

      {/* PWA Status Badge */}
      {window.matchMedia('(display-mode: standalone)').matches && (
        <div className="pwa-status-badge">
          <span className="pwa-status-icon">📱</span>
          <span className="pwa-status-text">PWA Mode</span>
        </div>
      )}
    </>
  );
};

export default PWAInstall;
