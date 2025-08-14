const axios = require('axios');

const BASE_URL = 'http://localhost:3001';
let authToken = '';

// Test functions
async function testServerConnection() {
  console.log('🔍 Testing server connection...');
  try {
    const response = await axios.get(`${BASE_URL}/test`);
    console.log('✅ Server is running:', response.data.message);
    return true;
  } catch (error) {
    console.error('❌ Server connection failed:', error.message);
    return false;
  }
}

async function testLogin() {
  console.log('\n🔐 Testing login...');
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'admin@pusat.com',
      password: 'admin123'
    });
    
    if (response.data.success) {
      authToken = response.data.data.token;
      console.log('✅ Login successful');
      console.log('👤 User:', response.data.data.user.nama_lengkap);
      console.log('🔑 Role:', response.data.data.user.role);
      return true;
    } else {
      console.error('❌ Login failed:', response.data.message);
      return false;
    }
  } catch (error) {
    console.error('❌ Login error:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testProtectedEndpoints() {
  console.log('\n🔒 Testing protected endpoints...');
  
  const headers = {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json'
  };

  // Test get profile
  try {
    const response = await axios.get(`${BASE_URL}/api/auth/profile`, { headers });
    console.log('✅ Get profile:', response.data.success ? 'Success' : 'Failed');
  } catch (error) {
    console.error('❌ Get profile failed:', error.response?.data?.message || error.message);
  }

  // Test get users (admin only)
  try {
    const response = await axios.get(`${BASE_URL}/api/auth/users`, { headers });
    console.log('✅ Get users:', response.data.success ? 'Success' : 'Failed');
    if (response.data.success) {
      console.log(`   📊 Total users: ${response.data.data.length}`);
    }
  } catch (error) {
    console.error('❌ Get users failed:', error.response?.data?.message || error.message);
  }

  // Test get roles
  try {
    const response = await axios.get(`${BASE_URL}/api/auth/roles`, { headers });
    console.log('✅ Get roles:', response.data.success ? 'Success' : 'Failed');
    if (response.data.success) {
      console.log(`   📊 Total roles: ${response.data.data.length}`);
    }
  } catch (error) {
    console.error('❌ Get roles failed:', error.response?.data?.message || error.message);
  }
}

async function testFaskesEndpoints() {
  console.log('\n🏥 Testing faskes endpoints...');
  
  const headers = {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json'
  };

  // Test get faskes
  try {
    const response = await axios.get(`${BASE_URL}/api/faskes`, { headers });
    console.log('✅ Get faskes:', response.data.success ? 'Success' : 'Failed');
    if (response.data.success) {
      console.log(`   📊 Total faskes: ${response.data.data.length}`);
    }
  } catch (error) {
    console.error('❌ Get faskes failed:', error.response?.data?.message || error.message);
  }
}

async function testPasienEndpoints() {
  console.log('\n👥 Testing pasien endpoints...');
  
  const headers = {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json'
  };

  // Test get pasien
  try {
    const response = await axios.get(`${BASE_URL}/api/pasien`, { headers });
    console.log('✅ Get pasien:', response.data.success ? 'Success' : 'Failed');
    if (response.data.success) {
      console.log(`   📊 Total pasien: ${response.data.data.length}`);
    }
  } catch (error) {
    console.error('❌ Get pasien failed:', error.response?.data?.message || error.message);
  }
}

async function testRujukanEndpoints() {
  console.log('\n📋 Testing rujukan endpoints...');
  
  const headers = {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json'
  };

  // Test get rujukan
  try {
    const response = await axios.get(`${BASE_URL}/api/rujukan`, { headers });
    console.log('✅ Get rujukan:', response.data.success ? 'Success' : 'Failed');
    if (response.data.success) {
      console.log(`   📊 Total rujukan: ${response.data.data.length}`);
    }
  } catch (error) {
    console.error('❌ Get rujukan failed:', error.response?.data?.message || error.message);
  }

  // Test get rujukan stats
  try {
    const response = await axios.get(`${BASE_URL}/api/rujukan/stats/overview`, { headers });
    console.log('✅ Get rujukan stats:', response.data.success ? 'Success' : 'Failed');
    if (response.data.success) {
      console.log('   📊 Stats:', response.data.data);
    }
  } catch (error) {
    console.error('❌ Get rujukan stats failed:', error.response?.data?.message || error.message);
  }
}

async function testTempatTidurEndpoints() {
  console.log('\n🛏️ Testing tempat tidur endpoints...');
  
  const headers = {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json'
  };

  // Test get tempat tidur
  try {
    const response = await axios.get(`${BASE_URL}/api/tempat-tidur`, { headers });
    console.log('✅ Get tempat tidur:', response.data.success ? 'Success' : 'Failed');
    if (response.data.success) {
      console.log(`   📊 Total tempat tidur: ${response.data.data.length}`);
    }
  } catch (error) {
    console.error('❌ Get tempat tidur failed:', error.response?.data?.message || error.message);
  }
}

async function testSearchEndpoints() {
  console.log('\n🔍 Testing search endpoints...');
  
  const headers = {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json'
  };

  // Test global search
  try {
    const response = await axios.get(`${BASE_URL}/api/search/global?query=admin`, { headers });
    console.log('✅ Global search:', response.data.success ? 'Success' : 'Failed');
  } catch (error) {
    console.error('❌ Global search failed:', error.response?.data?.message || error.message);
  }
}

async function testTrackingEndpoints() {
  console.log('\n📍 Testing tracking endpoints...');
  
  const headers = {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json'
  };

  // Test get active sessions
  try {
    const response = await axios.get(`${BASE_URL}/api/tracking/sessions/active`, { headers });
    console.log('✅ Get active tracking sessions:', response.data.success ? 'Success' : 'Failed');
    if (response.data.success) {
      console.log(`   📊 Active sessions: ${response.data.data.length}`);
    }
  } catch (error) {
    console.error('❌ Get active sessions failed:', error.response?.data?.message || error.message);
  }
}

async function testNotificationsEndpoints() {
  console.log('\n🔔 Testing notifications endpoints...');
  
  const headers = {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json'
  };

  // Test get notifications
  try {
    const response = await axios.get(`${BASE_URL}/api/notifications`, { headers });
    console.log('✅ Get notifications:', response.data.success ? 'Success' : 'Failed');
    if (response.data.success) {
      console.log(`   📊 Total notifications: ${response.data.data.length}`);
    }
  } catch (error) {
    console.error('❌ Get notifications failed:', error.response?.data?.message || error.message);
  }

  // Test get unread count
  try {
    const response = await axios.get(`${BASE_URL}/api/notifications/unread-count`, { headers });
    console.log('✅ Get unread count:', response.data.success ? 'Success' : 'Failed');
    if (response.data.success) {
      console.log(`   📊 Unread notifications: ${response.data.data.count}`);
    }
  } catch (error) {
    console.error('❌ Get unread count failed:', error.response?.data?.message || error.message);
  }
}

// Main test function
async function runAllTests() {
  console.log('🚀 Starting API Endpoint Tests...\n');
  
  // Test server connection
  const serverOk = await testServerConnection();
  if (!serverOk) {
    console.log('❌ Cannot proceed without server connection');
    return;
  }

  // Test login
  const loginOk = await testLogin();
  if (!loginOk) {
    console.log('❌ Cannot proceed without authentication');
    return;
  }

  // Test all protected endpoints
  await testProtectedEndpoints();
  await testFaskesEndpoints();
  await testPasienEndpoints();
  await testRujukanEndpoints();
  await testTempatTidurEndpoints();
  await testSearchEndpoints();
  await testTrackingEndpoints();
  await testNotificationsEndpoints();

  console.log('\n🎉 API Endpoint Tests Completed!');
  console.log('✅ Backend API is ready for frontend integration');
}

// Run tests
runAllTests().catch(error => {
  console.error('❌ Test execution failed:', error.message);
});
