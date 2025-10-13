# LAMPIRAN C: FRONTEND COMPONENT IMPLEMENTATION

## C.1 Komponen SearchPage Utama

```javascript
// File: frontend/src/components/SearchPage.js
import React, { useState } from 'react';
import Layout from './Layout';
import './SearchPage.css';

const SearchPage = () => {
  // State management untuk pencarian
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('global');
  const [searchResults, setSearchResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('global');
  
  // State untuk filter termasuk spesialisasi
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
    tersedia: '',
    tipe: '',
    spesialisasi: ''  // Filter spesialisasi
  });

  // State untuk autocomplete spesialisasi
  const [spesialisasiSuggestions, setSpesialisasiSuggestions] = useState([]);
  const [showSpesialisasiSuggestions, setShowSpesialisasiSuggestions] = useState(false);

  return (
    <Layout>
      <div className="search-page">
        {/* Konten halaman pencarian */}
      </div>
    </Layout>
  );
};

export default SearchPage;
```

## C.2 Fungsi Global Search

```javascript
// Fungsi untuk pencarian global dengan spesialisasi
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
```

## C.3 Fungsi Advanced Search

```javascript
// Fungsi untuk pencarian advanced dengan filter spesialisasi
const handleAdvancedSearch = async () => {
  setLoading(true);
  try {
    const params = new URLSearchParams();
    
    if (searchQuery) params.append('query', searchQuery);
    
    // Add filters berdasarkan active tab
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
```

## C.4 Fungsi Autocomplete Spesialisasi

```javascript
// Fungsi untuk fetch autocomplete spesialisasi
const fetchSpesialisasiSuggestions = async (query) => {
  if (query.length < 2) {
    setSpesialisasiSuggestions([]);
    setShowSpesialisasiSuggestions(false);
    return;
  }

  try {
    const response = await fetch(`/api/search/autocomplete/spesialisasi?query=${encodeURIComponent(query)}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    const data = await response.json();
    if (data.success) {
      setSpesialisasiSuggestions(data.data);
      setShowSpesialisasiSuggestions(true);
    }
  } catch (error) {
    console.error('Error fetching spesialisasi suggestions:', error);
  }
};

// Handler untuk input change spesialisasi
const handleSpesialisasiInputChange = (e) => {
  const value = e.target.value;
  setFilters(prev => ({ ...prev, spesialisasi: value }));
  fetchSpesialisasiSuggestions(value);
};

