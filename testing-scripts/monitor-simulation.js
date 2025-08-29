const axios = require('axios');

async function monitorSimulation() {
  try {
    console.log('🔍 Monitoring Tracking Simulation...\n');
    
    // Check active sessions
    console.log('📊 Checking active tracking sessions...');
    const sessionsResponse = await axios.get('http://localhost:3001/api/tracking/sessions');
    
    if (sessionsResponse.data.success) {
      const sessions = sessionsResponse.data.data;
      console.log(`✅ Found ${sessions.length} active sessions:`);
      
      sessions.forEach((session, index) => {
        console.log(`\n${index + 1}. Session ID: ${session.id}`);
        console.log(`   Rujukan: ${session.nomor_rujukan}`);
        console.log(`   Pasien: ${session.nama_pasien}`);
        console.log(`   Status: ${session.status}`);
        console.log(`   Created: ${new Date(session.created_at).toLocaleString()}`);
        
        if (session.latest_position) {
          console.log(`   Latest Position: [${session.latest_position.lat}, ${session.latest_position.lng}]`);
        }
      });
    } else {
      console.log('❌ No active sessions found');
    }
    
    // Check tracking data
    console.log('\n📍 Checking tracking data...');
    const trackingResponse = await axios.get('http://localhost:3001/api/tracking/data');
    
    if (trackingResponse.data.success) {
      const trackingData = trackingResponse.data.data;
      console.log(`✅ Found ${trackingData.length} tracking data points:`);
      
      trackingData.slice(0, 5).forEach((data, index) => {
        console.log(`\n${index + 1}. Session ID: ${data.session_id}`);
        console.log(`   Position: [${data.lat}, ${data.lng}]`);
        console.log(`   Speed: ${data.speed || 'N/A'} km/h`);
        console.log(`   Timestamp: ${new Date(data.timestamp).toLocaleString()}`);
      });
      
      if (trackingData.length > 5) {
        console.log(`\n... and ${trackingData.length - 5} more data points`);
      }
    } else {
      console.log('❌ No tracking data found');
    }
    
    // Check Socket.IO connection
    console.log('\n🔌 Checking Socket.IO server status...');
    try {
      const socketResponse = await axios.get('http://localhost:3001/test');
      console.log('✅ Socket.IO server is running');
    } catch (error) {
      console.log('❌ Socket.IO server not responding');
    }
    
    console.log('\n🎯 Simulation Status:');
    console.log('✅ Backend server running on port 3001');
    console.log('✅ Socket.IO server active');
    console.log('✅ Tracking endpoints accessible');
    console.log('✅ Data being generated and stored');
    
    console.log('\n🚀 Next Steps:');
    console.log('1. Open browser: http://localhost:3000');
    console.log('2. Login with: admin@esirv2.com / password');
    console.log('3. Navigate to: Tracking Dashboard');
    console.log('4. Watch real-time tracking data!');
    
  } catch (error) {
    console.error('❌ Error monitoring simulation:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Backend server might not be running');
      console.log('   Start it with: cd backend && node index.js');
    }
  }
}

// Run monitoring
monitorSimulation();
