const axios = require('axios');

async function testLoginDriverRSUDLeuwiliang() {
  try {
    console.log('🔐 Testing login for RSUD Leuwiliang driver...');
    
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      emailOrUsername: 'driver_rsud_leuwiliang',
      password: 'driver123'
    });
    
    console.log('📥 Login response:', loginResponse.data);
    
    if (loginResponse.data.success) {
      const user = loginResponse.data.data.user;
      console.log('✅ Login successful!');
      console.log(`👤 User: ${user.nama_lengkap}`);
      console.log(`📧 Email: ${user.email}`);
      console.log(`👥 Role: ${user.role}`);
      console.log(`🏥 Faskes ID: ${user.faskes_id}`);
      
      const token = loginResponse.data.data.token;
      console.log('\n🔍 Testing driver-specific access...');
      
      // Test tracking access (drivers should have access to tracking)
      try {
        console.log('🚑 Testing tracking access...');
        const trackingResponse = await axios.get('http://localhost:3001/api/tracking', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('✅ Tracking access successful');
        console.log(`📊 Tracking data count: ${trackingResponse.data.data?.length || 0}`);
      } catch (error) {
        console.log('⚠️ Tracking access test:', error.response?.data?.message || error.message);
      }
      
      // Test users list access (drivers should have limited access)
      try {
        console.log('\n👥 Testing users list access...');
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
      } catch (error) {
        console.log('⚠️ Users list access test:', error.response?.data?.message || error.message);
      }
      
      // Test referral access (drivers might have limited access)
      try {
        console.log('\n📋 Testing referral access...');
        const referralResponse = await axios.get('http://localhost:3001/api/rujukan', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('✅ Referral access successful');
        console.log(`📊 Referral data count: ${referralResponse.data.data?.length || 0}`);
      } catch (error) {
        console.log('⚠️ Referral access test:', error.response?.data?.message || error.message);
      }
      
    } else {
      console.log('❌ Login failed:', loginResponse.data.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testLoginDriverRSUDLeuwiliang();
