const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'esirv2'
};

async function fixUsersEndpoint() {
  let connection;
  
  try {
    console.log('🔧 Fixing Users Endpoint...\n');
    
    // Connect to database
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');
    
    // 1. Check and fix users table
    console.log('\n1️⃣ Checking users table...');
    
    // Check if last_login column exists
    const [userColumns] = await connection.execute('DESCRIBE users');
    const hasLastLogin = userColumns.some(col => col.Field === 'last_login');
    
    if (!hasLastLogin) {
      console.log('⚠️ Adding last_login column to users table...');
      await connection.execute('ALTER TABLE users ADD COLUMN last_login TIMESTAMP NULL');
      console.log('✅ last_login column added');
    } else {
      console.log('✅ last_login column already exists');
    }
    
    // 2. Check and fix roles table
    console.log('\n2️⃣ Checking roles table...');
    
    const [roleColumns] = await connection.execute('DESCRIBE roles');
    const hasDeskripsi = roleColumns.some(col => col.Field === 'deskripsi');
    
    if (!hasDeskripsi) {
      console.log('⚠️ Adding deskripsi column to roles table...');
      await connection.execute('ALTER TABLE roles ADD COLUMN deskripsi TEXT NULL');
      console.log('✅ deskripsi column added');
    } else {
      console.log('✅ deskripsi column already exists');
    }
    
    // 3. Check and fix faskes table
    console.log('\n3️⃣ Checking faskes table...');
    
    const [faskesColumns] = await connection.execute('DESCRIBE faskes');
    const hasNamaFaskes = faskesColumns.some(col => col.Field === 'nama_faskes');
    
    if (!hasNamaFaskes) {
      console.log('⚠️ Adding nama_faskes column to faskes table...');
      await connection.execute('ALTER TABLE faskes ADD COLUMN nama_faskes VARCHAR(255) NOT NULL DEFAULT "Unknown"');
      console.log('✅ nama_faskes column added');
    } else {
      console.log('✅ nama_faskes column already exists');
    }
    
    // 4. Check for orphaned users (users without roles)
    console.log('\n4️⃣ Checking for orphaned users...');
    
    const [orphanedUsers] = await connection.execute(`
      SELECT u.id, u.nama_lengkap, u.email, u.role_id 
      FROM users u 
      LEFT JOIN roles r ON u.role_id = r.id 
      WHERE r.id IS NULL
    `);
    
    if (orphanedUsers.length > 0) {
      console.log(`⚠️ Found ${orphanedUsers.length} users without valid roles`);
      
      // Get default role (admin_pusat or first available)
      const [defaultRoles] = await connection.execute('SELECT id FROM roles WHERE nama_role = "admin_pusat" LIMIT 1');
      let defaultRoleId = null;
      
      if (defaultRoles.length > 0) {
        defaultRoleId = defaultRoles[0].id;
      } else {
        const [firstRole] = await connection.execute('SELECT id FROM roles LIMIT 1');
        if (firstRole.length > 0) {
          defaultRoleId = firstRole[0].id;
        }
      }
      
      if (defaultRoleId) {
        console.log(`🔧 Fixing orphaned users with role ID: ${defaultRoleId}`);
        for (const user of orphanedUsers) {
          await connection.execute(
            'UPDATE users SET role_id = ? WHERE id = ?',
            [defaultRoleId, user.id]
          );
          console.log(`  - Fixed user: ${user.nama_lengkap} (ID: ${user.id})`);
        }
      } else {
        console.log('❌ No valid roles found to assign to orphaned users');
      }
    } else {
      console.log('✅ No orphaned users found');
    }
    
    // 5. Test the fixed query
    console.log('\n5️⃣ Testing the fixed query...');
    
    try {
      const [testUsers] = await connection.execute(`
        SELECT 
          u.id, 
          u.nama_lengkap, 
          u.username, 
          u.email, 
          u.faskes_id, 
          u.telepon, 
          u.created_at, 
          u.updated_at, 
          u.last_login, 
          COALESCE(r.nama_role, 'Unknown') as role, 
          COALESCE(f.nama_faskes, 'Unknown') as nama_faskes
        FROM users u 
        LEFT JOIN roles r ON u.role_id = r.id 
        LEFT JOIN faskes f ON u.faskes_id = f.id
        ORDER BY u.created_at DESC
      `);
      
      console.log('✅ Query successful!');
      console.log(`Found ${testUsers.length} users`);
      
      if (testUsers.length > 0) {
        console.log('\nSample user data:');
        const sampleUser = testUsers[0];
        console.log(`  - ID: ${sampleUser.id}`);
        console.log(`  - Name: ${sampleUser.nama_lengkap}`);
        console.log(`  - Email: ${sampleUser.email}`);
        console.log(`  - Role: ${sampleUser.role}`);
        console.log(`  - Faskes: ${sampleUser.nama_faskes}`);
      }
      
    } catch (queryError) {
      console.error('❌ Query still failed:', queryError.message);
      throw queryError;
    }
    
    // 6. Show summary
    console.log('\n6️⃣ Summary:');
    
    const [userCount] = await connection.execute('SELECT COUNT(*) as count FROM users');
    const [roleCount] = await connection.execute('SELECT COUNT(*) as count FROM roles');
    const [faskesCount] = await connection.execute('SELECT COUNT(*) as count FROM faskes');
    
    console.log(`  - Total users: ${userCount[0].count}`);
    console.log(`  - Total roles: ${roleCount[0].count}`);
    console.log(`  - Total faskes: ${faskesCount[0].count}`);
    
    console.log('\n✅ Users endpoint should now work properly!');
    
  } catch (error) {
    console.error('❌ Fix failed:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run fix
fixUsersEndpoint()
  .then(() => {
    console.log('\n🎉 Fix completed!');
    console.log('\n🚀 Next steps:');
    console.log('  1. Restart your backend server');
    console.log('  2. Test the UserManagement page');
    console.log('  3. Check if the 500 error is resolved');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Fix failed:', error);
    process.exit(1);
  });
