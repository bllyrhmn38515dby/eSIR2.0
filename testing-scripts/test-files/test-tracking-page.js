const { exec } = require('child_process');

function testTrackingPage() {
  console.log('🧪 Testing Tracking Page endpoints...\n');

  // Test 1: Get active sessions
  console.log('1. Testing get active sessions...');
  exec('curl -X GET "http://localhost:3001/api/tracking/sessions/active" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIwLCJlbWFpbCI6IndpbGxpbm1tQGVzaXJ2MmZhc2tlcy5jb20iLCJyb2xlIjoiYWRtaW5fZmFza2VzIiwiaWF0IjoxNzU1NTM3NTQyLCJleHAiOjE3NTU2MjM5NDJ9._v67j9PspAs41hkXebQLqe2Nw2U7d7KQvMdeMTyqqP4" -H "Content-Type: application/json"', (error, stdout, stderr) => {
    if (error) {
      console.log('❌ Error:', error.message);
      return;
    }
    console.log('✅ Active sessions response:', stdout);
    
    // Test 2: Get specific tracking data
    console.log('\n2. Testing get specific tracking data...');
    exec('curl -X GET "http://localhost:3001/api/tracking/1" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIwLCJlbWFpbCI6IndpbGxpbm1tQGVzaXJ2MmZhc2tlcy5jb20iLCJyb2xlIjoiYWRtaW5fZmFza2VzIiwiaWF0IjoxNzU1NTM3NTQyLCJleHAiOjE3NTU2MjM5NDJ9._v67j9PspAs41hkXebQLqe2Nw2U7d7KQvMdeMTyqqP4" -H "Content-Type: application/json"', (error, stdout, stderr) => {
      if (error) {
        console.log('❌ Error:', error.message);
        return;
      }
      console.log('✅ Tracking data response:', stdout);
    });
  });
}

testTrackingPage();
