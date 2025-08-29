const mysql = require('mysql2/promise');
require('dotenv').config();
const bcrypt = require('bcryptjs');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'esirv2'
};

async function debugLoginIssue() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database esirv2');

    // 1. Check all users in database
    console.log('\n1️⃣ Checking all users in database...');
    const [users] = await connection.execute(`
      SELECT u.id, u.username, u.email, u.password, u.role_id, r.nama_role 
      FROM users u 
      LEFT JOIN roles r ON u.role_id = r.id
      ORDER BY u.id
    `);
    
    console.log(`Found ${users.length} users:`);
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. User ID: ${user.id}`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.nama_role} (ID: ${user.role_id})`);
      console.log(`   Password: ${user.password ? user.password.substring(0, 30) + '...' : 'NULL'}`);
    });

    // 2. Test password verification
    console.log('\n2️⃣ Testing password verification...');
    const testPassword = 'admin123';
    const testEmail = 'admin@esirv2.com';
    
    // Find user by email
    const [userByEmail] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [testEmail]
    );
    
    if (userByEmail.length > 0) {
      const user = userByEmail[0];
      console.log(`Found user: ${user.username} (${user.email})`);
      
      // Test password verification
      const isPasswordValid = await bcrypt.compare(testPassword, user.password);
      console.log(`Password verification for '${testPassword}': ${isPasswordValid ? '✅ VALID' : '❌ INVALID'}`);
      
      if (!isPasswordValid) {
        console.log('❌ Password verification failed!');
        console.log('Creating new password hash...');
        
        const newHashedPassword = await bcrypt.hash(testPassword, 12);
        await connection.execute(
          'UPDATE users SET password = ? WHERE email = ?',
          [newHashedPassword, testEmail]
        );
        console.log('✅ Password updated successfully');
      }
    } else {
      console.log(`❌ User with email ${testEmail} not found!`);
    }

    // 3. Create fresh admin user
    console.log('\n3️⃣ Creating fresh admin user...');
    const freshHashedPassword = await bcrypt.hash('admin123', 12);
    
    await connection.execute(`
      INSERT INTO users (username, email, password, role_id, created_at, updated_at) 
      VALUES ('admin_fresh', 'admin@esirv2.com', ?, 1, NOW(), NOW())
      ON DUPLICATE KEY UPDATE 
        username = VALUES(username),
        password = VALUES(password),
        role_id = VALUES(role_id),
        updated_at = NOW()
    `, [freshHashedPassword]);

    console.log('✅ Fresh admin user created/updated');

    // 4. Create fresh operator user
    console.log('\n4️⃣ Creating fresh operator user...');
    await connection.execute(`
      INSERT INTO users (username, email, password, role_id, faskes_id, created_at, updated_at) 
      VALUES ('operator_fresh', 'operator@esirv2.com', ?, 2, 1, NOW(), NOW())
      ON DUPLICATE KEY UPDATE 
        username = VALUES(username),
        password = VALUES(password),
        role_id = VALUES(role_id),
        faskes_id = VALUES(faskes_id),
        updated_at = NOW()
    `, [freshHashedPassword]);

    console.log('✅ Fresh operator user created/updated');

    // 5. Final verification
    console.log('\n5️⃣ Final verification...');
    const [finalUsers] = await connection.execute(`
      SELECT u.id, u.username, u.email, u.role_id, r.nama_role 
      FROM users u 
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.email IN ('admin@esirv2.com', 'operator@esirv2.com')
      ORDER BY u.email
    `);
    
    console.log('\nFinal users for login:');
    finalUsers.forEach(user => {
      console.log(`  - ${user.username} (${user.email}) - Role: ${user.nama_role}`);
    });

    // 6. Test password verification again
    console.log('\n6️⃣ Final password verification test...');
    const [adminUser] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      ['admin@esirv2.com']
    );
    
    if (adminUser.length > 0) {
      const isFinalValid = await bcrypt.compare('admin123', adminUser[0].password);
      console.log(`Final password test: ${isFinalValid ? '✅ SUCCESS' : '❌ FAILED'}`);
    }

    console.log('\n🎉 Login debug completed!');
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

debugLoginIssue()
  .then(() => {
    console.log('\n✅ Login debug completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Login debug failed:', error);
    process.exit(1);
  });
