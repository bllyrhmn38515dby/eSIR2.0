const { exec } = require('child_process');

function testSimpleCurl() {
  console.log('🧪 Testing simple curl...\n');

  // Test server connection
  console.log('1. Testing server connection...');
  exec('curl -X GET "http://localhost:3001/test"', (error, stdout, stderr) => {
    if (error) {
      console.log('❌ Server not running:', error.message);
      return;
    }
    console.log('✅ Server is running:', stdout);
    
    // Test update position
    console.log('\n2. Testing update position...');
    exec('curl -X POST "http://localhost:3001/api/tracking/update-position" -H "Content-Type: application/json" -d "{\\"session_token\\": \\"9596b377de164787acf655564e0d9a8c4405fc5f0a5affd4221d44a43489555c\\", \\"latitude\\": -6.5933988, \\"longitude\\": 106.6582559, \\"status\\": \\"dijemput\\"}"', (error, stdout, stderr) => {
      if (error) {
        console.log('❌ Error:', error.message);
        return;
      }
      console.log('✅ Response:', stdout);
    });
  });
}

testSimpleCurl();
