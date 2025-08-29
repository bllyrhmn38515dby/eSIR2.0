const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login API...');
    
    const response = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log('Response status:', response.status);
    console.log('Response data:', response.data);

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testLogin();
