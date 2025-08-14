const axios = require('axios');

async function testStatsEndpoint() {
  try {
    console.log('Testing stats endpoint...');
    
    // Test without authentication first
    try {
      const response = await axios.get('http://localhost:3001/api/rujukan/stats/overview');
      console.log('Response without auth:', response.data);
    } catch (error) {
      console.log('Expected auth error:', error.response?.status, error.response?.data?.message);
    }
    
    // Login first to get token
    console.log('Logging in...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@pusat.com',
      password: 'admin123'
    });

    const token = loginResponse.data.data.token;
    const headers = { Authorization: `Bearer ${token}` };

    console.log('Login successful, testing stats with auth...');
    
    // Test stats endpoint
    const statsResponse = await axios.get('http://localhost:3001/api/rujukan/stats/overview', { headers });
    console.log('✅ Stats endpoint working:', statsResponse.data);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testStatsEndpoint();
