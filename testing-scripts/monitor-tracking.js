const io = require('socket.io-client');
const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:3001';
const API_URL = `${BASE_URL}/api`;

// Test credentials
const credentials = {
  username: 'admin_pusat',
  password: 'admin123'
};

let authToken = null;
let socket = null;

// Utility functions
const log = (message, type = 'INFO') => {
  const timestamp = new Date().toISOString();
  const emoji = {
    'INFO': 'ℹ️',
    'SUCCESS': '✅',
    'ERROR': '❌',
    'WARNING': '⚠️',
    'TRACKING': '🛰️',
    'SOCKET': '🔌'
  };
  console.log(`${emoji[type]} [${timestamp}] ${message}`);
};

// Authentication
async function authenticate() {
  try {
    log('Authenticating...', 'INFO');
    
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    
    if (response.data.success) {
      authToken = response.data.token;
      log(`Authenticated as: ${response.data.user.nama_lengkap}`, 'SUCCESS');
      return true;
    } else {
      log('Authentication failed', 'ERROR');
      return false;
    }
  } catch (error) {
    log(`Authentication error: ${error.message}`, 'ERROR');
    return false;
  }
}

// Connect to Socket.IO
function connectSocket() {
  return new Promise((resolve, reject) => {
    log('Connecting to Socket.IO...', 'SOCKET');
    
    socket = io(BASE_URL, {
      auth: { token: authToken },
      timeout: 10000
    });

    socket.on('connect', () => {
      log('Socket.IO connected successfully', 'SUCCESS');
      resolve(true);
    });

    socket.on('connect_error', (error) => {
      log(`Socket.IO connection error: ${error.message}`, 'ERROR');
      reject(error);
    });

    socket.on('disconnect', (reason) => {
      log(`Socket.IO disconnected: ${reason}`, 'WARNING');
    });

    // Timeout
    setTimeout(() => {
      if (!socket.connected) {
        log('Socket.IO connection timeout', 'ERROR');
        reject(new Error('Connection timeout'));
      }
    }, 10000);
  });
}

// Monitor tracking updates
function monitorTrackingUpdates() {
  log('Starting tracking updates monitoring...', 'TRACKING');
  
  // Listen for tracking updates
  socket.on('tracking-update', (data) => {
    log(`🛰️ Tracking Update for Rujukan ${data.rujukan_id}:`, 'TRACKING');
    log(`   Position: ${data.latitude}, ${data.longitude}`, 'INFO');
    log(`   Status: ${data.status}`, 'INFO');
    log(`   Distance: ${data.estimated_distance} km`, 'INFO');
    log(`   Time: ${data.estimated_time} minutes`, 'INFO');
    log(`   Speed: ${data.speed} km/h`, 'INFO');
    log(`   Battery: ${data.battery_level}%`, 'INFO');
    log(`   Updated: ${data.updated_at}`, 'INFO');
    console.log('   ──────────────────────────────────────');
  });

  // Join admin room to receive all updates
  socket.emit('join-admin');
  log('Joined admin room for global monitoring', 'SOCKET');
}

