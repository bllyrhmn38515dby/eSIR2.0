const axios = require('axios');

const users = [
  { email: 'admin@esir.local', password: 'password123', name: 'Admin' },
  { email: 'puskesmas@esir.local', password: 'password123', name: 'Puskesmas A' },
  { email: 'rs@esir.local', password: 'password123', name: 'RS A' },
  { email: 'admin@pusat.com', password: 'password123', name: 'Administrator Pusat' },
  { email: 'admin@faskes.com', password: 'password123', name: 'Administrator Faskes' },
  { email: 'test@example.com', password: 'password123', name: 'Test User' }
];

async function testLogin(email, password, name) {
  try {
    console.log(`\nTesting login untuk: ${name} (${email})`);
    
    const response = await axios.post('http://localhost:3001/api/auth/login', {
      email: email,
      password: password
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000
    });

    console.log('✓ Login berhasil');
    console.log('  User ID:', response.data.data.user.id);
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

async function testAllUsers() {
  console.log('=== TEST LOGIN SEMUA USER ===');
  
  for (const user of users) {
    await testLogin(user.email, user.password, user.name);
  }
  
  console.log('\n=== TEST SELESAI ===');
}

testAllUsers();
