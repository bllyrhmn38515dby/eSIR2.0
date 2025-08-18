const axios = require('axios');

async function testSimpleEndpoints() {
  const baseURL = 'http://localhost:3004';
  
  try {
    console.log('🧪 Testing simple endpoints...\n');
    
    // Test POST
    console.log('1. Testing POST /api/auth/users...');
    const postResponse = await axios.post(`${baseURL}/api/auth/users`, {
      nama_lengkap: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'admin_faskes'
    });
    console.log('✅ POST successful:', postResponse.data);
    
    // Test PUT
    console.log('\n2. Testing PUT /api/auth/users/1...');
    const putResponse = await axios.put(`${baseURL}/api/auth/users/1`, {
      nama_lengkap: 'Updated User',
      email: 'updated@example.com',
      role: 'admin_faskes'
    });
    console.log('✅ PUT successful:', putResponse.data);
    
    // Test DELETE
    console.log('\n3. Testing DELETE /api/auth/users/1...');
    const deleteResponse = await axios.delete(`${baseURL}/api/auth/users/1`);
    console.log('✅ DELETE successful:', deleteResponse.data);
    
    // Test GET
    console.log('\n4. Testing GET /api/auth/users...');
    const getResponse = await axios.get(`${baseURL}/api/auth/users`);
    console.log('✅ GET successful:', getResponse.data);
    
    console.log('\n🎉 All simple endpoint tests passed!');
    
  } catch (error) {
    console.error('❌ Error testing simple endpoints:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Simple test server is not running. Please start it first.');
    }
  }
}

testSimpleEndpoints();
