const mysql = require('mysql2/promise');
require('dotenv').config();
const bcrypt = require('bcryptjs');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'esirv2'
};

async function fixFaskesPasswords() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database esirv2');

    // Check current faskes users
    console.log('\n1️⃣ Checking faskes users...');
    const [faskesUsers] = await connection.execute(`
      SELECT u.id, u.nama_lengkap, u.username, u.email, u.password, u.role_id, r.nama_role, f.nama_faskes
      FROM users u 
      LEFT JOIN roles r ON u.role_id = r.id
      LEFT JOIN faskes f ON u.faskes_id = f.id
      WHERE u.email LIKE '%@esirv2faskes.com'
      ORDER BY u.id
    `);
    
    console.log(`Found ${faskesUsers.length} faskes users:`);
    faskesUsers.forEach((user, index) => {
      console.log(`\n${index + 1}. User ID: ${user.id}`);
      console.log(`   Nama: ${user.nama_lengkap}`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.nama_role} (ID: ${user.role_id})`);
      console.log(`   Faskes: ${user.nama_faskes}`);
      console.log(`   Password: ${user.password ? user.password.substring(0, 30) + '...' : 'NULL'}`);
    });

    // Fix password for willinmm@esirv2faskes.com
    console.log('\n2️⃣ Fixing password for willinmm@esirv2faskes.com...');
    const [willinUser] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      ['willinmm@esirv2faskes.com']
    );
    
    if (willinUser.length > 0) {
      const user = willinUser[0];
      console.log(`Found user: ${user.nama_lengkap} (${user.email})`);
      
      // Test password verification
      const isPasswordValid = await bcrypt.compare('faskes123', user.password);
      console.log(`Password verification for 'faskes123': ${isPasswordValid ? '✅ VALID' : '❌ INVALID'}`);
      
      if (!isPasswordValid) {
        console.log('❌ Password verification failed! Creating new password hash...');
        
        const newHashedPassword = await bcrypt.hash('faskes123', 12);
        await connection.execute(
          'UPDATE users SET password = ? WHERE email = ?',
          [newHashedPassword, 'willinmm@esirv2faskes.com']
        );
        console.log('✅ Password updated successfully for willinmm@esirv2faskes.com');
      }
    } else {
      console.log('❌ User willinmm@esirv2faskes.com not found!');
    }

    // Fix password for retaazra@esirv2faskes.com
    console.log('\n3️⃣ Fixing password for retaazra@esirv2faskes.com...');
    const [retaUser] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      ['retaazra@esirv2faskes.com']
    );
    
    if (retaUser.length > 0) {
      const user = retaUser[0];
      console.log(`Found user: ${user.nama_lengkap} (${user.email})`);
      
      // Test password verification
      const isPasswordValid = await bcrypt.compare('faskes123', user.password);
      console.log(`Password verification for 'faskes123': ${isPasswordValid ? '✅ VALID' : '❌ INVALID'}`);
      
      if (!isPasswordValid) {
        console.log('❌ Password verification failed! Creating new password hash...');
        
        const newHashedPassword = await bcrypt.hash('faskes123', 12);
        await connection.execute(
          'UPDATE users SET password = ? WHERE email = ?',
          [newHashedPassword, 'retaazra@esirv2faskes.com']
        );
        console.log('✅ Password updated successfully for retaazra@esirv2faskes.com');
      }
    } else {
      console.log('❌ User retaazra@esirv2faskes.com not found!');
    }

    // Final verification
    console.log('\n4️⃣ Final verification...');
    const [finalFaskesUsers] = await connection.execute(`
      SELECT u.id, u.nama_lengkap, u.username, u.email, u.role_id, r.nama_role, f.nama_faskes
      FROM users u 
      LEFT JOIN roles r ON u.role_id = r.id
      LEFT JOIN faskes f ON u.faskes_id = f.id
      WHERE u.email LIKE '%@esirv2faskes.com'
      ORDER BY u.email
    `);
    
    console.log('\nFinal faskes users:');
    finalFaskesUsers.forEach(user => {
      console.log(`  - ${user.nama_lengkap} (${user.email}) - Role: ${user.nama_role} - Faskes: ${user.nama_faskes}`);
    });

    // Test final password verification
    console.log('\n5️⃣ Final password verification test...');
    const [finalWillinUser] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      ['willinmm@esirv2faskes.com']
    );
    
    if (finalWillinUser.length > 0) {
      const isFinalValid = await bcrypt.compare('faskes123', finalWillinUser[0].password);
      console.log(`Final password test for willinmm@esirv2faskes.com: ${isFinalValid ? '✅ SUCCESS' : '❌ FAILED'}`);
    }

    console.log('\n🎉 Faskes password fix completed!');
    console.log('\n📋 Use these credentials:');
    console.log('  Email: willinmm@esirv2faskes.com');
    console.log('  Password: faskes123');
    console.log('  Email: retaazra@esirv2faskes.com');
    console.log('  Password: faskes123');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

fixFaskesPasswords()
  .then(() => {
    console.log('\n✅ Faskes password fix completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Faskes password fix failed:', error);
    process.exit(1);
  });
