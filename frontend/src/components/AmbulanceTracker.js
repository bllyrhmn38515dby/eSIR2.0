import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import './AmbulanceTracker.css';

const AmbulanceTracker = () => {
  const navigate = useNavigate();
  // const { user } = useAuth(); // Removed unused variable
  const [sessionToken, setSessionToken] = useState('');
  const [rujukanId, setRujukanId] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [trackingData, setTrackingData] = useState(null);
  const [rujukanList, setRujukanList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingRujukan, setLoadingRujukan] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualPosition, setManualPosition] = useState({ latitude: '', longitude: '' });
  const watchIdRef = useRef(null);

  // Load rujukan yang bisa di-track
  useEffect(() => {
    loadRujukanList();
    loadActiveSessions();
  }, []);

  // Check existing session when rujukan changes
  useEffect(() => {
    if (rujukanId) {
      checkExistingSession();
    }
  }, [rujukanId, checkExistingSession]);

  const checkExistingSession = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Cek apakah ada session aktif untuk rujukan yang dipilih
      if (rujukanId) {
        const response = await fetch(`http://localhost:3001/api/tracking/session/${rujukanId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Found existing session:', result.data);
          
          // Auto-resume existing session
          setSessionToken(result.data.session_token);
          setTrackingData({
            nomor_rujukan: result.data.nomor_rujukan,
            nama_pasien: result.data.nama_pasien,
            faskes_asal_nama: result.data.faskes_asal_nama,
            faskes_tujuan_nama: result.data.faskes_tujuan_nama,
            status: result.data.rujukan_status
          });
          setIsTracking(true);
          setSuccess('Session tracking aktif ditemukan, melanjutkan...');
          
          // Start GPS tracking
          startGPSTracking();
        }
      }
    } catch (error) {
      console.error('Error checking existing session:', error);
    }
  };

  const loadActiveSessions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/tracking/sessions/active', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Active sessions:', result.data);
        // Handle active sessions if needed
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
      
      const response = await fetch('http://localhost:3001/api/rujukan', {
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
          // Filter rujukan yang statusnya 'diterima', 'dalam_perjalanan', atau 'pending'
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

      const response = await fetch('http://localhost:3001/api/tracking/start-session', {
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
        setSessionToken(result.data.session_token);
        setTrackingData(result.data.rujukan);
        setIsTracking(true);
        
        if (result.data.is_existing) {
          setSuccess('Session tracking sudah aktif, melanjutkan tracking...');
        } else {
          setSuccess('Session tracking berhasil dimulai!');
        }
        
        // Start GPS tracking
        startGPSTracking();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Gagal memulai session tracking');
      }
    } catch (error) {
      console.error('Error starting tracking session:', error);
      setError('Terjadi kesalahan saat memulai tracking');
    } finally {
      setLoading(false);
    }
  };

  const startGPSTracking = () => {
    if (!navigator.geolocation) {
      setError('Geolocation tidak didukung di browser ini');
      return;
    }

    // Clear any previous error
    setError('');

    // Try with high accuracy first, then fallback to lower accuracy
    const tryGetPosition = (highAccuracy = true) => {
      const options = {
        enableHighAccuracy: highAccuracy,
        timeout: highAccuracy ? 15000 : 30000, // Longer timeout for low accuracy
        maximumAge: highAccuracy ? 0 : 60000 // Allow cached position for low accuracy
      };

      console.log(`🔄 Mencoba mendapatkan posisi GPS (${highAccuracy ? 'high accuracy' : 'low accuracy'})...`);

      // Get initial position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('✅ Posisi GPS berhasil didapatkan:', position.coords);
          setCurrentPosition({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
          updatePosition(position.coords);
          
          // Start watching position with same options
          startWatchingPosition(options);
        },
        (error) => {
          console.error('❌ Error getting position:', error);
          
          let errorMessage = '';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Izin lokasi ditolak. Silakan izinkan akses lokasi di browser.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Informasi lokasi tidak tersedia.';
              break;
            case error.TIMEOUT:
              if (highAccuracy) {
                console.log('⏰ Timeout dengan high accuracy, mencoba low accuracy...');
                setError('Mencoba mendapatkan posisi dengan akurasi rendah...');
                setTimeout(() => tryGetPosition(false), 1000);
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

    // Start with high accuracy
    tryGetPosition(true);
  };

  const startWatchingPosition = (options) => {
    // Watch position changes
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const newPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          heading: position.coords.heading,
          speed: position.coords.speed ? position.coords.speed * 3.6 : null // Convert m/s to km/h
        };
        
        setCurrentPosition(newPosition);
        updatePosition(newPosition);
      },
      (error) => {
        console.error('Error watching position:', error);
        
        // Don't show error for watching, just log it
        // The user can still manually update status
        if (error.code === error.TIMEOUT) {
          console.log('⏰ Timeout watching position, akan mencoba lagi...');
        }
      },
      options
    );
  };

  const updatePosition = async (coords) => {
    if (!sessionToken) return;

    try {
      const response = await fetch('http://localhost:3001/api/tracking/update-position', {
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
          battery_level: getBatteryLevel()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error updating position:', errorData);
      }
    } catch (error) {
      console.error('Error updating position:', error);
    }
  };

  const getBatteryLevel = () => {
    // Try to get battery level if available
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        return Math.round(battery.level * 100);
      });
    }
    return null;
  };

  const stopTracking = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    setIsTracking(false);
    setSessionToken('');
    setCurrentPosition(null);
    setTrackingData(null);
    setSuccess('Tracking berhasil dihentikan');
  };

  const updateStatus = async (status) => {
    if (!sessionToken) {
      setError('Session token tidak ditemukan');
      return;
    }

    try {
      // Gunakan posisi default jika tidak ada GPS
      const position = currentPosition || {
        latitude: -6.5971,
        longitude: 106.8060,
        accuracy: 1000,
        speed: null,
        heading: null
      };

      const requestBody = {
        session_token: sessionToken,
        latitude: position.latitude,
        longitude: position.longitude,
        status: status,
        speed: position.speed,
        heading: position.heading,
        accuracy: position.accuracy,
        battery_level: getBatteryLevel()
      };

      console.log('🔄 Updating status:', status);
      console.log('📡 Request body:', requestBody);

      const response = await fetch('http://localhost:3001/api/tracking/update-position', {
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
        
        // Update current position jika berhasil
        if (!currentPosition) {
          setCurrentPosition(position);
        }
      } else {
        const errorData = await response.json();
        console.error('❌ Error response:', errorData);
        setError(errorData.message || 'Gagal mengupdate status');
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

  const handleManualPositionSubmit = () => {
    const lat = parseFloat(manualPosition.latitude);
    const lng = parseFloat(manualPosition.longitude);
    
    if (isNaN(lat) || isNaN(lng)) {
      setError('Latitude dan longitude harus berupa angka');
      return;
    }
    
    if (lat < -90 || lat > 90) {
      setError('Latitude harus antara -90 dan 90');
      return;
    }
    
    if (lng < -180 || lng > 180) {
      setError('Longitude harus antara -180 dan 180');
      return;
    }

    const position = {
      latitude: lat,
      longitude: lng,
      accuracy: 100, // Manual input accuracy
      speed: null,
      heading: null
    };

    setCurrentPosition(position);
    updatePosition(position);
    setShowManualInput(false);
    setError('');
    setSuccess('Posisi manual berhasil diupdate');
  };

  const useDefaultPosition = () => {
    // Default position di Bogor
    const defaultPosition = {
      latitude: -6.5971,
      longitude: 106.8060,
      accuracy: 1000, // Low accuracy for default position
      speed: null,
      heading: null
    };

    setCurrentPosition(defaultPosition);
    updatePosition(defaultPosition);
    setError('');
    setSuccess('Menggunakan posisi default Bogor');
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
                  <div className="position-actions">
                    <button 
                      onClick={() => setShowManualInput(true)}
                      className="manual-btn"
                    >
                      📝 Input Manual
                    </button>
                  </div>
                </div>
              ) : (
                <div className="no-position">
                  <p>Posisi GPS belum tersedia</p>
                  <p>Pastikan GPS aktif dan izin lokasi diberikan</p>
                  <div className="position-fallback">
                    <button 
                      onClick={() => setShowManualInput(true)}
                      className="manual-btn"
                    >
                      📝 Input Posisi Manual
                    </button>
                    <button 
                      onClick={useDefaultPosition}
                      className="default-btn"
                    >
                      🏠 Gunakan Posisi Default
                    </button>
                  </div>
                </div>
              )}

              {showManualInput && (
                <div className="manual-input">
                  <h4>📝 Input Posisi Manual</h4>
                  <div className="input-group">
                    <label>Latitude:</label>
                    <input
                      type="number"
                      step="any"
                      value={manualPosition.latitude}
                      onChange={(e) => setManualPosition(prev => ({ ...prev, latitude: e.target.value }))}
                      placeholder="-6.5971"
                    />
                  </div>
                  <div className="input-group">
                    <label>Longitude:</label>
                    <input
                      type="number"
                      step="any"
                      value={manualPosition.longitude}
                      onChange={(e) => setManualPosition(prev => ({ ...prev, longitude: e.target.value }))}
                      placeholder="106.8060"
                    />
                  </div>
                  <div className="manual-actions">
                    <button 
                      onClick={handleManualPositionSubmit}
                      className="submit-btn"
                    >
                      ✅ Submit
                    </button>
                    <button 
                      onClick={() => setShowManualInput(false)}
                      className="cancel-btn"
                    >
                      ❌ Batal
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
