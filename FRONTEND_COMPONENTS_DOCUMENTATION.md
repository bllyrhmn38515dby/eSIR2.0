# 🎨 FRONTEND COMPONENTS - INTERFACE PENGGUNA

## 📋 **OVERVIEW FRONTEND COMPONENTS**

Frontend eSIR2.0 dibangun dengan **React.js** dan menyediakan interface pengguna yang intuitif berdasarkan **User-Centered Design (UCD)** dengan 22 responden dari 3 rumah sakit. Sistem menggunakan **Custom Design System** dengan komponen yang responsif dan user-friendly.

---

## 🏗️ **ARSITEKTUR FRONTEND**

### **Teknologi Stack**
- **Framework**: React.js 18+
- **Routing**: React Router DOM
- **State Management**: Context API + useState/useEffect
- **UI Components**: Custom Design System
- **Real-time**: Socket.IO Client
- **Maps**: Leaflet + React-Leaflet
- **Styling**: CSS Modules + Custom CSS
- **Port**: 3000

### **Struktur Direktori**
```
frontend/src/
├── components/          # UI Components
│   ├── medical/        # Medical-specific components
│   ├── ui/             # Reusable UI components
│   └── *.js            # Page components
├── context/            # React Context providers
├── hooks/              # Custom hooks
├── utils/              # Helper functions
├── styles/             # Global styles
└── assets/             # Static assets
```

---

## 🎯 **CORE PAGE COMPONENTS**

### **1. Layout Component (`Layout.js`)**
**Fungsi**: Wrapper utama dengan sidebar navigation dan responsive design

```javascript
// Layout.js - Main layout wrapper
const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  
  return (
    <div className="layout">
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        user={user}
        onLogout={logout}
      />
      <main className="main-content">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <div className="content">
          {children}
        </div>
      </main>
    </div>
  );
};
```

**Fitur**:
- ✅ Responsive sidebar navigation
- ✅ Role-based menu items
- ✅ User profile dropdown
- ✅ Mobile-friendly design

---

### **2. Enhanced Rujukan Page (`EnhancedRujukanPage.js`)**
**Fungsi**: Interface utama untuk manajemen rujukan dengan multi-step form

```javascript
// EnhancedRujukanPage.js - Main referral management
const EnhancedRujukanPage = () => {
  const [rujukan, setRujukan] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedRujukan, setSelectedRujukan] = useState(null);
  
  return (
    <Layout>
      <div className="enhanced-rujukan-page">
        {/* Header dengan tombol buat rujukan */}
        <div className="header-card">
          <h1>🏥 Manajemen Rujukan</h1>
          <button onClick={() => setShowForm(true)}>
            📋 Buat Rujukan Baru
          </button>
        </div>
        
        {/* Statistics Cards */}
        <div className="stat-container">
          <StatCard icon="📋" value={rujukan.length} label="Total Rujukan" />
          <StatCard icon="⏳" value={pendingCount} label="Menunggu" />
          <StatCard icon="✅" value={completedCount} label="Selesai" />
          <StatCard icon="🚑" value={ambulanceCount} label="Ambulans" />
        </div>
        
        {/* Rujukan Table */}
        <RujukanTable 
          data={rujukan}
          onViewDetail={setSelectedRujukan}
          onUpdateStatus={handleStatusUpdate}
          onCancel={handleCancel}
        />
        
        {/* Multi-Step Form Modal */}
        {showForm && (
          <Modal>
            <MultiStepReferralForm
              mode="create"
              onSubmit={handleFormSubmit}
              onCancel={() => setShowForm(false)}
            />
          </Modal>
        )}
      </div>
    </Layout>
  );
};
```

**Fitur**:
- ✅ Multi-step referral form
- ✅ Real-time statistics
- ✅ Status management (update/cancel)
- ✅ Document management
- ✅ Search & filter

---

### **3. Multi-Step Referral Form (`MultiStepReferralForm.js`)**
**Fungsi**: Form bertahap untuk input rujukan dengan validasi

