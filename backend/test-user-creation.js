const axios = require('axios');

async function testUserCreation() {
  try {
    // First, login to get a token
    console.log('🔐 Logging in...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      emailOrUsername: 'admin',
      password: 'admin123'
    });
    
    console.log('📥 Login response:', loginResponse.data);
    
    if (!loginResponse.data.success) {
      throw new Error('Login failed: ' + loginResponse.data.message);
    }
    
    const token = loginResponse.data.data.token;
    console.log('✅ Login successful, token:', token.substring(0, 20) + '...');
    
    // Test creating a user
    console.log('👤 Creating user...');
    const userData = {
      nama_lengkap: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'admin_faskes',
      faskes_id: 1,
      telepon: '081234567890'
    };
    
    const createResponse = await axios.post('http://localhost:3001/api/auth/users', userData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ User created successfully:', createResponse.data);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

testUserCreation();
