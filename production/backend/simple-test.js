const axios = require('axios');

async function simpleTest() {
  try {
    console.log('🔗 Testing server connection...');
    
    // Test server connection
    const response = await axios.get('http://localhost:3001/');
    console.log('✅ Server is running');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.error('❌ Server connection failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Server mungkin belum berjalan. Jalankan: npm start');
    }
  }
}

simpleTest();
