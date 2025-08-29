const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function testAPIWithAuth() {
  try {
    console.log('🔗 Testing API with authentication...');

    // Login untuk mendapatkan token
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@pusat.com',
      password: 'password'
    });

    if (!loginResponse.data.success) {
      console.error('❌ Login failed:', loginResponse.data.message);
      return;
    }

    const token = loginResponse.data.data.token;
    console.log('✅ Login successful, token obtained');

    // Test API tempat tidur dengan token
    const apiResponse = await axios.get('http://localhost:3001/api/tempat-tidur', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('✅ API Response:', apiResponse.data);
    console.log(`📊 Found ${apiResponse.data.data.length} tempat tidur records`);

  } catch (error) {
    console.error('❌ Error testing API:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error details:', error);
    }
  }
}

// Run the test
testAPIWithAuth();
