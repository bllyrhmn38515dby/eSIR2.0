const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testRealLogin() {
  console.log('🔍 Testing Real Login with Database...\n');

  try {
    // Test 1: Server connection
    console.log('1️⃣ Testing server connection...');
    const testResponse = await axios.get(`${BASE_URL}/test`);
    console.log('✅ Server is running:', testResponse.data.message);

    // Test 2: Login with real database
    console.log('\n2️⃣ Testing login with real database...');
    const loginData = {
      email: 'admin@pusat.com',
      password: 'admin123'
    };

    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, loginData);
    
    if (loginResponse.data.success) {
      console.log('✅ Login successful!');
      console.log('📋 User data:', {
        id: loginResponse.data.data.user.id,
        nama: loginResponse.data.data.user.nama_lengkap,
        email: loginResponse.data.data.user.email,
        role: loginResponse.data.data.user.role
      });
      console.log('🔑 Token received:', loginResponse.data.data.token.substring(0, 20) + '...');
      
      const token = loginResponse.data.data.token;

      // Test 3: Test protected endpoint with real token
      console.log('\n3️⃣ Testing protected endpoint with real token...');
      const profileResponse = await axios.get(`${BASE_URL}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (profileResponse.data.success) {
        console.log('✅ Protected endpoint works!');
        console.log('📋 Profile data:', {
          id: profileResponse.data.data.id,
          nama: profileResponse.data.data.nama_lengkap,
          email: profileResponse.data.data.email,
          role: profileResponse.data.data.role
        });
      } else {
        console.log('❌ Protected endpoint failed:', profileResponse.data.message);
      }

    } else {
      console.log('❌ Login failed:', loginResponse.data.message);
    }

  } catch (error) {
    if (error.response) {
      console.log('❌ Error:', error.response.data.message || error.response.statusText);
    } else if (error.code === 'ECONNREFUSED') {
      console.log('❌ Server connection failed');
      console.log('💡 Please start the server first with: node index.js');
    } else {
      console.log('❌ Error:', error.message);
    }
  }
}

testRealLogin();
