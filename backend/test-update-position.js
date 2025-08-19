const { exec } = require('child_process');

function testUpdatePosition() {
  console.log('🧪 Testing update-position endpoint...\n');

  const newToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIwLCJlbWFpbCI6IndpbGxpbm1tQGVzaXJ2MmZhc2tlcy5jb20iLCJyb2xlIjoiYWRtaW5fZmFza2VzIiwiaWF0IjoxNzU1NTM1MjY1LCJleHAiOjE3NTU2MjE2NjV9.c_oBpKhcbVJGvoB61N0TzVYnpf0U6kzaaJQs4wy0dEmA';

  // Test update position dengan koordinat Bogor
  console.log('1. Testing update-position with Bogor coordinates...');
  exec(`curl -X POST "http://localhost:3001/api/tracking/update-position" -H "Content-Type: application/json" -d "{\\"session_token\\": \\"9499921137e10cb80424484e285230d18b1bad57ff9b88fa0d756b416161027a\\", \\"latitude\\": -6.5971, \\"longitude\\": 106.8060, \\"status\\": \\"menunggu\\", \\"speed\\": 0, \\"heading\\": null, \\"accuracy\\": 1000, \\"battery_level\\": 80}"`, (error, stdout, stderr) => {
    if (error) {
      console.log('❌ Error:', error.message);
      return;
    }
    console.log('✅ Response:', stdout);
  });
}

testUpdatePosition();
