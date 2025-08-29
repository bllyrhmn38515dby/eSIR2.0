const axios = require('axios');

console.log('🔍 Checking Faskes Data...');

async function checkFaskesData() {
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

    // 2. Get faskes data
    console.log('\n2️⃣ Get faskes data...');
    const faskesResponse = await axios.get('http://localhost:3001/api/faskes', { headers });
    
    if (!faskesResponse.data.success) {
      console.error('❌ Failed to get faskes:', faskesResponse.data.message);
      return false;
    }

    const faskes = faskesResponse.data.data;
    console.log('✅ Faskes data retrieved:', faskes.length, 'faskes');
    
    console.log('\n📋 Faskes details:');
    faskes.forEach((faskes, index) => {
      console.log(`${index + 1}. ID: ${faskes.id}`);
      console.log(`   Nama: ${faskes.nama_faskes}`);
      console.log(`   Tipe: ${faskes.tipe}`);
      console.log(`   Alamat: ${faskes.alamat}`);
      console.log(`   Telepon: ${faskes.telepon}`);
      console.log(`   Latitude: ${faskes.latitude}`);
      console.log(`   Longitude: ${faskes.longitude}`);
      console.log('');
    });

    // 3. Categorize faskes by type
    const rsFaskes = faskes.filter(f => f.tipe === 'rs');
    const puskesmasFaskes = faskes.filter(f => f.tipe === 'puskesmas');
    const otherFaskes = faskes.filter(f => f.tipe !== 'rs' && f.tipe !== 'puskesmas');

    console.log('🏥 RS Faskes:', rsFaskes.length);
    rsFaskes.forEach(f => console.log(`   - ${f.nama_faskes}`));

    console.log('🏥 Puskesmas Faskes:', puskesmasFaskes.length);
    puskesmasFaskes.forEach(f => console.log(`   - ${f.nama_faskes}`));

    console.log('🏥 Other Faskes:', otherFaskes.length);
    otherFaskes.forEach(f => console.log(`   - ${f.nama_faskes} (${f.tipe})`));

    return true;

  } catch (error) {
    console.error('❌ Check failed:', error.response?.data || error.message);
    return false;
  }
}

checkFaskesData().then(success => {
  console.log(success ? '\n✅ Faskes data check completed!' : '\n❌ Faskes data check failed!');
  process.exit(success ? 0 : 1);
});
