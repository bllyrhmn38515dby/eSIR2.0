import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const { isConnected } = useSocket();
  const { isRefreshing } = useAuth();

  const fetchStats = useCallback(async (retryAttempt = 0) => {
    try {
      setError('');
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Token tidak ditemukan, silakan login ulang');
        setLoading(false);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      
      console.log('📊 Fetching dashboard stats...');
      const response = await axios.get('http://localhost:3001/api/rujukan/stats/overview', { headers });
      
      if (response.data.success) {
        setStats(response.data.data);
        console.log('✅ Stats loaded successfully:', response.data.data);
      } else {
        throw new Error('Response format tidak valid');
      }
    } catch (error) {
      console.error('❌ Error fetching stats:', error);
      
      // Jika error 401 dan masih ada retry attempt, coba lagi
      if (error.response?.status === 401 && retryAttempt < 2) {
        console.log(`🔄 Retrying stats fetch (attempt ${retryAttempt + 1})...`);
        setTimeout(() => {
          fetchStats(retryAttempt + 1);
        }, 1000);
        return;
      }
      
      setError('Gagal memuat statistik dashboard. Silakan refresh halaman.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Retry mechanism
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setLoading(true);
    fetchStats();
  };

  // Loading state dengan refresh indicator
  if (loading || isRefreshing) {
    return (
      <Layout>
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>{isRefreshing ? 'Memperbarui token...' : 'Memuat dashboard...'}</p>
        </div>
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
            <div className="error-content">
              <span className="error-icon">⚠️</span>
              <span className="error-text">{error}</span>
              <button onClick={handleRetry} className="retry-button">
                🔄 Coba Lagi
              </button>
            </div>
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