```javascript
// MultiStepReferralForm.js - 5-step referral form
const MultiStepReferralForm = ({ mode, onSubmit, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Data Rujukan
    tanggalRujukan: '',
    waktuRujukan: '',
    
    // Step 2: Data Pasien
    pasienId: '',
    namaPasien: '',
    tanggalLahirPasien: '',
    jenisKelaminPasien: 'L',
    alamatPasien: '',
    teleponPasien: '',
    
    // Step 3: Data Pengirim & Penerima
    faskesPengirim: '',
    faskesPenerima: '',
    
    // Step 4: Data Medis
    diagnosis: '',
    keluhan: '',
    pemeriksaanFisik: '',
    
    // Step 5: Data Transportasi & Status
    jenisTransportasi: 'ambulance',
    kondisiPasien: 'stable',
    prioritas: 'P3'
  });
  
  const steps = [
    { id: 1, title: 'Data Rujukan', component: <Step1Rujukan /> },
    { id: 2, title: 'Data Pasien', component: <Step2Pasien /> },
    { id: 3, title: 'Faskes', component: <Step3Faskes /> },
    { id: 4, title: 'Data Medis', component: <Step4Medis /> },
    { id: 5, title: 'Transportasi', component: <Step5Transportasi /> }
  ];
  
  return (
    <div className="multi-step-form">
      {/* Progress Bar */}
      <div className="progress-bar">
        {steps.map((step, index) => (
          <div 
            key={step.id}
            className={`step ${currentStep > step.id ? 'completed' : ''} ${currentStep === step.id ? 'active' : ''}`}
          >
            <div className="step-number">{step.id}</div>
            <div className="step-title">{step.title}</div>
          </div>
        ))}
      </div>
      
      {/* Step Content */}
      <div className="step-content">
        {steps[currentStep - 1].component}
      </div>
      
      {/* Navigation */}
      <div className="step-navigation">
        <button 
          onClick={() => setCurrentStep(currentStep - 1)}
          disabled={currentStep === 1}
        >
          ← Sebelumnya
        </button>
        
        {currentStep === steps.length ? (
          <button onClick={handleSubmit} className="btn-primary">
            ✅ Submit Rujukan
          </button>
        ) : (
          <button 
            onClick={() => setCurrentStep(currentStep + 1)}
            className="btn-primary"
          >
            Selanjutnya →
          </button>
        )}
      </div>
    </div>
  );
};
```

**5 Tahap Form**:
1. **Data Rujukan** - Tanggal, waktu, prioritas
2. **Data Pasien** - NIK, nama, alamat, telepon
3. **Faskes** - Pengirim dan penerima
4. **Data Medis** - Diagnosa, keluhan, pemeriksaan
5. **Transportasi** - Jenis transport, kondisi pasien

---

### **4. Tracking Page (`TrackingPage.js`)**
**Fungsi**: Real-time GPS tracking dengan peta interaktif

```javascript
// TrackingPage.js - Real-time GPS tracking
const TrackingPage = () => {
  const { socket } = useSocket();
  const [activeSessions, setActiveSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [trackingData, setTrackingData] = useState(null);
  const [mapCenter, setMapCenter] = useState([-6.5971, 106.8060]);
  const [routePolyline, setRoutePolyline] = useState([]);
  
  return (
    <Layout>
      <div className="tracking-page">
        <div className="tracking-header">
          <h1>🛰️ Real-Time Route Tracking</h1>
          <p>Monitor perjalanan ambulans dan pasien secara real-time</p>
        </div>
        
        <div className="tracking-container">
          {/* Sidebar - Active Sessions */}
          <div className="tracking-sidebar">
            <h3>📋 Sesi Tracking Aktif</h3>
            <div className="sessions-list">
              {activeSessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  isSelected={selectedSession?.id === session.id}
                  onClick={() => selectSession(session)}
                />
              ))}
            </div>
          </div>
          
          {/* Map Container */}
          <div className="tracking-map-container">
            <MapContainer center={mapCenter} zoom={12}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              
              {/* Route Polyline */}
              {routePolyline.length > 0 && (
                <Polyline
                  positions={routePolyline}
                  color="#4285F4"
                  weight={6}
                  opacity={0.8}
                />
              )}
              
              {/* Origin Marker */}
              {trackingData?.route?.origin && (
                <Marker position={[trackingData.route.origin.lat, trackingData.route.origin.lng]}>
                  <Popup>🏥 {trackingData.route.origin.name}</Popup>
                </Marker>
              )}
              
              {/* Destination Marker */}
              {trackingData?.route?.destination && (
                <Marker position={[trackingData.route.destination.lat, trackingData.route.destination.lng]}>
                  <Popup>🎯 {trackingData.route.destination.name}</Popup>
                </Marker>
              )}
              
              {/* Ambulance Marker */}
              {trackingData?.tracking && (
                <Marker position={[trackingData.tracking.latitude, trackingData.tracking.longitude]}>
                  <Popup>🚑 Posisi Ambulans</Popup>
                </Marker>
              )}
            </MapContainer>
            
            {/* Tracking Info Panel */}
            {selectedSession && trackingData && (
              <TrackingInfoPanel 
                session={selectedSession}
                trackingData={trackingData}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};
```

