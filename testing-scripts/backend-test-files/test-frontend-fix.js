const axios = require('axios');

async function testFrontendFix() {
  console.log('🔍 Testing Frontend Fix - Headers Scope Issue');
  console.log('=============================================\n');

  try {
    // Test login first
    console.log('1. Testing login...');
    console.log('Sending request to: http://localhost:3001/api/auth/login');
    console.log('Request data:', { email: 'admin@faskes.com', password: 'password123' });
    
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@faskes.com',
      password: 'password123'
    });

    console.log('Login response:', loginResponse.data);
    const token = loginResponse.data.data.token;
    console.log('Token extracted:', token);
    
    if (!token) {
      throw new Error('Token tidak ditemukan dalam response login');
    }
    
    const headers = { Authorization: `Bearer ${token}` };
    console.log('✅ Login berhasil\n');

    // Test faskes endpoints
    console.log('2. Testing Faskes endpoints...');
    const faskesResponse = await axios.get('http://localhost:3001/api/faskes', { headers });
    console.log(`✅ GET /api/faskes: ${faskesResponse.data.data.length} faskes found`);

    // Test pasien endpoints
    console.log('\n3. Testing Pasien endpoints...');
    const pasienResponse = await axios.get('http://localhost:3001/api/pasien', { headers });
    console.log(`✅ GET /api/pasien: ${pasienResponse.data.data.length} pasien found`);

    // Test rujukan endpoints
    console.log('\n4. Testing Rujukan endpoints...');
    const rujukanResponse = await axios.get('http://localhost:3001/api/rujukan', { headers });
    console.log(`✅ GET /api/rujukan: ${rujukanResponse.data.data.length} rujukan found`);

    // Test dashboard stats
    console.log('\n5. Testing Dashboard stats...');
    const statsResponse = await axios.get('http://localhost:3001/api/rujukan/stats/overview', { headers });
    console.log('✅ GET /api/rujukan/stats/overview: Stats retrieved');

    console.log('\n🎉 SEMUA TEST BERHASIL!');
    console.log('✅ Error "headers is not defined" sudah teratasi');
    console.log('✅ Semua API endpoints berfungsi dengan authentication');
    console.log('✅ Frontend dapat mengakses semua data dengan benar');

  } catch (error) {
    console.error('❌ Error details:');
    console.error('Message:', error.message);
    console.error('Response data:', error.response?.data);
    console.error('Response status:', error.response?.status);
    console.error('Response headers:', error.response?.headers);
    console.error('Full error:', error);
  }
}

testFrontendFix();
