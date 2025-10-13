# ⚡ REAL-TIME FEATURES - SOCKET.IO & GPS TRACKING

## 📋 **OVERVIEW REAL-TIME FEATURES**

Sistem eSIR2.0 menggunakan **Socket.IO** untuk komunikasi real-time dan **GPS tracking** untuk monitoring perjalanan ambulans secara live. Fitur real-time ini memungkinkan update posisi, status rujukan, dan notifikasi secara instan kepada semua pengguna yang terkait.

---

## 🏗️ **ARSITEKTUR REAL-TIME**

### **Teknologi Stack**
- **Real-time Communication**: Socket.IO
- **GPS Tracking**: HTML5 Geolocation API
- **Map Integration**: Leaflet + React-Leaflet
- **Routing**: OSRM (Open Source Routing Machine)
- **Distance Calculation**: Haversine Formula
- **Throttling**: 5 detik untuk GPS updates

### **Komponen Real-time**
```
Real-time System
├── Socket.IO Server (Backend)
│   ├── Authentication
│   ├── Room Management
│   ├── Event Handling
│   └── Broadcasting
├── Socket.IO Client (Frontend)
│   ├── Connection Management
│   ├── Event Listeners
│   └── UI Updates
└── GPS Tracking System
    ├── Position Updates
    ├── Distance Calculation
    ├── Route Optimization
    └── Status Management
```

---

## 🔌 **SOCKET.IO IMPLEMENTATION**

### **Backend Socket.IO Setup**

```javascript
// server.js - Socket.IO server configuration
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Socket.IO authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Authentication error'));
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    socket.userRole = decoded.role;
    socket.faskesId = decoded.faskes_id;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.userId} (${socket.userRole})`);
  
  // Join role-based rooms
  if (socket.userRole === 'admin_pusat') {
    socket.join('admin');
    console.log(`👑 Admin pusat joined admin room`);
  } else if (socket.userRole === 'admin_faskes' && socket.faskesId) {
    socket.join(`faskes-${socket.faskesId}`);
    console.log(`🏥 Admin faskes joined faskes-${socket.faskesId} room`);
  }
  
  // Join tracking room
  socket.on('join-tracking', (rujukanId) => {
    socket.join(`tracking-${rujukanId}`);
    console.log(`🛰️ User ${socket.userId} joined tracking-${rujukanId}`);
  });
  
  // Leave tracking room
  socket.on('leave-tracking', (rujukanId) => {
    socket.leave(`tracking-${rujukanId}`);
    console.log(`🛰️ User ${socket.userId} left tracking-${rujukanId}`);
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`🔌 User disconnected: ${socket.userId}`);
  });
});

