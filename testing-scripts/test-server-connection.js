const axios = require('axios');

async function testServerConnection() {
  try {
    console.log('🧪 Testing server connection...');
    
    const response = await axios.get('http://localhost:3001/test', {
      timeout: 5000
    });
    
    console.log('✅ Server is running and accessible!');
    console.log('Response:', response.data);
    return true;
  } catch (error) {
    console.log('❌ Server connection failed:', error.message);
    return false;
  }
}

testServerConnection();
