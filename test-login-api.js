const axios = require('axios');

async function testLoginAPI() {
  try {
    console.log('🧪 Testing Login API...\n');
    
    const loginData = {
      email: 'admin@esirv2.com',
      password: 'admin123'
    };
    
    console.log('📤 Sending login request...');
    console.log('URL: http://localhost:3001/api/auth/login');
    console.log('Data:', loginData);
    
    const response = await axios.post('http://localhost:3001/api/auth/login', loginData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('\n✅ Login successful!');
    console.log('Status:', response.status);
    console.log('Response:', response.data);
    
    if (response.data.token) {
      console.log('\n🔑 Token received successfully!');
      console.log('Token preview:', response.data.token.substring(0, 50) + '...');
    }
    
  } catch (error) {
    console.log('\n❌ Login failed!');
    console.log('Status:', error.response?.status);
    console.log('Error message:', error.response?.data);
    console.log('Full error:', error.message);
    
    if (error.response?.status === 401) {
      console.log('\n🔍 401 Unauthorized - Possible causes:');
      console.log('1. Email tidak ditemukan di database');
      console.log('2. Password salah');
      console.log('3. Password hash tidak valid');
      console.log('4. Database connection issue');
    }
  }
}

testLoginAPI()
  .then(() => {
    console.log('\n✅ API test completed!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ API test failed:', error.message);
    process.exit(1);
  });
