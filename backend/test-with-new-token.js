const { exec } = require('child_process');

function testWithNewToken() {
  console.log('🧪 Testing with new token...\n');

  const newToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIwLCJlbWFpbCI6IndpbGxpbm1tQGVzaXJ2MmZhc2tlcy5jb20iLCJyb2xlIjoiYWRtaW5fZmFza2VzIiwiaWF0IjoxNzU1NTM1MjY1LCJleHAiOjE3NTU2MjE2NjV9.c_oBpKhcbVJGvoB61N0TzVYnpf0U6kzaaJQs4wy0dEmA';

  // Test tracking endpoint with new token
  console.log('1. Testing start-session with new token...');
  exec(`curl -X POST "http://localhost:3001/api/tracking/start-session" -H "Authorization: Bearer ${newToken}" -H "Content-Type: application/json" -d "{\\"rujukan_id\\": 1, \\"device_id\\": \\"test-device\\"}"`, (error, stdout, stderr) => {
    if (error) {
      console.log('❌ Error:', error.message);
      return;
    }
    console.log('✅ Response:', stdout);
  });
}

testWithNewToken();
