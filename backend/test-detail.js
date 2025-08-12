const axios = require('axios');

async function testDetail() {
  try {
    console.log('🔍 Testing backend connection...');
    
    // Test basic endpoint
    try {
      const response = await axios.get('http://localhost:3001/api');
      console.log('✅ Backend is running:', response.data);
    } catch (error) {
      console.log('❌ Backend connection failed:', error.message);
      if (error.code === 'ECONNREFUSED') {
        console.log('💡 Backend server is not running. Please start it with: node index.js');
      }
      return;
    }
    
    // Test login
    console.log('\n🔐 Testing login...');
    try {
      const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
        email: 'admin@pusat.com',
        password: 'password123'
      });
      
      console.log('✅ Login successful:', loginResponse.data.success);
      console.log('Token:', loginResponse.data.data.token.substring(0, 50) + '...');
      
      // Test pasien API
      console.log('\n🏥 Testing pasien API...');
      const token = loginResponse.data.data.token;
      
      const pasienResponse = await axios.get('http://localhost:3001/api/pasien', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('✅ Pasien API working:', pasienResponse.data.success);
      console.log('Total pasien:', pasienResponse.data.data.length);
      
      // Test rujukan API
      console.log('\n📋 Testing rujukan API...');
      const rujukanResponse = await axios.get('http://localhost:3001/api/rujukan', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('✅ Rujukan API working:', rujukanResponse.data.success);
      console.log('Total rujukan:', rujukanResponse.data.data.length);
      
      // Test stats API
      console.log('\n📊 Testing stats API...');
      const statsResponse = await axios.get('http://localhost:3001/api/rujukan/stats/overview', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('✅ Stats API working:', statsResponse.data.success);
      console.log('Stats data:', statsResponse.data.data);
      
    } catch (error) {
      console.log('❌ API test failed:', error.message);
      if (error.response) {
        console.log('Response status:', error.response.status);
        console.log('Response data:', error.response.data);
      }
    }
    
  } catch (error) {
    console.error('❌ General error:', error.message);
  }
}

testDetail();