// Handler untuk select spesialisasi dari autocomplete
const selectSpesialisasi = (spesialisasi) => {
  setFilters(prev => ({ ...prev, spesialisasi: spesialisasi.nama_spesialisasi }));
  setShowSpesialisasiSuggestions(false);
};
```

## C.5 Render Filter Spesialisasi

```javascript
// Render filter untuk tab faskes dengan spesialisasi
const renderFilters = () => {
  if (activeTab === 'global') return null;

  return (
    <div className="search-filters">
      <h4>Filter Pencarian</h4>
      
      {/* Filter untuk tab faskes */}
      {activeTab === 'faskes' && (
        <div className="filter-group">
          <div className="filter-row">
            <div className="filter-item">
              <label>Tipe Faskes:</label>
              <select 
                value={filters.tipe} 
                onChange={(e) => setFilters(prev => ({ ...prev, tipe: e.target.value }))}
              >
                <option value="">Semua</option>
                <option value="RSUD">RSUD</option>
                <option value="RS Swasta">RS Swasta</option>
                <option value="Puskesmas">Puskesmas</option>
                <option value="Klinik">Klinik</option>
              </select>
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
          <div className="filter-item">
            <label>Spesialisasi:</label>
            <div className="autocomplete-container">
              <input 
                type="text" 
                value={filters.spesialisasi}
                onChange={handleSpesialisasiInputChange}
                onFocus={() => {
                  if (filters.spesialisasi.length >= 2) {
                    setShowSpesialisasiSuggestions(true);
                  }
                }}
                onBlur={() => {
                  setTimeout(() => setShowSpesialisasiSuggestions(false), 200);
                }}
                placeholder="Cari spesialisasi (contoh: Bedah, Jantung, Paru)"
              />
              {showSpesialisasiSuggestions && spesialisasiSuggestions.length > 0 && (
                <div className="autocomplete-suggestions">
                  {spesialisasiSuggestions.map((spesialisasi, index) => (
                    <div 
                      key={index}
                      className="suggestion-item"
                      onClick={() => selectSpesialisasi(spesialisasi)}
                    >
                      <div className="suggestion-label">{spesialisasi.label}</div>
                      <div className="suggestion-subtitle">{spesialisasi.subtitle}</div>
                    </div>
                  ))}
                </div>
              )}
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
```

## C.6 Render Hasil Pencarian

```javascript
// Render hasil pencarian advanced dengan spesialisasi
const renderAdvancedSearchResults = () => {
  const data = searchResults.patients || searchResults.referrals || searchResults.beds || searchResults.facilities;
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
              {activeTab === 'faskes' && (
                <>
                  <th>Nama Faskes</th>
                  <th>Tipe</th>
                  <th>Alamat</th>
                  <th>Telepon</th>
                  <th>Spesialisasi</th>
                  <th>Jumlah Spesialisasi</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                {activeTab === 'faskes' && (
                  <>
                    <td>{item.nama_faskes}</td>
                    <td>{item.tipe_faskes}</td>
                    <td>{item.alamat}</td>
                    <td>{item.telepon}</td>
                    <td>
                      <div className="spesialisasi-list">
                        {item.spesialisasi ? (
                          item.spesialisasi.split(', ').slice(0, 3).map((spec, idx) => (
                            <span key={idx} className="spesialisasi-tag">
                              {spec}
                            </span>
                          ))
                        ) : (
                          <span className="no-spec">Tidak ada data</span>
                        )}
                        {item.spesialisasi && item.spesialisasi.split(', ').length > 3 && (
                          <span className="more-spec">
                            +{item.spesialisasi.split(', ').length - 3} lainnya
                          </span>
                        )}
                      </div>
                    </td>
                    <td>{item.jumlah_spesialisasi || 0}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
```

## C.7 Input Search dengan Type Selector

```javascript
// Render input search dengan type selector
const renderSearchInput = () => (
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
          activeTab === 'faskes' ? 'Cari berdasarkan nama faskes, alamat, atau spesialisasi...' :
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
);
```

## C.8 Tab Navigation

```javascript
// Render tab navigation
const renderTabs = () => (
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
      className={`tab ${activeTab === 'faskes' ? 'active' : ''}`}
      onClick={() => setActiveTab('faskes')}
    >
      Pencarian Faskes
    </button>
    <button 
      className={`tab ${activeTab === 'tempat-tidur' ? 'active' : ''}`}
      onClick={() => setActiveTab('tempat-tidur')}
    >
      Pencarian Tempat Tidur
    </button>
  </div>
);
```

## C.9 Event Handlers

```javascript
// Handler untuk key press (Enter)
const handleKeyPress = (e) => {
  if (e.key === 'Enter') {
    handleSearch();
  }
};

// Handler untuk search button
const handleSearch = () => {
  if (activeTab === 'global') {
    handleGlobalSearch();
  } else {
    handleAdvancedSearch();
  }
};

// Handler untuk clear filters
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
    tersedia: '',
    tipe: '',
    spesialisasi: ''
  });
  setAdvancedFilters({
    sort_by: 'nama_pasien',
    sort_order: 'ASC',
    page: 1,
    limit: 20
  });
};
```

## C.10 Main Render Function

```javascript
// Main render function
return (
  <Layout>
    <div className="search-page">
      <div className="search-header">
        <h1>🔍 Pencarian</h1>
        <p>Cari data pasien, rujukan, faskes, dan tempat tidur dengan mudah</p>
      </div>

      <div className="search-container">
        {renderTabs()}
        {renderSearchInput()}
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
  </Layout>
);
```

## C.11 State Management Summary

```javascript
// State yang digunakan dalam komponen
const [searchQuery, setSearchQuery] = useState('');           // Query pencarian
const [searchType, setSearchType] = useState('global');       // Tipe pencarian global
const [searchResults, setSearchResults] = useState({});       // Hasil pencarian
const [loading, setLoading] = useState(false);                // Status loading
const [activeTab, setActiveTab] = useState('global');         // Tab aktif
const [filters, setFilters] = useState({...});                // Filter pencarian
const [spesialisasiSuggestions, setSpesialisasiSuggestions] = useState([]); // Autocomplete
const [showSpesialisasiSuggestions, setShowSpesialisasiSuggestions] = useState(false);
```

**Fitur Utama:**
- Pencarian global dan advanced
- Filter berdasarkan spesialisasi
- Autocomplete real-time
- Pagination dan sorting
- Responsive design
- Error handling
- Loading states
