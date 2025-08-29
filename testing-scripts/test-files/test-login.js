require('dotenv').config();
const axios = require('axios');

async function testLogin() {
  const baseURL = 'http://localhost:3001';
  
  try {
    console.log('🧪 Testing login functionality...\n');
    
    // Test server connection
    console.log('1. Testing server connection...');
    const testResponse = await axios.get(`${baseURL}/test`);
    console.log('✅ Server is running:', testResponse.data);
    
    // Test login with valid credentials
    console.log('\n2. Testing login with admin credentials...');
    const loginResponse = await axios.post(`${baseURL}/api/auth/login`, {
      email: 'admin@pusat.com',
      password: 'admin123'
    });
    
    console.log('✅ Login successful!');
    console.log('📋 Response:', {
      success: loginResponse.data.success,
      message: loginResponse.data.message,
      hasUser: !!loginResponse.data.data?.user,
      hasToken: !!loginResponse.data.data?.token,
      userRole: loginResponse.data.data?.user?.role
    });
    
    if (loginResponse.data.success && loginResponse.data.data?.token) {
      const token = loginResponse.data.data.token;
      
      // Test profile endpoint with token
      console.log('\n3. Testing profile endpoint with token...');
      const profileResponse = await axios.get(`${baseURL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('✅ Profile endpoint working!');
      console.log('👤 User profile:', {
        id: profileResponse.data.data?.id,
        nama_lengkap: profileResponse.data.data?.nama_lengkap,
        email: profileResponse.data.data?.email,
        role: profileResponse.data.data?.role
      });
    }
    
    console.log('\n🎉 Login test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing login:', error.response?.data || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Backend server is not running. Please start it with: npm start');
    }
  }
}

testLogin();
