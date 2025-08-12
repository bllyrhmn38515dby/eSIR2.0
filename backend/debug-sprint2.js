const axios = require('axios');

async function debugSprint2() {
  try {
    console.log('🔍 DEBUG SPRINT 2 ERRORS');
    console.log('========================');
    
    // Login
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@pusat.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.data.token;
    console.log('✅ Login berhasil');
    
    // Test create pasien dengan detail error
    console.log('\n🔍 Test Create Pasien...');
    try {
      const pasienData = {
        nama: 'Test Pasien',
        nik: '3573010101990004',
        tanggal_lahir: '1999-01-01',
        jenis_kelamin: 'L',
        alamat: 'Jl. Test No.123, Surabaya',
        telepon: '081234567893',
        golongan_darah: 'O'
      };
      
      const response = await axios.post('http://localhost:3001/api/pasien', pasienData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('✅ Create pasien berhasil:', response.data);
      
    } catch (error) {
      console.log('❌ Create pasien error:');
      console.log('Status:', error.response?.status);
      console.log('Message:', error.response?.data?.message);
      console.log('Full error:', error.response?.data);
    }
    
    // Test create rujukan dengan detail error
    console.log('\n🔍 Test Create Rujukan...');
    try {
      const rujukanData = {
        pasien_id: 1,
        faskes_tujuan_id: 1,
        diagnosa: 'Hipertensi Grade 1',
        alasan_rujukan: 'Memerlukan pemeriksaan lebih lanjut'
      };
      
      const response = await axios.post('http://localhost:3001/api/rujukan', rujukanData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('✅ Create rujukan berhasil:', response.data);
      
    } catch (error) {
      console.log('❌ Create rujukan error:');
      console.log('Status:', error.response?.status);
      console.log('Message:', error.response?.data?.message);
      console.log('Full error:', error.response?.data);
    }
    
  } catch (error) {
    console.error('❌ Debug error:', error.message);
  }
}

debugSprint2();
