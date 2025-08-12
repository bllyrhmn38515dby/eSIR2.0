import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      // Disconnect socket if user is not logged in
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Create socket connection
    const newSocket = io('http://localhost:3001', {
      auth: {
        token: localStorage.getItem('token')
      }
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setIsConnected(true);

      // Join appropriate rooms based on user role
      if (user.role === 'admin') {
        newSocket.emit('join-admin');
        console.log('Joined admin room');
      } else if ((user.role === 'puskesmas' || user.role === 'rs') && user.faskes_id) {
        newSocket.emit('join-faskes', user.faskes_id);
        console.log('Joined faskes room:', user.faskes_id);
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    // Listen for realtime notifications
    newSocket.on('rujukan-baru', (data) => {
      console.log('Rujukan baru received:', data);
      addNotification({
        id: Date.now(),
        type: 'rujukan-baru',
        title: 'Rujukan Baru',
        message: data.message,
        data: data.data,
        timestamp: data.timestamp,
        read: false
      });
    });

    newSocket.on('status-update', (data) => {
      console.log('Status update received:', data);
      addNotification({
        id: Date.now(),
        type: 'status-update',
        title: 'Update Status Rujukan',
        message: data.message,
        data: data.data,
        timestamp: data.timestamp,
        read: false
      });
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const addNotification = (notification) => {
    setNotifications(prev => {
      const newNotifications = [notification, ...prev];
      // Keep only last 10 notifications
      return newNotifications.slice(0, 10);
    });

    // Show browser notification if supported
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico'
      });
    }
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const getUnreadCount = () => {
    return notifications.filter(notif => !notif.read).length;
  };

  const value = {
    socket,
    isConnected,
    notifications,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
    getUnreadCount
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
