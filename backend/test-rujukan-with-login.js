const axios = require('axios');

async function testRujukanWithLogin() {
  try {
    console.log('🔍 Testing login and rujukan API...');
    
    // Login dulu dengan email yang benar
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@pusat.com',
      password: 'admin123'
    });
    
    console.log('✅ Login response success:', loginResponse.data.success);
    
    if (loginResponse.data.success && loginResponse.data.data && loginResponse.data.data.token) {
      const token = loginResponse.data.data.token;
      console.log('🔑 Token obtained:', token.substring(0, 50) + '...');
      
      // Test API rujukan dengan token
      const rujukanResponse = await axios.get('http://localhost:3001/api/rujukan', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Rujukan API response:');
      console.log('Success:', rujukanResponse.data.success);
      console.log('Data count:', rujukanResponse.data.data ? rujukanResponse.data.data.length : 'null');
      if (rujukanResponse.data.data && rujukanResponse.data.data.length > 0) {
        console.log('Sample data:', rujukanResponse.data.data[0]);
      } else {
        console.log('No data found');
      }
      
    } else {
      console.log('❌ Login failed:', loginResponse.data);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.response?.data || error.message);
  }
}

testRujukanWithLogin();
