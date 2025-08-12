const axios = require('axios');

async function testFrontendLogin() {
  const testUsers = [
    { email: 'admin@pusat.com', password: 'password123', name: 'Administrator Pusat' },
    { email: 'admin@faskes.com', password: 'password123', name: 'Administrator Faskes' },
    { email: 'test@example.com', password: 'password123', name: 'Test User' }
  ];

  console.log('=== TEST LOGIN FRONTEND ===');
  console.log('Menggunakan field "email" bukan "username"');
  
  for (const user of testUsers) {
    try {
      console.log(`\nTesting login untuk: ${user.name} (${user.email})`);
      
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        email: user.email,
        password: user.password
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000
      });

      console.log('✓ Login berhasil');
      console.log('  User ID:', response.data.data.user.id);
      console.log('  Nama:', response.data.data.user.nama);
      console.log('  Role:', response.data.data.user.role);
      console.log('  Token:', response.data.data.token.substring(0, 50) + '...');

    } catch (error) {
      console.log('✗ Login gagal');
      if (error.response) {
        console.log('  Error:', error.response.data.message);
      } else {
        console.log('  Error:', error.message);
      }
    }
  }
  
  console.log('\n=== TEST SELESAI ===');
  console.log('Sekarang coba login di frontend dengan:');
  console.log('- Email: admin@pusat.com');
  console.log('- Password: password123');
}

testFrontendLogin();
