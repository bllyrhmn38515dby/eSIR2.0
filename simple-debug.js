console.log('🚀 Starting simple debug...');

const axios = require('axios');

console.log('📦 Axios loaded');

async function simpleDebug() {
  console.log('🔍 Simple debug started');
  
  try {
    console.log('1️⃣ Testing server...');
    const response = await axios.get('http://localhost:3001/test');
    console.log('✅ Server response:', response.data);
  } catch (error) {
    console.log('❌ Server error:', error.message);
  }
  
  console.log('🏁 Simple debug completed');
}

simpleDebug().catch(error => {
  console.log('❌ Simple debug failed:', error.message);
});
