console.log('🚀 Starting rujukan test...');

const axios = require('axios');

async function testRujukan() {
  console.log('🔍 Testing rujukan API...');
  
  try {
    // Test server
    console.log('1️⃣ Testing server...');
    try {
      const testResponse = await axios.get('http://localhost:3001/test');
      console.log('✅ Server OK:', testResponse.data);
    } catch (error) {
      console.log('❌ Server error:', error.message);
      return;
    }
    
    // Test login
    console.log('\n2️⃣ Testing login...');
    try {
      const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
        email: 'willinmm@esirv2faskes.com',
        password: 'faskes123'
      });
      
      const token = loginResponse.data.data.token;
      console.log('✅ Login OK');
      
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      // Test create rujukan
      console.log('\n3️⃣ Testing create rujukan...');
      const rujukanData = {
        nik: '1234567890123461',
        nama_pasien: 'Test Final',
        tanggal_lahir: '1990-01-01',
        jenis_kelamin: 'L',
        alamat: 'Test Address',
        telepon: '081234567890',
        faskes_asal_id: 3,
        faskes_tujuan_id: 1,
        diagnosa: 'Test Diagnosa',
        alasan_rujukan: 'Test Alasan'
      };
      
      console.log('📤 Sending data:', rujukanData);
      const createResponse = await axios.post('http://localhost:3001/api/rujukan/with-pasien', rujukanData, { headers });
      
      console.log('✅ Create rujukan OK!');
      console.log('Response:', createResponse.data);
      
    } catch (error) {
      console.log('❌ Login error:', error.message);
      if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Data:', error.response.data);
      }
    }
    
  } catch (error) {
    console.log('❌ General error:', error.message);
  }
  
  console.log('\n🏁 Test completed');
}

testRujukan().catch(error => {
  console.log('❌ Test failed:', error.message);
});