**Fitur**:
- ✅ Real-time GPS tracking
- ✅ Interactive map dengan Leaflet
- ✅ Precise routing dengan OSRM
- ✅ Multiple tracking sessions
- ✅ Chat integration

---

### **5. Ambulance Tracker (`AmbulanceTracker.js`)**
**Fungsi**: Interface untuk petugas ambulans

```javascript
// AmbulanceTracker.js - Interface untuk petugas ambulans
const AmbulanceTracker = () => {
  const [sessionToken, setSessionToken] = useState('');
  const [rujukanId, setRujukanId] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [trackingData, setTrackingData] = useState(null);
  
  const startTrackingSession = async () => {
    try {
      const response = await fetch('/api/tracking/start-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          rujukan_id: rujukanId,
          device_id: navigator.userAgent
        })
      });
      
      const result = await response.json();
      setSessionToken(result.data.session_token);
      setTrackingData(result.data.rujukan);
      setIsTracking(true);
      startGPSTracking();
    } catch (error) {
      console.error('Error starting tracking session:', error);
    }
  };
  
  const updatePosition = useCallback(async (position) => {
    if (!sessionToken) return;
    
    const { latitude, longitude } = position.coords;
    const batteryLevel = await getBatteryLevel();
    
    try {
      await fetch('/api/tracking/update-position', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_token: sessionToken,
          latitude,
          longitude,
          status: 'dalam_perjalanan',
          speed: position.coords.speed || 0,
          heading: position.coords.heading || null,
          accuracy: position.coords.accuracy || 0,
          battery_level: batteryLevel
        })
      });
      
      setCurrentPosition({ latitude, longitude });
    } catch (error) {
      console.error('Error updating position:', error);
    }
  }, [sessionToken]);
  
  return (
    <Layout>
      <div className="ambulance-tracker">
        <div className="tracker-header">
          <h1>🚑 Ambulance Tracker</h1>
          <p>Interface untuk petugas ambulans</p>
        </div>
        
        <div className="tracker-content">
          {/* Session Control */}
          <div className="session-control">
            <select 
              value={rujukanId} 
              onChange={(e) => setRujukanId(e.target.value)}
            >
              <option value="">Pilih Rujukan</option>
              {rujukanList.map(rujukan => (
                <option key={rujukan.id} value={rujukan.id}>
                  {rujukan.nomor_rujukan} - {rujukan.nama_pasien}
                </option>
              ))}
            </select>
            
            <button 
              onClick={startTrackingSession}
              disabled={!rujukanId || isTracking}
              className="btn-primary"
            >
              {isTracking ? '🔄 Tracking...' : '▶️ Start Tracking'}
            </button>
          </div>
          
          {/* Current Position */}
          {currentPosition && (
            <div className="position-info">
              <h3>📍 Posisi Saat Ini</h3>
              <p>Lat: {currentPosition.latitude.toFixed(6)}</p>
              <p>Lng: {currentPosition.longitude.toFixed(6)}</p>
            </div>
          )}
          
          {/* Tracking Data */}
          {trackingData && (
            <div className="tracking-info">
              <h3>📋 Info Rujukan</h3>
              <p><strong>Pasien:</strong> {trackingData.nama_pasien}</p>
              <p><strong>Dari:</strong> {trackingData.faskes_asal_nama}</p>
              <p><strong>Ke:</strong> {trackingData.faskes_tujuan_nama}</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
```

**Fitur**:
- ✅ GPS session management
- ✅ Real-time position updates
- ✅ Battery level monitoring
- ✅ Manual position input
- ✅ Status updates

---

## 🧩 **REUSABLE UI COMPONENTS**

### **1. Button Component**
```javascript
// ui/Button.js
const Button = ({ 
  variant = 'primary', 
  size = 'medium', 
  children, 
  onClick, 
  disabled,
  className = '',
  ...props 
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
```

### **2. Modal Component**
```javascript
// ui/Modal.js
const Modal = ({ isOpen, onClose, title, children, size = 'medium' }) => {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content modal-${size}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};
```

### **3. Status Badge Component**
```javascript
// ui/StatusBadge.js
const StatusBadge = ({ status, size = 'medium' }) => {
  const statusConfig = {
    'pending': { text: 'Menunggu', class: 'status-menunggu' },
    'diterima': { text: 'Diterima', class: 'status-diterima' },
    'ditolak': { text: 'Ditolak', class: 'status-ditolak' },
    'selesai': { text: 'Selesai', class: 'status-selesai' },
    'dibatalkan': { text: 'Dibatalkan', class: 'status-dibatalkan' }
  };
  
  const config = statusConfig[status] || { text: status, class: 'status-default' };
  
  return (
    <span className={`status-badge status-badge-${size} ${config.class}`}>
      {config.text}
    </span>
  );
};
```

