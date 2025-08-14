const axios = require('axios');

async function testEndpoints() {
  try {
    console.log('Testing endpoints...');
    
    // Test basic endpoint
    const testResponse = await axios.get('http://localhost:3001/test');
    console.log('✅ Test endpoint:', testResponse.data);
    
    // Test login
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@pusat.com',
      password: 'admin123'
    });
    console.log('✅ Login successful:', loginResponse.data.success);
    
    // Test stats with token
    const token = loginResponse.data.data.token;
    const statsResponse = await axios.get('http://localhost:3001/api/rujukan/stats/overview', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Stats endpoint:', statsResponse.data);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testEndpoints();
