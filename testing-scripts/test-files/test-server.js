const { exec } = require('child_process');

function testServer() {
  console.log('🧪 Testing server connection...\n');

  // Test basic server response
  exec('curl -X GET "http://localhost:3001/api/health"', (error, stdout, stderr) => {
    if (error) {
      console.log('❌ Server not responding:', error.message);
      console.log('💡 Make sure server is running with: node index.js');
      return;
    }
    console.log('✅ Server is running:', stdout);
  });
}

testServer();
