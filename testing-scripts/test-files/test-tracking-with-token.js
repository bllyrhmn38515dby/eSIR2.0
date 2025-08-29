const { exec } = require('child_process');

function testTrackingWithToken() {
  console.log('🧪 Testing tracking endpoint with token...\n');

  // Test tracking endpoint with valid token
  console.log('1. Testing start-session with token...');
  exec('curl -X POST "http://localhost:3001/api/tracking/start-session" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIwLCJlbWFpbCI6IndpbGxpbm1tQGVzaXJ2MmZhc2tlcy5jb20iLCJyb2xlIjoiYWRtaW5fZmFza2VzIiwiaWF0IjoxNzU1NTI1ODYzLCJleHAiOjE3NTU2MTIyNjN9.9IFe6r7xB2emZ8-D4QcJpv82Ms2w2NveRIMktCDm8iw" -H "Content-Type: application/json" -d "{\\"rujukan_id\\": 1, \\"device_id\\": \\"test-device\\"}"', (error, stdout, stderr) => {
    if (error) {
      console.log('❌ Error:', error.message);
      return;
    }
    console.log('✅ Response:', stdout);
  });
}

testTrackingWithToken();
