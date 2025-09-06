const axios = require('axios');

async function testDatabaseConnection() {
  try {
    console.log('🔗 Testing database connection...');
    
    // Test server endpoint
    const response = await axios.get('http://localhost:3001/test', {
      timeout: 5000
    });
    
    console.log('✅ Server is running');
    console.log('Response:', response.data);
    
    // Test login endpoint
    console.log('\n🔐 Testing login...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@esir.com',
      password: 'admin123'
    }, {
      timeout: 5000
    });
    
    console.log('✅ Login successful');
    console.log('User:', loginResponse.data.data.user.nama_lengkap);
    console.log('Role:', loginResponse.data.data.user.role);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testDatabaseConnection();
