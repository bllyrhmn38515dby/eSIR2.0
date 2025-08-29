const axios = require('axios');

async function quickTest() {
  console.log('🔍 Quick API Test...');
  
  try {
    // Test server connection
    const response = await axios.get('http://localhost:3001/test');
    console.log('✅ Server is running:', response.data.message);
    
    // Test login
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@pusat.com',
      password: 'admin123'
    });
    
    if (loginResponse.data.success) {
      console.log('✅ Login successful');
      console.log('👤 User:', loginResponse.data.data.user.nama_lengkap);
      
      // Test protected endpoint
      const token = loginResponse.data.data.token;
      const profileResponse = await axios.get('http://localhost:3001/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (profileResponse.data.success) {
        console.log('✅ Protected endpoint works');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 Server is not running. Please start the server first.');
    }
  }
}

quickTest();
