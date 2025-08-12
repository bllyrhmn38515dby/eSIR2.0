const axios = require('axios');

async function testSimple() {
  try {
    console.log('🔍 Testing backend connection...');
    
    // Test basic endpoint
    const response = await axios.get('http://localhost:3001/api');
    console.log('✅ Backend is running:', response.data);
    
    // Test login
    console.log('\n🔐 Testing login...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@pusat.com',
      password: 'password123'
    });
    
    console.log('✅ Login successful:', loginResponse.data.success);
    console.log('Token:', loginResponse.data.data.token.substring(0, 50) + '...');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testSimple();
