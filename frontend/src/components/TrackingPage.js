import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSocket } from '../context/SocketContext';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Layout from './Layout';
import './TrackingPage.css';

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Icon ambulans menggunakan divIcon yang lebih stabil
const ambulanceIcon = L.divIcon({
  html: `
    <div style="
      width: 40px; 
      height: 40px; 
      background: #E66666; 
      border: 3px solid white; 
      border-radius: 50%; 
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 18px;
    ">
      🚑
    </div>
  `,
  className: 'custom-ambulance-icon',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20]
});

// Icon origin menggunakan divIcon yang lebih stabil
const originIcon = L.divIcon({
  html: `
    <div style="
      width: 32px; 
      height: 32px; 
      background: #34A853; 
      border: 3px solid white; 
      border-radius: 50%; 
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 14px;
    ">
      🏥
    </div>
  `,
  className: 'custom-origin-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

// Icon destination menggunakan divIcon yang lebih stabil
const destinationIcon = L.divIcon({
  html: `
    <div style="
      width: 32px; 
      height: 32px; 
      background: #FF3434; 
      border: 3px solid white; 
      border-radius: 50%; 
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 14px;
    ">
      🎯
    </div>
  `,
  className: 'custom-destination-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

// Component untuk update map center
const MapUpdater = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  
  return null;
};

const TrackingPage = () => {
  const { socket } = useSocket();
  const [activeSessions, setActiveSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState([-6.5971, 106.8060]); // Kota Bogor center
  const [routePolyline, setRoutePolyline] = useState([]);
  const [currentPhase, setCurrentPhase] = useState('unknown'); // 'going_to_pickup', 'transporting_patient', 'unknown'
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const mapRef = useRef(null);

  // Fungsi untuk menghitung jarak antara dua koordinat (dalam meter)
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371000; // Radius bumi dalam meter
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Jarak dalam meter
  };

  // Fungsi untuk menentukan fase perjalanan berdasarkan posisi ambulans
  const determineJourneyPhase = (tracking, route) => {
    if (!tracking.latitude || !tracking.longitude || !route.origin.lat || !route.origin.lng) {
      return 'unknown';
    }

    const ambulancePos = [parseFloat(tracking.latitude), parseFloat(tracking.longitude)];
    const originPos = [parseFloat(route.origin.lat), parseFloat(route.origin.lng)];
    
    // Hitung jarak ke RS perujuk (dalam meter)
    const distanceToOrigin = calculateDistance(
      ambulancePos[0], ambulancePos[1],
      originPos[0], originPos[1]
    );

    // Jika jarak ke RS perujuk lebih dari 200 meter, ambulans masih menuju RS perujuk
    if (distanceToOrigin > 200) {
      return 'going_to_pickup';
    } else {
      return 'transporting_patient';
    }
  };

  // Fungsi untuk mendapatkan routing presisi melalui backend API
  const getPreciseRoute = async (startLat, startLng, endLat, endLng) => {
    try {
      const response = await fetch('http://localhost:3001/api/routing/precise-route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          startLat: parseFloat(startLat),
          startLng: parseFloat(startLng),
          endLat: parseFloat(endLat),
          endLng: parseFloat(endLng)
        })
      });

      if (!response.ok) {
        throw new Error(`Backend routing API error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.data.coordinates) {
        console.log('✅ Precise route received from backend:', result.data.pointCount, 'points');
        return result.data.coordinates;
      } else {
        console.log('⚠️ Backend returned fallback route');
        return result.data.coordinates || [[startLat, startLng], [endLat, endLng]];
      }
    } catch (error) {
      console.error('Error getting precise route from backend:', error);
      // Final fallback ke garis lurus
      return [[startLat, startLng], [endLat, endLng]];
    }
  };

  // Fungsi untuk membuat polyline berdasarkan fase perjalanan dengan routing presisi
  const createSmartPolyline = async (tracking, route, phase) => {
    if (!tracking.latitude || !tracking.longitude) {
      return [];
    }

    const ambulancePos = [parseFloat(tracking.latitude), parseFloat(tracking.longitude)];
    
    if (phase === 'going_to_pickup') {
      // Rute presisi dari posisi ambulans ke RS perujuk
      if (route.origin.lat && route.origin.lng) {
        const preciseRoute = await getPreciseRoute(
          ambulancePos[0], ambulancePos[1],
          parseFloat(route.origin.lat), parseFloat(route.origin.lng)
        );
        return preciseRoute || [ambulancePos, [parseFloat(route.origin.lat), parseFloat(route.origin.lng)]];
      }
    } else if (phase === 'transporting_patient') {
      // Rute presisi dari RS perujuk ke RS tujuan
      if (route.origin.lat && route.origin.lng && route.destination.lat && route.destination.lng) {
        const preciseRoute = await getPreciseRoute(
          parseFloat(route.origin.lat), parseFloat(route.origin.lng),
          parseFloat(route.destination.lat), parseFloat(route.destination.lng)
        );
        return preciseRoute || [
          [parseFloat(route.origin.lat), parseFloat(route.origin.lng)],
          [parseFloat(route.destination.lat), parseFloat(route.destination.lng)]
        ];
      }
    }
    
    return [];
  };

  const loadActiveSessions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/tracking/sessions/active', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setActiveSessions(result.data);
      } else {
        console.error('Failed to load active sessions');
      }
    } catch (error) {
      console.error('Error loading active sessions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load active tracking sessions
  useEffect(() => {
    loadActiveSessions();
  }, [loadActiveSessions]);

  const updateMapWithNewPosition = useCallback((data) => {
    if (data.latitude && data.longitude) {
      setMapCenter([data.latitude, data.longitude]);
    }
  }, []);

  // Socket.IO events untuk real-time updates
  useEffect(() => {
    const setupSocketListeners = () => {
      if (socket && socket.on && socket.connected) {
        console.log('🔌 Setting up socket listeners for tracking updates');
        
        const handleTrackingUpdate = (data) => {
          console.log('📡 Tracking update received:', data);
          if (selectedSession && data.rujukan_id === selectedSession.rujukan_id) {
            setTrackingData(prev => ({ ...prev, ...data }));
            updateMapWithNewPosition(data);
          }
        };

        socket.on('tracking-update', handleTrackingUpdate);

        return () => {
          if (socket && socket.off) {
            console.log('🔌 Cleaning up socket listeners');
            socket.off('tracking-update', handleTrackingUpdate);
          }
        };
      } else {
        console.log('⚠️ Socket not available for tracking updates');
        return () => {};
      }
    };

    const cleanup = setupSocketListeners();

    if (socket && !socket.connected) {
      console.log('⏳ Waiting for socket connection...');
      const timeoutId = setTimeout(() => {
        if (socket.connected) {
          console.log('✅ Socket connected, setting up listeners');
          setupSocketListeners();
        } else {
          console.log('❌ Socket connection timeout');
        }
      }, 2000);

      return () => {
        clearTimeout(timeoutId);
        cleanup();
      };
    }

    return cleanup;
  }, [socket, selectedSession, updateMapWithNewPosition]);

  const selectSession = async (session) => {
    try {
      setLoading(true);
      setSelectedSession(session);
      setTrackingData(null); // Clear previous data

      console.log('🔍 Loading tracking data for session:', session);

      // Join tracking room
      if (socket) {
        socket.emit('join-tracking', session.rujukan_id);
        console.log('🔌 Joined tracking room:', session.rujukan_id);
      }

      // Load tracking data
      const response = await fetch(`http://localhost:3001/api/tracking/${session.rujukan_id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Tracking data loaded:', result.data);
        setTrackingData(result.data);
        await renderMapWithTrackingData(result.data);
      } else {
        console.error('❌ Failed to load tracking data:', response.status, response.statusText);
        const errorData = await response.json();
        console.error('Error details:', errorData);
      }
    } catch (error) {
      console.error('❌ Error loading tracking data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMapWithTrackingData = async (data) => {
    const { tracking, route } = data;

    console.log('🗺️ Rendering map with data:', { tracking, route });

    // Set map center to current position or destination
    if (tracking.latitude && tracking.longitude && 
        !isNaN(parseFloat(tracking.latitude)) && 
        !isNaN(parseFloat(tracking.longitude))) {
      setMapCenter([parseFloat(tracking.latitude), parseFloat(tracking.longitude)]);
      console.log('📍 Map center set to current position:', [tracking.latitude, tracking.longitude]);
    } else if (route.destination.lat && route.destination.lng && 
               !isNaN(parseFloat(route.destination.lat)) && 
               !isNaN(parseFloat(route.destination.lng))) {
      setMapCenter([parseFloat(route.destination.lat), parseFloat(route.destination.lng)]);
      console.log('📍 Map center set to destination:', [route.destination.lat, route.destination.lng]);
    }

    // Tentukan fase perjalanan berdasarkan posisi ambulans
    const journeyPhase = determineJourneyPhase(tracking, route);
    setCurrentPhase(journeyPhase);
    console.log('🚗 Journey phase determined:', journeyPhase);

    // Buat polyline berdasarkan fase perjalanan dengan routing presisi
    setIsLoadingRoute(true);
    try {
      const smartPolyline = await createSmartPolyline(tracking, route, journeyPhase);
      setRoutePolyline(smartPolyline);
      
      if (smartPolyline.length > 0) {
        console.log('🛣️ Precise route polyline created for phase:', journeyPhase, smartPolyline.length, 'points');
      } else {
        console.log('⚠️ Cannot create smart polyline - missing or invalid coordinates');
        console.log('Origin:', { lat: route.origin.lat, lng: route.origin.lng });
        console.log('Destination:', { lat: route.destination.lat, lng: route.destination.lng });
      }
    } catch (error) {
      console.error('Error creating precise route:', error);
      // Fallback ke garis lurus
      const fallbackPolyline = createFallbackPolyline(tracking, route, journeyPhase);
      setRoutePolyline(fallbackPolyline);
    } finally {
      setIsLoadingRoute(false);
    }
  };

  // Fungsi fallback untuk membuat polyline sederhana jika API gagal
  const createFallbackPolyline = (tracking, route, phase) => {
    if (!tracking.latitude || !tracking.longitude) {
      return [];
    }

    const ambulancePos = [parseFloat(tracking.latitude), parseFloat(tracking.longitude)];
    
    if (phase === 'going_to_pickup') {
      if (route.origin.lat && route.origin.lng) {
        return [ambulancePos, [parseFloat(route.origin.lat), parseFloat(route.origin.lng)]];
      }
    } else if (phase === 'transporting_patient') {
      if (route.origin.lat && route.origin.lng && route.destination.lat && route.destination.lng) {
        return [
          [parseFloat(route.origin.lat), parseFloat(route.origin.lng)],
          [parseFloat(route.destination.lat), parseFloat(route.destination.lng)]
        ];
      }
    }
    
    return [];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'menunggu': return '#FFA500';
      case 'dijemput': return '#FFD700';
      case 'dalam_perjalanan': return '#4285F4';
      case 'tiba': return '#34A853';
      default: return '#666';
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

  const getPhaseText = (phase) => {
    switch (phase) {
      case 'going_to_pickup': return 'Menuju RS Perujuk';
      case 'transporting_patient': return 'Mengantar Pasien';
      case 'unknown': return 'Status Tidak Diketahui';
      default: return 'Status Tidak Diketahui';
    }
  };

  const getPhaseColor = (phase) => {
    switch (phase) {
      case 'going_to_pickup': return '#FF6B35'; // Orange untuk menuju pickup
      case 'transporting_patient': return '#4285F4'; // Blue untuk transportasi
      case 'unknown': return '#666666'; // Gray untuk unknown
      default: return '#666666';
    }
  };

  const formatTime = (minutes) => {
    if (!minutes) return '-';
    if (minutes < 60) return `${minutes} menit`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}j ${mins}m`;
  };

  return (
    <Layout>
      <div className="tracking-page">
        <div className="tracking-header">
          <h1>🛰️ Real-Time Route Tracking</h1>
          <p>Monitor perjalanan ambulans dan pasien secara real-time di Kota Bogor</p>
        </div>

        <div className="tracking-container">
          <div className="tracking-sidebar">
            <div className="sidebar-header">
              <h3>📋 Sesi Tracking Aktif</h3>
              <button 
                className="refresh-btn"
                onClick={loadActiveSessions}
                disabled={loading}
              >
                🔄 Refresh
              </button>
            </div>

            {loading ? (
              <div className="loading">Loading...</div>
            ) : activeSessions.length === 0 ? (
              <div className="no-sessions">
                <p>Belum ada sesi tracking aktif</p>
              </div>
            ) : (
              <div className="sessions-list">
                {activeSessions.map((session) => (
                  <div 
                    key={session.id}
                    className={`session-card ${selectedSession?.id === session.id ? 'active' : ''}`}
                    onClick={() => selectSession(session)}
                  >
                    <div className="session-header">
                      <h4>{session.nomor_rujukan}</h4>
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(session.status) }}
                      >
                        {getStatusText(session.status)}
                      </span>
                    </div>
                    
                    <div className="session-details">
                      <p><strong>Pasien:</strong> {session.nama_pasien}</p>
                      <p><strong>Dari:</strong> {session.faskes_asal_nama}</p>
                      <p><strong>Ke:</strong> {session.faskes_tujuan_nama}</p>
                      <p><strong>Petugas:</strong> {session.petugas_nama}</p>
                    </div>

                    {(session.estimated_time || session.estimated_distance) && (
                      <div className="session-estimates">
                        {session.estimated_time && (
                          <span>⏱️ {formatTime(session.estimated_time)}</span>
                        )}
                        {session.estimated_distance && typeof session.estimated_distance === 'number' && (
                          <span>📏 {session.estimated_distance.toFixed(1)} km</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="tracking-map-container">
            {loading && (
              <div className="map-loading">
                <div className="loading-spinner"></div>
                <p>Memuat data tracking...</p>
              </div>
            )}
            
            <MapContainer 
              ref={mapRef}
              center={mapCenter}
              zoom={12}
              style={{ height: '600px', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              <MapUpdater center={mapCenter} />

              {/* Smart Route Polyline */}
              {routePolyline.length > 0 && (
                <Polyline
                  positions={routePolyline}
                  color={getPhaseColor(currentPhase)}
                  weight={routePolyline.length > 2 ? 6 : 3}
                  opacity={0.8}
                />
              )}
              
              {/* Route Info Overlay */}
              {routePolyline.length > 2 && (
                <div className="route-info-overlay">
                  <div className="route-info-card">
                    <span className="route-icon">🛣️</span>
                    <span className="route-text">
                      Rute Presisi ({routePolyline.length} titik)
                    </span>
                  </div>
                </div>
              )}

              {/* Origin Marker */}
              {trackingData?.route?.origin?.lat && 
               trackingData?.route?.origin?.lng && 
               !isNaN(parseFloat(trackingData.route.origin.lat)) && 
               !isNaN(parseFloat(trackingData.route.origin.lng)) && (
                <Marker
                  position={[parseFloat(trackingData.route.origin.lat), parseFloat(trackingData.route.origin.lng)]}
                  icon={originIcon}
                >
                  <Popup>
                    <strong>🏥 Asal:</strong> {trackingData.route.origin.name}<br />
                    Lat: {parseFloat(trackingData.route.origin.lat).toFixed(6)}<br />
                    Lng: {parseFloat(trackingData.route.origin.lng).toFixed(6)}
                  </Popup>
                </Marker>
              )}

              {/* Destination Marker */}
              {trackingData?.route?.destination?.lat && 
               trackingData?.route?.destination?.lng && 
               !isNaN(parseFloat(trackingData.route.destination.lat)) && 
               !isNaN(parseFloat(trackingData.route.destination.lng)) && (
                <Marker
                  position={[parseFloat(trackingData.route.destination.lat), parseFloat(trackingData.route.destination.lng)]}
                  icon={destinationIcon}
                >
                  <Popup>
                    <strong>🏥 Tujuan:</strong> {trackingData.route.destination.name}<br />
                    Lat: {parseFloat(trackingData.route.destination.lat).toFixed(6)}<br />
                    Lng: {parseFloat(trackingData.route.destination.lng).toFixed(6)}
                  </Popup>
                </Marker>
              )}

              {/* Current Position Marker */}
              {trackingData?.tracking?.latitude && 
               trackingData?.tracking?.longitude && 
               !isNaN(parseFloat(trackingData.tracking.latitude)) && 
               !isNaN(parseFloat(trackingData.tracking.longitude)) && (
                <Marker
                  position={[parseFloat(trackingData.tracking.latitude), parseFloat(trackingData.tracking.longitude)]}
                  icon={ambulanceIcon}
                >
                  <Popup>
                    <strong>🚑 Posisi Ambulans</strong><br />
                    Status: {getStatusText(trackingData.tracking.status)}<br />
                    Lat: {parseFloat(trackingData.tracking.latitude).toFixed(6)}<br />
                    Lng: {parseFloat(trackingData.tracking.longitude).toFixed(6)}
                  </Popup>
                </Marker>
              )}
            </MapContainer>
            
            {selectedSession && trackingData && (
              <div className="tracking-info-panel">
                <div className="info-header">
                  <h3>📍 Info Tracking</h3>
                  <div className="status-badges">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(trackingData.tracking.status) }}
                    >
                      {getStatusText(trackingData.tracking.status)}
                    </span>
                    <span 
                      className="phase-badge"
                      style={{ backgroundColor: getPhaseColor(currentPhase) }}
                    >
                      {isLoadingRoute ? '🔄 Memproses Rute...' : getPhaseText(currentPhase)}
                    </span>
                  </div>
                </div>
                
                <div className="info-content">
                  <div className="info-row">
                    <span>Nomor Rujukan:</span>
                    <span>{trackingData.rujukan.nomor_rujukan}</span>
                  </div>
                  <div className="info-row">
                    <span>Pasien:</span>
                    <span>{trackingData.rujukan.nama_pasien}</span>
                  </div>
                  <div className="info-row">
                    <span>Dari:</span>
                    <span>{trackingData.route.origin.name}</span>
                  </div>
                  <div className="info-row">
                    <span>Ke:</span>
                    <span>{trackingData.route.destination.name}</span>
                  </div>
                  <div className="info-row">
                    <span>Estimasi Waktu:</span>
                    <span>{formatTime(trackingData.tracking.estimated_time)}</span>
                  </div>
                  <div className="info-row">
                    <span>Jarak Tersisa:</span>
                    <span>
                      {trackingData.tracking.estimated_distance && typeof trackingData.tracking.estimated_distance === 'number' 
                        ? `${trackingData.tracking.estimated_distance.toFixed(1)} km`
                        : '-'
                      }
                    </span>
                  </div>
                  {currentPhase === 'going_to_pickup' && trackingData?.tracking?.latitude && trackingData?.route?.origin?.lat && (
                    <div className="info-row">
                      <span>Jarak ke RS Perujuk:</span>
                      <span>
                        {(calculateDistance(
                          parseFloat(trackingData.tracking.latitude),
                          parseFloat(trackingData.tracking.longitude),
                          parseFloat(trackingData.route.origin.lat),
                          parseFloat(trackingData.route.origin.lng)
                        ) / 1000).toFixed(1)} km
                      </span>
                    </div>
                  )}
                  {trackingData.tracking.speed && typeof trackingData.tracking.speed === 'number' && (
                    <div className="info-row">
                      <span>Kecepatan:</span>
                      <span>{trackingData.tracking.speed.toFixed(1)} km/h</span>
                    </div>
                  )}
                  <div className="info-row">
                    <span>Update Terakhir:</span>
                    <span>{new Date(trackingData.tracking.updated_at).toLocaleTimeString()}</span>
                  </div>
                  {routePolyline.length > 2 && (
                    <div className="info-row">
                      <span>Detail Rute:</span>
                      <span>{routePolyline.length} titik koordinat presisi</span>
                    </div>
                  )}
                  {routePolyline.length > 2 && (
                    <div className="info-row">
                      <span>Jenis Rute:</span>
                      <span>🛣️ Mengikuti jalan yang sebenarnya</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TrackingPage;
