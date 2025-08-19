const { exec } = require('child_process');

function testSimpleEndpoints() {
  console.log('🧪 Testing simple endpoints...\n');

  // Test 1: Basic server
  console.log('1. Testing basic server...');
  exec('curl -X GET "http://localhost:3001/test"', (error, stdout, stderr) => {
    if (error) {
      console.log('❌ Error:', error.message);
      return;
    }
    console.log('✅ Server response:', stdout);
    
    // Test 2: Auth endpoint
    console.log('\n2. Testing auth endpoint...');
    exec('curl -X GET "http://localhost:3001/api/auth/test"', (error, stdout, stderr) => {
      if (error) {
        console.log('❌ Auth error:', error.message);
        return;
      }
      console.log('✅ Auth response:', stdout);
      
      // Test 3: Tracking endpoint without auth
      console.log('\n3. Testing tracking endpoint without auth...');
      exec('curl -X POST "http://localhost:3001/api/tracking/start-session" -H "Content-Type: application/json" -d "{\\"rujukan_id\\": 1}"', (error, stdout, stderr) => {
        if (error) {
          console.log('❌ Tracking error:', error.message);
          return;
        }
        console.log('✅ Tracking response:', stdout);
      });
    });
  });
}

testSimpleEndpoints();
