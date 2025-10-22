import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Layout from './Layout';
import './LaporanPage.css';

const LaporanPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    faskesId: '',
    status: ''
  });
  const [faskes, setFaskes] = useState([]);
  const [data, setData] = useState({});

  const fetchFaskes = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await axios.get('/api/faskes', { headers });
      setFaskes(response.data.data);
    } catch (error) {
      console.error('Error fetching faskes:', error);
    }
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let endpoint = '';
      let params = {};

      switch (activeTab) {
        case 'overview':
          endpoint = '/api/laporan/dashboard-overview';
          break;
        case 'rujukan':
          endpoint = '/api/laporan/rujukan-statistik';
          params = filters;
          break;
        case 'bed':
          endpoint = '/api/laporan/bed-statistik';
          params = { faskesId: filters.faskesId };
          break;
        case 'pasien':
          endpoint = '/api/laporan/pasien-statistik';
          params = { startDate: filters.startDate, endDate: filters.endDate };
          break;
        default:
          break;
      }

      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await axios.get(`http://localhost:3001${endpoint}`, { params, headers });
      setData(response.data.data);
    } catch (error) {
      setError('Gagal memuat data laporan');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, filters]);

  useEffect(() => {
    fetchFaskes();
    fetchData();
  }, [fetchFaskes, fetchData]);

  const handleExport = async (type) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await axios.get(`/api/laporan/export/${type}`, {
        params: filters,
        headers
      });
      
      // Create and download file
      const blob = new Blob([JSON.stringify(response.data.data.data, null, 2)], {
        type: 'application/json'
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = response.data.data.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      setError('Gagal mengekspor data');
      console.error('Error exporting data:', error);
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const formatPercentage = (num) => {
    return `${num || 0}%`;
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID');
  };

  const renderOverview = () => {
    if (!data.overview) return null;

    const { overview, monthlyTrends, topFaskes, bedUtilization } = data;

    return (
      <div className="overview-section">
        {/* Key Metrics */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon">📊</div>
            <div className="metric-content">
              <h3>Total Rujukan</h3>
              <div className="metric-value">{formatNumber(overview.total_rujukan)}</div>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon">✅</div>
            <div className="metric-content">
              <h3>Diterima</h3>
              <div className="metric-value">{formatNumber(overview.diterima)}</div>
              <div className="metric-rate">{formatPercentage(overview.acceptance_rate)}</div>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon">⏳</div>
            <div className="metric-content">
              <h3>Menunggu</h3>
              <div className="metric-value">{formatNumber(overview.pending)}</div>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon">🛏️</div>
            <div className="metric-content">
              <h3>Utilisasi Tempat Tidur</h3>
              <div className="metric-value">
                {bedUtilization?.[0]?.utilization_rate ? 
                  formatPercentage(bedUtilization[0].utilization_rate) : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Trends */}
        {monthlyTrends && (
          <div className="chart-section">
            <h3>Trend Bulanan</h3>
            <div className="trend-chart">
              {monthlyTrends.map((trend, index) => (
                <div key={index} className="trend-bar">
                  <div className="trend-label">{trend.bulan}</div>
                  <div className="trend-bars">
                    <div 
                      className="trend-bar-accepted" 
                      style={{ width: `${(trend.diterima / Math.max(...monthlyTrends.map(t => t.total))) * 100}%` }}
                    >
                      {trend.diterima}
                    </div>
                    <div 
                      className="trend-bar-rejected" 
                      style={{ width: `${(trend.ditolak / Math.max(...monthlyTrends.map(t => t.total))) * 100}%` }}
                    >
                      {trend.ditolak}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Faskes */}
        {topFaskes && (
          <div className="chart-section">
            <h3>Top 5 Faskes</h3>
            <div className="faskes-list">
              {topFaskes.map((faskes, index) => (
                <div key={index} className="faskes-item">
                  <div className="faskes-rank">#{index + 1}</div>
                  <div className="faskes-info">
                    <div className="faskes-name">{faskes.nama_faskes}</div>
                    <div className="faskes-stats">
                      <span>Total: {faskes.total_rujukan}</span>
                      <span>Diterima: {faskes.diterima}</span>
                      <span>Ditolak: {faskes.ditolak}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderRujukanStats = () => {
    if (!data.statistik) return null;

    const { statistik, dailyTrends, faskesPerformance } = data;

    return (
      <div className="rujukan-stats">
        {/* Statistics Overview */}
        <div className="stats-overview">
          <div className="stat-item">
            <label>Total Rujukan</label>
            <span>{formatNumber(statistik.total_rujukan)}</span>
          </div>
          <div className="stat-item">
            <label>Rate Penerimaan</label>
            <span>{formatPercentage(statistik.acceptance_rate)}</span>
          </div>
          <div className="stat-item">
            <label>Rate Penyelesaian</label>
            <span>{formatPercentage(statistik.completion_rate)}</span>
          </div>
          <div className="stat-item">
            <label>Rata-rata Waktu Respon</label>
            <span>{statistik.avg_response_time_hours ? 
              `${Math.round(statistik.avg_response_time_hours)} jam` : 'N/A'}</span>
          </div>
        </div>

        {/* Daily Trends */}
        {dailyTrends && (
          <div className="chart-section">
            <h3>Trend Harian (30 Hari Terakhir)</h3>
            <div className="daily-chart">
              {dailyTrends.slice(0, 7).map((trend, index) => (
                <div key={index} className="daily-bar">
                  <div className="daily-label">{formatDate(trend.tanggal)}</div>
                  <div className="daily-value">{trend.total}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Faskes Performance */}
        {faskesPerformance && (
          <div className="chart-section">
            <h3>Performa Faskes</h3>
            <div className="performance-table">
              <table>
                <thead>
                  <tr>
                    <th>Faskes</th>
                    <th>Total</th>
                    <th>Diterima</th>
                    <th>Ditolak</th>
                    <th>Rate Penerimaan</th>
                    <th>Waktu Respon (jam)</th>
                  </tr>
                </thead>
                <tbody>
                  {faskesPerformance.map((faskes, index) => (
                    <tr key={index}>
                      <td>{faskes.nama_faskes}</td>
                      <td>{faskes.total_rujukan}</td>
                      <td>{faskes.diterima}</td>
                      <td>{faskes.ditolak}</td>
                      <td>{formatPercentage(faskes.acceptance_rate)}</td>
                      <td>{faskes.avg_response_time_hours ? 
                        Math.round(faskes.avg_response_time_hours) : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderBedStats = () => {
    if (!data.overview) return null;

    const { overview, bedByType, faskesBedSummary } = data;

    return (
      <div className="bed-stats">
        {/* Bed Overview */}
        <div className="stats-overview">
          <div className="stat-item">
            <label>Total Tempat Tidur</label>
            <span>{formatNumber(overview.total_bed)}</span>
          </div>
          <div className="stat-item">
            <label>Tersedia</label>
            <span>{formatNumber(overview.tersedia)}</span>
          </div>
          <div className="stat-item">
            <label>Terisi</label>
            <span>{formatNumber(overview.terisi)}</span>
          </div>
          <div className="stat-item">
            <label>Rate Ketersediaan</label>
            <span>{formatPercentage(overview.availability_rate)}</span>
          </div>
        </div>

        {/* Bed by Type */}
        {bedByType && (
          <div className="chart-section">
            <h3>Ketersediaan berdasarkan Tipe</h3>
            <div className="bed-type-chart">
              {bedByType.map((type, index) => (
                <div key={index} className="bed-type-item">
                  <div className="bed-type-header">
                    <span className="bed-type-name">{type.tipe_kamar}</span>
                    <span className="bed-type-total">{type.total}</span>
                  </div>
                  <div className="bed-type-bars">
                    <div 
                      className="bed-bar-available" 
                      style={{ width: `${(type.tersedia / type.total) * 100}%` }}
                    >
                      {type.tersedia}
                    </div>
                    <div 
                      className="bed-bar-occupied" 
                      style={{ width: `${(type.terisi / type.total) * 100}%` }}
                    >
                      {type.terisi}
                    </div>
                    <div 
                      className="bed-bar-maintenance" 
                      style={{ width: `${(type.maintenance / type.total) * 100}%` }}
                    >
                      {type.maintenance}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Faskes Bed Summary */}
        {faskesBedSummary && (
          <div className="chart-section">
            <h3>Ringkasan per Faskes</h3>
            <div className="faskes-bed-table">
              <table>
                <thead>
                  <tr>
                    <th>Faskes</th>
                    <th>Total</th>
                    <th>Tersedia</th>
                    <th>Terisi</th>
                    <th>Rate Ketersediaan</th>
                    <th>Rate Utilisasi</th>
                  </tr>
                </thead>
                <tbody>
                  {faskesBedSummary.map((faskes, index) => (
                    <tr key={index}>
                      <td>{faskes.nama_faskes}</td>
                      <td>{faskes.total_bed}</td>
                      <td>{faskes.tersedia}</td>
                      <td>{faskes.terisi}</td>
                      <td>{formatPercentage(faskes.availability_rate)}</td>
                      <td>{formatPercentage(faskes.utilization_rate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderPasienStats = () => {
    if (!data.overview) return null;

    const { overview, ageDistribution, monthlyRegistration, topPatients } = data;

    return (
      <div className="pasien-stats">
        {/* Patient Overview */}
        <div className="stats-overview">
          <div className="stat-item">
            <label>Total Pasien</label>
            <span>{formatNumber(overview.total_pasien)}</span>
          </div>
          <div className="stat-item">
            <label>Laki-laki</label>
            <span>{formatNumber(overview.laki_laki)}</span>
          </div>
          <div className="stat-item">
            <label>Perempuan</label>
            <span>{formatNumber(overview.perempuan)}</span>
          </div>
          <div className="stat-item">
            <label>Rata-rata Usia</label>
            <span>{overview.avg_age ? Math.round(overview.avg_age) : 'N/A'} tahun</span>
          </div>
        </div>

        {/* Age Distribution */}
        {ageDistribution && (
          <div className="chart-section">
            <h3>Distribusi Usia</h3>
            <div className="age-distribution">
              {ageDistribution.map((age, index) => (
                <div key={index} className="age-item">
                  <div className="age-label">{age.age_group}</div>
                  <div className="age-bar">
                    <div 
                      className="age-bar-fill" 
                      style={{ width: `${(age.total / Math.max(...ageDistribution.map(a => a.total))) * 100}%` }}
                    >
                      {age.total}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Monthly Registration */}
        {monthlyRegistration && (
          <div className="chart-section">
            <h3>Registrasi Bulanan</h3>
            <div className="registration-chart">
              {monthlyRegistration.slice(0, 6).map((reg, index) => (
                <div key={index} className="registration-bar">
                  <div className="registration-label">{reg.bulan}</div>
                  <div className="registration-value">{reg.total_pasien}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Patients */}
        {topPatients && (
          <div className="chart-section">
            <h3>Pasien dengan Rujukan Terbanyak</h3>
            <div className="top-patients">
              {topPatients.map((patient, index) => (
                <div key={index} className="patient-item">
                  <div className="patient-rank">#{index + 1}</div>
                  <div className="patient-info">
                    <div className="patient-name">{patient.nama_pasien}</div>
                    <div className="patient-rm">{patient.no_rm}</div>
                  </div>
                  <div className="patient-stats">
                    <span>Total: {patient.total_rujukan}</span>
                    <span>Diterima: {patient.diterima}</span>
                    <span>Ditolak: {patient.ditolak}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading">Memuat data laporan...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="laporan-page">
        <div className="page-header">
          <h1>Laporan dan Statistik</h1>
          <div className="export-buttons">
            <button onClick={() => handleExport('rujukan')} className="btn btn-outline">
              📊 Export Rujukan
            </button>
            <button onClick={() => handleExport('pasien')} className="btn btn-outline">
              👥 Export Pasien
            </button>
            <button onClick={() => handleExport('tempat-tidur')} className="btn btn-outline">
              🛏️ Export Tempat Tidur
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        {/* Filters */}
        <div className="filters-section">
          <div className="filter-group">
            <label>Tanggal Mulai</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({...filters, startDate: e.target.value})}
            />
          </div>
          <div className="filter-group">
            <label>Tanggal Akhir</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({...filters, endDate: e.target.value})}
            />
          </div>
          <div className="filter-group">
            <label>Faskes</label>
            <select
              value={filters.faskesId}
              onChange={(e) => setFilters({...filters, faskesId: e.target.value})}
            >
              <option value="">Semua Faskes</option>
              {faskes.map(f => (
                <option key={f.id} value={f.id}>{f.nama_faskes}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="">Semua Status</option>
              <option value="pending">Menunggu</option>
              <option value="diterima">Diterima</option>
              <option value="ditolak">Ditolak</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`tab ${activeTab === 'rujukan' ? 'active' : ''}`}
            onClick={() => setActiveTab('rujukan')}
          >
            📋 Statistik Rujukan
          </button>
          <button 
            className={`tab ${activeTab === 'bed' ? 'active' : ''}`}
            onClick={() => setActiveTab('bed')}
          >
            🛏️ Statistik Tempat Tidur
          </button>
          <button 
            className={`tab ${activeTab === 'pasien' ? 'active' : ''}`}
            onClick={() => setActiveTab('pasien')}
          >
            👥 Statistik Pasien
          </button>
        </div>

        {/* Content */}
        <div className="content-section">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'rujukan' && renderRujukanStats()}
          {activeTab === 'bed' && renderBedStats()}
          {activeTab === 'pasien' && renderPasienStats()}
        </div>
      </div>
    </Layout>
  );
};

export default LaporanPage;
