const { exec } = require('child_process');

function testLoginWithCurl() {
  console.log('🔍 Testing login with curl...');
  
  const curlCommand = `curl -X POST http://localhost:3001/api/auth/login \
    -H "Content-Type: application/json" \
    -d "{\\"email\\":\\"admin@pusat.com\\",\\"password\\":\\"admin123\\"}"`;
  
  exec(curlCommand, (error, stdout, stderr) => {
    if (error) {
      console.log('❌ Error:', error.message);
      return;
    }
    
    if (stderr) {
      console.log('⚠️  Warning:', stderr);
    }
    
    console.log('✅ Response:', stdout);
    
    try {
      const response = JSON.parse(stdout);
      if (response.success) {
        console.log('🎉 Login successful!');
        console.log('Token:', response.data.token.substring(0, 30) + '...');
        
        // Test protected endpoint
        testProtectedEndpoint(response.data.token);
      } else {
        console.log('❌ Login failed:', response.message);
      }
    } catch (parseError) {
      console.log('❌ Failed to parse response:', parseError.message);
    }
  });
}

function testProtectedEndpoint(token) {
  console.log('\n🔍 Testing protected endpoint...');
  
  const curlCommand = `curl -X GET http://localhost:3001/api/auth/profile \
    -H "Authorization: Bearer ${token}"`;
  
  exec(curlCommand, (error, stdout, stderr) => {
    if (error) {
      console.log('❌ Error:', error.message);
      return;
    }
    
    console.log('✅ Protected endpoint response:', stdout);
    
    try {
      const response = JSON.parse(stdout);
      if (response.success) {
        console.log('🎉 Protected endpoint works!');
        console.log('User:', response.data.nama_lengkap);
      } else {
        console.log('❌ Protected endpoint failed:', response.message);
      }
    } catch (parseError) {
      console.log('❌ Failed to parse response:', parseError.message);
    }
  });
}

testLoginWithCurl();
