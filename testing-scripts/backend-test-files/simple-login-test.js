const axios = require('axios');

async function testLogin() {
  try {
    console.log('🔍 Testing login...');
    
    const response = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@pusat.com',
      password: 'admin123'
    });
    
    console.log('✅ Login response:', response.data);
    
    if (response.data.success) {
      console.log('🎉 Login berhasil!');
      console.log('Token:', response.data.data.token.substring(0, 30) + '...');
    }
    
  } catch (error) {
    console.log('❌ Error:', error.response?.data || error.message);
  }
}

testLogin();
