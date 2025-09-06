const axios = require('axios');

async function testLogin() {
  try {
    console.log('🔗 Testing login...');
    
    const response = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@esir.com',
      password: 'admin123'
    }, {
      timeout: 5000
    });
    
    console.log('✅ Login successful');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.error('❌ Login failed:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received - Server mungkin tidak berjalan');
      console.error('Error code:', error.code);
    } else {
      console.error('Error details:', error);
    }
  }
}

testLogin();
