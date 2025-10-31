const db = require('./config/db');

async function testUpdatePosition() {
  try {
    console.log('🧪 Testing update-position endpoint logic...');
    
    const session_token = '66f724d66f1403323a73d8f5db2beaaf4b5d7fc6a97a23e975b813edc6c5aa17';
    const latitude = -6.5971;
    const longitude = 106.8060;
    const status = 'dalam_perjalanan';
    const speed = 30;
    const heading = 0;
    const accuracy = 10;
    const battery_level = 85;
    
    console.log('📋 Test data:', {
      session_token: session_token.substring(0, 20) + '...',
      latitude,
      longitude,
      status,
      speed,
      heading,
      accuracy,
      battery_level
    });
    
    // Test 1: Check session token
    console.log('\n🔍 Test 1: Checking session token...');
    const [sessionRows] = await db.execute(`
      SELECT ts.*, r.faskes_tujuan_id, ft.latitude as dest_lat, ft.longitude as dest_lng
      FROM tracking_sessions ts
      LEFT JOIN rujukan r ON ts.rujukan_id = r.id
      LEFT JOIN faskes ft ON r.faskes_tujuan_id = ft.id
      WHERE ts.session_token = ? AND ts.is_active = TRUE
    `, [session_token]);
    
    console.log('📊 Session query result:', sessionRows.length, 'rows found');
    
    if (sessionRows.length === 0) {
      console.log('❌ Invalid session token');
      return;
    }
    
    const session = sessionRows[0];
    const rujukan_id = session.rujukan_id;
    console.log('✅ Session found for rujukan_id:', rujukan_id);
    
    // Test 2: Check if tracking_data exists for this rujukan_id
    console.log('\n🔍 Test 2: Checking tracking_data...');
    const [trackingRows] = await db.execute(`
      SELECT * FROM tracking_data WHERE rujukan_id = ?
    `, [rujukan_id]);
    
    console.log('📊 Tracking data rows:', trackingRows.length);
    
    if (trackingRows.length === 0) {
      console.log('❌ No tracking_data found for rujukan_id:', rujukan_id);
      console.log('💡 Creating initial tracking data...');
      
      await db.execute(`
        INSERT INTO tracking_data (rujukan_id, latitude, longitude, status, estimated_time, estimated_distance)
        VALUES (?, ?, ?, 'menunggu', NULL, NULL)
      `, [rujukan_id, 0, 0]);
      
      console.log('✅ Initial tracking data created');
    }
    
    // Test 3: Calculate distance and estimated time
    console.log('\n🔍 Test 3: Calculating distance and time...');
    let estimated_distance = null;
    let estimated_time = null;
    
    if (session.dest_lat && session.dest_lng) {
      // Haversine formula
      const R = 6371; // Radius bumi dalam km
      const dLat = (session.dest_lat - latitude) * Math.PI / 180;
      const dLon = (session.dest_lng - longitude) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(latitude * Math.PI / 180) * Math.cos(session.dest_lat * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      estimated_distance = R * c;
      
      const avgSpeed = speed || 30;
      estimated_time = Math.round((estimated_distance / avgSpeed) * 60);
      
      if (estimated_time < 0) estimated_time = 0;
      if (estimated_time > 1440) estimated_time = 1440;
      
      console.log('✅ Distance calculated:', estimated_distance, 'km');
      console.log('✅ Estimated time:', estimated_time, 'minutes');
    } else {
      console.log('⚠️ No destination coordinates found');
    }
    
    // Test 4: Update tracking data
    console.log('\n🔍 Test 4: Updating tracking data...');
    const updateData = [
      latitude, longitude, status, estimated_time,
      estimated_distance, speed || 0, heading || null, accuracy || 0, battery_level || null,
      rujukan_id
    ];
    
    console.log('📋 Update data:', updateData);
    
    const updateResult = await db.execute(`
      UPDATE tracking_data 
      SET latitude = ?, longitude = ?, status = ?, estimated_time = ?, 
          estimated_distance = ?, speed = ?, heading = ?, accuracy = ?, battery_level = ?
      WHERE rujukan_id = ?
    `, updateData);
    
    console.log('✅ Tracking data updated successfully');
    console.log('📊 Update result:', updateResult);
    
    // Test 5: Verify update
    console.log('\n🔍 Test 5: Verifying update...');
    const [verifyRows] = await db.execute(`
      SELECT * FROM tracking_data WHERE rujukan_id = ?
    `, [rujukan_id]);
    
    console.log('📊 Updated tracking data:', verifyRows[0]);
    
    console.log('\n✅ All tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('❌ Error details:', {
      message: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage,
      sqlState: error.sqlState,
      errno: error.errno,
      stack: error.stack
    });
  } finally {
    process.exit(0);
  }
}

testUpdatePosition();
