const axios = require('axios');

console.log('🧪 Testing Tracking Data Structure...');

async function testTrackingData() {
  try {
    // 1. Login sebagai admin
    console.log('\n1️⃣ Login sebagai admin...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@esir.com',
      password: 'admin123'
    });

    if (!loginResponse.data.success) {
      console.error('❌ Login failed:', loginResponse.data.message);
      return false;
    }

    const token = loginResponse.data.token;
    const headers = { Authorization: `Bearer ${token}` };
    console.log('✅ Login successful, token obtained');

    // 2. Get active tracking sessions
    console.log('\n2️⃣ Get active tracking sessions...');
    const sessionsResponse = await axios.get('http://localhost:3001/api/tracking/sessions/active', { headers });
    
    if (!sessionsResponse.data.success) {
      console.error('❌ Failed to get active sessions:', sessionsResponse.data.message);
      return false;
    }

    const sessions = sessionsResponse.data.data;
    console.log('✅ Active sessions retrieved:', sessions.length, 'sessions');

    if (sessions.length === 0) {
      console.log('ℹ️ No active sessions found');
      return true;
    }

    // 3. Test tracking data for first session
    console.log('\n3️⃣ Test tracking data for first session...');
    const firstSession = sessions[0];
    console.log('📋 Session details:', {
      id: firstSession.id,
      nomor_rujukan: firstSession.nomor_rujukan,
      status: firstSession.status,
      rujukan_id: firstSession.rujukan_id
    });

    const trackingResponse = await axios.get(`http://localhost:3001/api/tracking/${firstSession.rujukan_id}`, { headers });
    
    if (!trackingResponse.data.success) {
      console.error('❌ Failed to get tracking data:', trackingResponse.data.message);
      return false;
    }

    const trackingData = trackingResponse.data.data;
    console.log('✅ Tracking data retrieved successfully');
    
    // 4. Analyze tracking data structure
    console.log('\n4️⃣ Analyze tracking data structure...');
    console.log('📊 Tracking data structure:');
    console.log('- tracking:', trackingData.tracking ? '✅ Present' : '❌ Missing');
    console.log('- route:', trackingData.route ? '✅ Present' : '❌ Missing');
    console.log('- rujukan:', trackingData.rujukan ? '✅ Present' : '❌ Missing');

    if (trackingData.tracking) {
      console.log('\n📍 Tracking details:');
      console.log('- latitude:', trackingData.tracking.latitude || '❌ Missing');
      console.log('- longitude:', trackingData.tracking.longitude || '❌ Missing');
      console.log('- status:', trackingData.tracking.status || '❌ Missing');
      console.log('- updated_at:', trackingData.tracking.updated_at || '❌ Missing');
    }

    if (trackingData.route) {
      console.log('\n🛣️ Route details:');
      console.log('- origin:', trackingData.route.origin ? '✅ Present' : '❌ Missing');
      console.log('- destination:', trackingData.route.destination ? '✅ Present' : '❌ Missing');
      
      if (trackingData.route.origin) {
        console.log('  - origin.lat:', trackingData.route.origin.lat || '❌ Missing');
        console.log('  - origin.lng:', trackingData.route.origin.lng || '❌ Missing');
        console.log('  - origin.name:', trackingData.route.origin.name || '❌ Missing');
      }
      
      if (trackingData.route.destination) {
        console.log('  - destination.lat:', trackingData.route.destination.lat || '❌ Missing');
        console.log('  - destination.lng:', trackingData.route.destination.lng || '❌ Missing');
        console.log('  - destination.name:', trackingData.route.destination.name || '❌ Missing');
      }
    }

    if (trackingData.rujukan) {
      console.log('\n📋 Rujukan details:');
      console.log('- nomor_rujukan:', trackingData.rujukan.nomor_rujukan || '❌ Missing');
      console.log('- nama_pasien:', trackingData.rujukan.nama_pasien || '❌ Missing');
    }

    // 5. Check if data is sufficient for map rendering
    console.log('\n5️⃣ Check map rendering requirements...');
    const hasTrackingCoords = trackingData.tracking && trackingData.tracking.latitude && trackingData.tracking.longitude;
    const hasOriginCoords = trackingData.route && trackingData.route.origin && trackingData.route.origin.lat && trackingData.route.origin.lng;
    const hasDestCoords = trackingData.route && trackingData.route.destination && trackingData.route.destination.lat && trackingData.route.destination.lng;
    
    console.log('📍 Current position marker:', hasTrackingCoords ? '✅ Can render' : '❌ Cannot render');
    console.log('🟢 Origin marker:', hasOriginCoords ? '✅ Can render' : '❌ Cannot render');
    console.log('🔴 Destination marker:', hasDestCoords ? '✅ Can render' : '❌ Cannot render');
    console.log('🛣️ Route polyline:', (hasOriginCoords && hasDestCoords) ? '✅ Can render' : '❌ Cannot render');

    console.log('\n🎉 Tracking data analysis completed!');
    return true;

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    return false;
  }
}

// Run the test
testTrackingData().then(success => {
  if (success) {
    console.log('\n✅ Tracking data test completed successfully!');
    console.log('📝 Silakan periksa output di atas untuk melihat struktur data tracking');
  } else {
    console.log('\n❌ Tracking data test failed!');
  }
  process.exit(success ? 0 : 1);
});
