const mysql = require('mysql2/promise');
require('dotenv').config();
const bcrypt = require('bcryptjs');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DATABASE || 'esirv2'
};

async function fixAdminPassword() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database esirv2');

    // Check current admin users
    console.log('\n1️⃣ Checking admin users...');
    const [adminUsers] = await connection.execute(`
      SELECT u.id, u.nama_lengkap, u.username, u.email, u.password, u.role_id, r.nama_role 
      FROM users u 
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.email IN ('admin@esirv2.com', 'adminstaff@esirv2.com')
      ORDER BY u.id
    `);
    
    console.log(`Found ${adminUsers.length} admin users:`);
    adminUsers.forEach((user, index) => {
      console.log(`\n${index + 1}. User ID: ${user.id}`);
      console.log(`   Nama: ${user.nama_lengkap}`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.nama_role} (ID: ${user.role_id})`);
      console.log(`   Password: ${user.password ? user.password.substring(0, 30) + '...' : 'NULL'}`);
    });

    // Test password verification for admin@esirv2.com
    console.log('\n2️⃣ Testing password for admin@esirv2.com...');
    const [adminUser] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      ['admin@esirv2.com']
    );
    
    if (adminUser.length > 0) {
      const user = adminUser[0];
      console.log(`Found user: ${user.nama_lengkap} (${user.email})`);
      
      // Test password verification
      const isPasswordValid = await bcrypt.compare('admin123', user.password);
      console.log(`Password verification for 'admin123': ${isPasswordValid ? '✅ VALID' : '❌ INVALID'}`);
      
      if (!isPasswordValid) {
        console.log('❌ Password verification failed! Creating new password hash...');
        
        const newHashedPassword = await bcrypt.hash('admin123', 12);
        await connection.execute(
          'UPDATE users SET password = ? WHERE email = ?',
          [newHashedPassword, 'admin@esirv2.com']
        );
        console.log('✅ Password updated successfully for admin@esirv2.com');
      }
    } else {
      console.log('❌ User admin@esirv2.com not found!');
    }

    // Test password verification for adminstaff@esirv2.com
    console.log('\n3️⃣ Testing password for adminstaff@esirv2.com...');
    const [adminStaffUser] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      ['adminstaff@esirv2.com']
    );
    
    if (adminStaffUser.length > 0) {
      const user = adminStaffUser[0];
      console.log(`Found user: ${user.nama_lengkap} (${user.email})`);
      
      // Test password verification
      const isPasswordValid = await bcrypt.compare('admin123', user.password);
      console.log(`Password verification for 'admin123': ${isPasswordValid ? '✅ VALID' : '❌ INVALID'}`);
      
      if (!isPasswordValid) {
        console.log('❌ Password verification failed! Creating new password hash...');
        
        const newHashedPassword = await bcrypt.hash('admin123', 12);
        await connection.execute(
          'UPDATE users SET password = ? WHERE email = ?',
          [newHashedPassword, 'adminstaff@esirv2.com']
        );
        console.log('✅ Password updated successfully for adminstaff@esirv2.com');
      }
    } else {
      console.log('❌ User adminstaff@esirv2.com not found!');
    }

    // Final verification
    console.log('\n4️⃣ Final verification...');
    const [finalAdminUsers] = await connection.execute(`
      SELECT u.id, u.nama_lengkap, u.username, u.email, u.role_id, r.nama_role 
      FROM users u 
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.email IN ('admin@esirv2.com', 'adminstaff@esirv2.com')
      ORDER BY u.email
    `);
    
    console.log('\nFinal admin users:');
    finalAdminUsers.forEach(user => {
      console.log(`  - ${user.nama_lengkap} (${user.email}) - Role: ${user.nama_role}`);
    });

    // Test final password verification
    console.log('\n5️⃣ Final password verification test...');
    const [finalAdminUser] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      ['admin@esirv2.com']
    );
    
    if (finalAdminUser.length > 0) {
      const isFinalValid = await bcrypt.compare('admin123', finalAdminUser[0].password);
      console.log(`Final password test for admin@esirv2.com: ${isFinalValid ? '✅ SUCCESS' : '❌ FAILED'}`);
    }

    console.log('\n🎉 Admin password fix completed!');
    console.log('\n📋 Use these credentials:');
    console.log('  Email: admin@esirv2.com');
    console.log('  Password: admin123');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

fixAdminPassword()
  .then(() => {
    console.log('\n✅ Admin password fix completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Admin password fix failed:', error);
    process.exit(1);
  });
