const axios = require('axios');

async function testProfile() {
  try {
    console.log('🧪 Testing profile endpoint...\n');
    
    // First, get a token by logging in
    console.log('1. Getting token...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@pusat.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.data.token;
    console.log('✅ Token received:', token.substring(0, 50) + '...');
    
    // Test profile endpoint
    console.log('\n2. Testing profile endpoint...');
    const profileResponse = await axios.get('http://localhost:3001/api/auth/profile', {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Profile response:', profileResponse.data);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    console.error('❌ Status:', error.response?.status);
    console.error('❌ Headers:', error.response?.headers);
  }
}

testProfile();
