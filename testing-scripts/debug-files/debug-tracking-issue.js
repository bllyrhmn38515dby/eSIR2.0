const axios = require('axios');

console.log('🔍 Debugging Tracking Issue...');

async function debugTracking() {
  try {
    // 1. Test login dan dapatkan token
    console.log('\n1️⃣ Login test...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@esir.com',
      password: 'admin123'
    });
    
    if (!loginResponse.data.success) {
      console.error('❌ Login failed:', loginResponse.data.message);
      return false;
    }
    
    const token = loginResponse.data.data.token;
    console.log('✅ Login successful');
    console.log('🔑 Token:', token.substring(0, 50) + '...');
    
    // 2. Test endpoint lain untuk memastikan token valid
    console.log('\n2️⃣ Test token dengan endpoint lain...');
    const headers = { Authorization: `Bearer ${token}` };
    
    try {
      const faskesResponse = await axios.get('http://localhost:3001/api/faskes', { headers });
      console.log('✅ Faskes endpoint works with token');
    } catch (error) {
      console.error('❌ Faskes endpoint failed:', error.response?.data || error.message);
    }
    
    // 3. Test tracking sessions dengan curl command
    console.log('\n3️⃣ Test tracking sessions with curl...');
    const curlCommand = `curl -X GET "http://localhost:3001/api/tracking/sessions/active" -H "Authorization: Bearer ${token}"`;
    console.log('🔧 Curl command:', curlCommand);
    
    // 4. Test tracking sessions dengan axios
    console.log('\n4️⃣ Test tracking sessions with axios...');
    try {
      const sessionsResponse = await axios.get('http://localhost:3001/api/tracking/sessions/active', { headers });
      console.log('✅ Sessions response:', sessionsResponse.data);
      
      if (sessionsResponse.data.success && sessionsResponse.data.data.length > 0) {
        const session = sessionsResponse.data.data[0];
        console.log('📋 First session:', session);
        
        // 5. Test tracking data
        console.log('\n5️⃣ Test tracking data...');
        const trackingResponse = await axios.get(`http://localhost:3001/api/tracking/${session.rujukan_id}`, { headers });
        console.log('✅ Tracking response:', trackingResponse.data);
        
        if (trackingResponse.data.success) {
          const trackingData = trackingResponse.data.data;
          console.log('📊 Tracking data structure:');
          console.log('- Has tracking:', !!trackingData.tracking);
          console.log('- Has route:', !!trackingData.route);
          console.log('- Has rujukan:', !!trackingData.rujukan);
          
          if (trackingData.tracking) {
            console.log('📍 Tracking coords:', {
              lat: trackingData.tracking.latitude,
              lng: trackingData.tracking.longitude
            });
          }
          
          if (trackingData.route) {
            console.log('🛣️ Route data:', {
              origin: trackingData.route.origin ? {
                lat: trackingData.route.origin.lat,
                lng: trackingData.route.origin.lng,
                name: trackingData.route.origin.name
              } : 'Missing',
              destination: trackingData.route.destination ? {
                lat: trackingData.route.destination.lat,
                lng: trackingData.route.destination.lng,
                name: trackingData.route.destination.name
              } : 'Missing'
            });
          }
        }
      } else {
        console.log('ℹ️ No active sessions found');
      }
    } catch (error) {
      console.error('❌ Tracking sessions failed:', error.response?.data || error.message);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Error headers:', error.response?.headers);
    }
    
    console.log('\n🎉 Debug completed!');
    return true;
    
  } catch (error) {
    console.error('❌ Debug failed:', error.response?.data || error.message);
    return false;
  }
}

debugTracking().then(success => {
  console.log(success ? '\n✅ Debug completed!' : '\n❌ Debug failed!');
  process.exit(success ? 0 : 1);
});
