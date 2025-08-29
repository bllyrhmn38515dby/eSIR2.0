const fs = require('fs');
const path = require('path');

const envContent = `# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_DATABASE=esirv2
DB_PORT=3306

# JWT Configuration
JWT_SECRET=esir2_super_secret_key_2024
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3001
NODE_ENV=development
`;

const envPath = path.join(__dirname, '.env');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ File .env berhasil dibuat!');
  console.log('📁 Path:', envPath);
  console.log('🔑 JWT_SECRET:', 'esir2_super_secret_key_2024');
} catch (error) {
  console.error('❌ Error membuat file .env:', error.message);
}
