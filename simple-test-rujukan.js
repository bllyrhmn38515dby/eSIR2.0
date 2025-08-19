const axios = require('axios');

async function simpleTestRujukan() {
  try {
    console.log('🧪 Simple Rujukan API Test...\n');
    
    // Test basic connectivity first
    console.log('1️⃣ Testing server connectivity...');
    try {
      const healthResponse = await axios.get('http://localhost:3001/api/health');
      console.log('✅ Server is running, health status:', healthResponse.data);
    } catch (error) {
      console.log('❌ Server not responding:', error.message);
      return;
    }
    
    // Test login
    console.log('\n2️⃣ Testing login...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'willinmm@esirv2faskes.com',
      password: 'faskes123'
    });
    
    const token = loginResponse.data.data.token;
    console.log('✅ Login successful');
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    // Test GET rujukan first
    console.log('\n3️⃣ Testing GET /api/rujukan...');
    const getResponse = await axios.get('http://localhost:3001/api/rujukan', { headers });
    console.log('✅ GET rujukan successful, count:', getResponse.data.data.length);
    
    // Test POST rujukan with minimal data
    console.log('\n4️⃣ Testing POST /api/rujukan/with-pasien...');
    const minimalData = {
      nik: '1234567890123458',
      nama_pasien: 'Test Minimal',
      tanggal_lahir: '1990-01-01',
      jenis_kelamin: 'L',
      alamat: 'Test Address',
      telepon: '081234567890',
      faskes_asal_id: 3,
      faskes_tujuan_id: 1,
      diagnosa: 'Test Diagnosa',
      alasan_rujukan: 'Test Alasan'
    };
    
    console.log('📤 Sending minimal data:', minimalData);
    
    const postResponse = await axios.post('http://localhost:3001/api/rujukan/with-pasien', minimalData, { headers });
    
    console.log('✅ POST rujukan successful!');
    console.log('Status:', postResponse.status);
    console.log('Response:', postResponse.data);
    
  } catch (error) {
    console.log('\n❌ Test failed!');
    console.log('Error type:', error.constructor.name);
    console.log('Error message:', error.message);
    
    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response data:', error.response.data);
    } else if (error.request) {
      console.log('No response received');
    }
  }
}

simpleTestRujukan()
  .then(() => {
    console.log('\n✅ Simple test completed!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Simple test failed:', error.message);
    process.exit(1);
  });
