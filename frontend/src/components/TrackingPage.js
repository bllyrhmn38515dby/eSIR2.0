import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSocket } from '../context/SocketContext';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './TrackingPage.css';

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom icons
const createCustomIcon = (iconUrl, size = [32, 32]) => {
  return L.icon({
    iconUrl,
    iconSize: size,
    iconAnchor: [size[0] / 2, size[1] / 2],
    popupAnchor: [0, -size[1] / 2]
  });
};

const ambulanceIcon = createCustomIcon('https://maps.google.com/mapfiles/ms/icons/ambulance.png', [40, 40]);
const originIcon = createCustomIcon('https://maps.google.com/mapfiles/ms/icons/green-dot.png', [32, 32]);
const destinationIcon = createCustomIcon('https://maps.google.com/mapfiles/ms/icons/red-dot.png', [32, 32]);

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
      const response = await fetch('/api/tracking/sessions/active', {
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

      // Join tracking room
      if (socket) {
        socket.emit('join-tracking', session.rujukan_id);
      }

      // Load tracking data
      const response = await fetch(`/api/tracking/${session.rujukan_id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setTrackingData(result.data);
        renderMapWithTrackingData(result.data);
      }
    } catch (error) {
      console.error('Error loading tracking data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMapWithTrackingData = (data) => {
    const { tracking, route } = data;

    // Set map center to current position
    if (tracking.latitude && tracking.longitude) {
      setMapCenter([tracking.latitude, tracking.longitude]);
    }

    // Create route polyline
    if (route.origin.lat && route.origin.lng && route.destination.lat && route.destination.lng) {
      const polyline = [
        [route.origin.lat, route.origin.lng],
        [route.destination.lat, route.destination.lng]
      ];
      setRoutePolyline(polyline);
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

                  {session.estimated_time && (
                    <div className="session-estimates">
                      <span>⏱️ {formatTime(session.estimated_time)}</span>
                      <span>📏 {session.estimated_distance?.toFixed(1)} km</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="tracking-map-container">
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
            {trackingData?.route?.origin?.lat && (
              <Marker
                position={[trackingData.route.origin.lat, trackingData.route.origin.lng]}
                icon={originIcon}
              >
                <Popup>
                  <strong>Asal:</strong> {trackingData.route.origin.name}
                </Popup>
              </Marker>
            )}

            {/* Destination Marker */}
            {trackingData?.route?.destination?.lat && (
              <Marker
                position={[trackingData.route.destination.lat, trackingData.route.destination.lng]}
                icon={destinationIcon}
              >
                <Popup>
                  <strong>Tujuan:</strong> {trackingData.route.destination.name}
                </Popup>
              </Marker>
            )}

            {/* Current Position Marker */}
            {trackingData?.tracking?.latitude && (
              <Marker
                position={[trackingData.tracking.latitude, trackingData.tracking.longitude]}
                icon={ambulanceIcon}
              >
                <Popup>
                  <strong>Posisi Ambulans</strong><br />
                  Status: {getStatusText(trackingData.tracking.status)}
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
                  <span>{trackingData.tracking.estimated_distance?.toFixed(1)} km</span>
                </div>
                {trackingData.tracking.speed && (
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
  );
};

export default TrackingPage;
