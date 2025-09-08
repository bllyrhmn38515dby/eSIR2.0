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

    console.log('✅ Login successful!');
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    
  } catch (error) {
    if (error.response) {
      console.log('❌ Login failed:');
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else if (error.code === 'ECONNREFUSED') {
      console.log('❌ Connection refused - Server tidak berjalan');
    } else {
      console.log('❌ Error:', error.message);
    }
  }
}

testLogin();
