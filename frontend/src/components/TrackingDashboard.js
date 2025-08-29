import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useSocket } from '../context/SocketContext';
import './TrackingDashboard.css';

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom icons untuk tracking
const createCustomIcon = (color, size = [32, 32]) => {
  return L.divIcon({
    html: `
      <div style="
        width: ${size[0]}px; 
        height: ${size[1]}px; 
        background: ${color}; 
        border: 3px solid white; 
        border-radius: 50%; 
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
      ">
        🚑
      </div>
    `,
    className: 'custom-marker',
    iconSize: size,
    iconAnchor: [size[0] / 2, size[1] / 2],
    popupAnchor: [0, -size[1] / 2]
  });
};

// Custom icons untuk tracking (defined but not used in current implementation)
// const ambulanceIcon = createCustomIcon('#e74c3c', [40, 40]);
// const originIcon = createCustomIcon('#27ae60', [32, 32]);
// const destinationIcon = createCustomIcon('#f39c12', [32, 32]);

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

// Component untuk real-time tracking marker
const TrackingMarker = ({ trackingData, session }) => {
  const [position, setPosition] = useState([trackingData.latitude, trackingData.longitude]);
  const [status, setStatus] = useState(trackingData.status);

  useEffect(() => {
    setPosition([trackingData.latitude, trackingData.longitude]);
    setStatus(trackingData.status);
  }, [trackingData]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'menunggu': return '#3498db';
      case 'dijemput': return '#f39c12';
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
      case 'tiba': return 'Tiba';
      default: return 'Unknown';
    }
  };

  return (
    <Marker 
      position={position} 
      icon={createCustomIcon(getStatusColor(status), [40, 40])}
    >
      <Popup>
        <div className="tracking-popup">
          <h4>🚑 {session.nama_pasien}</h4>
          <p><strong>Status:</strong> {getStatusText(status)}</p>
          <p><strong>Rujukan:</strong> {session.nomor_rujukan}</p>
          <p><strong>Dari:</strong> {session.faskes_asal_nama}</p>
          <p><strong>Ke:</strong> {session.faskes_tujuan_nama}</p>
          {trackingData.estimated_distance && (
            <p><strong>Jarak:</strong> {Number(trackingData.estimated_distance).toFixed(2)} km</p>
          )}
          {trackingData.estimated_time && (
            <p><strong>Waktu:</strong> {trackingData.estimated_time} menit</p>
          )}
          {trackingData.speed && (
            <p><strong>Kecepatan:</strong> {Number(trackingData.speed).toFixed(1)} km/h</p>
          )}
          {trackingData.battery_level && (
            <p><strong>Baterai:</strong> {trackingData.battery_level}%</p>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

const TrackingDashboard = () => {
  const { socket } = useSocket();
  const [activeSessions, setActiveSessions] = useState([]);
  const [trackingData, setTrackingData] = useState({});
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState([-6.5971, 106.8060]); // Kota Bogor
  const [selectedSession, setSelectedSession] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    menunggu: 0,
    dijemput: 0,
    dalam_perjalanan: 0,
    tiba: 0
  });
  const mapRef = useRef(null);

  // Load active sessions
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
        
        // Calculate stats
        const statsData = {
          total: result.data.length,
          menunggu: result.data.filter(s => s.tracking_status === 'menunggu').length,
          dijemput: result.data.filter(s => s.tracking_status === 'dijemput').length,
          dalam_perjalanan: result.data.filter(s => s.tracking_status === 'dalam_perjalanan').length,
          tiba: result.data.filter(s => s.tracking_status === 'tiba').length
        };
        setStats(statsData);

        // Load tracking data for each session
        for (const session of result.data) {
          await loadTrackingData(session.rujukan_id);
        }
      }
    } catch (error) {
      console.error('Error loading active sessions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load tracking data for specific session
  const loadTrackingData = async (rujukanId) => {
    try {
      const response = await fetch(`/api/tracking/${rujukanId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setTrackingData(prev => ({
          ...prev,
          [rujukanId]: result.data.tracking
        }));
      }
    } catch (error) {
      console.error('Error loading tracking data:', error);
    }
  };

  // Socket.IO real-time updates
  useEffect(() => {
    if (socket) {
      const handleTrackingUpdate = (data) => {
        console.log('📡 Real-time tracking update:', data);
        setTrackingData(prev => ({
          ...prev,
          [data.rujukan_id]: data
        }));

        // Update stats
        setStats(prev => {
          const newStats = { ...prev };
          // Update based on new status
          return newStats;
        });
      };

      socket.on('tracking-update', handleTrackingUpdate);
      socket.emit('join-admin'); // Join admin room for all updates

      return () => {
        socket.off('tracking-update', handleTrackingUpdate);
      };
    }
  }, [socket]);

  // Load data on mount
  useEffect(() => {
    loadActiveSessions();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadActiveSessions, 30000);
    return () => clearInterval(interval);
  }, [loadActiveSessions]);

  const handleSessionClick = (session) => {
    setSelectedSession(session);
    if (trackingData[session.rujukan_id]) {
      const data = trackingData[session.rujukan_id];
      setMapCenter([data.latitude, data.longitude]);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'menunggu': return '#3498db';
      case 'dijemput': return '#f39c12';
      case 'dalam_perjalanan': return '#e74c3c';
      case 'tiba': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  return (
    <div className="tracking-dashboard">
      <div className="dashboard-header">
        <h1>🚑 eSIR2.0 Tracking Dashboard</h1>
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Active</div>
          </div>
          <div className="stat-card" style={{ backgroundColor: '#3498db' }}>
            <div className="stat-number">{stats.menunggu}</div>
            <div className="stat-label">Menunggu</div>
          </div>
          <div className="stat-card" style={{ backgroundColor: '#f39c12' }}>
            <div className="stat-number">{stats.dijemput}</div>
            <div className="stat-label">Dijemput</div>
          </div>
          <div className="stat-card" style={{ backgroundColor: '#e74c3c' }}>
            <div className="stat-number">{stats.dalam_perjalanan}</div>
            <div className="stat-label">Dalam Perjalanan</div>
          </div>
          <div className="stat-card" style={{ backgroundColor: '#27ae60' }}>
            <div className="stat-number">{stats.tiba}</div>
            <div className="stat-label">Tiba</div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="map-container">
          <MapContainer
            center={mapCenter}
            zoom={12}
            style={{ height: '600px', width: '100%' }}
            ref={mapRef}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {/* Render tracking markers */}
            {activeSessions.map(session => {
              const data = trackingData[session.rujukan_id];
              if (data && data.latitude && data.longitude) {
                return (
                  <TrackingMarker
                    key={session.rujukan_id}
                    trackingData={data}
                    session={session}
                  />
                );
              }
              return null;
            })}

            {/* Route polylines */}
            {activeSessions.map(session => {
              const data = trackingData[session.rujukan_id];
              if (data && data.latitude && data.longitude) {
                // Create route from current position to destination
                const route = [
                  [data.latitude, data.longitude],
                  [session.faskes_tujuan_lat || data.latitude, session.faskes_tujuan_lng || data.longitude]
                ];
                
                return (
                  <Polyline
                    key={`route-${session.rujukan_id}`}
                    positions={route}
                    color="#e74c3c"
                    weight={3}
                    opacity={0.7}
                  />
                );
              }
              return null;
            })}

            <MapUpdater center={mapCenter} />
          </MapContainer>
        </div>

        <div className="sessions-panel">
          <h3>📋 Active Sessions</h3>
          {loading ? (
            <div className="loading">Loading sessions...</div>
          ) : (
            <div className="sessions-list">
              {activeSessions.map(session => {
                const data = trackingData[session.rujukan_id];
                const isSelected = selectedSession?.rujukan_id === session.rujukan_id;
                
                return (
                  <div
                    key={session.rujukan_id}
                    className={`session-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSessionClick(session)}
                  >
                    <div className="session-header">
                      <div 
                        className="status-indicator"
                        style={{ backgroundColor: getStatusColor(session.tracking_status) }}
                      />
                      <div className="session-info">
                        <h4>{session.nama_pasien}</h4>
                        <p>{session.nomor_rujukan}</p>
                      </div>
                    </div>
                    
                    <div className="session-details">
                      <p><strong>Dari:</strong> {session.faskes_asal_nama}</p>
                      <p><strong>Ke:</strong> {session.faskes_tujuan_nama}</p>
                      <p><strong>Status:</strong> {session.tracking_status}</p>
                      {data && (
                        <>
                          {data.estimated_distance && (
                            <p><strong>Jarak:</strong> {Number(data.estimated_distance).toFixed(2)} km</p>
                          )}
                          {data.estimated_time && (
                            <p><strong>Waktu:</strong> {data.estimated_time} menit</p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {activeSessions.length === 0 && (
                <div className="no-sessions">
                  <p>📭 Tidak ada session tracking aktif</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackingDashboard;
