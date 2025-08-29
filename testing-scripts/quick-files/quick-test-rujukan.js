const axios = require('axios');

async function quickTest() {
  try {
    console.log('🧪 Quick Rujukan Test...');
    
    // Test server
    const testResponse = await axios.get('http://localhost:3001/test');
    console.log('✅ Server OK:', testResponse.data);
    
    // Test login
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
    const rujukanData = {
      nik: '1234567890123459',
      nama_pasien: 'Test Quick',
      tanggal_lahir: '1990-01-01',
      jenis_kelamin: 'L',
      alamat: 'Test Address',
      telepon: '081234567890',
      faskes_asal_id: 3,
      faskes_tujuan_id: 1,
      diagnosa: 'Test Diagnosa',
      alasan_rujukan: 'Test Alasan'
    };
    
    console.log('📤 Creating rujukan...');
    const createResponse = await axios.post('http://localhost:3001/api/rujukan/with-pasien', rujukanData, { headers });
    
    console.log('✅ Create rujukan OK!');
    console.log('Response:', createResponse.data);
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
  }
}

quickTest();
