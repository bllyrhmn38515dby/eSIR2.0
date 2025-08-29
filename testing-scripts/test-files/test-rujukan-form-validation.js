const axios = require('axios');

console.log('🧪 Testing Rujukan Form Validation...');

async function testRujukanFormValidation() {
  try {
    // 1. Login sebagai admin
    console.log('\n1️⃣ Login sebagai admin...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@esir.com',
      password: 'admin123'
    });

    if (!loginResponse.data.success) {
      console.error('❌ Login failed:', loginResponse.data.message);
      return false;
    }

    const token = loginResponse.data.data.token;
    const headers = { Authorization: `Bearer ${token}` };
    console.log('✅ Login successful, token obtained');
    console.log('👤 User role:', loginResponse.data.data.user.role);

    // 2. Get faskes data untuk testing
    console.log('\n2️⃣ Get faskes data...');
    const faskesResponse = await axios.get('http://localhost:3001/api/faskes', { headers });
    
    if (!faskesResponse.data.success) {
      console.error('❌ Failed to get faskes:', faskesResponse.data.message);
      return false;
    }

    const faskes = faskesResponse.data.data;
    console.log('✅ Faskes data retrieved:', faskes.length, 'faskes');
    
    // Pilih faskes untuk testing dengan tipe yang benar
    const faskesTujuan = faskes.find(f => f.tipe === 'RS');
    const faskesAsal = faskes.find(f => f.tipe === 'Puskesmas');
    
    if (!faskesTujuan || !faskesAsal) {
      console.error('❌ Tidak ada faskes RS atau Puskesmas untuk testing');
      console.log('Available types:', [...new Set(faskes.map(f => f.tipe))]);
      return false;
    }

    console.log('🏥 Faskes Tujuan:', faskesTujuan.nama_faskes);
    console.log('🏥 Faskes Asal:', faskesAsal.nama_faskes);

    // 3. Test form data yang lengkap
    console.log('\n3️⃣ Test form data lengkap...');
    const completeFormData = {
      // Data Pasien
      nik: '1234567890123456',
      nama_pasien: 'Test Pasien Form Validation',
      tanggal_lahir: '1990-01-01',
      jenis_kelamin: 'L',
      alamat: 'Jl. Test No. 123, Bogor',
      telepon: '081234567890',
      // Data Rujukan
      faskes_asal_id: loginResponse.data.data.user.role === 'admin_pusat' ? faskesAsal.id : '',
      faskes_tujuan_id: faskesTujuan.id,
      diagnosa: 'Demam berdarah',
      alasan_rujukan: 'Perlu perawatan intensif',
      catatan_asal: 'Pasien dalam kondisi stabil'
    };

    console.log('📋 Complete form data:');
    console.log('- nik:', completeFormData.nik);
    console.log('- nama_pasien:', completeFormData.nama_pasien);
    console.log('- tanggal_lahir:', completeFormData.tanggal_lahir);
    console.log('- jenis_kelamin:', completeFormData.jenis_kelamin);
    console.log('- alamat:', completeFormData.alamat);
    console.log('- telepon:', completeFormData.telepon);
    console.log('- faskes_asal_id:', completeFormData.faskes_asal_id);
    console.log('- faskes_tujuan_id:', completeFormData.faskes_tujuan_id);
    console.log('- diagnosa:', completeFormData.diagnosa);
    console.log('- alasan_rujukan:', completeFormData.alasan_rujukan);
    console.log('- catatan_asal:', completeFormData.catatan_asal);

    // 4. Test API endpoint dengan data lengkap
    console.log('\n4️⃣ Test API endpoint dengan data lengkap...');
    try {
      const response = await axios.post('http://localhost:3001/api/rujukan/with-pasien', completeFormData, { headers });
      
      if (response.data.success) {
        console.log('✅ Rujukan berhasil dibuat!');
        console.log('📋 Rujukan ID:', response.data.data.id);
        console.log('📋 Nomor Rujukan:', response.data.data.nomor_rujukan);
        return true;
      } else {
        console.error('❌ API returned error:', response.data.message);
        return false;
      }
    } catch (error) {
      console.error('❌ API request failed:', error.response?.data || error.message);
      
      if (error.response?.data?.message) {
        console.log('🔍 Error message:', error.response.data.message);
        
        // Check if it's a validation error
        if (error.response.data.message.includes('wajib diisi')) {
          console.log('⚠️ Validation error detected');
          console.log('🔍 Check if all required fields are properly filled');
        }
      }
      
      return false;
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    return false;
  }
}

// Run the test
testRujukanFormValidation().then(success => {
  if (success) {
    console.log('\n✅ Rujukan form validation test completed successfully!');
    console.log('📝 Form validation working correctly');
  } else {
    console.log('\n❌ Rujukan form validation test failed!');
    console.log('🔍 Check the error messages above for details');
  }
  process.exit(success ? 0 : 1);
});
