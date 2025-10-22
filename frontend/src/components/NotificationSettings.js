import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NotificationSettings.css';

const NotificationSettings = ({ onClose }) => {
  const [settings, setSettings] = useState({
    browserNotifications: true,
    soundNotifications: true,
    toastNotifications: true,
    emailNotifications: false,
    rujukanBaru: true,
    statusUpdate: true,
    trackingUpdate: true,
    systemNotifications: true,
    quietHours: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',
    toastPosition: 'top-right',
    maxToasts: 5
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/notifications/settings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setSettings(response.data.data);
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
      // Load default settings from localStorage if API fails
      const savedSettings = localStorage.getItem('notificationSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      const token = localStorage.getItem('token');
      const response = await axios.put('/api/notifications/settings', settings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setSuccess('Pengaturan notifikasi berhasil disimpan');
        // Also save to localStorage as backup
        localStorage.setItem('notificationSettings', JSON.stringify(settings));
        
        // Test browser notification permission if enabled
        if (settings.browserNotifications) {
          if ('Notification' in window && Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
              setError('Izin notifikasi browser ditolak. Beberapa notifikasi mungkin tidak akan muncul.');
            }
          }
        }
      }
    } catch (error) {
      console.error('Error saving notification settings:', error);
      setError('Gagal menyimpan pengaturan notifikasi');
      
      // Save to localStorage as fallback
      localStorage.setItem('notificationSettings', JSON.stringify(settings));
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const testNotification = async () => {
    try {
      // Test browser notification
      if (settings.browserNotifications && 'Notification' in window && Notification.permission === 'granted') {
        new Notification('Test Notifikasi', {
          body: 'Ini adalah notifikasi test dari eSIR 2.0',
          icon: '/favicon.ico'
        });
      }
      
      // Test toast notification
      if (settings.toastNotifications) {
        const { showInfoToast } = await import('./ToastContainer');
        showInfoToast('Ini adalah notifikasi test', 'Test Notifikasi');
      }
      
      // Test sound notification
      if (settings.soundNotifications) {
        playNotificationSound();
      }
      
      setSuccess('Test notifikasi berhasil dikirim');
    } catch (error) {
      console.error('Error testing notification:', error);
      setError('Gagal mengirim test notifikasi');
    }
  };

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

  if (loading) {
    return (
      <div className="notification-settings-modal">
        <div className="notification-settings-content">
          <div className="loading">Memuat pengaturan...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="notification-settings-modal">
      <div className="notification-settings-content">
        <div className="settings-header">
          <h2>⚙️ Pengaturan Notifikasi</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        <div className="settings-sections">
          {/* General Settings */}
          <div className="settings-section">
            <h3>🔔 Pengaturan Umum</h3>
            
            <div className="setting-item">
              <label className="setting-label">
                <input
                  type="checkbox"
                  checked={settings.browserNotifications}
                  onChange={(e) => handleChange('browserNotifications', e.target.checked)}
                />
                <span>Notifikasi Browser</span>
              </label>
              <p className="setting-description">
                Menampilkan notifikasi popup di browser
              </p>
            </div>

            <div className="setting-item">
              <label className="setting-label">
                <input
                  type="checkbox"
                  checked={settings.soundNotifications}
                  onChange={(e) => handleChange('soundNotifications', e.target.checked)}
                />
                <span>Notifikasi Suara</span>
              </label>
              <p className="setting-description">
                Memutar suara saat ada notifikasi baru
              </p>
            </div>

            <div className="setting-item">
              <label className="setting-label">
                <input
                  type="checkbox"
                  checked={settings.toastNotifications}
                  onChange={(e) => handleChange('toastNotifications', e.target.checked)}
                />
                <span>Toast Notifications</span>
              </label>
              <p className="setting-description">
                Menampilkan notifikasi toast di pojok layar
              </p>
            </div>

            <div className="setting-item">
              <label className="setting-label">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                />
                <span>Notifikasi Email</span>
              </label>
              <p className="setting-description">
                Mengirim notifikasi melalui email
              </p>
            </div>
          </div>

          {/* Notification Types */}
          <div className="settings-section">
            <h3>📋 Jenis Notifikasi</h3>
            
            <div className="setting-item">
              <label className="setting-label">
                <input
                  type="checkbox"
                  checked={settings.rujukanBaru}
                  onChange={(e) => handleChange('rujukanBaru', e.target.checked)}
                />
                <span>Rujukan Baru</span>
              </label>
              <p className="setting-description">
                Notifikasi saat ada rujukan baru masuk
              </p>
            </div>

            <div className="setting-item">
              <label className="setting-label">
                <input
                  type="checkbox"
                  checked={settings.statusUpdate}
                  onChange={(e) => handleChange('statusUpdate', e.target.checked)}
                />
                <span>Update Status</span>
              </label>
              <p className="setting-description">
                Notifikasi saat status rujukan berubah
              </p>
            </div>

            <div className="setting-item">
              <label className="setting-label">
                <input
                  type="checkbox"
                  checked={settings.trackingUpdate}
                  onChange={(e) => handleChange('trackingUpdate', e.target.checked)}
                />
                <span>Update Tracking</span>
              </label>
              <p className="setting-description">
                Notifikasi saat ada update tracking ambulans
              </p>
            </div>

            <div className="setting-item">
              <label className="setting-label">
                <input
                  type="checkbox"
                  checked={settings.systemNotifications}
                  onChange={(e) => handleChange('systemNotifications', e.target.checked)}
                />
                <span>Notifikasi Sistem</span>
              </label>
              <p className="setting-description">
                Notifikasi penting dari sistem
              </p>
            </div>
          </div>

          {/* Toast Settings */}
          <div className="settings-section">
            <h3>🍞 Pengaturan Toast</h3>
            
            <div className="setting-item">
              <label className="setting-label">
                <span>Posisi Toast:</span>
                <select
                  value={settings.toastPosition}
                  onChange={(e) => handleChange('toastPosition', e.target.value)}
                >
                  <option value="top-right">Pojok Kanan Atas</option>
                  <option value="top-left">Pojok Kiri Atas</option>
                  <option value="bottom-right">Pojok Kanan Bawah</option>
                  <option value="bottom-left">Pojok Kiri Bawah</option>
                </select>
              </label>
            </div>

            <div className="setting-item">
              <label className="setting-label">
                <span>Maksimal Toast:</span>
                <select
                  value={settings.maxToasts}
                  onChange={(e) => handleChange('maxToasts', parseInt(e.target.value))}
                >
                  <option value={3}>3</option>
                  <option value={5}>5</option>
                  <option value={8}>8</option>
                  <option value={10}>10</option>
                </select>
              </label>
            </div>
          </div>

          {/* Quiet Hours */}
          <div className="settings-section">
            <h3>🌙 Jam Tenang</h3>
            
            <div className="setting-item">
              <label className="setting-label">
                <input
                  type="checkbox"
                  checked={settings.quietHours}
                  onChange={(e) => handleChange('quietHours', e.target.checked)}
                />
                <span>Aktifkan Jam Tenang</span>
              </label>
              <p className="setting-description">
                Menonaktifkan notifikasi suara pada jam tertentu
              </p>
            </div>

            {settings.quietHours && (
              <div className="quiet-hours-settings">
                <div className="setting-item">
                  <label className="setting-label">
                    <span>Dari:</span>
                    <input
                      type="time"
                      value={settings.quietHoursStart}
                      onChange={(e) => handleChange('quietHoursStart', e.target.value)}
                    />
                  </label>
                </div>

                <div className="setting-item">
                  <label className="setting-label">
                    <span>Sampai:</span>
                    <input
                      type="time"
                      value={settings.quietHoursEnd}
                      onChange={(e) => handleChange('quietHoursEnd', e.target.value)}
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="settings-actions">
          <button 
            className="btn-test"
            onClick={testNotification}
            disabled={saving}
          >
            🧪 Test Notifikasi
          </button>
          
          <div className="action-buttons">
            <button 
              className="btn-cancel"
              onClick={onClose}
              disabled={saving}
            >
              Batal
            </button>
            
            <button 
              className="btn-save"
              onClick={saveSettings}
              disabled={saving}
            >
              {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
