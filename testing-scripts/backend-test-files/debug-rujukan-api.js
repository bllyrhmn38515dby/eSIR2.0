const axios = require('axios');

async function debugRujukanAPI() {
  try {
    console.log('🔍 Debugging Rujukan API...');
    
    // Login dulu
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@pusat.com',
      password: 'admin123'
    });
    
    if (loginResponse.data.success && loginResponse.data.data && loginResponse.data.data.token) {
      const token = loginResponse.data.data.token;
      console.log('✅ Login successful');
      console.log('🔑 Token:', token.substring(0, 50) + '...');
      
      // Test API rujukan dengan error handling detail
      try {
        console.log('📡 Calling rujukan API...');
        const rujukanResponse = await axios.get('http://localhost:3001/api/rujukan', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('✅ Rujukan API response:');
        console.log('Status:', rujukanResponse.status);
        console.log('Success:', rujukanResponse.data.success);
        console.log('Data count:', rujukanResponse.data.data ? rujukanResponse.data.data.length : 'null');
        
        if (rujukanResponse.data.data && rujukanResponse.data.data.length > 0) {
          console.log('Sample data:', rujukanResponse.data.data[0]);
        } else {
          console.log('No data found');
        }
        
      } catch (apiError) {
        console.log('❌ API Error Details:');
        console.log('Status:', apiError.response?.status);
        console.log('Status Text:', apiError.response?.statusText);
        console.log('Response Data:', apiError.response?.data);
        console.log('Error Message:', apiError.message);
        
        if (apiError.response?.data?.message) {
          console.log('Error Message:', apiError.response.data.message);
        }
      }
      
    } else {
      console.log('❌ Login failed:', loginResponse.data);
    }
    
  } catch (error) {
    console.log('❌ General Error:', error.message);
    if (error.response) {
      console.log('Response Status:', error.response.status);
      console.log('Response Data:', error.response.data);
    } else if (error.request) {
      console.log('No response received:', error.request);
    } else {
      console.log('Error setting up request:', error.message);
    }
  }
}

debugRujukanAPI();
