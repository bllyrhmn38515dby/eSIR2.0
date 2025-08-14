const axios = require('axios');

async function quickTest() {
  try {
    console.log('🧪 Quick test...');
    
    const response = await axios.get('http://localhost:3001/test');
    console.log('✅ Server response:', response.data);
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Server tidak berjalan');
    }
  }
}

quickTest();
