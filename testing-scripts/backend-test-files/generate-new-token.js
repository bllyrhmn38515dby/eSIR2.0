const jwt = require('jsonwebtoken');
require('dotenv').config();

function generateNewToken() {
  try {
    const payload = {
      userId: 20, // willin user
      email: 'willinmm@esirv2faskes.com',
      role: 'admin_faskes'
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    console.log('🔑 Generated new token:');
    console.log(token);
    console.log('\n📋 Token info:');
    console.log('- User ID:', payload.userId);
    console.log('- Email:', payload.email);
    console.log('- Role:', payload.role);
    console.log('- Expires in: 24 hours');
    
  } catch (error) {
    console.error('❌ Error generating token:', error.message);
  }
}

generateNewToken();
