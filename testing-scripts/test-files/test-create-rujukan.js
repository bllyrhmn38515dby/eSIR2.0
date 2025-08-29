const axios = require('axios');

console.log('🧪 Testing Create Rujukan...');

async function testCreateRujukan() {
  try {
    // 1. Login
    console.log('\n1️⃣ Login...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@esir.com',
      password: 'admin123'
    });
    
    if (!loginResponse.data.success) {
      console.error('❌ Login failed');
      return false;
    }
    
    const token = loginResponse.data.token;
    const headers = { Authorization: `Bearer ${token}` };
    console.log('✅ Login successful');
    
    // 2. Get faskes untuk dropdown
    console.log('\n2️⃣ Get faskes...');
    const faskesResponse = await axios.get('http://localhost:3001/api/faskes', { headers });
    
    if (!faskesResponse.data.success) {
      console.error('❌ Failed to get faskes');
      return false;
    }
    
    const faskes = faskesResponse.data.data;
    console.log('✅ Faskes retrieved:', faskes.length, 'faskes');
    
    // 3. Test create rujukan
    console.log('\n3️⃣ Create rujukan...');
    const rujukanData = {
      nik: '1234567890123456',
      nama_pasien: 'Test Pasien Rujukan',
      tanggal_lahir: '1990-01-01',
      jenis_kelamin: 'L',
      alamat: 'Jl. Test No. 123, Jakarta',
      telepon: '081234567890',
      faskes_tujuan_id: faskes[0].id, // Ambil faskes pertama
      diagnosa: 'Demam berdarah',
      alasan_rujukan: 'Perlu perawatan intensif',
      catatan_asal: 'Pasien dalam kondisi stabil'
    };
    
    console.log('Rujukan data:', rujukanData);
    
    const createResponse = await axios.post('http://localhost:3001/api/rujukan/with-pasien', rujukanData, { headers });
    
    console.log('Create response:', createResponse.data);
    
    if (createResponse.data.success) {
      console.log('✅ Rujukan created successfully!');
      console.log('📋 Rujukan details:', {
        nomor_rujukan: createResponse.data.data.nomor_rujukan,
        pasien: createResponse.data.data.nama_pasien,
        faskes_tujuan: createResponse.data.data.faskes_tujuan_nama,
        status: createResponse.data.data.status
      });
    } else {
      console.error('❌ Failed to create rujukan:', createResponse.data.message);
      return false;
    }
    
    console.log('\n🎉 Test completed successfully!');
    return true;
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    return false;
  }
}

testCreateRujukan().then(success => {
  console.log(success ? '\n✅ Test passed!' : '\n❌ Test failed!');
  process.exit(success ? 0 : 1);
});
