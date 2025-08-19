const axios = require('axios');

async function testCreateRujukan() {
  try {
    console.log('🧪 Testing Create Rujukan API...\n');
    
    // First, login to get token
    console.log('1️⃣ Logging in to get token...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'willinmm@esirv2faskes.com',
      password: 'faskes123'
    });
    
    const token = loginResponse.data.data.token;
    console.log('✅ Login successful, token received');
    console.log('User:', loginResponse.data.data.user.nama_lengkap);
    console.log('Role:', loginResponse.data.data.user.role);
    console.log('Faskes ID:', loginResponse.data.data.user.faskes_id);
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    // Test creating rujukan with pasien data
    console.log('\n2️⃣ Testing POST /api/rujukan/with-pasien...');
    const rujukanData = {
      // Data Pasien
      nik: '1234567890123457',
      nama_pasien: 'Test Pasien Baru',
      tanggal_lahir: '1995-06-15',
      jenis_kelamin: 'L',
      alamat: 'Jl. Test No. 123, Bogor',
      telepon: '081234567890',
      // Data Rujukan
      faskes_asal_id: 3, // RS dr. H. Marzoeki Mahdi
      faskes_tujuan_id: 1, // RSUD Kota Bogor
      diagnosa: 'Demam berdarah dengue',
      alasan_rujukan: 'Memerlukan perawatan intensif dan transfusi trombosit',
      catatan_asal: 'Pasien sudah diberikan obat penurun demam dan cairan infus'
    };
    
    console.log('📤 Sending rujukan data:', rujukanData);
    
    const createResponse = await axios.post('http://localhost:3001/api/rujukan/with-pasien', rujukanData, { headers });
    
    console.log('\n✅ Create rujukan response:');
    console.log('Status:', createResponse.status);
    console.log('Success:', createResponse.data.success);
    console.log('Message:', createResponse.data.message);
    
    if (createResponse.data.data) {
      console.log('\n📋 Created rujukan data:');
      const rujukan = createResponse.data.data;
      console.log('  ID:', rujukan.id);
      console.log('  Nomor:', rujukan.nomor_rujukan);
      console.log('  Pasien:', rujukan.nama_pasien);
      console.log('  NIK:', rujukan.nik_pasien);
      console.log('  Asal:', rujukan.faskes_asal_nama);
      console.log('  Tujuan:', rujukan.faskes_tujuan_nama);
      console.log('  Status:', rujukan.status);
      console.log('  Diagnosa:', rujukan.diagnosa);
    }
    
  } catch (error) {
    console.log('\n❌ Create rujukan failed!');
    console.log('Status:', error.response?.status);
    console.log('Error message:', error.response?.data);
    console.log('Full error:', error.message);
    
    if (error.response?.status === 400) {
      console.log('\n🔍 400 Bad Request - Possible causes:');
      console.log('1. Missing required fields');
      console.log('2. Invalid data format');
      console.log('3. Validation errors');
    } else if (error.response?.status === 500) {
      console.log('\n🔍 500 Internal Server Error - Possible causes:');
      console.log('1. Database connection issue');
      console.log('2. SQL syntax error');
      console.log('3. Foreign key constraint violation');
    }
  }
}

testCreateRujukan()
  .then(() => {
    console.log('\n✅ Create rujukan test completed!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Create rujukan test failed:', error.message);
    process.exit(1);
  });
