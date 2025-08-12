import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import './NotificationBell.css';

const NotificationBell = () => {
  const { notifications, getUnreadCount, markNotificationAsRead, markAllNotificationsAsRead, clearNotifications, isConnected } = useSocket();
  const [showDropdown, setShowDropdown] = useState(false);

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleNotificationClick = (notification) => {
    markNotificationAsRead(notification.id);
    setShowDropdown(false);
    
    // You can add navigation logic here based on notification type
    if (notification.type === 'rujukan-baru') {
      // Navigate to rujukan page
      window.location.href = '/rujukan';
    } else if (notification.type === 'status-update') {
      // Navigate to rujukan page
      window.location.href = '/rujukan';
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));

    if (diffInMinutes < 1) return 'Baru saja';
    if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} jam yang lalu`;
    return `${Math.floor(diffInMinutes / 1440)} hari yang lalu`;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'rujukan-baru':
        return '📋';
      case 'status-update':
        return '🔄';
      default:
        return '🔔';
    }
  };

  const unreadCount = getUnreadCount();

  return (
    <div className="notification-bell">
      <button 
        className="notification-button"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <span className="bell-icon">🔔</span>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
        <span className="connection-status">
          {isConnected ? '🟢' : '🔴'}
        </span>
      </button>

      {showDropdown && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifikasi</h3>
            <div className="notification-actions">
              {unreadCount > 0 && (
                <button 
                  className="mark-all-read"
                  onClick={markAllNotificationsAsRead}
                >
                  Tandai Semua Dibaca
                </button>
              )}
              {notifications.length > 0 && (
                <button 
                  className="clear-all"
                  onClick={clearNotifications}
                >
                  Hapus Semua
                </button>
              )}
            </div>
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <p>Tidak ada notifikasi</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">
                      {notification.title}
                    </div>
                    <div className="notification-message">
                      {notification.message}
                    </div>
                    <div className="notification-time">
                      {formatTime(notification.timestamp)}
                    </div>
                  </div>
                  {!notification.read && (
                    <div className="unread-indicator"></div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {showDropdown && (
        <div 
          className="notification-overlay"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default NotificationBell;
