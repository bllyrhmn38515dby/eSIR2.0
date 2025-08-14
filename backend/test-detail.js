const axios = require('axios');

async function testEndpoints() {
  try {
    console.log('Testing endpoints...');
    
    // Test basic endpoint
    try {
      const testResponse = await axios.get('http://localhost:3001/test');
      console.log('✅ Test endpoint:', testResponse.data);
    } catch (error) {
      console.log('❌ Test endpoint error:', error.message);
      if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Data:', error.response.data);
      }
      return;
    }
    
    // Test login
    try {
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
      console.log('❌ Login/Stats error:', error.message);
      if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Data:', error.response.data);
      }
    }
    
  } catch (error) {
    console.error('❌ General error:', error.message);
  }
}

testEndpoints();
