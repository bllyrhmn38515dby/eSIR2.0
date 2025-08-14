const axios = require('axios');

async function testStatsEndpoint() {
  try {
    // Login first to get token
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@pusat.com',
      password: 'admin123'
    });

    const token = loginResponse.data.data.token;
    const headers = { Authorization: `Bearer ${token}` };

    console.log('Testing stats endpoint...');
    
    // Test stats endpoint
    const statsResponse = await axios.get('http://localhost:3001/api/rujukan/stats/overview', { headers });
    console.log('✅ Stats endpoint working:', statsResponse.data);
    
  } catch (error) {
    console.error('❌ Error testing stats endpoint:', error.response?.data || error.message);
  }
}

testStatsEndpoint();
