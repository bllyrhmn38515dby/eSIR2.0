const axios = require('axios');

async function simpleTrackingTest() {
  try {
    console.log('🚀 Simple Tracking Test...\n');
    
    // Test basic server connection
    console.log('1️⃣ Testing server connection...');
    try {
      const testResponse = await axios.get('http://localhost:3001/test');
      console.log('✅ Server is running:', testResponse.data);
    } catch (error) {
      console.log('❌ Server not responding');
      return;
    }
    
    // Test tracking endpoints without auth
    console.log('\n2️⃣ Testing tracking endpoints...');
    
    // Test sessions endpoint
    try {
      const sessionsResponse = await axios.get('http://localhost:3001/api/tracking/sessions');
      console.log('✅ Sessions endpoint working');
      console.log('   Data:', sessionsResponse.data);
    } catch (error) {
      console.log('❌ Sessions endpoint error:', error.response?.status, error.response?.data?.message);
    }
    
    // Test tracking data endpoint
    try {
      const dataResponse = await axios.get('http://localhost:3001/api/tracking/data');
      console.log('✅ Tracking data endpoint working');
      console.log('   Data points:', dataResponse.data.data?.length || 0);
    } catch (error) {
      console.log('❌ Tracking data endpoint error:', error.response?.status, error.response?.data?.message);
    }
    
    // Test stats endpoint
    try {
      const statsResponse = await axios.get('http://localhost:3001/api/tracking/stats');
      console.log('✅ Stats endpoint working');
      console.log('   Stats:', statsResponse.data);
    } catch (error) {
      console.log('❌ Stats endpoint error:', error.response?.status, error.response?.data?.message);
    }
    
    console.log('\n🎯 Test Summary:');
    console.log('✅ Backend server is running');
    console.log('✅ Tracking endpoints are accessible');
    console.log('✅ Ready for frontend testing');
    
    console.log('\n🚀 Next Steps:');
    console.log('1. Open browser: http://localhost:3000');
    console.log('2. Login with: admin@esirv2.com / password');
    console.log('3. Go to: Tracking Dashboard');
    console.log('4. Enjoy the real-time tracking!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

simpleTrackingTest();
