import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
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

  const addNotification = useCallback((notification) => {
    setNotifications(prev => {
      const newNotifications = [notification, ...prev];
      // Keep only last 10 notifications
      return newNotifications.slice(0, 10);
    });

    // Get notification settings
    const savedSettings = localStorage.getItem('notificationSettings');
    const settings = savedSettings ? JSON.parse(savedSettings) : {
      browserNotifications: true,
      soundNotifications: true,
      toastNotifications: true,
      rujukanBaru: true,
      statusUpdate: true,
      trackingUpdate: true,
      systemNotifications: true,
      quietHours: false
    };

    // Check if notification type is enabled
    const isTypeEnabled = (type) => {
      switch (type) {
        case 'rujukan-baru':
          return settings.rujukanBaru;
        case 'status-update':
          return settings.statusUpdate;
        case 'tracking-update':
          return settings.trackingUpdate;
        case 'system':
          return settings.systemNotifications;
        default:
          return true;
      }
    };

    if (!isTypeEnabled(notification.type)) {
      return; // Don't show notification if type is disabled
    }

    // Check quiet hours
    if (settings.quietHours && settings.soundNotifications) {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const startTime = parseInt(settings.quietHoursStart.split(':')[0]) * 60 + parseInt(settings.quietHoursStart.split(':')[1]);
      const endTime = parseInt(settings.quietHoursEnd.split(':')[0]) * 60 + parseInt(settings.quietHoursEnd.split(':')[1]);
      
      if (currentTime >= startTime || currentTime <= endTime) {
        // In quiet hours, don't play sound
        settings.soundNotifications = false;
      }
    }

    // Show browser notification if enabled
    if (settings.browserNotifications && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico'
      });
    }

    // Show toast notification if enabled
    if (settings.toastNotifications) {
      import('../components/ToastContainer').then(({ showToast }) => {
        showToast(notification);
      });
    }

    // Play sound notification if enabled
    if (settings.soundNotifications) {
      playNotificationSound();
    }
  }, []); // Empty dependency array to prevent infinite loop

  const playNotificationSound = () => {
    try {
      const audio = new Audio('/notification-sound.mp3');
      audio.volume = 0.5;
      audio.play().catch(error => {
        console.log('Audio play failed:', error);
        // Fallback: create a simple beep sound
        const context = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
        
        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + 0.5);
      });
    } catch (error) {
      console.log('Sound notification failed:', error);
    }
  };

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

    // Create socket connection with better error handling
    const newSocket = io('http://localhost:3001', {
      auth: {
        token: localStorage.getItem('token')
      },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      setIsConnected(true);

      // Join appropriate rooms based on user role
      if (user.role === 'admin') {
        newSocket.emit('join-admin');
        console.log('👑 Joined admin room');
      } else if ((user.role === 'puskesmas' || user.role === 'rs') && user.faskes_id) {
        newSocket.emit('join-faskes', user.faskes_id);
        console.log('🏥 Joined faskes room:', user.faskes_id);
      }
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
      setIsConnected(false);
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
      setIsConnected(true);
    });

    newSocket.on('reconnect_error', (error) => {
      console.error('❌ Socket reconnection error:', error);
      setIsConnected(false);
    });

    newSocket.on('reconnect_failed', () => {
      console.error('❌ Socket reconnection failed');
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

    newSocket.on('tracking-update', (data) => {
      console.log('Tracking update received:', data);
      addNotification({
        id: Date.now(),
        type: 'tracking-update',
        title: 'Update Tracking',
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
  }, [user, addNotification]); // Include addNotification in dependencies

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
