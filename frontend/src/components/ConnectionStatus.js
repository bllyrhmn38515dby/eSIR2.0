import React from 'react';
import { useSocket } from '../context/SocketContext';

const ConnectionStatus = () => {
  const { isConnected, connectionStatus, retryCount, reconnectSocket } = useSocket();

  const getStatusInfo = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          icon: '🟢',
          text: 'Terhubung',
          color: '#10B981',
          showRetry: false
        };
      case 'connecting':
        return {
          icon: '🟡',
          text: 'Menghubungkan...',
          color: '#F59E0B',
          showRetry: false
        };
      case 'reconnecting':
        return {
          icon: '🔄',
          text: `Mencoba ulang (${retryCount}/10)`,
          color: '#F59E0B',
          showRetry: true
        };
      case 'error':
        return {
          icon: '🔴',
          text: 'Koneksi Error',
          color: '#EF4444',
          showRetry: true
        };
      case 'failed':
        return {
          icon: '❌',
          text: 'Gagal Koneksi',
          color: '#EF4444',
          showRetry: true
        };
      default:
        return {
          icon: '⚪',
          text: 'Terputus',
          color: '#6B7280',
          showRetry: true
        };
    }
  };

  const statusInfo = getStatusInfo();

  // Don't show status if connected
  if (isConnected && connectionStatus === 'connected') {
    return null;
  }

  return (
    <div 
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        backgroundColor: 'white',
        border: `2px solid ${statusInfo.color}`,
        borderRadius: '8px',
        padding: '8px 12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      <span style={{ fontSize: '16px' }}>{statusInfo.icon}</span>
      <span style={{ color: statusInfo.color, fontWeight: '500' }}>
        {statusInfo.text}
      </span>
      {statusInfo.showRetry && (
        <button
          onClick={reconnectSocket}
          style={{
            backgroundColor: statusInfo.color,
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '4px 8px',
            fontSize: '12px',
            cursor: 'pointer',
            marginLeft: '8px'
          }}
          onMouseOver={(e) => {
            e.target.style.opacity = '0.8';
          }}
          onMouseOut={(e) => {
            e.target.style.opacity = '1';
          }}
        >
          Coba Ulang
        </button>
      )}
    </div>
  );
};

export default ConnectionStatus;
