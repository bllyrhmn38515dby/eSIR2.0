require('dotenv').config();
const jwt = require('jsonwebtoken');

console.log('🔍 Debugging JWT Configuration...\n');

console.log('📋 Environment Variables:');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Not set');
console.log('JWT_EXPIRES_IN:', process.env.JWT_EXPIRES_IN || '❌ Not set');

if (!process.env.JWT_SECRET) {
  console.log('\n❌ JWT_SECRET is not set!');
  console.log('💡 Please check your .env file');
  process.exit(1);
}

// Test JWT signing
try {
  const testPayload = { userId: 1, email: 'test@test.com' };
  const token = jwt.sign(testPayload, process.env.JWT_SECRET, { 
    expiresIn: process.env.JWT_EXPIRES_IN || '24h' 
  });
  
  console.log('\n✅ JWT signing test successful!');
  console.log('🔑 Test token:', token.substring(0, 50) + '...');
  
  // Test JWT verification
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log('✅ JWT verification test successful!');
  console.log('📋 Decoded payload:', decoded);
  
} catch (error) {
  console.error('❌ JWT test failed:', error.message);
}
