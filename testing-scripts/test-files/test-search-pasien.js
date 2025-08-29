const axios = require('axios');

// Test pencarian pasien
async function testSearchPasien() {
  try {
    // Ambil token dari localStorage (simulasi)
    const token = 'your-token-here'; // Ganti dengan token yang valid
    
    const headers = { Authorization: `Bearer ${token}` };
    
    // Test dengan NIK yang ada di database
    const response = await axios.get('http://localhost:3001/api/pasien/search?nik=3201234567890001', { headers });
    
    console.log('Response:', response.data);
    
    if (response.data.success) {
      const pasien = response.data.data;
      console.log('Data pasien yang ditemukan:');
      console.log('- NIK:', pasien.nik);
      console.log('- Nama:', pasien.nama_pasien);
      console.log('- Tanggal Lahir:', pasien.tanggal_lahir);
      console.log('- Jenis Kelamin:', pasien.jenis_kelamin);
      console.log('- Alamat:', pasien.alamat);
      console.log('- Telepon:', pasien.telepon);
    }
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testSearchPasien();
