const axios = require('axios');
const io = require('socket.io-client');

let authToken = '';
let socket = null;

// Test API endpoints
async function testAPI() {
  try {
    console.log('🔍 Testing API endpoints...');
    
    // Login
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@pusat.com',
      password: 'password123'
    });
    
    authToken = loginResponse.data.data.token;
    console.log('✅ Login successful');
    
    // Test notifications API
    console.log('\n📋 Testing notifications API...');
    
    const notificationsResponse = await axios.get('http://localhost:3001/api/notifications', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    console.log('✅ Notifications API working:', notificationsResponse.data.success);
    console.log('Total notifications:', notificationsResponse.data.data.length);
    
    // Test unread count
    const unreadResponse = await axios.get('http://localhost:3001/api/notifications/unread-count', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    console.log('✅ Unread count API working:', unreadResponse.data.success);
    console.log('Unread count:', unreadResponse.data.data.unreadCount);
    
    return true;
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    return false;
  }
}

// Test Socket.IO connection
async function testSocketIO() {
  return new Promise((resolve) => {
    console.log('\n🔌 Testing Socket.IO connection...');
    
    socket = io('http://localhost:3001', {
      auth: {
        token: authToken
      }
    });
    
    socket.on('connect', () => {
      console.log('✅ Socket.IO connected successfully');
    });
    
    socket.on('connect_error', (error) => {
      console.error('❌ Socket.IO connection failed:', error.message);
      resolve(false);
    });
    
    socket.on('notification', (data) => {
      console.log('📢 Received notification:', data);
    });
    
    // Test sending notification
    setTimeout(() => {
      socket.emit('send-notification', {
        type: 'test',
        title: 'Test Notification',
        message: 'This is a test notification',
        targetRoom: 'admin-room'
      });
      console.log('✅ Test notification sent');
      
      setTimeout(() => {
        socket.disconnect();
        console.log('✅ Socket.IO test completed');
        resolve(true);
      }, 1000);
    }, 1000);
  });
}

// Test realtime features
async function testRealtimeFeatures() {
  try {
    console.log('\n🚀 Testing realtime features...');
    
    // Create a new rujukan to trigger notification
    console.log('📝 Creating test rujukan...');
    
    const rujukanResponse = await axios.post('http://localhost:3001/api/rujukan', {
      pasien_id: 1,
      faskes_tujuan_id: 1,
      diagnosa: 'Test Diagnosa',
      alasan_rujukan: 'Test Alasan Rujukan',
      catatan_asal: 'Test Catatan'
    }, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    console.log('✅ Test rujukan created:', rujukanResponse.data.success);
    
    // Wait for notification
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return true;
  } catch (error) {
    console.error('❌ Realtime test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    return false;
  }
}

// Main test function
async function runSprint3Tests() {
  console.log('🚀 SPRINT 3 TEST - REALTIME FEATURES');
  console.log('=====================================');
  
  // Test API
  const apiSuccess = await testAPI();
  if (!apiSuccess) {
    console.log('❌ API test failed, stopping...');
    return;
  }
  
  // Test Socket.IO
  const socketSuccess = await testSocketIO();
  if (!socketSuccess) {
    console.log('❌ Socket.IO test failed, stopping...');
    return;
  }
  
  // Test realtime features
  const realtimeSuccess = await testRealtimeFeatures();
  
  console.log('\n🎉 SPRINT 3 TEST RESULTS');
  console.log('========================');
  console.log('✅ API Endpoints:', apiSuccess ? 'PASS' : 'FAIL');
  console.log('✅ Socket.IO:', socketSuccess ? 'PASS' : 'FAIL');
  console.log('✅ Realtime Features:', realtimeSuccess ? 'PASS' : 'FAIL');
  
  if (apiSuccess && socketSuccess && realtimeSuccess) {
    console.log('\n🎊 ALL TESTS PASSED! Sprint 3 is working correctly!');
  } else {
    console.log('\n⚠️ Some tests failed. Please check the implementation.');
  }
}

// Run tests
runSprint3Tests().catch(console.error);
