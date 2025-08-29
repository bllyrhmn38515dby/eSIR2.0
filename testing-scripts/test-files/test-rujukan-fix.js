const axios = require('axios');

console.log('🧪 Testing Rujukan Form Fix...');

async function testRujukanForm() {
  try {
    // 1. Login untuk mendapatkan token
    console.log('\n1️⃣ Login untuk mendapatkan token...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@esir.com',
      password: 'admin123'
    });

    if (!loginResponse.data.success) {
      console.error('❌ Login failed:', loginResponse.data.message);
      return false;
    }

    const token = loginResponse.data.token;
    const headers = { Authorization: `Bearer ${token}` };
    console.log('✅ Login successful, token obtained');
    console.log('🔑 Token:', token.substring(0, 20) + '...');

    // 2. Test get faskes untuk dropdown
    console.log('\n2️⃣ Testing get faskes for dropdown...');
    const faskesResponse = await axios.get('http://localhost:3001/api/faskes', { headers });
    
    if (faskesResponse.data.success) {
      console.log('✅ Faskes data retrieved:', faskesResponse.data.data.length, 'faskes found');
      console.log('📋 Faskes list:', faskesResponse.data.data.map(f => `${f.nama_faskes} (${f.tipe})`));
    } else {
      console.error('❌ Failed to get faskes:', faskesResponse.data.message);
      return false;
    }

    // 3. Test search pasien
    console.log('\n3️⃣ Testing search pasien...');
    const searchResponse = await axios.get('http://localhost:3001/api/pasien/search?nik=1234567890123456', { headers });
    
    if (searchResponse.data.success && searchResponse.data.data) {
      console.log('✅ Pasien found:', searchResponse.data.data.nama_lengkap);
    } else {
      console.log('ℹ️ Pasien not found, will create new one');
    }

    // 4. Test create rujukan dengan data minimal
    console.log('\n4️⃣ Testing create rujukan...');
    const rujukanData = {
      nik: '1234567890123456',
      nama_pasien: 'Test Pasien Rujukan',
      tanggal_lahir: '1990-01-01',
      jenis_kelamin: 'L',
      alamat: 'Jl. Test No. 123, Jakarta',
      telepon: '081234567890',
      faskes_tujuan_id: faskesResponse.data.data[0].id, // Ambil faskes pertama
      diagnosa: 'Demam berdarah',
      alasan_rujukan: 'Perlu perawatan intensif',
      catatan_asal: 'Pasien dalam kondisi stabil'
    };

    const createResponse = await axios.post('http://localhost:3001/api/rujukan/with-pasien', rujukanData, { headers });
    
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

    // 5. Test get rujukan list
    console.log('\n5️⃣ Testing get rujukan list...');
    const rujukanListResponse = await axios.get('http://localhost:3001/api/rujukan', { headers });
    
    if (rujukanListResponse.data.success) {
      console.log('✅ Rujukan list retrieved:', rujukanListResponse.data.data.length, 'rujukan found');
    } else {
      console.error('❌ Failed to get rujukan list:', rujukanListResponse.data.message);
      return false;
    }

    console.log('\n🎉 All tests passed! Rujukan form fix is working correctly.');
    return true;

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    return false;
  }
}

// Run the test
testRujukanForm().then(success => {
  if (success) {
    console.log('\n✅ Rujukan form fix verification completed successfully!');
  } else {
    console.log('\n❌ Rujukan form fix verification failed!');
  }
  process.exit(success ? 0 : 1);
});
