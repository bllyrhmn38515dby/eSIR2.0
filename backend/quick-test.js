const axios = require('axios');

async function quickTest() {
  try {
    console.log('🧪 Quick test...');
    
    // Test server connection
    const response = await axios.get('http://localhost:3001/test');
    console.log('✅ Server running:', response.data);
    
    // Test auth endpoint without token (should get 401)
    try {
      await axios.get('http://localhost:3001/api/auth/users');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ GET /api/auth/users - 401 (expected)');
      } else {
        console.log('❌ GET /api/auth/users - Unexpected:', error.response?.status);
      }
    }
    
    // Test POST endpoint without token (should get 401)
    try {
      await axios.post('http://localhost:3001/api/auth/users', {
        nama_lengkap: 'Test',
        email: 'test@test.com',
        password: 'password',
        role: 'admin_faskes'
      });
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ POST /api/auth/users - 401 (expected)');
      } else {
        console.log('❌ POST /api/auth/users - Unexpected:', error.response?.status);
      }
    }
    
    console.log('🎉 Quick test completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

quickTest();
