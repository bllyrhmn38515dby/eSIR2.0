const axios = require('axios');
const io = require('socket.io-client');

// Configuration
const BASE_URL = 'http://localhost:3001';
const API_URL = `${BASE_URL}/api`;

// Test data
const testData = {
  admin: {
    username: 'admin_pusat',
    password: 'admin123'
  },
  rujukan_id: 1, // ID rujukan yang akan ditest
  device_id: 'TEST_DEVICE_001',
  coordinates: {
    valid: { lat: -6.5971, lng: 106.8060 }, // Koordinat valid di Bogor
    invalid: { lat: -8.0000, lng: 110.0000 }, // Koordinat di luar Jawa Barat
    route: [
      { lat: -6.5971, lng: 106.8060, status: 'menunggu' },
      { lat: -6.5960, lng: 106.8070, status: 'dijemput' },
      { lat: -6.5950, lng: 106.8080, status: 'dalam_perjalanan' },
      { lat: -6.5940, lng: 106.8090, status: 'dalam_perjalanan' },
      { lat: -6.5930, lng: 106.8100, status: 'tiba' }
    ]
  }
};

// Utility functions
const log = (message, type = 'INFO') => {
  const timestamp = new Date().toISOString();
  const emoji = {
    'INFO': 'ℹ️',
    'SUCCESS': '✅',
    'ERROR': '❌',
    'WARNING': '⚠️',
    'TEST': '🧪'
  };
  console.log(`${emoji[type]} [${timestamp}] ${message}`);
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Authentication
let authToken = null;
let sessionToken = null;

async function authenticate() {
  try {
    log('Testing authentication...', 'TEST');
    
    const response = await axios.post(`${API_URL}/auth/login`, {
      username: testData.admin.username,
      password: testData.admin.password
    });

    if (response.data.success) {
      authToken = response.data.token;
      log(`Authentication successful: ${response.data.user.nama_lengkap}`, 'SUCCESS');
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

// Test 1: Start Tracking Session
async function testStartTrackingSession() {
  try {
    log('Testing start tracking session...', 'TEST');
    
    const response = await axios.post(`${API_URL}/tracking/start-session`, {
      rujukan_id: testData.rujukan_id,
      device_id: testData.device_id
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    if (response.data.success) {
      sessionToken = response.data.data.session_token;
      log(`Session started successfully: ${response.data.data.session_id}`, 'SUCCESS');
      log(`Session token: ${sessionToken}`, 'INFO');
      return true;
    } else {
      log(`Failed to start session: ${response.data.message}`, 'ERROR');
      return false;
    }
  } catch (error) {
    log(`Start session error: ${error.response?.data?.message || error.message}`, 'ERROR');
    return false;
  }
}

// Test 2: Update Position with Valid Coordinates
async function testUpdatePositionValid() {
  try {
    log('Testing position update with valid coordinates...', 'TEST');
    
    const response = await axios.post(`${API_URL}/tracking/update-position`, {
      session_token: sessionToken,
      latitude: testData.coordinates.valid.lat,
      longitude: testData.coordinates.valid.lng,
      status: 'dalam_perjalanan',
      speed: 45,
      heading: 90,
      accuracy: 5.0,
      battery_level: 85
    });

    if (response.data.success) {
      log('Position updated successfully', 'SUCCESS');
      log(`Estimated distance: ${response.data.data.estimated_distance} km`, 'INFO');
      log(`Estimated time: ${response.data.data.estimated_time} minutes`, 'INFO');
      return true;
    } else {
      log(`Failed to update position: ${response.data.message}`, 'ERROR');
      return false;
    }
  } catch (error) {
    log(`Update position error: ${error.response?.data?.message || error.message}`, 'ERROR');
    return false;
  }
}

// Test 3: Update Position with Invalid Coordinates
async function testUpdatePositionInvalid() {
  try {
    log('Testing position update with invalid coordinates...', 'TEST');
    
    const response = await axios.post(`${API_URL}/tracking/update-position`, {
      session_token: sessionToken,
      latitude: testData.coordinates.invalid.lat,
      longitude: testData.coordinates.invalid.lng,
      status: 'dalam_perjalanan'
    });

    if (!response.data.success) {
      log('Correctly rejected invalid coordinates', 'SUCCESS');
      return true;
    } else {
      log('Should have rejected invalid coordinates', 'ERROR');
      return false;
    }
  } catch (error) {
    if (error.response?.status === 400) {
      log('Correctly rejected invalid coordinates', 'SUCCESS');
      return true;
    } else {
      log(`Unexpected error: ${error.message}`, 'ERROR');
      return false;
    }
  }
}

// Test 4: Simulate Route Tracking
async function testRouteTracking() {
  try {
    log('Testing route tracking simulation...', 'TEST');
    
    for (let i = 0; i < testData.coordinates.route.length; i++) {
      const coord = testData.coordinates.route[i];
      
      const response = await axios.post(`${API_URL}/tracking/update-position`, {
        session_token: sessionToken,
        latitude: coord.lat,
        longitude: coord.lng,
        status: coord.status,
        speed: 30 + Math.random() * 20,
        heading: Math.floor(Math.random() * 360),
        accuracy: 3.0 + Math.random() * 4.0,
        battery_level: 85 - (i * 2)
      });

      if (response.data.success) {
        log(`Route point ${i + 1}/${testData.coordinates.route.length} updated: ${coord.status}`, 'SUCCESS');
        await delay(1000); // Wait 1 second between updates
      } else {
        log(`Failed to update route point ${i + 1}: ${response.data.message}`, 'ERROR');
        return false;
      }
    }
    
    log('Route tracking simulation completed', 'SUCCESS');
    return true;
  } catch (error) {
    log(`Route tracking error: ${error.message}`, 'ERROR');
    return false;
  }
}

// Test 5: Get Tracking Data
async function testGetTrackingData() {
  try {
    log('Testing get tracking data...', 'TEST');
    
    const response = await axios.get(`${API_URL}/tracking/${testData.rujukan_id}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    if (response.data.success) {
      const data = response.data.data;
      log('Tracking data retrieved successfully', 'SUCCESS');
      log(`Current status: ${data.tracking.status}`, 'INFO');
      log(`Current position: ${data.tracking.latitude}, ${data.tracking.longitude}`, 'INFO');
      log(`Route origin: ${data.route.origin.name}`, 'INFO');
      log(`Route destination: ${data.route.destination.name}`, 'INFO');
      return true;
    } else {
      log(`Failed to get tracking data: ${response.data.message}`, 'ERROR');
      return false;
    }
  } catch (error) {
    log(`Get tracking data error: ${error.response?.data?.message || error.message}`, 'ERROR');
    return false;
  }
}

// Test 6: Get Active Session
async function testGetActiveSession() {
  try {
    log('Testing get active session...', 'TEST');
    
    const response = await axios.get(`${API_URL}/tracking/session/${testData.rujukan_id}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    if (response.data.success) {
      const session = response.data.data;
      log('Active session retrieved successfully', 'SUCCESS');
      log(`Session ID: ${session.id}`, 'INFO');
      log(`Session token: ${session.session_token}`, 'INFO');
      log(`Device ID: ${session.device_id}`, 'INFO');
      log(`Petugas: ${session.petugas_nama}`, 'INFO');
      return true;
    } else {
      log(`Failed to get active session: ${response.data.message}`, 'ERROR');
      return false;
    }
  } catch (error) {
    log(`Get active session error: ${error.response?.data?.message || error.message}`, 'ERROR');
    return false;
  }
}

// Test 7: Get All Active Sessions
async function testGetAllActiveSessions() {
  try {
    log('Testing get all active sessions...', 'TEST');
    
    const response = await axios.get(`${API_URL}/tracking/sessions/active`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    if (response.data.success) {
      const sessions = response.data.data;
      log(`Retrieved ${sessions.length} active sessions`, 'SUCCESS');
      
      sessions.forEach((session, index) => {
        log(`Session ${index + 1}: Rujukan ${session.nomor_rujukan} - ${session.nama_pasien}`, 'INFO');
      });
      
      return true;
    } else {
      log(`Failed to get active sessions: ${response.data.message}`, 'ERROR');
      return false;
    }
  } catch (error) {
    log(`Get active sessions error: ${error.response?.data?.message || error.message}`, 'ERROR');
    return false;
  }
}

// Test 8: End Tracking Session
async function testEndTrackingSession() {
  try {
    log('Testing end tracking session...', 'TEST');
    
    // First get the session ID
    const sessionResponse = await axios.get(`${API_URL}/tracking/session/${testData.rujukan_id}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    if (!sessionResponse.data.success) {
      log('No active session to end', 'WARNING');
      return true;
    }

    const sessionId = sessionResponse.data.data.id;
    
    const response = await axios.post(`${API_URL}/tracking/end-session/${sessionId}`, {}, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    if (response.data.success) {
      log('Session ended successfully', 'SUCCESS');
      return true;
    } else {
      log(`Failed to end session: ${response.data.message}`, 'ERROR');
      return false;
    }
  } catch (error) {
    log(`End session error: ${error.response?.data?.message || error.message}`, 'ERROR');
    return false;
  }
}

// Test 9: Socket.IO Connection Test
async function testSocketConnection() {
  return new Promise((resolve) => {
    log('Testing Socket.IO connection...', 'TEST');
    
    const socket = io(BASE_URL, {
      auth: { token: authToken }
    });

    socket.on('connect', () => {
      log('Socket.IO connected successfully', 'SUCCESS');
      socket.disconnect();
      resolve(true);
    });

    socket.on('connect_error', (error) => {
      log(`Socket.IO connection error: ${error.message}`, 'ERROR');
      resolve(false);
    });

    // Timeout after 5 seconds
    setTimeout(() => {
      log('Socket.IO connection timeout', 'ERROR');
      socket.disconnect();
      resolve(false);
    }, 5000);
  });
}

// Test 10: Database Connection Test
async function testDatabaseConnection() {
  try {
    log('Testing database connection...', 'TEST');
    
    const response = await axios.get(`${BASE_URL}/api/health`);
    
    if (response.data.success && response.data.database.isConnected) {
      log('Database connection successful', 'SUCCESS');
      return true;
    } else {
      log('Database connection failed', 'ERROR');
      return false;
    }
  } catch (error) {
    log(`Database connection error: ${error.message}`, 'ERROR');
    return false;
  }
}

// Main test runner
async function runAllTests() {
  log('🚀 Starting eSIR2.0 Tracking System Tests', 'TEST');
  log('==========================================', 'TEST');
  
  const results = {
    total: 0,
    passed: 0,
    failed: 0
  };

  const tests = [
    { name: 'Database Connection', fn: testDatabaseConnection },
    { name: 'Authentication', fn: authenticate },
    { name: 'Start Tracking Session', fn: testStartTrackingSession },
    { name: 'Update Position (Valid)', fn: testUpdatePositionValid },
    { name: 'Update Position (Invalid)', fn: testUpdatePositionInvalid },
    { name: 'Route Tracking Simulation', fn: testRouteTracking },
    { name: 'Get Tracking Data', fn: testGetTrackingData },
    { name: 'Get Active Session', fn: testGetActiveSession },
    { name: 'Get All Active Sessions', fn: testGetAllActiveSessions },
    { name: 'Socket.IO Connection', fn: testSocketConnection },
    { name: 'End Tracking Session', fn: testEndTrackingSession }
  ];

  for (const test of tests) {
    results.total++;
    log(`\n🧪 Running test: ${test.name}`, 'TEST');
    
    try {
      const success = await test.fn();
      if (success) {
        results.passed++;
        log(`✅ ${test.name}: PASSED`, 'SUCCESS');
      } else {
        results.failed++;
        log(`❌ ${test.name}: FAILED`, 'ERROR');
      }
    } catch (error) {
      results.failed++;
      log(`❌ ${test.name}: ERROR - ${error.message}`, 'ERROR');
    }
    
    await delay(500); // Small delay between tests
  }

  // Summary
  log('\n📊 TEST SUMMARY', 'TEST');
  log('===============', 'TEST');
  log(`Total Tests: ${results.total}`, 'INFO');
  log(`Passed: ${results.passed}`, 'SUCCESS');
  log(`Failed: ${results.failed}`, results.failed > 0 ? 'ERROR' : 'SUCCESS');
  log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`, 'INFO');
  
  if (results.failed === 0) {
    log('\n🎉 All tests passed! Tracking system is working correctly.', 'SUCCESS');
  } else {
    log('\n⚠️  Some tests failed. Please check the errors above.', 'WARNING');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(error => {
    log(`Fatal error: ${error.message}`, 'ERROR');
    process.exit(1);
  });
}

module.exports = {
  runAllTests,
  testData,
  log
};
