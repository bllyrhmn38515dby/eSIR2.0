const axios = require('axios');

console.log('🔍 Debugging Rujukan Frontend Issue...');

async function debugRujukanFrontend() {
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
    console.log('✅ Login successful');
    console.log('👤 User role:', loginResponse.data.data.user.role);

    // 2. Simulasi form data yang mungkin bermasalah
    console.log('\n2️⃣ Simulasi form data bermasalah...');
    
    // Test case 1: Data lengkap
    const completeData = {
      nik: '1234567890123456',
      nama_pasien: 'Test Pasien Complete',
      tanggal_lahir: '1990-01-01',
      jenis_kelamin: 'L',
      alamat: 'Jl. Test No. 123, Bogor',
      telepon: '081234567890',
      faskes_asal_id: '2',
      faskes_tujuan_id: '4',
      diagnosa: 'Demam berdarah',
      alasan_rujukan: 'Perlu perawatan intensif',
      catatan_asal: 'Pasien dalam kondisi stabil'
    };

    // Test case 2: Data dengan field kosong
    const incompleteData = {
      nik: '1234567890123456',
      nama_pasien: 'Test Pasien Incomplete',
      tanggal_lahir: '1990-01-01',
      jenis_kelamin: 'L',
      alamat: 'Jl. Test No. 123, Bogor',
      telepon: '081234567890',
      faskes_asal_id: '2',
      faskes_tujuan_id: '', // ❌ Kosong
      diagnosa: 'Demam berdarah',
      alasan_rujukan: 'Perlu perawatan intensif',
      catatan_asal: 'Pasien dalam kondisi stabil'
    };

    // Test case 3: Data dengan whitespace
    const whitespaceData = {
      nik: '1234567890123456',
      nama_pasien: '   ', // ❌ Hanya whitespace
      tanggal_lahir: '1990-01-01',
      jenis_kelamin: 'L',
      alamat: 'Jl. Test No. 123, Bogor',
      telepon: '081234567890',
      faskes_asal_id: '2',
      faskes_tujuan_id: '4',
      diagnosa: 'Demam berdarah',
      alasan_rujukan: 'Perlu perawatan intensif',
      catatan_asal: 'Pasien dalam kondisi stabil'
    };

    // 3. Test validasi frontend
    console.log('\n3️⃣ Test validasi frontend...');
    
    function validateFormData(data, userRole) {
      const requiredFields = {
        nik: 'NIK',
        nama_pasien: 'Nama Pasien',
        tanggal_lahir: 'Tanggal Lahir',
        jenis_kelamin: 'Jenis Kelamin',
        alamat: 'Alamat',
        faskes_tujuan_id: 'Faskes Tujuan',
        diagnosa: 'Diagnosa',
        alasan_rujukan: 'Alasan Rujukan'
      };

      // Tambahkan faskes_asal_id untuk admin pusat
      if (userRole === 'admin_pusat') {
        requiredFields.faskes_asal_id = 'Faskes Asal';
      }

      const missingFields = [];
      for (const [field, label] of Object.entries(requiredFields)) {
        if (!data[field] || data[field].toString().trim() === '') {
          missingFields.push(label);
        }
      }

      return {
        isValid: missingFields.length === 0,
        missingFields: missingFields
      };
    }

    // Test validasi untuk setiap test case
    console.log('\n📋 Test Case 1 - Complete Data:');
    const validation1 = validateFormData(completeData, loginResponse.data.data.user.role);
    console.log('Valid:', validation1.isValid);
    if (!validation1.isValid) {
      console.log('Missing fields:', validation1.missingFields);
    }

    console.log('\n📋 Test Case 2 - Incomplete Data:');
    const validation2 = validateFormData(incompleteData, loginResponse.data.data.user.role);
    console.log('Valid:', validation2.isValid);
    if (!validation2.isValid) {
      console.log('Missing fields:', validation2.missingFields);
    }

    console.log('\n📋 Test Case 3 - Whitespace Data:');
    const validation3 = validateFormData(whitespaceData, loginResponse.data.data.user.role);
    console.log('Valid:', validation3.isValid);
    if (!validation3.isValid) {
      console.log('Missing fields:', validation3.missingFields);
    }

    // 4. Test API dengan data bermasalah
    console.log('\n4️⃣ Test API dengan data bermasalah...');
    
    try {
      console.log('\n🔍 Testing incomplete data...');
      const response1 = await axios.post('http://localhost:3001/api/rujukan/with-pasien', incompleteData, { headers });
      console.log('Response:', response1.data);
    } catch (error) {
      console.log('❌ Expected error for incomplete data:', error.response?.data?.message);
    }

    try {
      console.log('\n🔍 Testing whitespace data...');
      const response2 = await axios.post('http://localhost:3001/api/rujukan/with-pasien', whitespaceData, { headers });
      console.log('Response:', response2.data);
    } catch (error) {
      console.log('❌ Expected error for whitespace data:', error.response?.data?.message);
    }

    // 5. Simulasi masalah yang mungkin terjadi di frontend
    console.log('\n5️⃣ Simulasi masalah frontend...');
    
    // Test NIK validation
    const nikTestCases = [
      '1234567890123456', // ✅ Valid
      '123456789012345',  // ❌ 15 digit
      '12345678901234567', // ❌ 17 digit
      '',                 // ❌ Empty
      '   '               // ❌ Whitespace
    ];

    console.log('\n📋 NIK Validation Test:');
    nikTestCases.forEach(nik => {
      const isValid = nik.length === 16 && nik.trim() !== '';
      console.log(`NIK: "${nik}" -> ${isValid ? '✅ Valid' : '❌ Invalid'}`);
    });

    return true;

  } catch (error) {
    console.error('❌ Debug failed:', error.response?.data || error.message);
    return false;
  }
}

debugRujukanFrontend().then(success => {
  console.log(success ? '\n✅ Debug completed!' : '\n❌ Debug failed!');
  process.exit(success ? 0 : 1);
});