// Make io globally available
global.io = io;
```

### **Socket.IO Events**

#### **1. Tracking Update Event**
```javascript
// Emit tracking update to specific room
const emitTrackingUpdate = (rujukanId, trackingData) => {
  if (global.io) {
    global.io.to(`tracking-${rujukanId}`).emit('tracking-update', {
      rujukan_id: rujukanId,
      latitude: trackingData.latitude,
      longitude: trackingData.longitude,
      status: trackingData.status,
      estimated_time: trackingData.estimated_time,
      estimated_distance: trackingData.estimated_distance,
      speed: trackingData.speed,
      heading: trackingData.heading,
      accuracy: trackingData.accuracy,
      battery_level: trackingData.battery_level,
      updated_at: new Date()
    });
    
    console.log(`📍 Tracking update emitted for rujukan ${rujukanId}`);
  }
};
```

#### **2. Rujukan Status Change Event**
```javascript
// Emit status change notification
const emitStatusChange = (rujukanId, oldStatus, newStatus, userId) => {
  if (global.io) {
    // Notify faskes asal dan tujuan
    global.io.emit('rujukan-status-change', {
      rujukan_id: rujukanId,
      old_status: oldStatus,
      new_status: newStatus,
      updated_by: userId,
      timestamp: new Date()
    });
    
    console.log(`📋 Status change emitted: ${oldStatus} → ${newStatus}`);
  }
};
```

#### **3. Notification Event**
```javascript
// Emit general notification
const emitNotification = (userId, message, type = 'info') => {
  if (global.io) {
    global.io.to(`user-${userId}`).emit('notification', {
      message,
      type,
      timestamp: new Date()
    });
    
    console.log(`🔔 Notification sent to user ${userId}`);
  }
};
```

---

## 🛰️ **GPS TRACKING SYSTEM**

### **Frontend GPS Implementation**

```javascript
// AmbulanceTracker.js - GPS tracking implementation
const AmbulanceTracker = () => {
  const [sessionToken, setSessionToken] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);
  const watchIdRef = useRef(null);
  
  // Start GPS tracking
  const startGPSTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setError('GPS tidak didukung oleh browser ini');
      return;
    }
    
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 5000
    };
    
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        updatePosition(position);
      },
      (error) => {
        console.error('GPS Error:', error);
        setError(`GPS Error: ${error.message}`);
      },
      options
    );
    
    console.log('🛰️ GPS tracking started');
  }, [sessionToken]);
  
  // Update position to server
  const updatePosition = useCallback(async (position) => {
    if (!sessionToken) return;
    
    const { latitude, longitude, speed, heading, accuracy } = position.coords;
    const batteryLevel = await getBatteryLevel();
    
    try {
      const response = await fetch('/api/tracking/update-position', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_token: sessionToken,
          latitude,
          longitude,
          status: 'dalam_perjalanan',
          speed: speed || 0,
          heading: heading || null,
          accuracy: accuracy || 0,
          battery_level: batteryLevel
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        setCurrentPosition({ latitude, longitude });
        console.log('📍 Position updated successfully');
      }
    } catch (error) {
      console.error('Error updating position:', error);
    }
  }, [sessionToken]);
  
  // Get battery level
  const getBatteryLevel = useCallback(async () => {
    if ('getBattery' in navigator) {
      try {
        const battery = await navigator.getBattery();
        return Math.round(battery.level * 100);
      } catch (error) {
        console.error('Error getting battery level:', error);
      }
    }
    return null;
  }, []);
  
  // Stop GPS tracking
  const stopTracking = useCallback(() => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    
    setIsTracking(false);
    setSessionToken('');
    setCurrentPosition(null);
    console.log('🛰️ GPS tracking stopped');
  }, []);
  
  return (
    <div className="ambulance-tracker">
      {/* GPS tracking interface */}
    </div>
  );
};
```

### **Backend GPS Processing**

```javascript
// tracking.js - GPS position processing
router.post('/update-position', async (req, res) => {
  try {
    const { 
      session_token, 
      latitude, 
      longitude, 
      status, 
      speed, 
      heading, 
      accuracy, 
      battery_level 
    } = req.body;
    
    // Validate coordinates (Jawa Barat area)
    if (latitude < -7.5 || latitude > -5.5 || longitude < 106.0 || longitude > 108.5) {
      return res.status(400).json({
        success: false,
        message: 'Koordinat di luar area Jawa Barat'
      });
    }
    
    // Get session data
    const [sessionRows] = await db.execute(`
      SELECT ts.*, r.faskes_tujuan_id, ft.latitude as dest_lat, ft.longitude as dest_lng
      FROM tracking_sessions ts
      LEFT JOIN rujukan r ON ts.rujukan_id = r.id
      LEFT JOIN faskes ft ON r.faskes_tujuan_id = ft.id
      WHERE ts.session_token = ? AND ts.is_active = TRUE
    `, [session_token]);
    
    if (sessionRows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Session token tidak valid'
      });
    }
    
    const session = sessionRows[0];
    const rujukan_id = session.rujukan_id;
    
    // Calculate distance and estimated time
    let estimated_distance = null;
    let estimated_time = null;
    
    if (session.dest_lat && session.dest_lng) {
      estimated_distance = calculateDistance(
        latitude, longitude, 
        session.dest_lat, session.dest_lng
      );
      
      const avgSpeed = speed || 30; // Default 30 km/h
      estimated_time = Math.round((estimated_distance / avgSpeed) * 60); // minutes
      
      // Ensure reasonable time estimates
      if (estimated_time < 0) estimated_time = 0;
      if (estimated_time > 1440) estimated_time = 1440; // Max 24 hours
    }
    
    // Update tracking data in database
    await db.execute(`
      UPDATE tracking_data 
      SET latitude = ?, longitude = ?, status = ?, estimated_time = ?, 
          estimated_distance = ?, speed = ?, heading = ?, accuracy = ?, battery_level = ?
      WHERE rujukan_id = ?
    `, [
      latitude, longitude, status || 'dalam_perjalanan', estimated_time,
      estimated_distance, speed || 0, heading || null, accuracy || 0, battery_level || null,
      rujukan_id
    ]);
    
    // Emit real-time update with throttling
    if (global.io) {
      const lastEmitKey = `last_emit_${rujukan_id}`;
      const now = Date.now();
      const lastEmit = global.lastEmitTimes?.[lastEmitKey] || 0;
      
      // Throttle to prevent spam (5 seconds)
      if (now - lastEmit > 5000) {
        global.lastEmitTimes = global.lastEmitTimes || {};
        global.lastEmitTimes[lastEmitKey] = now;
        
        global.io.to(`tracking-${rujukan_id}`).emit('tracking-update', {
          rujukan_id,
          latitude,
          longitude,
          status: status || 'dalam_perjalanan',
          estimated_time,
          estimated_distance,
          speed,
          heading,
          accuracy,
          battery_level,
          updated_at: new Date()
        });
        
        console.log(`📍 Tracking update emitted for rujukan ${rujukan_id} (throttled)`);
      }
    }
    
    res.json({
      success: true,
      message: 'Posisi berhasil diupdate',
      data: {
        estimated_distance,
        estimated_time,
        status: status || 'dalam_perjalanan'
      }
    });
    
  } catch (error) {
    console.error('Error updating position:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate posisi'
    });
  }
});
```

---

## 🗺️ **MAP INTEGRATION & ROUTING**

### **Leaflet Map Component**

```javascript
// TrackingPage.js - Map integration
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

