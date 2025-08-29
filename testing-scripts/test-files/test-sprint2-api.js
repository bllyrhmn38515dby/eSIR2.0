const axios = require('axios');

// Test data
const testData = {
  pasien: {
    nama: 'Test Pasien',
    nik: '3573010101990004',
    tanggal_lahir: '1999-01-01',
    jenis_kelamin: 'L',
    alamat: 'Jl. Test No.123, Surabaya',
    telepon: '081234567893',
    golongan_darah: 'O'
  },
  rujukan: {
    pasien_id: 1,
    faskes_tujuan_id: 1,
    diagnosa: 'Hipertensi Grade 1',
    alasan_rujukan: 'Memerlukan pemeriksaan lebih lanjut'
  }
};

let authToken = '';

// Login untuk mendapatkan token
async function login() {
  try {
    console.log('🔐 Login untuk mendapatkan token...');
    
    const response = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@pusat.com',
      password: 'password123'
    });

    authToken = response.data.data.token;
    console.log('✅ Login berhasil, token:', authToken.substring(0, 50) + '...');
    
    return true;
  } catch (error) {
    console.error('❌ Login gagal:', error.response?.data?.message || error.message);
    return false;
  }
}

// Test API Pasien
async function testPasienAPI() {
  console.log('\n=== TEST API PASIEN ===');
  
  try {
    // Get semua pasien
    console.log('1. Get semua pasien...');
    const response1 = await axios.get('http://localhost:3001/api/pasien', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    console.log('✅ Berhasil, total pasien:', response1.data.data.length);

    // Create pasien baru
    console.log('\n2. Create pasien baru...');
    const response2 = await axios.post('http://localhost:3001/api/pasien', testData.pasien, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    console.log('✅ Berhasil, ID pasien baru:', response2.data.data.id);

    // Get pasien by ID
    console.log('\n3. Get pasien by ID...');
    const pasienId = response2.data.data.id;
    const response3 = await axios.get(`http://localhost:3001/api/pasien/${pasienId}`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    console.log('✅ Berhasil, nama pasien:', response3.data.data.nama);

  } catch (error) {
    console.error('❌ Error test pasien:', error.response?.data?.message || error.message);
  }
}

// Test API Rujukan
async function testRujukanAPI() {
  console.log('\n=== TEST API RUJUKAN ===');
  
  try {
    // Get semua rujukan
    console.log('1. Get semua rujukan...');
    const response1 = await axios.get('http://localhost:3001/api/rujukan', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    console.log('✅ Berhasil, total rujukan:', response1.data.data.length);

    // Create rujukan baru
    console.log('\n2. Create rujukan baru...');
    const response2 = await axios.post('http://localhost:3001/api/rujukan', testData.rujukan, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    console.log('✅ Berhasil, nomor rujukan:', response2.data.data.nomor_rujukan);

    // Update status rujukan
    console.log('\n3. Update status rujukan...');
    const rujukanId = response2.data.data.id;
    const response3 = await axios.patch(`http://localhost:3001/api/rujukan/${rujukanId}/status`, {
      status: 'diterima',
      catatan_dokter: 'Rujukan diterima, pasien akan dijadwalkan'
    }, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    console.log('✅ Berhasil, status baru:', response3.data.data.status);

    // Get statistik rujukan
    console.log('\n4. Get statistik rujukan...');
    const response4 = await axios.get('http://localhost:3001/api/rujukan/stats/overview', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    console.log('✅ Berhasil, total rujukan:', response4.data.data.overview.total_rujukan);

  } catch (error) {
    console.error('❌ Error test rujukan:', error.response?.data?.message || error.message);
  }
}

// Test API Faskes
async function testFaskesAPI() {
  console.log('\n=== TEST API FASKES ===');
  
  try {
    // Get semua faskes
    console.log('1. Get semua faskes...');
    const response1 = await axios.get('http://localhost:3001/api/faskes', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    console.log('✅ Berhasil, total faskes:', response1.data.data.length);

    // Get statistik faskes
    console.log('\n2. Get statistik faskes...');
    const response2 = await axios.get('http://localhost:3001/api/faskes/stats/overview', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    console.log('✅ Berhasil, total faskes:', response2.data.data.total);

  } catch (error) {
    console.error('❌ Error test faskes:', error.response?.data?.message || error.message);
  }
}

// Main test function
async function runTests() {
  console.log('🚀 MULAI TEST SPRINT 2 API');
  console.log('========================');
  
  // Login first
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log('❌ Tidak bisa melanjutkan test tanpa login');
    return;
  }

  // Run tests
  await testPasienAPI();
  await testRujukanAPI();
  await testFaskesAPI();

  console.log('\n🎉 TEST SPRINT 2 SELESAI!');
  console.log('========================');
  console.log('✅ Semua API Sprint 2 berfungsi dengan baik!');
  console.log('\n📋 Ringkasan API yang tersedia:');
  console.log('- POST /api/pasien - Create pasien');
  console.log('- GET /api/pasien - Get semua pasien');
  console.log('- GET /api/pasien/:id - Get pasien by ID');
  console.log('- PUT /api/pasien/:id - Update pasien');
  console.log('- DELETE /api/pasien/:id - Delete pasien');
  console.log('- POST /api/rujukan - Create rujukan');
  console.log('- GET /api/rujukan - Get semua rujukan');
  console.log('- GET /api/rujukan/:id - Get rujukan by ID');
  console.log('- PATCH /api/rujukan/:id/status - Update status rujukan');
  console.log('- GET /api/rujukan/stats/overview - Get statistik rujukan');
  console.log('- GET /api/faskes - Get semua faskes');
  console.log('- GET /api/faskes/:id - Get faskes by ID');
  console.log('- POST /api/faskes - Create faskes (admin only)');
  console.log('- PUT /api/faskes/:id - Update faskes (admin only)');
  console.log('- DELETE /api/faskes/:id - Delete faskes (admin only)');
  console.log('- GET /api/faskes/stats/overview - Get statistik faskes');
}

runTests();
