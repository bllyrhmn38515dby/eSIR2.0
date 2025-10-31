import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import './AmbulanceTracker.css';

const AmbulanceTracker = () => {
  const navigate = useNavigate();
  const [sessionToken, setSessionToken] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [rujukanId, setRujukanId] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [trackingData, setTrackingData] = useState(null);
  const [rujukanList, setRujukanList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingRujukan, setLoadingRujukan] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [gpsPermissionStatus, setGpsPermissionStatus] = useState('checking'); // checking, granted, denied, unavailable
  const [gpsError, setGpsError] = useState('');
  const watchIdRef = useRef(null);
  const gpsRequestTimeoutRef = useRef(null);
  const lastGpsRequestRef = useRef(0);
  const lastUpdatePositionRef = useRef(0);

  // Auto-request GPS permission on component mount with rate limiting
  const requestGPSPermission = useCallback(async () => {
    if (!navigator.geolocation) {
      setGpsPermissionStatus('unavailable');
      setGpsError('Geolocation tidak didukung di browser ini');
      return;
    }

    // Rate limiting: prevent multiple requests within 5 seconds
    const now = Date.now();
    if (now - lastGpsRequestRef.current < 5000) {
      console.log('⏰ GPS request rate limited, skipping...');
      return;
    }
    lastGpsRequestRef.current = now;

    // Clear any existing timeout
    if (gpsRequestTimeoutRef.current) {
      clearTimeout(gpsRequestTimeoutRef.current);
    }

    setGpsPermissionStatus('checking');
    setGpsError('');

    try {
      console.log('🔄 Requesting GPS permission...');
      
      // Try with high accuracy first (shorter timeout)
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 8000, // Reduced timeout
            maximumAge: 0
          }
        );
      });

      console.log('✅ GPS permission granted, position obtained:', position.coords);
      setGpsPermissionStatus('granted');
      setCurrentPosition({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        heading: position.coords.heading,
        speed: position.coords.speed ? position.coords.speed * 3.6 : null
      });
      setGpsError('');
    } catch (error) {
      console.error('❌ GPS permission error:', error);
      
      let finalError = error;
      
      // If timeout, try with lower accuracy
      if (error.code === error.TIMEOUT) {
        console.log('⏰ High accuracy timeout, trying low accuracy...');
        try {
          const fallbackPosition = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              resolve,
              reject,
              {
                enableHighAccuracy: false,
                timeout: 15000, // Longer timeout for low accuracy
                maximumAge: 60000 // Accept cached position up to 1 minute old
              }
            );
          });

          console.log('✅ GPS fallback successful:', fallbackPosition.coords);
          setGpsPermissionStatus('granted');
          setCurrentPosition({
            latitude: fallbackPosition.coords.latitude,
            longitude: fallbackPosition.coords.longitude,
            accuracy: fallbackPosition.coords.accuracy,
            heading: fallbackPosition.coords.heading,
            speed: fallbackPosition.coords.speed ? fallbackPosition.coords.speed * 3.6 : null
          });
          setGpsError('');
          return;
        } catch (fallbackError) {
          console.error('❌ GPS fallback also failed:', fallbackError);
          // Use fallback error for final handling
          finalError = fallbackError;
        }
      }
      
      let errorMessage = '';
      let status = 'denied';
      
      switch (finalError.code) {
        case finalError.PERMISSION_DENIED:
          errorMessage = 'Izin lokasi ditolak. Silakan izinkan akses lokasi di browser untuk menggunakan GPS tracking.';
          status = 'denied';
          break;
        case finalError.POSITION_UNAVAILABLE:
          errorMessage = 'Informasi lokasi tidak tersedia. Pastikan GPS aktif dan coba lagi.';
          status = 'unavailable';
          break;
        case finalError.TIMEOUT:
          errorMessage = 'Timeout mendapatkan posisi GPS. Pastikan GPS aktif dan coba lagi.';
          status = 'unavailable';
          break;
        default:
          errorMessage = 'Gagal mendapatkan posisi GPS.';
          status = 'unavailable';
      }
      
      setGpsPermissionStatus(status);
      setGpsError(errorMessage);
    }
  }, []);

  // Define all functions before they are used to avoid temporal dead zone
  const getBatteryLevel = useCallback(async () => {
    if ('getBattery' in navigator) {
      try {
        const battery = await navigator.getBattery();
        return Math.round(battery.level * 100);
      } catch (error) {
        console.warn('Failed to get battery level:', error);
        return null;
      }
    }
    return null;
  }, []);

  const updatePosition = useCallback(async (coords) => {
    if (!sessionToken) return;

    // Rate limiting: prevent multiple requests within 2 seconds
    const now = Date.now();
    if (now - lastUpdatePositionRef.current < 2000) {
      console.log('⏰ Update position rate limited, skipping...');
      return;
    }
    lastUpdatePositionRef.current = now;

    try {
      // Validasi koordinat sebelum mengirim
      if (!coords.latitude || !coords.longitude) {
        console.warn('⚠️ Invalid coordinates:', coords);
        return;
      }

      // Validasi koordinat dalam area Jawa Barat
      if (coords.latitude < -7.5 || coords.latitude > -5.5 || 
          coords.longitude < 106.0 || coords.longitude > 108.5) {
        console.warn('⚠️ Coordinates out of Jawa Barat area:', coords);
        setError('Koordinat di luar area Jawa Barat');
        return;
      }

      const batteryLevel = await getBatteryLevel();
      
      console.log('🔄 Updating position:', {
        session_token: sessionToken.substring(0, 20) + '...',
        latitude: coords.latitude,
        longitude: coords.longitude,
        battery_level: batteryLevel
      });

      // Retry mechanism for update position
      let response;
      let retryCount = 0;
      const maxRetries = 3;
      
      const attemptUpdate = async (currentRetryCount) => {
        try {
          response = await fetch('/api/tracking/update-position', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              session_token: sessionToken,
              latitude: coords.latitude,
              longitude: coords.longitude,
              status: 'dalam_perjalanan',
              speed: coords.speed,
              heading: coords.heading,
              accuracy: coords.accuracy,
              battery_level: batteryLevel
            })
          });

          if (response.ok) {
            const result = await response.json();
            console.log('✅ Position updated successfully:', result);
            return true; // Success
          } else {
            const errorData = await response.json();
            console.error(`❌ Error updating position (attempt ${currentRetryCount + 1}):`, errorData);
            
            if (currentRetryCount === maxRetries - 1) {
              // Last attempt failed
              setError(errorData.message || 'Gagal mengupdate posisi');
            } else {
              // Wait before retry
              await new Promise(resolve => setTimeout(resolve, 1000 * (currentRetryCount + 1)));
            }
            return false;
          }
        } catch (error) {
          console.error(`❌ Network error updating position (attempt ${currentRetryCount + 1}):`, error);
          
          if (currentRetryCount === maxRetries - 1) {
            // Last attempt failed
            setError('Gagal mengupdate posisi');
          } else {
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 1000 * (currentRetryCount + 1)));
          }
          return false;
        }
      };
      
      while (retryCount < maxRetries) {
        const success = await attemptUpdate(retryCount);
        if (success) {
          break; // Success, exit retry loop
        }
        retryCount++;
      }
    } catch (error) {
      console.error('❌ Error updating position:', error);
      setError('Gagal mengupdate posisi');
    }
  }, [sessionToken, getBatteryLevel]);

  const startWatchingPosition = useCallback((options) => {
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const newPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          heading: position.coords.heading,
          speed: position.coords.speed ? position.coords.speed * 3.6 : null
        };
        
        setCurrentPosition(newPosition);
        updatePosition(newPosition);
      },
      (error) => {
        console.error('Error watching position:', error);
        if (error.code === error.TIMEOUT) {
          console.log('⏰ Timeout watching position, akan mencoba lagi...');
        }
      },
      options
    );
  }, [updatePosition]);

  const startGPSTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation tidak didukung di browser ini');
      return;
    }

    setError('');

    const tryGetPosition = (highAccuracy = true, attempt = 1) => {
      // Rate limiting: prevent too many attempts
      if (attempt > 3) {
        console.log('❌ Max GPS attempts reached, giving up...');
        setError('Gagal mendapatkan posisi GPS setelah beberapa percobaan. Silakan coba lagi nanti.');
        return;
      }

      const options = {
        enableHighAccuracy: highAccuracy,
        timeout: highAccuracy ? 8000 : 15000, // Reduced timeouts
        maximumAge: highAccuracy ? 0 : 30000 // Accept cached position for low accuracy
      };

      console.log(`🔄 Mencoba mendapatkan posisi GPS (${highAccuracy ? 'high accuracy' : 'low accuracy'}) - attempt ${attempt}...`);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('✅ Posisi GPS berhasil didapatkan:', position.coords);
          setCurrentPosition({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            heading: position.coords.heading,
            speed: position.coords.speed ? position.coords.speed * 3.6 : null
          });
          updatePosition(position.coords);
          startWatchingPosition(options);
        },
        (error) => {
          console.error('❌ Error getting position:', error);
          
          let errorMessage = '';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Izin lokasi ditolak. Silakan izinkan akses lokasi di browser.';
              setError(errorMessage);
              return;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Informasi lokasi tidak tersedia.';
              break;
            case error.TIMEOUT:
              if (highAccuracy) {
                console.log('⏰ Timeout dengan high accuracy, mencoba low accuracy...');
                setError('Mencoba mendapatkan posisi dengan akurasi rendah...');
                setTimeout(() => tryGetPosition(false, attempt + 1), 2000); // Longer delay
                return;
              } else {
                errorMessage = 'Timeout mendapatkan posisi GPS. Pastikan GPS aktif dan coba lagi.';
              }
              break;
            default:
              errorMessage = 'Gagal mendapatkan posisi GPS.';
          }
          
          setError(errorMessage);
        },
        options
      );
    };

    tryGetPosition(true, 1);
  }, [updatePosition, startWatchingPosition]);

  const checkExistingSession = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (rujukanId) {
        const response = await fetch(`/api/tracking/session/${rujukanId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Found existing session:', result.data);
          
          setSessionToken(result.data.session_token);
          setSessionId(result.data.id || null);
          setTrackingData({
            nomor_rujukan: result.data.nomor_rujukan,
            nama_pasien: result.data.nama_pasien,
            faskes_asal_nama: result.data.faskes_asal_nama,
            faskes_tujuan_nama: result.data.faskes_tujuan_nama,
            status: result.data.rujukan_status
          });
          setIsTracking(true);
          setSuccess('Session tracking aktif ditemukan, melanjutkan...');
          
          startGPSTracking();
        }
      }
    } catch (error) {
      console.error('Error checking existing session:', error);
    }
  }, [rujukanId, startGPSTracking]);

  // useEffect hooks
  useEffect(() => {
    loadRujukanList();
    loadActiveSessions();
    // Auto-request GPS permission when component mounts
    requestGPSPermission();
  }, [requestGPSPermission]);

  useEffect(() => {
    if (rujukanId) {
      checkExistingSession();
    }
  }, [rujukanId, checkExistingSession]);

  // Cleanup on unmount
  useEffect(() => {
    const currentWatchId = watchIdRef.current;
    const currentTimeout = gpsRequestTimeoutRef.current;
    
    return () => {
      // Clear GPS watch
      if (currentWatchId) {
        navigator.geolocation.clearWatch(currentWatchId);
      }
      // Clear timeout
      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }
    };
  }, []);

  // Rest of the component functions
  const loadActiveSessions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/tracking/sessions/active', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Active sessions:', result.data);
      }
    } catch (error) {
      console.error('Error loading active sessions:', error);
    }
  };

  const loadRujukanList = async () => {
    try {
      setLoadingRujukan(true);
      console.log('🔍 Loading rujukan list...');
      const token = localStorage.getItem('token');
      console.log('Token exists:', !!token);
      
      const response = await fetch('/api/rujukan', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Rujukan API response:', result);
        
        if (result.success && result.data) {
          const activeRujukan = result.data.filter(rujukan => 
            ['diterima', 'dalam_perjalanan', 'pending'].includes(rujukan.status)
          );
          console.log('Active rujukan found:', activeRujukan.length);
          console.log('Active rujukan:', activeRujukan);
          setRujukanList(activeRujukan);
        } else {
          console.log('No data in response or API error');
          setRujukanList([]);
        }
      } else {
        console.error('API response not ok:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        setRujukanList([]);
      }
    } catch (error) {
      console.error('Error loading rujukan:', error);
      setRujukanList([]);
    } finally {
      setLoadingRujukan(false);
    }
  };

  const startTrackingSession = async () => {
    if (!rujukanId) {
      setError('Pilih rujukan terlebih dahulu');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/tracking/start-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          rujukan_id: rujukanId,
          device_id: navigator.userAgent
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Session started successfully:', result);
        
        if (!result.data?.session_token) {
          console.error('❌ No session token in response:', result);
          setError('Session token tidak ditemukan dalam response');
          return;
        }
        
        setSessionToken(result.data.session_token);
        setSessionId(result.data.session_id);
        setTrackingData(result.data.rujukan);
        setIsTracking(true);
        
        console.log('🔑 Session token set:', result.data.session_token.substring(0, 20) + '...');
        
        if (result.data.is_existing) {
          setSuccess('Session tracking sudah aktif, melanjutkan tracking...');
        } else {
          setSuccess('Session tracking berhasil dimulai!');
        }
        
        startGPSTracking();
      } else {
        const errorData = await response.json();
        console.error('❌ Failed to start session:', errorData);
        setError(errorData.message || 'Gagal memulai session tracking');
      }
    } catch (error) {
      console.error('Error starting tracking session:', error);
      setError('Terjadi kesalahan saat memulai tracking');
    } finally {
      setLoading(false);
    }
  };

  const stopTracking = async () => {
    try {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }

      if (sessionId) {
        const token = localStorage.getItem('token');
        const resp = await fetch(`/api/tracking/end-session/${sessionId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!resp.ok) {
          const err = await resp.json().catch(() => ({}));
          console.error('❌ end-session failed:', err);
        }
      }

      setIsTracking(false);
      setSessionToken('');
      setSessionId(null);
      setCurrentPosition(null);
      setTrackingData(null);
      setSuccess('Tracking berhasil dihentikan');
    } catch (e) {
      console.error('❌ Error stopping tracking:', e);
      setError('Gagal menghentikan tracking');
    }
  };

  const updateStatus = async (status) => {
    if (!sessionToken) {
      setError('Session token tidak ditemukan');
      return;
    }

    // Rate limiting: prevent multiple requests within 3 seconds
    const now = Date.now();
    if (now - lastUpdatePositionRef.current < 3000) {
      console.log('⏰ Update status rate limited, please wait...');
      setError('Tunggu sebentar sebelum mengupdate status lagi');
      return;
    }
    lastUpdatePositionRef.current = now;

    try {
      if (!currentPosition) {
        setError('Posisi GPS belum tersedia. Pastikan GPS aktif dan izin lokasi diberikan.');
        return;
      }

      const position = currentPosition;

      // Validasi koordinat sebelum mengirim
      if (!position.latitude || !position.longitude) {
        console.warn('⚠️ Invalid coordinates:', position);
        setError('Koordinat GPS tidak valid');
        return;
      }

      // Validasi koordinat dalam area Jawa Barat
      if (position.latitude < -7.5 || position.latitude > -5.5 || 
          position.longitude < 106.0 || position.longitude > 108.5) {
        console.warn('⚠️ Coordinates out of Jawa Barat area:', position);
        setError('Koordinat di luar area Jawa Barat');
        return;
      }

      const batteryLevel = await getBatteryLevel();
      
      const requestBody = {
        session_token: sessionToken,
        latitude: position.latitude,
        longitude: position.longitude,
        status: status,
        speed: position.speed,
        heading: position.heading,
        accuracy: position.accuracy,
        battery_level: batteryLevel
      };

      console.log('🔄 Updating status:', status);
      console.log('📡 Request body:', requestBody);

      // Retry mechanism for update status
      let response;
      let retryCount = 0;
      const maxRetries = 3;
      
      const attemptStatusUpdate = async (currentRetryCount) => {
        try {
          response = await fetch('/api/tracking/update-position', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
          });

          console.log('📡 Response status:', response.status);

          if (response.ok) {
            const result = await response.json();
            console.log('✅ Update successful:', result);
            setSuccess(`Status berhasil diupdate ke: ${getStatusText(status)}`);
            return true; // Success
          } else {
            const errorData = await response.json();
            console.error(`❌ Error response (attempt ${currentRetryCount + 1}):`, errorData);
            
            if (currentRetryCount === maxRetries - 1) {
              // Last attempt failed
              setError(errorData.message || 'Gagal mengupdate status');
            } else {
              // Wait before retry
              await new Promise(resolve => setTimeout(resolve, 1000 * (currentRetryCount + 1)));
            }
            return false;
          }
        } catch (error) {
          console.error(`❌ Network error updating status (attempt ${currentRetryCount + 1}):`, error);
          
          if (currentRetryCount === maxRetries - 1) {
            // Last attempt failed
            setError('Gagal mengupdate status');
          } else {
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 1000 * (currentRetryCount + 1)));
          }
          return false;
        }
      };
      
      while (retryCount < maxRetries) {
        const success = await attemptStatusUpdate(retryCount);
        if (success) {
          break; // Success, exit retry loop
        }
        retryCount++;
      }
    } catch (error) {
      console.error('❌ Error updating status:', error);
      setError('Gagal mengupdate status');
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'menunggu': return 'Menunggu';
      case 'dijemput': return 'Dijemput';
      case 'dalam_perjalanan': return 'Dalam Perjalanan';
      case 'tiba': return 'Tiba';
      default: return status;
    }
  };


  const retryGPSPermission = () => {
    // Debounce retry requests
    const now = Date.now();
    if (now - lastGpsRequestRef.current < 3000) {
      console.log('⏰ GPS retry rate limited, please wait...');
      return;
    }
    
    setGpsError('');
    requestGPSPermission();
  };

  return (
    <Layout>
      <div className="ambulance-tracker">
        <div className="tracker-header">
          <div className="header-content">
            <div className="header-left">
              <h1>🚑 Ambulance Tracker</h1>
              <p>Kirim posisi GPS secara real-time untuk monitoring perjalanan</p>
            </div>
            <div className="header-right">
              <button 
                onClick={() => navigate('/dashboard')}
                className="back-btn"
              >
                ← Kembali ke Dashboard
              </button>
            </div>
          </div>
        </div>

        <div className="tracker-container">
          <div className="tracker-sidebar">
            <div className="session-controls">
              <h3>🎯 Kontrol Session</h3>
              
              {!isTracking ? (
                <div className="start-session">
                  {loadingRujukan ? (
                    <div className="loading-rujukan">
                      <p>🔄 Memuat data rujukan...</p>
                    </div>
                  ) : (
                    <>
                      <div className="rujukan-info">
                        <div className="rujukan-header">
                          <p>📋 Ditemukan {rujukanList.length} rujukan aktif</p>
                          <button 
                            onClick={loadRujukanList}
                            className="refresh-btn"
                            title="Refresh data rujukan"
                          >
                            🔄
                          </button>
                        </div>
                      </div>
                      
                      <select 
                        value={rujukanId}
                        onChange={(e) => setRujukanId(e.target.value)}
                        className="rujukan-select"
                      >
                        <option value="">Pilih Rujukan</option>
                        {rujukanList.map(rujukan => (
                          <option key={rujukan.id} value={rujukan.id}>
                            {rujukan.nomor_rujukan} - {rujukan.nama_pasien} ({rujukan.status})
                          </option>
                        ))}
                      </select>

                      {rujukanList.length === 0 && (
                        <div className="no-rujukan">
                          <p>❌ Tidak ada rujukan aktif</p>
                          <p>Buat rujukan baru di menu Rujukan</p>
                        </div>
                      )}

                      <button 
                        onClick={startTrackingSession}
                        disabled={loading || !rujukanId || rujukanList.length === 0}
                        className="start-btn"
                      >
                        {loading ? 'Memulai...' : '🚀 Mulai Tracking'}
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="stop-session">
                  <button
                    type="button"
                    onClick={stopTracking}
                    className="stop-btn"
                  >
                    🛑 Hentikan Tracking
                  </button>
                </div>
              )}
            </div>

            {isTracking && (
              <div className="status-controls">
                <h3>📊 Status Kontrol</h3>
                <div className="arrived-actions" style={{ marginBottom: '10px' }}>
                  <button 
                    onClick={() => updateStatus('dijemput')}
                    className="status-btn dijemput"
                  >
                    ✅ Sudah sampai lokasi pasien
                  </button>
                </div>
                <div className="status-buttons">
                  <button 
                    onClick={() => updateStatus('menunggu')}
                    className="status-btn menunggu"
                  >
                    ⏳ Menunggu
                  </button>
                  <button 
                    onClick={() => updateStatus('dijemput')}
                    className="status-btn dijemput"
                  >
                    🚗 Dijemput
                  </button>
                  <button 
                    onClick={() => updateStatus('dalam_perjalanan')}
                    className="status-btn dalam_perjalanan"
                  >
                    🚑 Dalam Perjalanan
                  </button>
                  <button 
                    onClick={() => updateStatus('tiba')}
                    className="status-btn tiba"
                  >
                    ✅ Tiba
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="error-message">
                ❌ {error}
              </div>
            )}

            {success && (
              <div className="success-message">
                ✅ {success}
              </div>
            )}
          </div>

          <div className="tracker-main">
            <div className="position-display">
              <h3>📍 Posisi GPS</h3>
              
              {/* GPS Permission Status */}
              <div className="gps-status">
                {gpsPermissionStatus === 'checking' && (
                  <div className="gps-status-checking">
                    <div className="loading-spinner"></div>
                    <span>🔄 Meminta izin GPS...</span>
                    <p style={{fontSize: '12px', color: '#666', marginTop: '5px'}}>
                      Pastikan GPS aktif dan browser memiliki izin lokasi
                    </p>
                  </div>
                )}
                
                {gpsPermissionStatus === 'granted' && currentPosition && (
                  <div className="gps-status-granted">
                    <span>✅ GPS Aktif</span>
                  </div>
                )}
                
                {gpsPermissionStatus === 'denied' && (
                  <div className="gps-status-denied">
                    <span>❌ Izin GPS Ditolak</span>
                    <p style={{fontSize: '12px', color: '#666', marginTop: '5px'}}>
                      Klik ikon lokasi di address bar browser untuk mengizinkan akses lokasi
                    </p>
                    <button onClick={retryGPSPermission} className="retry-btn">
                      🔄 Coba Lagi
                    </button>
                  </div>
                )}
                
                {gpsPermissionStatus === 'unavailable' && (
                  <div className="gps-status-unavailable">
                    <span>⚠️ GPS Tidak Tersedia</span>
                    <p style={{fontSize: '12px', color: '#666', marginTop: '5px'}}>
                      Pastikan GPS aktif di perangkat dan coba lagi
                    </p>
                    <button onClick={retryGPSPermission} className="retry-btn">
                      🔄 Coba Lagi
                    </button>
                  </div>
                )}
              </div>

              {gpsError && (
                <div className="gps-error">
                  <p>❌ {gpsError}</p>
                </div>
              )}
              
              {currentPosition ? (
                <div className="position-info">
                  <div className="position-row">
                    <span>Latitude:</span>
                    <span>{currentPosition.latitude.toFixed(6)}</span>
                  </div>
                  <div className="position-row">
                    <span>Longitude:</span>
                    <span>{currentPosition.longitude.toFixed(6)}</span>
                  </div>
                  <div className="position-row">
                    <span>Akurasi:</span>
                    <span>{currentPosition.accuracy?.toFixed(1)} meter</span>
                  </div>
                  {currentPosition.speed && (
                    <div className="position-row">
                      <span>Kecepatan:</span>
                      <span>{currentPosition.speed.toFixed(1)} km/h</span>
                    </div>
                  )}
                  {currentPosition.heading && (
                    <div className="position-row">
                      <span>Arah:</span>
                      <span>{currentPosition.heading}°</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="no-position">
                  <p>Posisi GPS belum tersedia</p>
                  <p>Pastikan GPS aktif dan izin lokasi diberikan</p>
                  <div className="position-fallback">
                    <button 
                      onClick={retryGPSPermission}
                      className="retry-gps-btn"
                    >
                      🔄 Coba GPS Lagi
                    </button>
                  </div>
                </div>
              )}

            </div>

            {trackingData && (
              <div className="tracking-info">
                <h3>📋 Info Rujukan</h3>
                <div className="info-content">
                  <div className="info-row">
                    <span>Nomor Rujukan:</span>
                    <span>{trackingData.nomor_rujukan}</span>
                  </div>
                  <div className="info-row">
                    <span>Pasien:</span>
                    <span>{trackingData.nama_pasien}</span>
                  </div>
                  <div className="info-row">
                    <span>Dari:</span>
                    <span>{trackingData.faskes_asal_nama}</span>
                  </div>
                  <div className="info-row">
                    <span>Ke:</span>
                    <span>{trackingData.faskes_tujuan_nama}</span>
                  </div>
                  <div className="info-row">
                    <span>Status:</span>
                    <span className="status-text">
                      {getStatusText(trackingData.status)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="tracking-status">
              <h3>🔄 Status Tracking</h3>
              <div className={`status-indicator ${isTracking ? 'active' : 'inactive'}`}>
                {isTracking ? (
                  <div className="active-status">
                    <div className="pulse-dot"></div>
                    <span>Tracking Aktif</span>
                  </div>
                ) : (
                  <div className="inactive-status">
                    <span>Tracking Tidak Aktif</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AmbulanceTracker;

