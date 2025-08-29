const axios = require('axios');

async function testRefreshToken() {
  try {
    console.log('🔗 Testing refresh token functionality...');
    
    // Step 1: Login untuk mendapatkan token
    console.log('\n1️⃣ Login untuk mendapatkan token...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@esirv2.com',
      password: 'password'
    });
    
    if (!loginResponse.data.success) {
      console.error('❌ Login failed:', loginResponse.data.message);
      return;
    }
    
    const token = loginResponse.data.data.token;
    console.log('✅ Login successful, token received');
    
    // Step 2: Test profile endpoint dengan token
    console.log('\n2️⃣ Testing profile endpoint...');
    const profileResponse = await axios.get('http://localhost:3001/api/auth/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (profileResponse.data.success) {
      console.log('✅ Profile endpoint working:', profileResponse.data.data.nama_lengkap);
    } else {
      console.error('❌ Profile endpoint failed:', profileResponse.data.message);
    }
    
    // Step 3: Test refresh token endpoint
    console.log('\n3️⃣ Testing refresh token endpoint...');
    const refreshResponse = await axios.post('http://localhost:3001/api/auth/refresh', {
      token: token
    });
    
    if (refreshResponse.data.success) {
      const newToken = refreshResponse.data.data.token;
      const userData = refreshResponse.data.data.user;
      console.log('✅ Refresh token successful');
      console.log('   New token received:', newToken ? 'Yes' : 'No');
      console.log('   User data:', userData.nama_lengkap);
      
      // Step 4: Test profile dengan token baru
      console.log('\n4️⃣ Testing profile with new token...');
      const newProfileResponse = await axios.get('http://localhost:3001/api/auth/profile', {
        headers: { Authorization: `Bearer ${newToken}` }
      });
      
      if (newProfileResponse.data.success) {
        console.log('✅ New token working correctly');
      } else {
        console.error('❌ New token failed:', newProfileResponse.data.message);
      }
      
    } else {
      console.error('❌ Refresh token failed:', refreshResponse.data.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received - Server mungkin tidak berjalan');
      console.error('Error code:', error.code);
    } else {
      console.error('Error details:', error);
    }
  }
}

testRefreshToken();