### **4. Input Component**
```javascript
// ui/Input.js
const Input = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  required,
  placeholder,
  ...props 
}) => {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`form-input ${error ? 'error' : ''}`}
        {...props}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};
```

---

## 🎨 **DESIGN SYSTEM**

### **Color Palette**
```css
:root {
  /* Primary Colors */
  --primary-blue: #4285F4;
  --primary-green: #34A853;
  --primary-red: #EA4335;
  --primary-orange: #FBBC04;
  
  /* Status Colors */
  --status-pending: #FFA500;
  --status-accepted: #34A853;
  --status-rejected: #EA4335;
  --status-completed: #4285F4;
  --status-cancelled: #666666;
  
  /* Neutral Colors */
  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-200: #E5E7EB;
  --gray-300: #D1D5DB;
  --gray-400: #9CA3AF;
  --gray-500: #6B7280;
  --gray-600: #4B5563;
  --gray-700: #374151;
  --gray-800: #1F2937;
  --gray-900: #111827;
}
```

### **Typography**
```css
/* Font Family */
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* Font Sizes */
.text-xs { font-size: 0.75rem; }
.text-sm { font-size: 0.875rem; }
.text-base { font-size: 1rem; }
.text-lg { font-size: 1.125rem; }
.text-xl { font-size: 1.25rem; }
.text-2xl { font-size: 1.5rem; }
.text-3xl { font-size: 1.875rem; }
```

### **Spacing System**
```css
/* Spacing Scale */
.space-1 { margin: 0.25rem; }
.space-2 { margin: 0.5rem; }
.space-3 { margin: 0.75rem; }
.space-4 { margin: 1rem; }
.space-6 { margin: 1.5rem; }
.space-8 { margin: 2rem; }
.space-12 { margin: 3rem; }
.space-16 { margin: 4rem; }
```

---

## 📱 **RESPONSIVE DESIGN**

### **Breakpoints**
```css
/* Mobile First Approach */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### **Grid System**
```css
.grid {
  display: grid;
  gap: 1rem;
}

.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }

@media (min-width: 768px) {
  .md\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .md\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
```

---

## 🔄 **STATE MANAGEMENT**

### **Context API Usage**
```javascript
// context/AuthContext.js
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const login = async (credentials) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

---

## 🎯 **USER EXPERIENCE FEATURES**

### **Loading States**
```javascript
// Loading spinner component
const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => (
  <div className={`loading-spinner loading-${size}`}>
    <div className="spinner"></div>
    <p>{text}</p>
  </div>
);
```

### **Error Handling**
```javascript
// Error boundary component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Oops! Terjadi kesalahan</h2>
          <p>Silakan refresh halaman atau hubungi administrator.</p>
          <button onClick={() => window.location.reload()}>
            Refresh Halaman
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

### **Toast Notifications**
```javascript
// Toast notification system
const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);
  
  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  };
  
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      ))}
    </div>
  );
};
```

---

## 🚀 **PERFORMANCE OPTIMIZATION**

### **Code Splitting**
```javascript
// Lazy loading components
const TrackingPage = lazy(() => import('./TrackingPage'));
const AmbulanceTracker = lazy(() => import('./AmbulanceTracker'));

// Usage with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <TrackingPage />
</Suspense>
```

### **Memoization**
```javascript
// Memoized components
const RujukanCard = memo(({ rujukan, onUpdateStatus }) => {
  return (
    <div className="rujukan-card">
      <h3>{rujukan.nomor_rujukan}</h3>
      <p>{rujukan.nama_pasien}</p>
      <button onClick={() => onUpdateStatus(rujukan.id)}>
        Update Status
      </button>
    </div>
  );
});
```

### **Virtual Scrolling**
```javascript
// For large lists
import { FixedSizeList as List } from 'react-window';

const RujukanList = ({ rujukan }) => (
  <List
    height={600}
    itemCount={rujukan.length}
    itemSize={80}
    itemData={rujukan}
  >
    {({ index, style, data }) => (
      <div style={style}>
        <RujukanCard rujukan={data[index]} />
      </div>
    )}
  </List>
);
```

---

## 🔧 **DEVELOPMENT TOOLS**

### **Component Testing**
```javascript
// Jest + React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

test('renders button with correct text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});

test('calls onClick when clicked', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  
  fireEvent.click(screen.getByText('Click me'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### **Storybook Stories**
```javascript
// Button.stories.js
export default {
  title: 'UI/Button',
  component: Button,
};

export const Primary = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};
```

---

*Dokumentasi Frontend Components eSIR2.0 - Interface Pengguna yang User-Friendly dan Responsif*
