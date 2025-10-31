import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
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
  const [connectionStatus, setConnectionStatus] = useState(() => {
    // Try to restore connection status from localStorage
    const savedStatus = localStorage.getItem('socketConnectionStatus');
    return savedStatus || 'disconnected';
  });
  const [retryCount, setRetryCount] = useState(0);
  const { user } = useAuth();
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const healthCheckIntervalRef = useRef(null);

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

  // Create socket connection with enhanced error handling
  const createSocketConnection = useCallback(() => {
    if (!user) return;

    // Clean up existing connection
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    console.log('🔌 Creating new socket connection...');
    setConnectionStatus('connecting');

    const newSocket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001', {
      auth: {
        token: localStorage.getItem('token')
      },
      transports: ['websocket', 'polling'],
      timeout: 10000,
      reconnection: false, // We handle reconnection manually
      forceNew: true
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      console.log('🔗 Socket transport:', newSocket.io.engine.transport.name);
      console.log('🌐 Socket URL:', newSocket.io.uri);
      setIsConnected(true);
      setConnectionStatus('connected');
      setRetryCount(0); // Reset retry count on successful connection
      
      // Save connection status to localStorage
      localStorage.setItem('socketConnectionStatus', 'connected');

      // Join appropriate rooms based on user role
      if (user.role === 'admin') {
        newSocket.emit('join-admin');
        console.log('👑 Joined admin room');
      } else if ((user.role === 'puskesmas' || user.role === 'rs') && user.faskes_id) {
        newSocket.emit('join-faskes', user.faskes_id);
        console.log('🏥 Joined faskes room:', user.faskes_id);
      }

      // Start health check
      setTimeout(() => startHealthCheck(), 0);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      setIsConnected(false);
      setConnectionStatus('disconnected');
      
      // Save connection status to localStorage
      localStorage.setItem('socketConnectionStatus', 'disconnected');
      
      // Clear health check
      if (healthCheckIntervalRef.current) {
        clearInterval(healthCheckIntervalRef.current);
        healthCheckIntervalRef.current = null;
      }

      // Schedule reconnection unless it's a manual disconnect
      if (reason !== 'io client disconnect') {
        // Use setTimeout to avoid calling scheduleReconnect before it's defined
        setTimeout(() => scheduleReconnect(), 0);
      }
    });

    newSocket.on('connect_error', (error) => {
      console.warn('⚠️ Socket connection error:', error.message);
      setIsConnected(false);
      setConnectionStatus('error');
      // Use setTimeout to avoid calling scheduleReconnect before it's defined
      setTimeout(() => scheduleReconnect(), 0);
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
    socketRef.current = newSocket;
  }, [user, addNotification]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-reconnection with exponential backoff
  const scheduleReconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    const maxRetries = 10;
    const baseDelay = 1000; // 1 second
    const maxDelay = 30000; // 30 seconds
    const delay = Math.min(baseDelay * Math.pow(2, retryCount), maxDelay);

    if (retryCount < maxRetries) {
      console.log(`🔄 Scheduling reconnection attempt ${retryCount + 1}/${maxRetries} in ${delay}ms`);
      setConnectionStatus('reconnecting');
      
      reconnectTimeoutRef.current = setTimeout(() => {
        if (user && !isConnected) {
          console.log(`🔄 Attempting reconnection ${retryCount + 1}/${maxRetries}`);
          setRetryCount(prev => prev + 1);
          createSocketConnection();
        }
      }, delay);
    } else {
      console.error('❌ Max reconnection attempts reached. Auto-refreshing page...');
      setConnectionStatus('failed');
      
      // Auto-refresh page after 5 seconds if max retries reached
      setTimeout(() => {
        console.log('🔄 Auto-refreshing page due to connection failure');
        window.location.reload();
      }, 5000);
    }
  }, [retryCount, user, isConnected, createSocketConnection]);

  // Health check function
  const startHealthCheck = useCallback(() => {
    if (healthCheckIntervalRef.current) {
      clearInterval(healthCheckIntervalRef.current);
    }

    healthCheckIntervalRef.current = setInterval(async () => {
      if (socketRef.current && isConnected) {
        try {
          // Ping the backend health endpoint
          const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/health`);
          if (!response.ok) {
            throw new Error('Health check failed');
          }
          console.log('💚 Health check passed');
        } catch (error) {
          console.warn('⚠️ Health check failed, attempting reconnection');
          if (socketRef.current) {
            socketRef.current.disconnect();
          }
          scheduleReconnect();
        }
      }
    }, 30000); // Check every 30 seconds
  }, [isConnected, scheduleReconnect]);

  useEffect(() => {
    if (!user) {
      // Disconnect socket if user is not logged in
      if (socketRef.current) {
        socketRef.current.disconnect();
        setSocket(null);
        setIsConnected(false);
        setConnectionStatus('disconnected');
        socketRef.current = null;
      }
      
      // Clear any pending reconnection
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      
      // Clear health check
      if (healthCheckIntervalRef.current) {
        clearInterval(healthCheckIntervalRef.current);
        healthCheckIntervalRef.current = null;
      }
      
      return;
    }

    // Create initial connection
    createSocketConnection();

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      
      if (healthCheckIntervalRef.current) {
        clearInterval(healthCheckIntervalRef.current);
        healthCheckIntervalRef.current = null;
      }
    };
  }, [user, createSocketConnection]);

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

  const reconnectSocket = useCallback(() => {
    if (socketRef.current && !isConnected) {
      console.log('🔄 Attempting manual socket reconnection...');
      setRetryCount(0); // Reset retry count for manual reconnection
      createSocketConnection();
    }
  }, [isConnected, createSocketConnection]);

  const value = {
    socket,
    isConnected,
    connectionStatus,
    retryCount,
    notifications,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
    getUnreadCount,
    reconnectSocket
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
