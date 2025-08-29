const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login API...');
    
    const response = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@pusat.com',
      password: 'password123'
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000
    });

    console.log('Response status:', response.status);
    console.log('Response data:', response.data);

  } catch (error) {
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request error:', error.request);
    } else {
      console.error('Error config:', error.config);
    }
  }
}

testLogin();
