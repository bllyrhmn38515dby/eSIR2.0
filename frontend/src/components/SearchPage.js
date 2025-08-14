import React, { useState } from 'react';
import './SearchPage.css';

const SearchPage = () => {
  // const { user } = useAuth(); // Removed unused variable
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('global');
  const [searchResults, setSearchResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('global');
  const [filters, setFilters] = useState({
    jenis_kelamin: '',
    usia_min: '',
    usia_max: '',
    alamat: '',
    status: '',
    faskes_asal: '',
    faskes_tujuan: '',
    tanggal_mulai: '',
    tanggal_akhir: '',
    diagnosa: '',
    tipe_kamar: '',
    tersedia: ''
  });

  // Advanced search filters
  const [advancedFilters, setAdvancedFilters] = useState({
    sort_by: 'nama_pasien',
    sort_order: 'ASC',
    page: 1,
    limit: 20
  });

  const handleGlobalSearch = async () => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      alert('Query minimal 2 karakter');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/search/global?query=${encodeURIComponent(searchQuery)}&type=${searchType}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setSearchResults(data.data);
      } else {
        alert(data.message || 'Gagal melakukan pencarian');
      }
    } catch (error) {
      console.error('Error searching:', error);
      alert('Terjadi kesalahan saat melakukan pencarian');
    } finally {
      setLoading(false);
    }
  };

  const handleAdvancedSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (searchQuery) params.append('query', searchQuery);
      
      // Add filters based on active tab
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });

      // Add pagination and sorting
      Object.keys(advancedFilters).forEach(key => {
        params.append(key, advancedFilters[key]);
      });

      const response = await fetch(`/api/search/${activeTab}?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setSearchResults(data.data);
      } else {
        alert(data.message || 'Gagal melakukan pencarian');
      }
    } catch (error) {
      console.error('Error advanced searching:', error);
      alert('Terjadi kesalahan saat melakukan pencarian');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (activeTab === 'global') {
      handleGlobalSearch();
    } else {
      handleAdvancedSearch();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearFilters = () => {
    setFilters({
      jenis_kelamin: '',
      usia_min: '',
      usia_max: '',
      alamat: '',
      status: '',
      faskes_asal: '',
      faskes_tujuan: '',
      tanggal_mulai: '',
      tanggal_akhir: '',
      diagnosa: '',
      tipe_kamar: '',
      tersedia: ''
    });
    setAdvancedFilters({
      sort_by: 'nama_pasien',
      sort_order: 'ASC',
      page: 1,
      limit: 20
    });
  };

  const renderGlobalSearchResults = () => {
    const totalResults = Object.values(searchResults).reduce((sum, arr) => sum + arr.length, 0);
    
    return (
      <div className="search-results">
        <div className="results-header">
          <h3>Hasil Pencarian Global</h3>
          <span className="results-count">{totalResults} hasil ditemukan</span>
        </div>
        
        {Object.keys(searchResults).map(entityType => {
          const results = searchResults[entityType];
          if (results.length === 0) return null;

          return (
            <div key={entityType} className="entity-results">
              <h4 className="entity-title">
                {entityType === 'pasien' && '👥 Pasien'}
                {entityType === 'rujukan' && '📋 Rujukan'}
                {entityType === 'faskes' && '🏥 Fasilitas Kesehatan'}
                {entityType === 'tempat_tidur' && '🛏️ Tempat Tidur'}
              </h4>
              <div className="results-grid">
                {results.map((item, index) => (
                  <div key={index} className="result-card">
                    {entityType === 'pasien' && (
                      <>
                        <h5>{item.nama_pasien}</h5>
                        <p><strong>No. RM:</strong> {item.no_rm}</p>
                        <p><strong>NIK:</strong> {item.nik}</p>
                        <p><strong>Alamat:</strong> {item.alamat}</p>
                      </>
                    )}
                    {entityType === 'rujukan' && (
                      <>
                        <h5>{item.nomor_rujukan}</h5>
                        <p><strong>Pasien:</strong> {item.nama_pasien}</p>
                        <p><strong>Diagnosa:</strong> {item.diagnosa}</p>
                        <p><strong>Status:</strong> <span className={`status-${item.status}`}>{item.status}</span></p>
                      </>
                    )}
                    {entityType === 'faskes' && (
                      <>
                        <h5>{item.nama_faskes}</h5>
                        <p><strong>Tipe:</strong> {item.tipe_faskes}</p>
                        <p><strong>Alamat:</strong> {item.alamat}</p>
                        <p><strong>Telepon:</strong> {item.telepon}</p>
                      </>
                    )}
                    {entityType === 'tempat_tidur' && (
                      <>
                        <h5>Kamar {item.nomor_kamar} - Bed {item.nomor_bed}</h5>
                        <p><strong>Faskes:</strong> {item.nama_faskes}</p>
                        <p><strong>Tipe:</strong> {item.tipe_kamar}</p>
                        <p><strong>Status:</strong> <span className={`status-${item.status}`}>{item.status}</span></p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderAdvancedSearchResults = () => {
    const data = searchResults.patients || searchResults.referrals || searchResults.beds;
    const pagination = searchResults.pagination;

    if (!data) return null;

    return (
      <div className="search-results">
        <div className="results-header">
          <h3>Hasil Pencarian Lanjutan</h3>
          {pagination && (
            <span className="results-count">
              {pagination.total} hasil (halaman {pagination.page} dari {pagination.total_pages})
            </span>
          )}
        </div>
        
        <div className="results-table">
          <table>
            <thead>
              <tr>
                {activeTab === 'pasien' && (
                  <>
                    <th>Nama Pasien</th>
                    <th>No. RM</th>
                    <th>NIK</th>
                    <th>Usia</th>
                    <th>Jenis Kelamin</th>
                    <th>Alamat</th>
                    <th>Total Rujukan</th>
                  </>
                )}
                {activeTab === 'rujukan' && (
                  <>
                    <th>No. Rujukan</th>
                    <th>Pasien</th>
                    <th>Diagnosa</th>
                    <th>Faskes Asal</th>
                    <th>Faskes Tujuan</th>
                    <th>Status</th>
                    <th>Tanggal</th>
                  </>
                )}
                {activeTab === 'tempat-tidur' && (
                  <>
                    <th>Faskes</th>
                    <th>Kamar</th>
                    <th>Bed</th>
                    <th>Tipe</th>
                    <th>Status</th>
                    <th>Pasien</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  {activeTab === 'pasien' && (
                    <>
                      <td>{item.nama_pasien}</td>
                      <td>{item.no_rm}</td>
                      <td>{item.nik}</td>
                      <td>{item.usia} tahun</td>
                      <td>{item.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                      <td>{item.alamat}</td>
                      <td>{item.total_rujukan || 0}</td>
                    </>
                  )}
                  {activeTab === 'rujukan' && (
                    <>
                      <td>{item.nomor_rujukan}</td>
                      <td>{item.nama_pasien}</td>
                      <td>{item.diagnosa}</td>
                      <td>{item.faskes_asal}</td>
                      <td>{item.faskes_tujuan}</td>
                      <td><span className={`status-${item.status}`}>{item.status}</span></td>
                      <td>{new Date(item.tanggal_rujukan).toLocaleDateString('id-ID')}</td>
                    </>
                  )}
                  {activeTab === 'tempat-tidur' && (
                    <>
                      <td>{item.nama_faskes}</td>
                      <td>{item.nomor_kamar}</td>
                      <td>{item.nomor_bed}</td>
                      <td>{item.tipe_kamar}</td>
                      <td><span className={`status-${item.status}`}>{item.status}</span></td>
                      <td>{item.nama_pasien || '-'}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pagination && (
          <div className="pagination">
            <button 
              disabled={pagination.page <= 1}
              onClick={() => {
                setAdvancedFilters(prev => ({ ...prev, page: prev.page - 1 }));
              }}
            >
              Sebelumnya
            </button>
            <span>Halaman {pagination.page} dari {pagination.total_pages}</span>
            <button 
              disabled={pagination.page >= pagination.total_pages}
              onClick={() => {
                setAdvancedFilters(prev => ({ ...prev, page: prev.page + 1 }));
              }}
            >
              Selanjutnya
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderFilters = () => {
    if (activeTab === 'global') return null;

    return (
      <div className="search-filters">
        <h4>Filter Pencarian</h4>
        
        {activeTab === 'pasien' && (
          <div className="filter-group">
            <div className="filter-row">
              <div className="filter-item">
                <label>Jenis Kelamin:</label>
                <select 
                  value={filters.jenis_kelamin} 
                  onChange={(e) => setFilters(prev => ({ ...prev, jenis_kelamin: e.target.value }))}
                >
                  <option value="">Semua</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
              <div className="filter-item">
                <label>Usia Min:</label>
                <input 
                  type="number" 
                  value={filters.usia_min}
                  onChange={(e) => setFilters(prev => ({ ...prev, usia_min: e.target.value }))}
                  placeholder="0"
                />
              </div>
              <div className="filter-item">
                <label>Usia Max:</label>
                <input 
                  type="number" 
                  value={filters.usia_max}
                  onChange={(e) => setFilters(prev => ({ ...prev, usia_max: e.target.value }))}
                  placeholder="100"
                />
              </div>
            </div>
            <div className="filter-item">
              <label>Alamat:</label>
              <input 
                type="text" 
                value={filters.alamat}
                onChange={(e) => setFilters(prev => ({ ...prev, alamat: e.target.value }))}
                placeholder="Masukkan alamat"
              />
            </div>
          </div>
        )}

        {activeTab === 'rujukan' && (
          <div className="filter-group">
            <div className="filter-row">
              <div className="filter-item">
                <label>Status:</label>
                <select 
                  value={filters.status} 
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="">Semua</option>
                  <option value="pending">Pending</option>
                  <option value="diterima">Diterima</option>
                  <option value="ditolak">Ditolak</option>
                  <option value="selesai">Selesai</option>
                </select>
              </div>
              <div className="filter-item">
                <label>Faskes Asal:</label>
                <input 
                  type="text" 
                  value={filters.faskes_asal}
                  onChange={(e) => setFilters(prev => ({ ...prev, faskes_asal: e.target.value }))}
                  placeholder="Nama faskes asal"
                />
              </div>
              <div className="filter-item">
                <label>Faskes Tujuan:</label>
                <input 
                  type="text" 
                  value={filters.faskes_tujuan}
                  onChange={(e) => setFilters(prev => ({ ...prev, faskes_tujuan: e.target.value }))}
                  placeholder="Nama faskes tujuan"
                />
              </div>
            </div>
            <div className="filter-row">
              <div className="filter-item">
                <label>Tanggal Mulai:</label>
                <input 
                  type="date" 
                  value={filters.tanggal_mulai}
                  onChange={(e) => setFilters(prev => ({ ...prev, tanggal_mulai: e.target.value }))}
                />
              </div>
              <div className="filter-item">
                <label>Tanggal Akhir:</label>
                <input 
                  type="date" 
                  value={filters.tanggal_akhir}
                  onChange={(e) => setFilters(prev => ({ ...prev, tanggal_akhir: e.target.value }))}
                />
              </div>
              <div className="filter-item">
                <label>Diagnosa:</label>
                <input 
                  type="text" 
                  value={filters.diagnosa}
                  onChange={(e) => setFilters(prev => ({ ...prev, diagnosa: e.target.value }))}
                  placeholder="Masukkan diagnosa"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tempat-tidur' && (
          <div className="filter-group">
            <div className="filter-row">
              <div className="filter-item">
                <label>Status:</label>
                <select 
                  value={filters.status} 
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="">Semua</option>
                  <option value="tersedia">Tersedia</option>
                  <option value="terisi">Terisi</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="reserved">Reserved</option>
                </select>
              </div>
              <div className="filter-item">
                <label>Tipe Kamar:</label>
                <select 
                  value={filters.tipe_kamar} 
                  onChange={(e) => setFilters(prev => ({ ...prev, tipe_kamar: e.target.value }))}
                >
                  <option value="">Semua</option>
                  <option value="VIP">VIP</option>
                  <option value="Kelas 1">Kelas 1</option>
                  <option value="Kelas 2">Kelas 2</option>
                  <option value="Kelas 3">Kelas 3</option>
                  <option value="ICU">ICU</option>
                  <option value="NICU">NICU</option>
                  <option value="PICU">PICU</option>
                </select>
              </div>
              <div className="filter-item">
                <label>Tersedia:</label>
                <select 
                  value={filters.tersedia} 
                  onChange={(e) => setFilters(prev => ({ ...prev, tersedia: e.target.value }))}
                >
                  <option value="">Semua</option>
                  <option value="true">Ya</option>
                  <option value="false">Tidak</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="filter-actions">
          <button onClick={clearFilters} className="clear-filters-btn">
            Bersihkan Filter
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>🔍 Pencarian</h1>
        <p>Cari data pasien, rujukan, faskes, dan tempat tidur dengan mudah</p>
      </div>

      <div className="search-container">
        <div className="search-tabs">
          <button 
            className={`tab ${activeTab === 'global' ? 'active' : ''}`}
            onClick={() => setActiveTab('global')}
          >
            Pencarian Global
          </button>
          <button 
            className={`tab ${activeTab === 'pasien' ? 'active' : ''}`}
            onClick={() => setActiveTab('pasien')}
          >
            Pencarian Pasien
          </button>
          <button 
            className={`tab ${activeTab === 'rujukan' ? 'active' : ''}`}
            onClick={() => setActiveTab('rujukan')}
          >
            Pencarian Rujukan
          </button>
          <button 
            className={`tab ${activeTab === 'tempat-tidur' ? 'active' : ''}`}
            onClick={() => setActiveTab('tempat-tidur')}
          >
            Pencarian Tempat Tidur
          </button>
        </div>

        <div className="search-input-section">
          <div className="search-input-group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                activeTab === 'global' ? 'Cari pasien, rujukan, faskes, atau tempat tidur...' :
                activeTab === 'pasien' ? 'Cari berdasarkan nama, no. RM, atau NIK...' :
                activeTab === 'rujukan' ? 'Cari berdasarkan no. rujukan, diagnosa, atau nama pasien...' :
                'Cari berdasarkan nomor kamar, bed, atau nama faskes...'
              }
              className="search-input"
            />
            {activeTab === 'global' && (
              <select 
                value={searchType} 
                onChange={(e) => setSearchType(e.target.value)}
                className="search-type-select"
              >
                <option value="global">Semua</option>
                <option value="pasien">Pasien</option>
                <option value="rujukan">Rujukan</option>
                <option value="faskes">Faskes</option>
                <option value="tempat-tidur">Tempat Tidur</option>
              </select>
            )}
            <button 
              onClick={handleSearch} 
              disabled={loading}
              className="search-btn"
            >
              {loading ? '🔍 Mencari...' : '🔍 Cari'}
            </button>
          </div>
        </div>

        {renderFilters()}

        {Object.keys(searchResults).length > 0 && (
          activeTab === 'global' ? renderGlobalSearchResults() : renderAdvancedSearchResults()
        )}

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Sedang mencari...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
