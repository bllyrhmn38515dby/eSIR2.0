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

// Custom icons dengan fallback yang lebih baik
const createCustomIcon = (iconUrl, size = [32, 32], className = '') => {
  return L.icon({
    iconUrl,
    iconSize: size,
    iconAnchor: [size[0] / 2, size[1] / 2],
    popupAnchor: [0, -size[1] / 2],
    className: className
  });
};

// Icons dengan fallback yang lebih reliable
const ambulanceIcon = createCustomIcon(
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iMjAiIGZpbGw9IiNFNjY2NjYiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiIHg9IjgiIHk9IjgiPgo8cGF0aCBkPSJNMTIgMkMxMy4xIDIgMTQgMi45IDE0IDRWMTRIMThWNEgxNkMxNiAyLjkgMTUuMSAyIDE0IDJIMTJaIi8+CjxwYXRoIGQ9Ik0xOCAxNkgyMFYxOEgyMlYyMEgyMlYyMkgyMFYyNEgxOFYyMkgxNlYyMEgxNlYxOEgxOFYxNloiLz4KPHN2Zz4KPC9zdmc+', 
  [40, 40], 
  'custom-ambulance-icon'
);

const originIcon = createCustomIcon(
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTIiIGZpbGw9IiMzNEE4NTMiLz4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iNiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+', 
  [32, 32], 
  'custom-origin-icon'
);

const destinationIcon = createCustomIcon(
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTIiIGZpbGw9IiNGRjM0MzQiLz4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iNiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+', 
  [32, 32], 
  'custom-destination-icon'
);

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
  const mapRef = useRef(null);

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
        renderMapWithTrackingData(result.data);
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

  const renderMapWithTrackingData = (data) => {
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

    // Create route polyline with better validation
    if (route.origin.lat && route.origin.lng && route.destination.lat && route.destination.lng &&
        !isNaN(parseFloat(route.origin.lat)) && !isNaN(parseFloat(route.origin.lng)) &&
        !isNaN(parseFloat(route.destination.lat)) && !isNaN(parseFloat(route.destination.lng))) {
      
      const polyline = [
        [parseFloat(route.origin.lat), parseFloat(route.origin.lng)],
        [parseFloat(route.destination.lat), parseFloat(route.destination.lng)]
      ];
      setRoutePolyline(polyline);
      console.log('🛣️ Route polyline created:', polyline);
    } else {
      console.log('⚠️ Cannot create route polyline - missing or invalid coordinates');
      console.log('Origin:', { lat: route.origin.lat, lng: route.origin.lng });
      console.log('Destination:', { lat: route.destination.lat, lng: route.destination.lng });
      setRoutePolyline([]);
    }
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

              {/* Route Polyline */}
              {routePolyline.length > 0 && (
                <Polyline
                  positions={routePolyline}
                  color="#4285F4"
                  weight={5}
                  opacity={0.8}
                />
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
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(trackingData.tracking.status) }}
                  >
                    {getStatusText(trackingData.tracking.status)}
                  </span>
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
