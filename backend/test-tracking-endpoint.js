const fetch = require('node-fetch');

async function testTrackingEndpoint() {
  try {
    console.log('🧪 Testing tracking endpoint...\n');

    // Test login first
    console.log('1. Testing login...');
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'willinmm@esirv2faskes.com',
        password: 'admin123'
      })
    });

    if (!loginResponse.ok) {
      throw new Error('Login failed');
    }

    const loginResult = await loginResponse.json();
    const token = loginResult.data.token;
    console.log('✅ Login successful\n');

    // Test get active sessions
    console.log('2. Testing get active sessions...');
    const sessionsResponse = await fetch('http://localhost:3001/api/tracking/sessions/active', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (sessionsResponse.ok) {
      const sessionsResult = await sessionsResponse.json();
      console.log('✅ Active sessions:', sessionsResult.data);
    } else {
      const errorText = await sessionsResponse.text();
      console.log('❌ Sessions error:', errorText);
    }

    // Test start tracking session
    console.log('\n3. Testing start tracking session...');
    const startResponse = await fetch('http://localhost:3001/api/tracking/start-session', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        rujukan_id: 1,
        device_id: 'test-device'
      })
    });

    if (startResponse.ok) {
      const startResult = await startResponse.json();
      console.log('✅ Start session successful:', startResult.data);
      
      // Test update position
      console.log('\n4. Testing update position...');
      const updateResponse = await fetch('http://localhost:3001/api/tracking/update-position', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          session_token: startResult.data.session_token,
          latitude: -6.5971,
          longitude: 106.8060,
          status: 'dalam_perjalanan',
          speed: 30,
          heading: 90,
          accuracy: 10,
          battery_level: 80
        })
      });

      if (updateResponse.ok) {
        const updateResult = await updateResponse.json();
        console.log('✅ Update position successful:', updateResult.data);
      } else {
        const errorText = await updateResponse.text();
        console.log('❌ Update position error:', errorText);
      }
    } else {
      const errorText = await startResponse.text();
      console.log('❌ Start session error:', errorText);
    }

  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testTrackingEndpoint();
