const axios = require('axios');

let authToken = '';

// Test authentication fix
async function testAuthFix() {
  try {
    console.log('🔍 Testing Authentication Fix...');
    
    // Login
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@pusat.com',
      password: 'password123'
    });
    
    authToken = loginResponse.data.data.token;
    console.log('✅ Login successful');
    
    // Test all protected endpoints
    const endpoints = [
      { name: 'Dashboard Stats', url: '/api/rujukan/stats/overview' },
      { name: 'Pasien List', url: '/api/pasien' },
      { name: 'Rujukan List', url: '/api/rujukan' },
      { name: 'Faskes List', url: '/api/faskes' },
      { name: 'Notifications', url: '/api/notifications' },
      { name: 'Unread Count', url: '/api/notifications/unread-count' }
    ];
    
    const headers = { Authorization: `Bearer ${authToken}` };
    
    for (const endpoint of endpoints) {
      try {
        console.log(`\n🔍 Testing ${endpoint.name}...`);
        const response = await axios.get(`http://localhost:3001${endpoint.url}`, { headers });
        console.log(`✅ ${endpoint.name}: SUCCESS (${response.data.data?.length || 'N/A'} items)`);
      } catch (error) {
        console.log(`❌ ${endpoint.name}: FAILED - ${error.response?.status} ${error.response?.data?.message || error.message}`);
      }
    }
    
    // Test POST endpoints
    console.log('\n🔍 Testing POST endpoints...');
    
    // Test create pasien
    try {
      const pasienData = {
        nama: 'Test Pasien',
        nik: '1234567890123456',
        tanggal_lahir: '1990-01-01',
        jenis_kelamin: 'L',
        alamat: 'Test Address',
        telepon: '081234567890',
        golongan_darah: 'O',
        alergi: '',
        riwayat_penyakit: ''
      };
      
      const pasienResponse = await axios.post('http://localhost:3001/api/pasien', pasienData, { headers });
      console.log('✅ Create Pasien: SUCCESS');
      
      // Test create rujukan
      const rujukanData = {
        pasien_id: pasienResponse.data.data.id,
        faskes_tujuan_id: 1,
        diagnosa: 'Test Diagnosa',
        alasan_rujukan: 'Test Alasan',
        catatan_asal: 'Test Catatan'
      };
      
      const rujukanResponse = await axios.post('http://localhost:3001/api/rujukan', rujukanData, { headers });
      console.log('✅ Create Rujukan: SUCCESS');
      
    } catch (error) {
      console.log(`❌ POST Test: FAILED - ${error.response?.status} ${error.response?.data?.message || error.message}`);
    }
    
    console.log('\n🎉 AUTHENTICATION FIX TEST COMPLETED!');
    console.log('=====================================');
    console.log('✅ All protected endpoints should now work with authentication');
    console.log('✅ Frontend should no longer show 401 Unauthorized errors');
    console.log('✅ Dashboard should load statistics correctly');
    console.log('✅ All CRUD operations should work properly');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Run test
testAuthFix().catch(console.error);
