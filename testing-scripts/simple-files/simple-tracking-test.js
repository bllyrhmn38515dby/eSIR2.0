const axios = require('axios');

console.log('🧪 Simple Tracking Test...');

async function testTracking() {
  try {
    // 1. Test login
    console.log('\n1️⃣ Testing login...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@esir.com',
      password: 'admin123'
    });
    
    console.log('Login response:', loginResponse.data);
    
    if (!loginResponse.data.success) {
      console.error('❌ Login failed');
      return false;
    }
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    
    // 2. Test tracking sessions endpoint
    console.log('\n2️⃣ Testing tracking sessions...');
    const headers = { Authorization: `Bearer ${token}` };
    
    try {
      const sessionsResponse = await axios.get('http://localhost:3001/api/tracking/sessions/active', { headers });
      console.log('Sessions response:', sessionsResponse.data);
      
      if (sessionsResponse.data.success) {
        console.log('✅ Sessions retrieved successfully');
        console.log('Sessions count:', sessionsResponse.data.data.length);
        
        if (sessionsResponse.data.data.length > 0) {
          const session = sessionsResponse.data.data[0];
          console.log('First session:', session);
          
          // 3. Test tracking data endpoint
          console.log('\n3️⃣ Testing tracking data...');
          const trackingResponse = await axios.get(`http://localhost:3001/api/tracking/${session.rujukan_id}`, { headers });
          console.log('Tracking response:', trackingResponse.data);
          
          if (trackingResponse.data.success) {
            console.log('✅ Tracking data retrieved successfully');
            console.log('Tracking data structure:', Object.keys(trackingResponse.data.data));
          } else {
            console.error('❌ Failed to get tracking data');
          }
        }
      } else {
        console.error('❌ Failed to get sessions');
      }
    } catch (error) {
      console.error('❌ Error with tracking endpoints:', error.response?.data || error.message);
    }
    
    console.log('\n🎉 Test completed!');
    return true;
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    return false;
  }
}

testTracking().then(success => {
  console.log(success ? '\n✅ Test passed!' : '\n❌ Test failed!');
  process.exit(success ? 0 : 1);
});
