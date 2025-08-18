import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';
import Layout from './Layout';
import './MapPage.css';

// Fix untuk icon marker Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons untuk faskes
const createCustomIcon = (type) => {
  const iconColors = {
    'RSUD': '#1976d2',
    'Puskesmas': '#388e3c',
    'Klinik': '#f57c00',
    'RS Swasta': '#c2185b'
  };

  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${iconColors[type] || '#666'};
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 10px;
      font-weight: bold;
    ">${type.charAt(0)}</div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

// Komponen untuk update map bounds
const MapBoundsUpdater = ({ faskes }) => {
  const map = useMap();
  
  useEffect(() => {
    if (faskes.length > 0) {
      const bounds = L.latLngBounds(
        faskes
          .filter(f => f.latitude && f.longitude)
          .map(f => [parseFloat(f.latitude), parseFloat(f.longitude)])
      );
      
      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [faskes, map]);

  return null;
};

const MapPage = () => {
  const [faskes, setFaskes] = useState([]);
  const [rujukan, setRujukan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFaskes, setSelectedFaskes] = useState(null);
  const [showRujukanLines, setShowRujukanLines] = useState(true);
  const [error, setError] = useState('');
  const { socket, isConnected } = useSocket();
  const mapRef = useRef();

  const fetchRujukan = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await axios.get('http://localhost:3001/api/rujukan', { headers });
      setRujukan(response.data.data);
    } catch (error) {
      console.error('Error fetching rujukan:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  // Listen untuk realtime updates
  useEffect(() => {
    if (socket) {
      socket.on('rujukan-baru', (data) => {
        // Refresh data rujukan saat ada rujukan baru
        fetchRujukan();
      });

      socket.on('status-update', (data) => {
        // Refresh data rujukan saat ada update status
        fetchRujukan();
      });
    }

    return () => {
      if (socket) {
        socket.off('rujukan-baru');
        socket.off('status-update');
      }
    };
  }, [socket, fetchRujukan]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token tidak ditemukan. Silakan login ulang.');
        setLoading(false);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      
      console.log('Mengambil data faskes dan rujukan...');
      
      const [faskesRes, rujukanRes] = await Promise.all([
        axios.get('http://localhost:3001/api/faskes', { headers }),
        axios.get('http://localhost:3001/api/rujukan', { headers })
      ]);

      console.log(`Berhasil mengambil ${faskesRes.data.data.length} faskes`);
      console.log(`Berhasil mengambil ${rujukanRes.data.data.length} rujukan`);

      setFaskes(faskesRes.data.data);
      setRujukan(rujukanRes.data.data);
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error('Error fetching map data:', error);
      
      if (error.response) {
        // Server responded with error status
        if (error.response.status === 401) {
          setError('Token tidak valid. Silakan login ulang.');
        } else if (error.response.status === 404) {
          setError('Endpoint tidak ditemukan. Pastikan server berjalan.');
        } else {
          setError(`Gagal memuat data peta: ${error.response.data.message || 'Server error'}`);
        }
      } else if (error.request) {
        // Network error
        setError('Tidak dapat terhubung ke server. Pastikan backend berjalan di port 3001.');
      } else {
        // Other error
        setError(`Gagal memuat data peta: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };



  const handleMarkerClick = (faskes) => {
    setSelectedFaskes(faskes);
  };

  const getRujukanLines = () => {
    // Jika checkbox tidak dicentang, return array kosong
    if (!showRujukanLines) {
      console.log('Garis rujukan disembunyikan');
      return [];
    }

    // Filter rujukan yang memiliki faskes asal dan tujuan
    const validRujukan = rujukan.filter(r => r.faskes_asal_id && r.faskes_tujuan_id);
    
    console.log(`Menampilkan ${validRujukan.length} garis rujukan`);

    return validRujukan
      .map(r => {
        const faskesAsal = faskes.find(f => f.id === r.faskes_asal_id);
        const faskesTujuan = faskes.find(f => f.id === r.faskes_tujuan_id);

        // Pastikan kedua faskes memiliki koordinat
        if (faskesAsal?.latitude && faskesAsal?.longitude && 
            faskesTujuan?.latitude && faskesTujuan?.longitude) {
          return {
            id: r.id,
            positions: [
              [parseFloat(faskesAsal.latitude), parseFloat(faskesAsal.longitude)],
              [parseFloat(faskesTujuan.latitude), parseFloat(faskesTujuan.longitude)]
            ],
            rujukan: r
          };
        }
        return null;
      })
      .filter(line => line !== null);
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': '#ffc107',
      'diterima': '#28a745',
      'ditolak': '#dc3545',
      'selesai': '#17a2b8'
    };
    return colors[status] || '#666';
  };

  const getFaskesRujukanCount = (faskesId) => {
    return rujukan.filter(r => 
      r.faskes_asal_id === faskesId || r.faskes_tujuan_id === faskesId
    ).length;
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading">Memuat peta...</div>
      </Layout>
    );
  }

  const validFaskes = faskes.filter(f => f.latitude && f.longitude);
  const rujukanLines = getRujukanLines(); // This will be recalculated when showRujukanLines changes

  return (
    <Layout>
      <div className="map-page">
        <div className="map-header">
          <h1>Peta Interaktif eSIR 2.0</h1>
          <div className="map-controls">
            <div className="connection-status">
              <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
                {isConnected ? '🟢' : '🔴'}
              </span>
              <span>{isConnected ? 'Realtime Aktif' : 'Realtime Terputus'}</span>
            </div>
            <label className="toggle-lines">
              <input
                type="checkbox"
                checked={showRujukanLines}
                onChange={(e) => {
                  console.log('Checkbox garis rujukan:', e.target.checked ? 'ON' : 'OFF');
                  setShowRujukanLines(e.target.checked);
                }}
              />
              Tampilkan Garis Rujukan ({rujukan.filter(r => r.faskes_asal_id && r.faskes_tujuan_id).length} rujukan)
            </label>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <div className="error-content">
              <span>{error}</span>
              <button 
                onClick={() => {
                  setError('');
                  setLoading(true);
                  fetchData();
                }}
                className="retry-btn"
              >
                🔄 Coba Lagi
              </button>
            </div>
          </div>
        )}

        <div className="map-container">
          <MapContainer
            ref={mapRef}
            center={[-6.5950, 106.8166]} // Kota Bogor coordinates
            zoom={10}
            style={{ height: '600px', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* Faskes Markers */}
            {validFaskes.map((faskes) => (
              <Marker
                key={faskes.id}
                position={[parseFloat(faskes.latitude), parseFloat(faskes.longitude)]}
                icon={createCustomIcon(faskes.tipe)}
                eventHandlers={{
                  click: () => handleMarkerClick(faskes)
                }}
              >
                <Popup>
                  <div className="faskes-popup">
                    <h3>{faskes.nama_faskes}</h3>
                    <p><strong>Tipe:</strong> {faskes.tipe}</p>
                    <p><strong>Alamat:</strong> {faskes.alamat}</p>
                    {faskes.telepon && (
                      <p><strong>Telepon:</strong> {faskes.telepon}</p>
                    )}
                    <p><strong>Total Rujukan:</strong> {getFaskesRujukanCount(faskes.id)}</p>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Rujukan Lines */}
            {rujukanLines.length > 0 && (
              <div style={{ display: 'none' }}>
                Debug: Menampilkan {rujukanLines.length} garis rujukan
              </div>
            )}
            {rujukanLines.map((line) => (
              <Polyline
                key={line.id}
                positions={line.positions}
                color={getStatusColor(line.rujukan.status)}
                weight={3}
                opacity={0.7}
              >
                <Popup>
                  <div className="rujukan-popup">
                    <h4>Rujukan #{line.rujukan.nomor_rujukan}</h4>
                    <p><strong>Status:</strong> {line.rujukan.status}</p>
                    <p><strong>Diagnosa:</strong> {line.rujukan.diagnosa}</p>
                    <p><strong>Tanggal:</strong> {new Date(line.rujukan.tanggal_rujukan).toLocaleDateString('id-ID')}</p>
                  </div>
                </Popup>
              </Polyline>
            ))}

            <MapBoundsUpdater faskes={validFaskes} />
          </MapContainer>
        </div>

        {/* Legend */}
        <div className="map-legend">
          <h3>Legenda</h3>
          <div className="legend-items">
            <div className="legend-item">
              <div className="legend-icon rsud"></div>
              <span>RSUD</span>
            </div>
            <div className="legend-item">
              <div className="legend-icon puskesmas"></div>
              <span>Puskesmas</span>
            </div>
            <div className="legend-item">
              <div className="legend-icon klinik"></div>
              <span>Klinik</span>
            </div>
            <div className="legend-item">
              <div className="legend-icon rs-swasta"></div>
              <span>RS Swasta</span>
            </div>
          </div>
          
          <h4>Status Rujukan</h4>
          <div className="legend-items">
            <div className="legend-item">
              <div className="legend-line pending"></div>
              <span>Menunggu</span>
            </div>
            <div className="legend-item">
              <div className="legend-line diterima"></div>
              <span>Diterima</span>
            </div>
            <div className="legend-item">
              <div className="legend-line ditolak"></div>
              <span>Ditolak</span>
            </div>
            <div className="legend-item">
              <div className="legend-line selesai"></div>
              <span>Selesai</span>
            </div>
          </div>
        </div>

        {/* Faskes Details Panel */}
        {selectedFaskes && (
          <div className="faskes-details">
            <div className="details-header">
              <h3>{selectedFaskes.nama_faskes}</h3>
              <button 
                className="close-btn"
                onClick={() => setSelectedFaskes(null)}
              >
                ×
              </button>
            </div>
            <div className="details-content">
              <p><strong>Tipe:</strong> {selectedFaskes.tipe}</p>
              <p><strong>Alamat:</strong> {selectedFaskes.alamat}</p>
              {selectedFaskes.telepon && (
                <p><strong>Telepon:</strong> {selectedFaskes.telepon}</p>
              )}
              <p><strong>Koordinat:</strong> {selectedFaskes.latitude}, {selectedFaskes.longitude}</p>
              
              <h4>Rujukan Terkait</h4>
              <div className="rujukan-list">
                {rujukan
                  .filter(r => r.faskes_asal_id === selectedFaskes.id || r.faskes_tujuan_id === selectedFaskes.id)
                  .slice(0, 5)
                  .map(r => (
                    <div key={r.id} className="rujukan-item">
                      <span className="rujukan-number">{r.nomor_rujukan}</span>
                      <span className={`status-badge ${r.status}`}>{r.status}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MapPage;
