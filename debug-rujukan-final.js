const axios = require('axios');

async function debugRujukanFinal() {
  console.log('🔍 Debug Rujukan Final...\n');
  
  try {
    // Step 1: Test server connectivity
    console.log('1️⃣ Testing server...');
    try {
      const testResponse = await axios.get('http://localhost:3001/test', { timeout: 5000 });
      console.log('✅ Server OK:', testResponse.data);
    } catch (error) {
      console.log('❌ Server error:', error.message);
      return;
    }
    
    // Step 2: Test login
    console.log('\n2️⃣ Testing login...');
    try {
      const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
        email: 'willinmm@esirv2faskes.com',
        password: 'faskes123'
      }, { timeout: 5000 });
      
      const token = loginResponse.data.data.token;
      console.log('✅ Login OK, token received');
      
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      // Step 3: Test GET rujukan
      console.log('\n3️⃣ Testing GET rujukan...');
      try {
        const getResponse = await axios.get('http://localhost:3001/api/rujukan', { headers, timeout: 5000 });
        console.log('✅ GET rujukan OK, count:', getResponse.data.data.length);
      } catch (error) {
        console.log('❌ GET rujukan error:', error.response?.data || error.message);
      }
      
      // Step 4: Test POST rujukan
      console.log('\n4️⃣ Testing POST rujukan...');
      const rujukanData = {
        nik: '1234567890123460',
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
      
      try {
        const createResponse = await axios.post('http://localhost:3001/api/rujukan/with-pasien', rujukanData, { headers, timeout: 10000 });
        console.log('✅ POST rujukan OK!');
        console.log('Response:', createResponse.data);
      } catch (error) {
        console.log('❌ POST rujukan error:');
        console.log('Status:', error.response?.status);
        console.log('Data:', error.response?.data);
        console.log('Message:', error.message);
      }
      
    } catch (error) {
      console.log('❌ Login error:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.log('❌ General error:', error.message);
  }
  
  console.log('\n🏁 Debug completed');
}

debugRujukanFinal();
