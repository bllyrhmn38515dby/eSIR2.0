const bcrypt = require('bcryptjs');
const pool = require('./config/db');

async function checkPassword() {
  try {
    console.log('🔍 Checking password in database...');
    
    // Get user from database
    const [users] = await pool.execute(
      `SELECT u.*, r.nama_role as role 
       FROM users u 
       LEFT JOIN roles r ON u.role_id = r.id 
       WHERE u.email = ?`,
      ['admin@pusat.com']
    );
    
    if (users.length === 0) {
      console.log('❌ User tidak ditemukan');
      return;
    }
    
    const user = users[0];
    console.log('📋 User found:', {
      id: user.id,
      email: user.email,
      nama: user.nama_lengkap,
      role: user.role,
      password_hash: user.password.substring(0, 20) + '...'
    });
    
    // Test password
    const testPassword = 'admin123';
    const isValid = await bcrypt.compare(testPassword, user.password);
    
    console.log('🔐 Password test:', {
      test_password: testPassword,
      is_valid: isValid
    });
    
    if (!isValid) {
      console.log('⚠️  Password tidak valid. Generating new hash...');
      const newHash = await bcrypt.hash(testPassword, 12);
      console.log('🆕 New hash:', newHash);
      
      // Update password in database
      await pool.execute(
        'UPDATE users SET password = ? WHERE email = ?',
        [newHash, 'admin@pusat.com']
      );
      console.log('✅ Password updated in database');
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

checkPassword();
