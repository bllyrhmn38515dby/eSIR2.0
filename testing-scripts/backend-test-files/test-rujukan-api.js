const axios = require('axios');

async function testRujukanAPI() {
  try {
    console.log('🔍 Testing Rujukan API...');
    
    // Test tanpa token dulu
    const response = await axios.get('http://localhost:3001/api/rujukan');
    console.log('✅ Response without token:', response.data);
  } catch (error) {
    console.log('❌ Error without token:', error.response?.data || error.message);
    
    // Test dengan token dummy
    try {
      const response = await axios.get('http://localhost:3001/api/rujukan', {
        headers: {
          'Authorization': 'Bearer dummy-token'
        }
      });
      console.log('✅ Response with dummy token:', response.data);
    } catch (error2) {
      console.log('❌ Error with dummy token:', error2.response?.data || error2.message);
    }
  }
}

testRujukanAPI();
