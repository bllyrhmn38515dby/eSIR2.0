const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'esirv2'
};

async function debugUsersEndpoint() {
  let connection;
  
  try {
    console.log('🔍 Debugging Users Endpoint...\n');
    
    // Connect to database
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');
    
    // 1. Check if tables exist
    console.log('\n1️⃣ Checking tables...');
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('Available tables:', tables.map(t => Object.values(t)[0]));
    
    // 2. Check users table structure
    console.log('\n2️⃣ Checking users table structure...');
    const [userColumns] = await connection.execute('DESCRIBE users');
    console.log('Users table columns:');
    userColumns.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });
    
    // 3. Check roles table structure
    console.log('\n3️⃣ Checking roles table structure...');
    const [roleColumns] = await connection.execute('DESCRIBE roles');
    console.log('Roles table columns:');
    roleColumns.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });
    
    // 4. Check faskes table structure
    console.log('\n4️⃣ Checking faskes table structure...');
    const [faskesColumns] = await connection.execute('DESCRIBE faskes');
    console.log('Faskes table columns:');
    faskesColumns.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });
    
    // 5. Check sample data
    console.log('\n5️⃣ Checking sample data...');
    
    // Check users
    const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
    console.log(`Total users: ${users[0].count}`);
    
    // Check roles
    const [roles] = await connection.execute('SELECT * FROM roles');
    console.log('Available roles:');
    roles.forEach(role => {
      console.log(`  - ID: ${role.id}, Role: ${role.nama_role}`);
    });
    
    // Check faskes
    const [faskes] = await connection.execute('SELECT COUNT(*) as count FROM faskes');
    console.log(`Total faskes: ${faskes[0].count}`);
    
    // 6. Test the problematic query
    console.log('\n6️⃣ Testing the problematic query...');
    
    try {
      const [testUsers] = await connection.execute(`
        SELECT u.id, u.nama_lengkap, u.username, u.email, u.faskes_id, u.telepon, u.created_at, u.updated_at, u.last_login, r.nama_role as role, f.nama_faskes
        FROM users u 
        LEFT JOIN roles r ON u.role_id = r.id 
        LEFT JOIN faskes f ON u.faskes_id = f.id
        ORDER BY u.created_at DESC
      `);
      
      console.log('✅ Query successful!');
      console.log(`Found ${testUsers.length} users`);
      
      if (testUsers.length > 0) {
        console.log('\nSample user data:');
        console.log(JSON.stringify(testUsers[0], null, 2));
      }
      
    } catch (queryError) {
      console.error('❌ Query failed:', queryError.message);
      console.error('Error details:', queryError);
    }
    
    // 7. Check for data inconsistencies
    console.log('\n7️⃣ Checking for data inconsistencies...');
    
    // Check users without roles
    const [usersWithoutRoles] = await connection.execute(`
      SELECT u.id, u.nama_lengkap, u.email, u.role_id 
      FROM users u 
      LEFT JOIN roles r ON u.role_id = r.id 
      WHERE r.id IS NULL
    `);
    
    if (usersWithoutRoles.length > 0) {
      console.log('⚠️ Users without valid roles:');
      usersWithoutRoles.forEach(user => {
        console.log(`  - ID: ${user.id}, Name: ${user.nama_lengkap}, Role ID: ${user.role_id}`);
      });
    } else {
      console.log('✅ All users have valid roles');
    }
    
    // Check users without faskes (but this might be normal)
    const [usersWithoutFaskes] = await connection.execute(`
      SELECT u.id, u.nama_lengkap, u.email, u.faskes_id 
      FROM users u 
      LEFT JOIN faskes f ON u.faskes_id = f.id 
      WHERE u.faskes_id IS NOT NULL AND f.id IS NULL
    `);
    
    if (usersWithoutFaskes.length > 0) {
      console.log('⚠️ Users with invalid faskes:');
      usersWithoutFaskes.forEach(user => {
        console.log(`  - ID: ${user.id}, Name: ${user.nama_lengkap}, Faskes ID: ${user.faskes_id}`);
      });
    } else {
      console.log('✅ All users have valid faskes (or NULL faskes_id)');
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run debug
debugUsersEndpoint()
  .then(() => {
    console.log('\n🎉 Debug completed!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Debug failed:', error);
    process.exit(1);
  });
