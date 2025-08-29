const axios = require('axios');

async function testEndpoints() {
  const baseURL = 'http://localhost:3001';
  
  try {
    console.log('🧪 Testing API endpoints...\n');
    
    // Test server is running
    console.log('1. Testing server connection...');
    const testResponse = await axios.get(`${baseURL}/test`);
    console.log('✅ Server is running:', testResponse.data);
    
    // Test auth endpoints
    console.log('\n2. Testing auth endpoints...');
    
    // Test GET /api/auth/users (should return 401 without token)
    try {
      await axios.get(`${baseURL}/api/auth/users`);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ GET /api/auth/users - Requires authentication (expected)');
      } else {
        console.log('❌ GET /api/auth/users - Unexpected error:', error.response?.status);
      }
    }
    
    // Test POST /api/auth/users (should return 401 without token)
    try {
      await axios.post(`${baseURL}/api/auth/users`, {
        nama_lengkap: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'admin_faskes'
      });
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ POST /api/auth/users - Requires authentication (expected)');
      } else {
        console.log('❌ POST /api/auth/users - Unexpected error:', error.response?.status);
      }
    }
    
    // Test PUT /api/auth/users/:id (should return 401 without token)
    try {
      await axios.put(`${baseURL}/api/auth/users/1`, {
        nama_lengkap: 'Updated User',
        email: 'updated@example.com',
        role: 'admin_faskes'
      });
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ PUT /api/auth/users/:id - Requires authentication (expected)');
      } else {
        console.log('❌ PUT /api/auth/users/:id - Unexpected error:', error.response?.status);
      }
    }
    
    // Test DELETE /api/auth/users/:id (should return 401 without token)
    try {
      await axios.delete(`${baseURL}/api/auth/users/1`);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ DELETE /api/auth/users/:id - Requires authentication (expected)');
      } else {
        console.log('❌ DELETE /api/auth/users/:id - Unexpected error:', error.response?.status);
      }
    }
    
    console.log('\n🎉 All endpoint tests completed!');
    
  } catch (error) {
    console.error('❌ Error testing endpoints:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Backend server is not running. Please start it with: npm start');
    }
  }
}

testEndpoints();
