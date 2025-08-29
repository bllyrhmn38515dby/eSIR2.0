const crypto = require('crypto');

// Generate JWT Secret dengan berbagai opsi
function generateJWTSecret(length = 64) {
  return crypto.randomBytes(length).toString('hex');
}

// Generate dengan karakter khusus (lebih kompleks)
function generateComplexJWTSecret(length = 64) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

console.log('🔐 JWT Secret Generator');
console.log('========================\n');

// Generate beberapa opsi
console.log('1. Simple Hex Secret (64 chars):');
console.log(generateJWTSecret(64));
console.log('\n2. Complex Secret (64 chars):');
console.log(generateComplexJWTSecret(64));
console.log('\n3. Long Secret (128 chars):');
console.log(generateJWTSecret(128));

console.log('\n📝 Cara menggunakan:');
console.log('1. Copy salah satu secret di atas');
console.log('2. Paste ke file .env di backend folder');
console.log('3. Pastikan JWT_SECRET=your_secret_here');
console.log('\n⚠️  PENTING:');
console.log('- Jangan share secret ini ke publik');
console.log('- Gunakan secret yang berbeda untuk production');
console.log('- Simpan secret dengan aman');
console.log('- Backup secret untuk recovery');
