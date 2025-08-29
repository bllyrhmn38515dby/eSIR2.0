const axios = require('axios');

console.log('🔍 Checking User and Faskes ID...');

async function checkUserFaskes() {
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
    
    const user = loginResponse.data.data.user;
    console.log('✅ Login successful');
    console.log('👤 User details:', {
      id: user.id,
      nama_lengkap: user.nama_lengkap,
      email: user.email,
      role: user.role,
      faskes_id: user.faskes_id
    });
    
    if (!user.faskes_id) {
      console.log('⚠️ User tidak memiliki faskes_id!');
      console.log('💡 User dengan role admin_pusat biasanya tidak memiliki faskes_id');
      console.log('💡 Coba login dengan user faskes untuk test rujukan');
      return false;
    }
    
    console.log('✅ User memiliki faskes_id:', user.faskes_id);
    return true;
    
  } catch (error) {
    console.error('❌ Check failed:', error.response?.data || error.message);
    return false;
  }
}

checkUserFaskes().then(success => {
  console.log(success ? '\n✅ User check passed!' : '\n❌ User check failed!');
  process.exit(success ? 0 : 1);
});
