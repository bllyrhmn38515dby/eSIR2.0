const axios = require('axios');

async function testRujukanAPI() {
  try {
    console.log('🧪 Testing Rujukan API...\n');
    
    // First, login to get token
    console.log('1️⃣ Logging in to get token...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@esirv2.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.data.token;
    console.log('✅ Login successful, token received');
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    // Test GET /api/rujukan
    console.log('\n2️⃣ Testing GET /api/rujukan...');
    const rujukanResponse = await axios.get('http://localhost:3001/api/rujukan', { headers });
    
    console.log('✅ Rujukan API response:');
    console.log('Status:', rujukanResponse.status);
    console.log('Success:', rujukanResponse.data.success);
    console.log('Total rujukan:', rujukanResponse.data.data ? rujukanResponse.data.data.length : 0);
    
    if (rujukanResponse.data.data && rujukanResponse.data.data.length > 0) {
      console.log('\n📋 Sample rujukan data:');
      const sampleRujukan = rujukanResponse.data.data[0];
      console.log('  ID:', sampleRujukan.id);
      console.log('  Nomor:', sampleRujukan.nomor_rujukan);
      console.log('  Pasien:', sampleRujukan.nama_pasien);
      console.log('  NIK:', sampleRujukan.nik_pasien);
      console.log('  Asal:', sampleRujukan.faskes_asal_nama);
      console.log('  Tujuan:', sampleRujukan.faskes_tujuan_nama);
      console.log('  Status:', sampleRujukan.status);
      console.log('  Diagnosa:', sampleRujukan.diagnosa);
    }
    
    // Test GET /api/rujukan/stats/overview
    console.log('\n3️⃣ Testing GET /api/rujukan/stats/overview...');
    const statsResponse = await axios.get('http://localhost:3001/api/rujukan/stats/overview', { headers });
    
    console.log('✅ Stats API response:');
    console.log('Status:', statsResponse.status);
    console.log('Success:', statsResponse.data.success);
    console.log('Stats data:', statsResponse.data.data);
    
  } catch (error) {
    console.log('\n❌ API test failed!');
    console.log('Status:', error.response?.status);
    console.log('Error message:', error.response?.data);
    console.log('Full error:', error.message);
    console.log('Error stack:', error.stack);
  }
}

testRujukanAPI()
  .then(() => {
    console.log('\n✅ Rujukan API test completed!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Rujukan API test failed:', error.message);
    process.exit(1);
  });
