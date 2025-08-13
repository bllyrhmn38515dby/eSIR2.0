import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import './TrackingPage.css';

const TrackingPage = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const [activeSessions, setActiveSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [map, setMap] = useState(null);
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const mapRef = useRef(null);

  // Initialize Google Maps
  useEffect(() => {
    const initMap = () => {
      if (window.google && mapRef.current) {
        const mapInstance = new window.google.maps.Map(mapRef.current, {
          center: { lat: -6.5971, lng: 106.8060 }, // Kota Bogor center
          zoom: 12,
          styles: [
            {
              featureType: 'poi.medical',
              elementType: 'labels',
              stylers: [{ visibility: 'on' }]
            }
          ]
        });

        const directionsServiceInstance = new window.google.maps.DirectionsService();
        const directionsRendererInstance = new window.google.maps.DirectionsRenderer({
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: '#4285F4',
            strokeWeight: 5,
            strokeOpacity: 0.8
          }
        });

        directionsRendererInstance.setMap(mapInstance);

        setMap(mapInstance);
        setDirectionsService(directionsServiceInstance);
        setDirectionsRenderer(directionsRendererInstance);
      }
    };

    // Load Google Maps script
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=geometry,places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }
  }, []);

  // Load active tracking sessions
  useEffect(() => {
    loadActiveSessions();
  }, []);

  // Socket.IO events untuk real-time updates
  useEffect(() => {
    if (socket) {
      socket.on('tracking-update', (data) => {
        if (selectedSession && data.rujukan_id === selectedSession.rujukan_id) {
          setTrackingData(prev => ({ ...prev, ...data }));
          updateMapWithNewPosition(data);
        }
      });

      return () => {
        socket.off('tracking-update');
      };
    }
  }, [socket, selectedSession]);

  const loadActiveSessions = async () => {
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
  };

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
    if (!map || !directionsService || !directionsRenderer) return;

    const { tracking, rujukan, route } = data;

    // Clear existing markers
    if (window.trackingMarkers) {
      window.trackingMarkers.forEach(marker => marker.setMap(null));
    }
    window.trackingMarkers = [];

    // Add origin marker
    if (route.origin.lat && route.origin.lng) {
      const originMarker = new window.google.maps.Marker({
        position: { lat: route.origin.lat, lng: route.origin.lng },
        map: map,
        title: route.origin.name,
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
          scaledSize: new window.google.maps.Size(32, 32)
        },
        label: 'A'
      });
      window.trackingMarkers.push(originMarker);
    }

    // Add destination marker
    if (route.destination.lat && route.destination.lng) {
      const destMarker = new window.google.maps.Marker({
        position: { lat: route.destination.lat, lng: route.destination.lng },
        map: map,
        title: route.destination.name,
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
          scaledSize: new window.google.maps.Size(32, 32)
        },
        label: 'B'
      });
      window.trackingMarkers.push(destMarker);
    }

    // Add current position marker
    if (tracking.latitude && tracking.longitude) {
      const currentMarker = new window.google.maps.Marker({
        position: { lat: tracking.latitude, lng: tracking.longitude },
        map: map,
        title: 'Posisi Ambulans',
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/ambulance.png',
          scaledSize: new window.google.maps.Size(40, 40)
        }
      });
      window.trackingMarkers.push(currentMarker);

      // Center map on current position
      map.setCenter({ lat: tracking.latitude, lng: tracking.longitude });
    }

    // Draw route
    if (route.origin.lat && route.origin.lng && route.destination.lat && route.destination.lng) {
      const request = {
        origin: { lat: route.origin.lat, lng: route.origin.lng },
        destination: { lat: route.destination.lat, lng: route.destination.lng },
        travelMode: window.google.maps.TravelMode.DRIVING
      };

      directionsService.route(request, (result, status) => {
        if (status === 'OK') {
          directionsRenderer.setDirections(result);
        }
      });
    }
  };

  const updateMapWithNewPosition = (data) => {
    if (!map || !window.trackingMarkers) return;

    // Update current position marker
    const currentMarker = window.trackingMarkers.find(marker => 
      marker.getTitle() === 'Posisi Ambulans'
    );

    if (currentMarker) {
      currentMarker.setPosition({ lat: data.latitude, lng: data.longitude });
      
      // Add rotation if heading is available
      if (data.heading) {
        currentMarker.setIcon({
          url: 'https://maps.google.com/mapfiles/ms/icons/ambulance.png',
          scaledSize: new window.google.maps.Size(40, 40),
          rotation: data.heading
        });
      }
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
          <div ref={mapRef} className="tracking-map" />
          
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
