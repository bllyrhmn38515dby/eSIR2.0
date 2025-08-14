const axios = require('axios');

async function testFaskesAPI() {
  try {
    console.log('Testing faskes API...');
    
    // Test tanpa token dulu
    const response = await axios.get('http://localhost:3001/api/faskes');
    console.log('Response:', response.data);
    
    if (response.data.success) {
      console.log('✅ Faskes API berfungsi');
      console.log('Data faskes:', response.data.data);
      console.log('Jumlah faskes:', response.data.data.length);
    } else {
      console.log('❌ Faskes API error:', response.data.message);
    }
    
  } catch (error) {
    console.error('❌ Error testing faskes API:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('⚠️ API memerlukan authentication');
    }
  }
}

testFaskesAPI();
