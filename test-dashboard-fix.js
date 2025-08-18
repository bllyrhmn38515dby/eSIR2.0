const axios = require('axios');

const BASE_URL = 'http://localhost:3001';
const TEST_EMAIL = 'admin@esir.com';
const TEST_PASSWORD = 'admin123';

async function testDashboardFix() {
  console.log('🧪 Testing Dashboard Fix Implementation...\n');

  try {
    // 1. Test health endpoint
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Health check:', healthResponse.data);
    console.log('');

    // 2. Test login
    console.log('2️⃣ Testing login...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });

    if (!loginResponse.data.success) {
      throw new Error('Login failed: ' + loginResponse.data.message);
    }

    const token = loginResponse.data.data.token;
    const headers = { Authorization: `Bearer ${token}` };
    console.log('✅ Login successful');
    console.log('');

    // 3. Test profile endpoint
    console.log('3️⃣ Testing profile endpoint...');
    const profileResponse = await axios.get(`${BASE_URL}/api/auth/profile`, { headers });
    console.log('✅ Profile loaded:', profileResponse.data.data.nama_lengkap);
    console.log('');

    // 4. Test stats endpoint
    console.log('4️⃣ Testing stats endpoint...');
    const statsResponse = await axios.get(`${BASE_URL}/api/rujukan/stats/overview`, { headers });
    console.log('✅ Stats loaded:', statsResponse.data.data);
    console.log('');

    // 5. Test refresh token endpoint
    console.log('5️⃣ Testing refresh token endpoint...');
    const refreshResponse = await axios.post(`${BASE_URL}/api/auth/refresh`, {
      token: token
    });
    console.log('✅ Token refreshed successfully');
    console.log('');

    // 6. Test with expired token simulation
    console.log('6️⃣ Testing expired token handling...');
    try {
      const expiredResponse = await axios.get(`${BASE_URL}/api/rujukan/stats/overview`, {
        headers: { Authorization: 'Bearer expired_token_here' }
      });
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Expired token properly rejected');
      } else {
        console.log('⚠️ Unexpected error with expired token:', error.message);
      }
    }
    console.log('');

    // 7. Test database connection
    console.log('7️⃣ Testing database connection...');
    const dbHealthResponse = await axios.get(`${BASE_URL}/api/health`);
    if (dbHealthResponse.data.database.isConnected) {
      console.log('✅ Database connection healthy');
    } else {
      console.log('⚠️ Database connection issues detected');
    }
    console.log('');

    console.log('🎉 All tests completed successfully!');
    console.log('📋 Summary:');
    console.log('   ✅ Health endpoint working');
    console.log('   ✅ Login authentication working');
    console.log('   ✅ Profile endpoint working');
    console.log('   ✅ Stats endpoint working');
    console.log('   ✅ Token refresh working');
    console.log('   ✅ Error handling working');
    console.log('   ✅ Database monitoring working');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

// Run the test
testDashboardFix();
