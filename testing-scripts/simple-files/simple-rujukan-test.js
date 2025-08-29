const axios = require('axios');

console.log('🧪 Simple Rujukan Test...');

async function testRujukan() {
  try {
    // 1. Test login
    console.log('\n1️⃣ Testing login...');
    const loginData = {
      email: 'admin@esir.com',
      password: 'admin123'
    };
    
    console.log('Login data:', loginData);
    
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', loginData);
    console.log('Login response:', loginResponse.data);
    
    if (!loginResponse.data.success) {
      console.error('❌ Login failed');
      return false;
    }
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    
    // 2. Test get faskes
    console.log('\n2️⃣ Testing get faskes...');
    const headers = { Authorization: `Bearer ${token}` };
    
    const faskesResponse = await axios.get('http://localhost:3001/api/faskes', { headers });
    console.log('Faskes response:', faskesResponse.data);
    
    if (faskesResponse.data.success) {
      console.log('✅ Faskes retrieved successfully');
      console.log('Faskes count:', faskesResponse.data.data.length);
    } else {
      console.error('❌ Failed to get faskes');
      return false;
    }
    
    console.log('\n🎉 Test completed successfully!');
    return true;
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    return false;
  }
}

testRujukan().then(success => {
  console.log(success ? '\n✅ Test passed!' : '\n❌ Test failed!');
  process.exit(success ? 0 : 1);
});
