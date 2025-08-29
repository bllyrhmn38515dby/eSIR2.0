import React, { useState, useEffect, useCallback } from 'react';
import './ToastNotification.css';

const ToastNotification = ({ notification, onClose, position = 'top-right' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for exit animation
  }, [onClose]);

  useEffect(() => {
    // Show toast with animation
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Auto hide after 5 seconds
    const hideTimer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [handleClose]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'rujukan-baru':
        return '📋';
      case 'status-update':
        return '🔄';
      case 'tracking-update':
        return '🚑';
      case 'system':
        return '⚙️';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      case 'success':
        return '✅';
      default:
        return '🔔';
    }
  };

  const getNotificationClass = (type) => {
    switch (type) {
      case 'rujukan-baru':
        return 'toast-rujukan';
      case 'status-update':
        return 'toast-status';
      case 'tracking-update':
        return 'toast-tracking';
      case 'system':
        return 'toast-system';
      case 'warning':
        return 'toast-warning';
      case 'error':
        return 'toast-error';
      case 'success':
        return 'toast-success';
      default:
        return 'toast-default';
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));

    if (diffInMinutes < 1) return 'Baru saja';
    if (diffInMinutes < 60) return `${diffInMinutes}m yang lalu`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}j yang lalu`;
    return `${Math.floor(diffInMinutes / 1440)}d yang lalu`;
  };

  return (
    <div 
      className={`toast-notification ${getNotificationClass(notification.type)} ${position} ${isVisible ? 'show' : ''} ${isExiting ? 'exit' : ''}`}
      onClick={handleClose}
    >
      <div className="toast-header">
        <div className="toast-icon">
          {getNotificationIcon(notification.type)}
        </div>
        <div className="toast-title">
          {notification.title}
        </div>
        <button 
          className="toast-close"
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
        >
          ×
        </button>
      </div>
      
      <div className="toast-message">
        {notification.message}
      </div>
      
      <div className="toast-footer">
        <span className="toast-time">
          {formatTime(notification.timestamp)}
        </span>
        {notification.data && (
          <button 
            className="toast-action"
            onClick={(e) => {
              e.stopPropagation();
              // Handle action based on notification type
              if (notification.type === 'rujukan-baru' || notification.type === 'status-update') {
                window.location.href = '/rujukan';
              } else if (notification.type === 'tracking-update') {
                window.location.href = '/tracking';
              }
            }}
          >
            Lihat Detail
          </button>
        )}
      </div>
      
      {/* Progress bar */}
      <div className="toast-progress">
        <div className="toast-progress-bar"></div>
      </div>
    </div>
  );
};

export default ToastNotification;
