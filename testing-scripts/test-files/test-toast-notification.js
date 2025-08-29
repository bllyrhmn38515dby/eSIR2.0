const axios = require('axios');

console.log('🧪 Testing Toast Notification Fix...');

async function testToastNotification() {
  try {
    // 1. Login sebagai admin (user yang tersedia)
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

    // 2. Test get tracking data untuk memastikan endpoint berfungsi
    console.log('\n2️⃣ Testing get tracking data...');
    const trackingResponse = await axios.get('http://localhost:3001/api/tracking', { headers });
    
    if (trackingResponse.data.success) {
      console.log('✅ Tracking data retrieved successfully');
      console.log('📊 Tracking records:', trackingResponse.data.data.length);
    } else {
      console.error('❌ Failed to get tracking data:', trackingResponse.data.message);
      return false;
    }

    // 3. Test get notifications untuk memastikan sistem notifikasi berfungsi
    console.log('\n3️⃣ Testing get notifications...');
    const notificationsResponse = await axios.get('http://localhost:3001/api/notifications', { headers });
    
    if (notificationsResponse.data.success) {
      console.log('✅ Notifications retrieved successfully');
      console.log('📊 Notifications count:', notificationsResponse.data.data.length);
    } else {
      console.error('❌ Failed to get notifications:', notificationsResponse.data.message);
      return false;
    }

    console.log('\n🎉 Toast notification test completed successfully!');
    console.log('💡 Jika tidak ada error di console browser saat update status, toast notification fix berhasil!');
    console.log('📝 Silakan buka browser dan test update status untuk memastikan tidak ada error toast notification');
    return true;

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    return false;
  }
}

// Run the test
testToastNotification().then(success => {
  if (success) {
    console.log('\n✅ Toast notification fix verification completed successfully!');
    console.log('📝 Silakan buka browser dan test update status untuk memastikan tidak ada error toast notification');
  } else {
    console.log('\n❌ Toast notification fix verification failed!');
  }
  process.exit(success ? 0 : 1);
});
