const { exec } = require('child_process');

function testTrackingEndpoint() {
  console.log('🧪 Testing tracking endpoint...\n');

  // Test 1: Check if server is running
  console.log('1. Testing server connection...');
  exec('curl -X GET "http://localhost:3001/test"', (error, stdout, stderr) => {
    if (error) {
      console.log('❌ Server not responding:', error.message);
      return;
    }
    console.log('✅ Server is running:', stdout);
    
    // Test 2: Test tracking endpoint
    console.log('\n2. Testing tracking endpoint...');
    exec('curl -X POST "http://localhost:3001/api/tracking/start-session" -H "Content-Type: application/json" -d "{\\"rujukan_id\\": 1}"', (error, stdout, stderr) => {
      if (error) {
        console.log('❌ Error:', error.message);
        return;
      }
      console.log('✅ Response:', stdout);
    });
  });
}

testTrackingEndpoint();