const TrackingPage = () => {
  const [mapCenter, setMapCenter] = useState([-6.5971, 106.8060]);
  const [routePolyline, setRoutePolyline] = useState([]);
  const [trackingData, setTrackingData] = useState(null);
  
  // Custom icons
  const ambulanceIcon = L.divIcon({
    html: `
      <div style="
        width: 40px; height: 40px;
        background: #E66666;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 18px;
      ">
        🚑
      </div>
    `,
    className: 'custom-ambulance-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });
  
  // Calculate distance using Haversine formula
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371000; // Earth radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in meters
  };
  
  // Get precise route using OSRM
  const getPreciseRoute = async (startLat, startLng, endLat, endLng) => {
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`
      );
      
      if (!response.ok) {
        throw new Error(`OSRM API error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.routes && result.routes.length > 0) {
        const route = result.routes[0];
        // Convert [lng, lat] to [lat, lng] for Leaflet
        const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
        console.log('✅ Precise route received from OSRM:', coordinates.length, 'points');
        return coordinates;
      } else {
        console.log('⚠️ No routes found from OSRM');
        return [[startLat, startLng], [endLat, endLng]];
      }
    } catch (error) {
      console.error('Error getting precise route from OSRM:', error);
      return [[startLat, startLng], [endLat, endLng]];
    }
  };
  
  // Socket.IO event listener for real-time updates
  useEffect(() => {
    if (socket) {
      const handleTrackingUpdate = (data) => {
        console.log('📡 Tracking update received:', data);
        if (selectedSession && data.rujukan_id === selectedSession.rujukan_id) {
          setTrackingData(prev => ({ ...prev, ...data }));
          setMapCenter([data.latitude, data.longitude]);
        }
      };
      
      socket.on('tracking-update', handleTrackingUpdate);
      
      return () => {
        socket.off('tracking-update', handleTrackingUpdate);
      };
    }
  }, [socket, selectedSession]);
  
  return (
    <div className="tracking-page">
      <MapContainer center={mapCenter} zoom={12} style={{ height: '600px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
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
          <Marker 
            position={[trackingData.tracking.latitude, trackingData.tracking.longitude]}
            icon={ambulanceIcon}
          >
            <Popup>
              <strong>🚑 Posisi Ambulans</strong><br />
              Status: {trackingData.tracking.status}<br />
              Kecepatan: {trackingData.tracking.speed} km/h<br />
              Baterai: {trackingData.tracking.battery_level}%
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};
```

---

## 🔄 **REAL-TIME COMMUNICATION FLOW**

### **1. Connection Flow**
```
1. User Login → JWT Token Generated
2. Frontend connects to Socket.IO with token
3. Backend validates token and assigns user to rooms
4. User joins role-based rooms (admin, faskes-{id})
5. Connection established and ready for real-time updates
```

### **2. Tracking Flow**
```
1. Petugas starts tracking session → Session token generated
2. GPS device sends position updates every 5 seconds
3. Backend processes coordinates and calculates distance
4. Backend emits tracking-update to tracking-{rujukan_id} room
5. All users in room receive real-time position updates
6. Frontend updates map and UI with new position
```

### **3. Status Update Flow**
```
1. Admin updates rujukan status
2. Backend validates permission and updates database
3. Backend emits rujukan-status-change event
4. All relevant users receive status change notification
5. Frontend updates UI to reflect new status
```

---

## ⚡ **PERFORMANCE OPTIMIZATION**

### **Throttling System**
```javascript
// Throttling GPS updates to prevent spam
const throttleGPSUpdates = (rujukanId, updateFunction) => {
  const lastEmitKey = `last_emit_${rujukanId}`;
  const now = Date.now();
  const lastEmit = global.lastEmitTimes?.[lastEmitKey] || 0;
  
  // Only emit if 5 seconds have passed
  if (now - lastEmit > 5000) {
    global.lastEmitTimes = global.lastEmitTimes || {};
    global.lastEmitTimes[lastEmitKey] = now;
    updateFunction();
  }
};
```

### **Connection Management**
```javascript
// Auto-reconnection for Socket.IO
const setupSocketReconnection = (socket) => {
  socket.on('disconnect', () => {
    console.log('🔌 Socket disconnected, attempting reconnection...');
    
    setTimeout(() => {
      socket.connect();
    }, 2000);
  });
  
  socket.on('reconnect', () => {
    console.log('✅ Socket reconnected successfully');
    // Rejoin rooms after reconnection
    if (socket.userRole === 'admin_pusat') {
      socket.emit('join-admin');
    } else if (socket.userRole === 'admin_faskes') {
      socket.emit('join-faskes', socket.faskesId);
    }
  });
};
```

### **Memory Management**
```javascript
// Cleanup inactive tracking sessions
const cleanupInactiveSessions = async () => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  
  await db.execute(`
    UPDATE tracking_sessions 
    SET is_active = FALSE 
    WHERE last_update < ? AND is_active = TRUE
  `, [oneHourAgo]);
  
  console.log('🧹 Cleaned up inactive tracking sessions');
};

// Run cleanup every hour
setInterval(cleanupInactiveSessions, 60 * 60 * 1000);
```

---

## 🔒 **SECURITY & VALIDATION**

### **Coordinate Validation**
```javascript
// Validate GPS coordinates (Jawa Barat area)
const validateCoordinates = (latitude, longitude) => {
  // Jawa Barat bounds
  const minLat = -7.5;
  const maxLat = -5.5;
  const minLng = 106.0;
  const maxLng = 108.5;
  
  if (latitude < minLat || latitude > maxLat || 
      longitude < minLng || longitude > maxLng) {
    return false;
  }
  
  return true;
};
```

### **Session Token Security**
```javascript
// Generate secure session token
const generateSessionToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Validate session token
const validateSessionToken = async (token) => {
  const [sessions] = await db.execute(
    'SELECT * FROM tracking_sessions WHERE session_token = ? AND is_active = TRUE',
    [token]
  );
  
  return sessions.length > 0 ? sessions[0] : null;
};
```

---

## 📊 **MONITORING & ANALYTICS**

### **Real-time Metrics**
```javascript
// Track real-time performance metrics
const trackMetrics = {
  activeConnections: 0,
  trackingSessions: 0,
  messagesPerSecond: 0,
  averageResponseTime: 0
};

// Update metrics
const updateMetrics = () => {
  trackMetrics.activeConnections = io.engine.clientsCount;
  trackMetrics.trackingSessions = Object.keys(activeTrackingSessions).length;
  
  console.log('📊 Real-time Metrics:', trackMetrics);
};

// Update metrics every 30 seconds
setInterval(updateMetrics, 30000);
```

### **Error Tracking**
```javascript
// Track and log real-time errors
const trackError = (error, context) => {
  console.error('🚨 Real-time Error:', {
    error: error.message,
    context,
    timestamp: new Date(),
    stack: error.stack
  });
  
  // Send to monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Send to external monitoring service
  }
};
```

---

## 🚀 **DEPLOYMENT CONFIGURATION**

### **Environment Variables**
```env
# Socket.IO Configuration
SOCKET_CORS_ORIGIN=http://localhost:3000
SOCKET_PING_TIMEOUT=60000
SOCKET_PING_INTERVAL=25000

# GPS Configuration
GPS_UPDATE_INTERVAL=5000
GPS_THROTTLE_INTERVAL=5000
GPS_VALIDATION_BOUNDS=true

# Real-time Configuration
REALTIME_CLEANUP_INTERVAL=3600000
REALTIME_MAX_CONNECTIONS=1000
REALTIME_MESSAGE_RATE_LIMIT=100
```

### **Production Optimizations**
```javascript
// Production Socket.IO configuration
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"]
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
  maxHttpBufferSize: 1e6,
  allowEIO3: true
});
```

---

## 🎯 **BEST PRACTICES**

### **1. Error Handling**
- Always handle GPS permission errors
- Implement fallback for network failures
- Use try-catch for all async operations

### **2. Performance**
- Throttle GPS updates to prevent spam
- Use connection pooling for database
- Implement proper cleanup for inactive sessions

### **3. Security**
- Validate all GPS coordinates
- Use secure session tokens
- Implement rate limiting for API calls

### **4. User Experience**
- Show loading states during connection
- Provide offline indicators
- Implement auto-reconnection

---

*Dokumentasi Real-time Features eSIR2.0 - Socket.IO & GPS Tracking untuk Monitoring Real-time*
