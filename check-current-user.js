const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'esirv2'
};

async function checkCurrentUser() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database esirv2');

    // Check all users with their roles
    console.log('\n1️⃣ Checking all users and their roles...');
    const [users] = await connection.execute(`
      SELECT 
        u.id,
        u.nama_lengkap,
        u.username,
        u.email,
        u.role_id,
        r.nama_role,
        u.faskes_id,
        f.nama_faskes
      FROM users u 
      LEFT JOIN roles r ON u.role_id = r.id
      LEFT JOIN faskes f ON u.faskes_id = f.id
      ORDER BY u.id DESC
    `);
    
    console.log(`\nFound ${users.length} users:`);
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. User ID: ${user.id}`);
      console.log(`   Nama: ${user.nama_lengkap}`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.nama_role} (ID: ${user.role_id})`);
      console.log(`   Faskes: ${user.nama_faskes || 'Tidak ada'} (ID: ${user.faskes_id || 'NULL'})`);
    });

    // Check available roles
    console.log('\n2️⃣ Available roles:');
    const [roles] = await connection.execute('SELECT * FROM roles ORDER BY id');
    roles.forEach(role => {
      console.log(`   - ID ${role.id}: ${role.nama_role}`);
    });

    // Check available faskes
    console.log('\n3️⃣ Available faskes:');
    const [faskes] = await connection.execute('SELECT * FROM faskes ORDER BY id');
    faskes.forEach(faskes => {
      console.log(`   - ID ${faskes.id}: ${faskes.nama_faskes}`);
    });

    console.log('\n🎉 User check completed!');
    console.log('\n📋 Login recommendations:');
    console.log('  For Admin access:');
    console.log('    - admin@esirv2.com / admin123');
    console.log('    - adminstaff@esirv2.com / admin123');
    console.log('  For Faskes access:');
    console.log('    - willinmm@esirv2faskes.com / faskes123');
    console.log('    - retaazra@esirv2faskes.com / faskes123');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkCurrentUser()
  .then(() => {
    console.log('\n✅ User check completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ User check failed:', error);
    process.exit(1);
  });
