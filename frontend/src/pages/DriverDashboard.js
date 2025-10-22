import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import Layout from '../components/Layout';
import Chat from '../components/Chat';
import './DriverDashboard.css';

const DriverDashboard = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [activeSessions, setActiveSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [trackingStatus, setTrackingStatus] = useState('menunggu');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const watchId = useRef(null);
  const intervalId = useRef(null);

  // Cek apakah user adalah sopir ambulans
  useEffect(() => {
    if (user && user.role !== 'sopir_ambulans') {
      setError('Akses ditolak. Halaman ini hanya untuk sopir ambulans.');
    }
  }, [user]);

  // Ambil session aktif saat komponen dimount
  useEffect(() => {
    fetchActiveSessions();
  }, []);

  // Setup socket listeners
  useEffect(() => {
    if (socket) {
      socket.on('tracking-update', (data) => {
        console.log('📍 Real-time tracking update:', data);
        // Update UI dengan data real-time
        setActiveSessions(prev => 
          prev.map(session => 
            session.rujukan_id === data.rujukan_id 
              ? { ...session, ...data }
              : session
          )
        );
      });

      return () => {
        socket.off('tracking-update');
      };
    }
  }, [socket]);

  const fetchActiveSessions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tracking/sessions/active`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setActiveSessions(data.data);
      } else {
        setError('Gagal mengambil data session aktif');
      }
    } catch (error) {
      console.error('Error fetching active sessions:', error);
      setError('Terjadi kesalahan saat mengambil data');
    } finally {
      setLoading(false);
    }
  };

  const startTracking = async (session) => {
    try {
      setSelectedSession(session);
      setIsTracking(true);
      setError(null);

      // Request permission untuk geolocation
      if (!navigator.geolocation) {
        setError('Geolocation tidak didukung oleh browser ini');
        return;
      }

      // Check permission first
      if (navigator.permissions) {
        navigator.permissions.query({name: 'geolocation'}).then(function(result) {
          console.log('📍 Geolocation permission:', result.state);
          if (result.state === 'denied') {
            setError('Akses lokasi ditolak. Silakan izinkan akses lokasi di pengaturan browser.');
            return;
          }
        }).catch(err => {
          console.log('Permission API not supported:', err);
        });
      }

      // Start watching position
      watchId.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy, speed, heading } = position.coords;
          console.log('📍 GPS Position received:', { latitude, longitude, accuracy, speed, heading });
          setCurrentLocation({ latitude, longitude, accuracy, speed, heading });
          
          // Update position ke server setiap 10 detik
          updatePosition(session, latitude, longitude, accuracy, speed, heading);
        },
        (error) => {
          console.error('Geolocation error:', error);
          let errorMessage = 'Error GPS: ';
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += 'Akses lokasi ditolak. Silakan izinkan akses lokasi.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += 'Lokasi tidak tersedia.';
              break;
            case error.TIMEOUT:
              errorMessage += 'Timeout mendapatkan lokasi.';
              break;
            default:
              errorMessage += error.message;
              break;
          }
          setError(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000, // Increase timeout
          maximumAge: 10000 // Increase cache time
        }
      );

      // Update status setiap 30 detik
      intervalId.current = setInterval(() => {
        if (selectedSession && currentLocation) {
          updatePosition(
            selectedSession, 
            currentLocation.latitude, 
            currentLocation.longitude,
            currentLocation.accuracy,
            currentLocation.speed,
            currentLocation.heading
          );
        }
      }, 30000);

    } catch (error) {
      console.error('Error starting tracking:', error);
      setError('Gagal memulai tracking');
    }
  };

  const updatePosition = async (session, latitude, longitude, accuracy, speed, heading) => {
    try {
      console.log('🔄 Updating position:', { session_token: session.session_token, latitude, longitude });
      
      const response = await fetch(`/api/tracking/update-position`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          session_token: session.session_token,
          latitude,
          longitude,
          status: trackingStatus,
          speed: speed || 0,
          heading: heading || null,
          accuracy: accuracy || 0,
          battery_level: null // Browser tidak bisa akses battery level
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        console.log('✅ Position updated successfully');
      } else {
        console.error('❌ Failed to update position:', data.message);
      }
    } catch (error) {
      console.error('❌ Error updating position:', error);
      if (error.message.includes('404')) {
        console.error('❌ Endpoint not found. Check if backend is running on port 3001');
      }
    }
  };

  const updateStatus = (newStatus) => {
    setTrackingStatus(newStatus);
    if (selectedSession && currentLocation) {
      updatePosition(
        selectedSession,
        currentLocation.latitude,
        currentLocation.longitude,
        currentLocation.accuracy,
        currentLocation.speed,
        currentLocation.heading
      );
    }
  };

  const stopTracking = () => {
    if (watchId.current) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    
    if (intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }
    
    setIsTracking(false);
    setSelectedSession(null);
    setCurrentLocation(null);
    setTrackingStatus('menunggu');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'menunggu': return '#f39c12';
      case 'dijemput': return '#3498db';
      case 'dalam_perjalanan': return '#e74c3c';
      case 'tiba': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'menunggu': return 'Menunggu';
      case 'dijemput': return 'Dijemput';
      case 'dalam_perjalanan': return 'Dalam Perjalanan';
      case 'tiba': return 'Tiba di Tujuan';
      default: return 'Unknown';
    }
  };

  if (error && !user) {
    return (
      <Layout>
        <div className="driver-dashboard">
          <div className="error-container">
            <h2>❌ Akses Ditolak</h2>
            <p>{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="driver-dashboard">
        <div className="dashboard-header">
          <h1>🚑 Dashboard Sopir Ambulans</h1>
          <div className="user-info">
            <span>👤 {user?.nama_lengkap}</span>
            <span className={`status-indicator ${isTracking ? 'tracking' : 'idle'}`}>
              {isTracking ? '🟢 Sedang Tracking' : '⚪ Tidak Tracking'}
            </span>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <span>⚠️ {error}</span>
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

        <div className="dashboard-content">
          {/* Session List */}
          <div className="sessions-panel">
            <div className="panel-header">
              <h3>📋 Session Aktif</h3>
              <button onClick={fetchActiveSessions} disabled={loading}>
                {loading ? '🔄' : '🔄'} Refresh
              </button>
            </div>
            
            <div className="sessions-list">
              {activeSessions.length === 0 ? (
                <div className="no-sessions">
                  <p>📭 Tidak ada session aktif</p>
                </div>
              ) : (
                activeSessions.map((session) => (
                  <div 
                    key={session.id} 
                    className={`session-card ${selectedSession?.id === session.id ? 'selected' : ''}`}
                    onClick={() => !isTracking && setSelectedSession(session)}
                  >
                    <div className="session-info">
                      <h4>🚑 {session.nomor_rujukan}</h4>
                      <p><strong>Pasien:</strong> {session.nama_pasien}</p>
                      <p><strong>Dari:</strong> {session.faskes_asal_nama}</p>
                      <p><strong>Ke:</strong> {session.faskes_tujuan_nama}</p>
                      <p><strong>Transportasi:</strong> 
                        <span className="transport-badge">
                          {session.transport_type === 'pickup' ? '🚑 RS Tujuan Menjemput' : '🚑 Faskes Perujuk Mengantarkan'}
                        </span>
                      </p>
                      <p><strong>Status:</strong> 
                        <span 
                          className="status-badge" 
                          style={{ backgroundColor: getStatusColor(session.tracking_status) }}
                        >
                          {getStatusText(session.tracking_status)}
                        </span>
                      </p>
                    </div>
                    
                    <div className="session-actions">
                      {!isTracking ? (
                        <button 
                          className="start-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            startTracking(session);
                          }}
                        >
                          🚀 Mulai Tracking
                        </button>
                      ) : selectedSession?.id === session.id ? (
                        <button className="stop-btn" onClick={stopTracking}>
                          ⏹️ Stop Tracking
                        </button>
                      ) : (
                        <button disabled>⏸️ Sedang Tracking Lain</button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Tracking Panel */}
          {selectedSession && (
            <div className="tracking-panel">
              <div className="panel-header">
                <h3>📍 Tracking Aktif</h3>
                <span className="session-token">Token: {selectedSession.session_token}</span>
                <button
                  className="chat-btn"
                  onClick={() => setIsChatOpen(true)}
                  title="Buka Chat"
                >
                  💬 Chat
                </button>
              </div>
              
              <div className="tracking-info">
                <div className="location-info">
                  <h4>📍 Lokasi Saat Ini</h4>
                  {currentLocation ? (
                    <div className="location-data">
                      <p><strong>Latitude:</strong> {typeof currentLocation.latitude === 'number' ? currentLocation.latitude.toFixed(6) : 'N/A'}</p>
                      <p><strong>Longitude:</strong> {typeof currentLocation.longitude === 'number' ? currentLocation.longitude.toFixed(6) : 'N/A'}</p>
                      <p><strong>Akurasi:</strong> {typeof currentLocation.accuracy === 'number' ? `${currentLocation.accuracy.toFixed(0)}m` : 'N/A'}</p>
                      <p><strong>Kecepatan:</strong> {typeof currentLocation.speed === 'number' ? `${(currentLocation.speed * 3.6).toFixed(1)} km/h` : 'N/A'}</p>
                    </div>
                  ) : (
                    <p>⏳ Mendapatkan lokasi...</p>
                  )}
                </div>

                {/* Tombol aksi cepat saat tiba di lokasi pasien */}
                <div className="arrived-actions">
                  <button
                    className="status-btn arrived"
                    onClick={() => updateStatus('dijemput')}
                    style={{ backgroundColor: getStatusColor('dijemput') }}
                  >
                    ✅ Sudah sampai lokasi pasien
                  </button>
                </div>

                <div className="status-controls">
                  <h4>🎛️ Kontrol Status</h4>
                  <div className="status-buttons">
                    {['menunggu', 'dijemput', 'dalam_perjalanan', 'tiba'].map((status) => (
                      <button
                        key={status}
                        className={`status-btn ${trackingStatus === status ? 'active' : ''}`}
                        onClick={() => updateStatus(status)}
                        style={{ backgroundColor: getStatusColor(status) }}
                      >
                        {getStatusText(status)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="session-details">
                  <h4>📋 Detail Session</h4>
                  <div className="details-grid">
                    <div>
                      <strong>Nomor Rujukan:</strong> {selectedSession.nomor_rujukan}
                    </div>
                    <div>
                      <strong>Nama Pasien:</strong> {selectedSession.nama_pasien}
                    </div>
                    <div>
                      <strong>Faskes Asal:</strong> {selectedSession.faskes_asal_nama}
                    </div>
                    <div>
                      <strong>Faskes Tujuan:</strong> {selectedSession.faskes_tujuan_nama}
                    </div>
                    <div>
                      <strong>Jenis Transportasi:</strong> 
                      <span className="transport-badge">
                        {selectedSession.transport_type === 'pickup' ? '🚑 RS Tujuan Menjemput' : '🚑 Faskes Perujuk Mengantarkan'}
                      </span>
                    </div>
                    <div>
                      <strong>Mulai Tracking:</strong> {new Date(selectedSession.started_at).toLocaleString()}
                    </div>
                    <div>
                      <strong>Jarak Estimasi:</strong> {selectedSession.estimated_distance && typeof selectedSession.estimated_distance === 'number' ? `${selectedSession.estimated_distance.toFixed(1)} km` : 'N/A'}
                    </div>
                    <div>
                      <strong>Waktu Estimasi:</strong> {selectedSession.estimated_time ? `${selectedSession.estimated_time} menit` : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isChatOpen && selectedSession && (
            <Chat
              rujukanId={selectedSession.rujukan_id}
              isOpen={isChatOpen}
              onClose={() => setIsChatOpen(false)}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DriverDashboard;
