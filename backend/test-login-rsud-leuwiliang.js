const axios = require('axios');

async function testLoginRSUDLeuwiliang() {
  try {
    console.log('🔐 Testing login for RSUD Leuwiliang admin...');
    
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      emailOrUsername: 'admin_rsud_leuwiliang',
      password: 'admin123'
    });
    
    console.log('📥 Login response:', loginResponse.data);
    
    if (loginResponse.data.success) {
      const user = loginResponse.data.data.user;
      console.log('✅ Login successful!');
      console.log(`👤 User: ${user.nama_lengkap}`);
      console.log(`📧 Email: ${user.email}`);
      console.log(`👥 Role: ${user.role}`);
      console.log(`🏥 Faskes ID: ${user.faskes_id}`);
      
      // Test getting users list (should only see users from same faskes)
      const token = loginResponse.data.data.token;
      console.log('\n🔍 Testing users list access...');
      
      const usersResponse = await axios.get('http://localhost:3001/api/auth/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('📋 Users list response:');
      console.log(`- Success: ${usersResponse.data.success}`);
      console.log(`- Users count: ${usersResponse.data.data.length}`);
      
      usersResponse.data.data.forEach(user => {
        console.log(`  - ${user.nama_lengkap} (${user.role}) - ${user.nama_faskes || 'No faskes'}`);
      });
      
    } else {
      console.log('❌ Login failed:', loginResponse.data.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testLoginRSUDLeuwiliang();
