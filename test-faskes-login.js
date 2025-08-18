const axios = require('axios');

async function testFaskesLogin() {
  try {
    console.log('🧪 Testing Faskes Login API...\n');
    
    const loginData = {
      email: 'willinmm@esirv2faskes.com',
      password: 'faskes123'
    };
    
    console.log('📤 Sending faskes login request...');
    console.log('URL: http://localhost:3001/api/auth/login');
    console.log('Data:', loginData);
    
    const response = await axios.post('http://localhost:3001/api/auth/login', loginData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('\n✅ Faskes login successful!');
    console.log('Status:', response.status);
    console.log('Response:', response.data);
    
    if (response.data.data && response.data.data.token) {
      console.log('\n🔑 Token received successfully!');
      console.log('Token preview:', response.data.data.token.substring(0, 50) + '...');
      console.log('User role:', response.data.data.user.role);
      console.log('User faskes_id:', response.data.data.user.faskes_id);
    }
    
  } catch (error) {
    console.log('\n❌ Faskes login failed!');
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

testFaskesLogin()
  .then(() => {
    console.log('\n✅ Faskes API test completed!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Faskes API test failed:', error.message);
    process.exit(1);
  });
