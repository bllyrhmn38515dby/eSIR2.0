import React, { useState, useEffect, useCallback } from 'react';
import ToastNotification from './ToastNotification';
import './ToastContainer.css';

const ToastContainer = ({ position = 'top-right', maxToasts = 5 }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((notification, toastId = Date.now()) => {
    setToasts(prev => {
      const newToasts = [
        {
          id: toastId,
          notification: {
            ...notification,
            timestamp: notification.timestamp || new Date()
          }
        },
        ...prev
      ];
      
      // Keep only maxToasts
      return newToasts.slice(0, maxToasts);
    });
  }, [maxToasts]);

  const removeToast = useCallback((toastId) => {
    setToasts(prev => prev.filter(toast => toast.id !== toastId));
  }, []);

  // Listen for custom toast events
  useEffect(() => {
    const handleShowToast = (event) => {
      const { notification, toastId } = event.detail;
      addToast(notification, toastId);
    };

    const handleHideToast = (event) => {
      const { toastId } = event.detail;
      removeToast(toastId);
    };

    // Add event listeners
    window.addEventListener('show-toast', handleShowToast);
    window.addEventListener('hide-toast', handleHideToast);

    return () => {
      window.removeEventListener('show-toast', handleShowToast);
      window.removeEventListener('hide-toast', handleHideToast);
    };
  }, [addToast, removeToast]);

  const handleToastClose = useCallback((toastId) => {
    removeToast(toastId);
  }, [removeToast]);

  return (
    <div className={`toast-container ${position}`}>
      {toasts.map((toast, index) => (
        <ToastNotification
          key={toast.id}
          notification={toast.notification}
          onClose={() => handleToastClose(toast.id)}
          position={position}
          style={{
            zIndex: 9999 - index,
            transform: `translateY(${index * 8}px)`
          }}
        />
      ))}
    </div>
  );
};

// Utility functions to show/hide toasts from anywhere in the app
export const showToast = (notification, toastId = Date.now()) => {
  window.dispatchEvent(new CustomEvent('show-toast', {
    detail: { notification, toastId }
  }));
};

export const hideToast = (toastId) => {
  window.dispatchEvent(new CustomEvent('hide-toast', {
    detail: { toastId }
  }));
};

// Predefined toast types for easy use
export const toastTypes = {
  success: (message, title = 'Berhasil') => ({
    type: 'success',
    title,
    message
  }),
  
  error: (message, title = 'Error') => ({
    type: 'error',
    title,
    message
  }),
  
  warning: (message, title = 'Peringatan') => ({
    type: 'warning',
    title,
    message
  }),
  
  info: (message, title = 'Informasi') => ({
    type: 'system',
    title,
    message
  }),
  
  rujukanBaru: (message, title = 'Rujukan Baru') => ({
    type: 'rujukan-baru',
    title,
    message
  }),
  
  statusUpdate: (message, title = 'Status Diperbarui') => ({
    type: 'status-update',
    title,
    message
  }),
  
  trackingUpdate: (message, title = 'Tracking Diperbarui') => ({
    type: 'tracking-update',
    title,
    message
  })
};

// Convenience functions
export const showSuccessToast = (message, title) => {
  showToast(toastTypes.success(message, title));
};

export const showErrorToast = (message, title) => {
  showToast(toastTypes.error(message, title));
};

export const showWarningToast = (message, title) => {
  showToast(toastTypes.warning(message, title));
};

export const showInfoToast = (message, title) => {
  showToast(toastTypes.info(message, title));
};

export const showRujukanToast = (message, title) => {
  showToast(toastTypes.rujukanBaru(message, title));
};

export const showStatusToast = (message, title) => {
  showToast(toastTypes.statusUpdate(message, title));
};

export const showTrackingToast = (message, title) => {
  showToast(toastTypes.trackingUpdate(message, title));
};

export default ToastContainer;
