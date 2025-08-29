const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'http://localhost:3001/api';
let authToken = '';

// Fungsi untuk login dan mendapatkan token
async function login() {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      username: 'admin_pusat',
      password: 'admin123'
    });
    
    authToken = response.data.token;
    console.log('✅ Login berhasil');
    return authToken;
  } catch (error) {
    console.error('❌ Login gagal:', error.response?.data?.message || error.message);
    throw error;
  }
}

// Fungsi untuk test global search
async function testGlobalSearch() {
  console.log('\n🔍 Testing Global Search...');
  
  try {
    const response = await axios.get(`${BASE_URL}/search/global?query=Ahmad&type=global`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Global search berhasil');
    console.log('📊 Hasil:', response.data.data);
    console.log('📈 Total hasil:', response.data.total_results);
    
    return response.data;
  } catch (error) {
    console.error('❌ Global search gagal:', error.response?.data?.message || error.message);
  }
}

// Fungsi untuk test advanced patient search
async function testAdvancedPatientSearch() {
  console.log('\n👥 Testing Advanced Patient Search...');
  
  try {
    const response = await axios.get(`${BASE_URL}/search/pasien?query=Ahmad&jenis_kelamin=L&limit=5`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Advanced patient search berhasil');
    console.log('📊 Hasil:', response.data.data.patients);
    console.log('📈 Pagination:', response.data.data.pagination);
    
    return response.data;
  } catch (error) {
    console.error('❌ Advanced patient search gagal:', error.response?.data?.message || error.message);
  }
}

// Fungsi untuk test advanced referral search
async function testAdvancedReferralSearch() {
  console.log('\n📋 Testing Advanced Referral Search...');
  
  try {
    const response = await axios.get(`${BASE_URL}/search/rujukan?query=DBD&status=diterima&limit=5`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Advanced referral search berhasil');
    console.log('📊 Hasil:', response.data.data.referrals);
    console.log('📈 Pagination:', response.data.data.pagination);
    
    return response.data;
  } catch (error) {
    console.error('❌ Advanced referral search gagal:', error.response?.data?.message || error.message);
  }
}

// Fungsi untuk test advanced bed search
async function testAdvancedBedSearch() {
  console.log('\n🛏️ Testing Advanced Bed Search...');
  
  try {
    const response = await axios.get(`${BASE_URL}/search/tempat-tidur?query=VIP&status=tersedia&limit=5`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Advanced bed search berhasil');
    console.log('📊 Hasil:', response.data.data.beds);
    console.log('📈 Pagination:', response.data.data.pagination);
    
    return response.data;
  } catch (error) {
    console.error('❌ Advanced bed search gagal:', error.response?.data?.message || error.message);
  }
}

// Fungsi untuk test autocomplete
async function testAutocomplete() {
  console.log('\n💡 Testing Autocomplete...');
  
  const types = ['pasien', 'faskes', 'diagnosa', 'rujukan'];
  
  for (const type of types) {
    try {
      const response = await axios.get(`${BASE_URL}/search/autocomplete/${type}?query=A&limit=3`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      
      console.log(`✅ Autocomplete ${type} berhasil`);
      console.log(`📊 Hasil ${type}:`, response.data.data);
    } catch (error) {
      console.error(`❌ Autocomplete ${type} gagal:`, error.response?.data?.message || error.message);
    }
  }
}

// Fungsi untuk test search analytics
async function testSearchAnalytics() {
  console.log('\n📈 Testing Search Analytics...');
  
  try {
    const response = await axios.get(`${BASE_URL}/search/analytics?date_range=30`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Search analytics berhasil');
    console.log('📊 Search trends:', response.data.data.searchTrends);
    console.log('📈 Popular terms:', response.data.data.popularTerms);
    console.log('📊 Entity performance:', response.data.data.entityPerformance);
    
    return response.data;
  } catch (error) {
    console.error('❌ Search analytics gagal:', error.response?.data?.message || error.message);
  }
}

// Fungsi untuk test error handling
async function testErrorHandling() {
  console.log('\n⚠️ Testing Error Handling...');
  
  // Test query terlalu pendek
  try {
    await axios.get(`${BASE_URL}/search/global?query=a`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
  } catch (error) {
    if (error.response?.status === 400) {
      console.log('✅ Error handling query pendek berfungsi:', error.response.data.message);
    } else {
      console.error('❌ Error handling query pendek gagal');
    }
  }
  
  // Test tanpa query
  try {
    await axios.get(`${BASE_URL}/search/global`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
  } catch (error) {
    if (error.response?.status === 400) {
      console.log('✅ Error handling tanpa query berfungsi:', error.response.data.message);
    } else {
      console.error('❌ Error handling tanpa query gagal');
    }
  }
}

// Fungsi utama untuk menjalankan semua test
async function runAllTests() {
  console.log('🚀 Memulai test API Search...\n');
  
  try {
    // Login terlebih dahulu
    await login();
    
    // Jalankan semua test
    await testGlobalSearch();
    await testAdvancedPatientSearch();
    await testAdvancedReferralSearch();
    await testAdvancedBedSearch();
    await testAutocomplete();
    await testSearchAnalytics();
    await testErrorHandling();
    
    console.log('\n🎉 Semua test selesai!');
    
  } catch (error) {
    console.error('❌ Test gagal:', error.message);
  }
}

// Jalankan test jika file dijalankan langsung
if (require.main === module) {
  runAllTests();
}

module.exports = {
  login,
  testGlobalSearch,
  testAdvancedPatientSearch,
  testAdvancedReferralSearch,
  testAdvancedBedSearch,
  testAutocomplete,
  testSearchAnalytics,
  testErrorHandling,
  runAllTests
};
