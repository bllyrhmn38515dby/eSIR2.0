import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';
import Layout from './Layout';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isConnected } = useSocket();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await axios.get('http://localhost:3001/api/rujukan/stats/overview', { headers });
      setStats(response.data.data);
    } catch (error) {
      setError('Gagal memuat statistik dashboard');
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading">Memuat dashboard...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="dashboard-page">
        <div className="page-header">
          <h1>Dashboard</h1>
          <div className="connection-status">
            <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
              {isConnected ? '🟢' : '🔴'}
            </span>
            <span className="status-text">
              {isConnected ? 'Realtime Aktif' : 'Realtime Terputus'}
            </span>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon total">📊</div>
            <div className="stat-content">
              <h3>Total Rujukan</h3>
              <p className="stat-number">{stats?.total || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon pending">⏳</div>
            <div className="stat-content">
              <h3>Menunggu</h3>
              <p className="stat-number">{stats?.pending || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon accepted">✅</div>
            <div className="stat-content">
              <h3>Diterima</h3>
              <p className="stat-number">{stats?.diterima || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon rejected">❌</div>
            <div className="stat-content">
              <h3>Ditolak</h3>
              <p className="stat-number">{stats?.ditolak || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon completed">🏁</div>
            <div className="stat-content">
              <h3>Selesai</h3>
              <p className="stat-number">{stats?.selesai || 0}</p>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="welcome-card">
            <h2>Selamat Datang di eSIR 2.0</h2>
            <p>
              Sistem Informasi Rujukan Online - Dashboard untuk{' '}
              <strong>Administrator</strong>
            </p>
            {isConnected && (
              <div className="realtime-info">
                <span className="realtime-badge">🔄 Realtime Aktif</span>
                <p>Statistik akan diperbarui secara otomatis saat ada perubahan data</p>
              </div>
            )}
          </div>

          <div className="info-cards">
            <div className="info-card">
              <h3>Fitur yang Tersedia</h3>
              <p>👤 Manajemen Pasien</p>
              <p>📋 Sistem Rujukan</p>
              <p>🏥 Manajemen Faskes</p>
              <p>🔔 Notifikasi Realtime</p>
              <p>🗺️ Dashboard Peta (Coming Soon)</p>
            </div>

            <div className="info-card">
              <h3>Quick Actions</h3>
              <p>➕ Tambah pasien baru</p>
              <p>📝 Buat rujukan</p>
              <p>👁️ Lihat daftar rujukan</p>
              <p>📈 Monitor statistik</p>
              <p>🔔 Cek notifikasi</p>
            </div>
          </div>

          <div className="coming-soon">
            <h3>🚧 Fitur Sedang Dalam Pengembangan</h3>
            <p>Dashboard lengkap dengan fitur realtime, peta interaktif, dan laporan detail akan segera hadir!</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
