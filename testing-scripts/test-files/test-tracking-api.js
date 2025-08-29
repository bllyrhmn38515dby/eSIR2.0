const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'http://localhost:3001/api';
let authToken = '';

async function login() {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      username: 'admin_pusat',
      password: 'admin123'
    });

    authToken = response.data.token;
    console.log('✅ Login berhasil');
  } catch (error) {
    console.error('❌ Login gagal:', error.response?.data?.message || error.message);
    process.exit(1);
  }
}

async function testStartTrackingSession() {
  try {
    console.log('\n🧪 Testing Start Tracking Session...');
    
    const response = await axios.post(`${BASE_URL}/tracking/start-session`, {
      rujukan_id: 1,
      device_id: 'test-device-001'
    }, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    console.log('✅ Start tracking session berhasil');
    console.log('📋 Response:', response.data);
    return response.data.data.session_token;
  } catch (error) {
    console.error('❌ Start tracking session gagal:', error.response?.data?.message || error.message);
    return null;
  }
}

async function testUpdatePosition(sessionToken) {
  try {
    console.log('\n🧪 Testing Update Position...');
    
    const response = await axios.post(`${BASE_URL}/tracking/update-position`, {
      session_token: sessionToken,
      latitude: -6.5971,
      longitude: 106.8060,
      status: 'dalam_perjalanan',
      speed: 35.0,
      heading: 45,
      accuracy: 5.0,
      battery_level: 85
    });

    console.log('✅ Update position berhasil');
    console.log('📋 Response:', response.data);
  } catch (error) {
    console.error('❌ Update position gagal:', error.response?.data?.message || error.message);
  }
}

async function testGetTrackingData() {
  try {
    console.log('\n🧪 Testing Get Tracking Data...');
    
    const response = await axios.get(`${BASE_URL}/tracking/1`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    console.log('✅ Get tracking data berhasil');
    console.log('📋 Response:', response.data);
  } catch (error) {
    console.error('❌ Get tracking data gagal:', error.response?.data?.message || error.message);
  }
}

async function testGetActiveSessions() {
  try {
    console.log('\n🧪 Testing Get Active Sessions...');
    
    const response = await axios.get(`${BASE_URL}/tracking/sessions/active`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    console.log('✅ Get active sessions berhasil');
    console.log('📋 Response:', response.data);
  } catch (error) {
    console.error('❌ Get active sessions gagal:', error.response?.data?.message || error.message);
  }
}

async function testEndSession(sessionId) {
  try {
    console.log('\n🧪 Testing End Session...');
    
    const response = await axios.post(`${BASE_URL}/tracking/end-session/${sessionId}`, {}, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    console.log('✅ End session berhasil');
    console.log('📋 Response:', response.data);
  } catch (error) {
    console.error('❌ End session gagal:', error.response?.data?.message || error.message);
  }
}

async function runAllTests() {
  console.log('🚀 Memulai test API Tracking...\n');
  
  try {
    await login();
    
    const sessionToken = await testStartTrackingSession();
    if (sessionToken) {
      await testUpdatePosition(sessionToken);
    }
    
    await testGetTrackingData();
    await testGetActiveSessions();
    
    // Test end session jika ada session yang aktif
    // await testEndSession(1);
    
    console.log('\n🎉 Semua test selesai!');
  } catch (error) {
    console.error('❌ Test gagal:', error.message);
  }
}

if (require.main === module) {
  runAllTests();
}

module.exports = {
  login,
  testStartTrackingSession,
  testUpdatePosition,
  testGetTrackingData,
  testGetActiveSessions,
  testEndSession
};