// Get active tracking sessions
async function getActiveSessions() {
  try {
    log('Fetching active tracking sessions...', 'INFO');
    
    const response = await axios.get(`${API_URL}/tracking/sessions/active`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    if (response.data.success) {
      const sessions = response.data.data;
      log(`Found ${sessions.length} active tracking sessions`, 'SUCCESS');
      
      sessions.forEach((session, index) => {
        log(`Session ${index + 1}:`, 'INFO');
        log(`   Rujukan: ${session.nomor_rujukan}`, 'INFO');
        log(`   Pasien: ${session.nama_pasien}`, 'INFO');
        log(`   Petugas: ${session.petugas_nama}`, 'INFO');
        log(`   Status: ${session.tracking_status}`, 'INFO');
        log(`   Position: ${session.latitude}, ${session.longitude}`, 'INFO');
        log(`   Started: ${session.started_at}`, 'INFO');
        console.log('   ──────────────────────────────────────');
        
        // Join tracking room for this session
        socket.emit('join-tracking', session.rujukan_id);
        log(`Joined tracking room for rujukan ${session.rujukan_id}`, 'SOCKET');
      });
      
      return sessions;
    } else {
      log('No active sessions found', 'INFO');
      return [];
    }
  } catch (error) {
    log(`Error fetching active sessions: ${error.message}`, 'ERROR');
    return [];
  }
}

// Simulate tracking updates (for testing)
async function simulateTrackingUpdates() {
  log('Starting tracking simulation...', 'TRACKING');
  
  const testCoordinates = [
    { lat: -6.5971, lng: 106.8060, status: 'menunggu' },
    { lat: -6.5960, lng: 106.8070, status: 'dijemput' },
    { lat: -6.5950, lng: 106.8080, status: 'dalam_perjalanan' },
    { lat: -6.5940, lng: 106.8090, status: 'dalam_perjalanan' },
    { lat: -6.5930, lng: 106.8100, status: 'tiba' }
  ];

  // Get active sessions first
  const sessions = await getActiveSessions();
  
  if (sessions.length === 0) {
    log('No active sessions to simulate', 'WARNING');
    return;
  }

  const session = sessions[0]; // Use first active session
  
  for (let i = 0; i < testCoordinates.length; i++) {
    const coord = testCoordinates[i];
    
    try {
      const response = await axios.post(`${API_URL}/tracking/update-position`, {
        session_token: session.session_token,
        latitude: coord.lat,
        longitude: coord.lng,
        status: coord.status,
        speed: 30 + Math.random() * 20,
        heading: Math.floor(Math.random() * 360),
        accuracy: 3.0 + Math.random() * 4.0,
        battery_level: 85 - (i * 2)
      });

      if (response.data.success) {
        log(`Simulated update ${i + 1}/${testCoordinates.length}: ${coord.status}`, 'SUCCESS');
      } else {
        log(`Simulation update ${i + 1} failed: ${response.data.message}`, 'ERROR');
      }
    } catch (error) {
      log(`Simulation error: ${error.message}`, 'ERROR');
    }
    
    // Wait 3 seconds between updates
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  log('Tracking simulation completed', 'SUCCESS');
}

// Main monitoring function
async function startMonitoring() {
  log('🚀 Starting eSIR2.0 Tracking Monitor', 'INFO');
  log('====================================', 'INFO');
  
  try {
    // Step 1: Authenticate
    if (!await authenticate()) {
      log('Cannot proceed without authentication', 'ERROR');
      return;
    }
    
    // Step 2: Connect to Socket.IO
    await connectSocket();
    
    // Step 3: Set up monitoring
    monitorTrackingUpdates();
    
    // Step 4: Get current active sessions
    await getActiveSessions();
    
    // Step 5: Start simulation (optional)
    log('\nPress Ctrl+C to stop monitoring', 'INFO');
    log('Starting simulation in 5 seconds...', 'INFO');
    
    setTimeout(async () => {
      await simulateTrackingUpdates();
    }, 5000);
    
    // Keep the process running
    process.on('SIGINT', () => {
      log('\n🛑 Stopping monitoring...', 'INFO');
      if (socket) {
        socket.disconnect();
      }
      process.exit(0);
    });
    
  } catch (error) {
    log(`Monitoring error: ${error.message}`, 'ERROR');
    if (socket) {
      socket.disconnect();
    }
    process.exit(1);
  }
}

// Run monitoring if this file is executed directly
if (require.main === module) {
  startMonitoring().catch(error => {
    log(`Fatal error: ${error.message}`, 'ERROR');
    process.exit(1);
  });
}

module.exports = {
  startMonitoring,
  authenticate,
  connectSocket,
  monitorTrackingUpdates,
  getActiveSessions,
  simulateTrackingUpdates
};
