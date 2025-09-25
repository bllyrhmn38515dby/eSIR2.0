const mysql = require('mysql2');

async function createAdminRSUDLeuwiliang() {
  let connection;
  try {
    connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'prodsysesirv02'
    });

    console.log('👤 Creating admin user for RSUD Leuwiliang...');
    
    // Check if user already exists
    const [existingUsers] = await connection.promise().query(`
      SELECT id, nama_lengkap, email, username
      FROM users 
      WHERE email = 'admin@rsudleuwiliang.go.id' OR username = 'admin_rsud_leuwiliang'
    `);
    
    if (existingUsers.length > 0) {
      console.log('⚠️ User already exists:');
      existingUsers.forEach(user => {
        console.log(`- ID: ${user.id}, Name: ${user.nama_lengkap}, Email: ${user.email}, Username: ${user.username}`);
      });
      return;
    }
    
    // Get role_id for admin_faskes
    const [roles] = await connection.promise().query(`
      SELECT id FROM roles WHERE nama_role = 'admin_faskes'
    `);
    
    if (roles.length === 0) {
      console.log('❌ Role admin_faskes not found');
      return;
    }
    
    const role_id = roles[0].id;
    console.log('✅ Found role admin_faskes with ID:', role_id);
    
    // Create new admin user
    const userData = {
      nama_lengkap: 'Admin RSUD Leuwiliang',
      username: 'admin_rsud_leuwiliang',
      email: 'admin@rsudleuwiliang.go.id',
      password: 'admin123', // Plain text for development
      role_id: role_id,
      faskes_id: 26, // RSUD Leuwiliang ID
      telepon: '0251-8643290'
    };
    
    console.log('📝 User data:', userData);
    
    const [result] = await connection.promise().query(`
      INSERT INTO users (nama_lengkap, username, password, email, role_id, faskes_id, telepon, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      userData.nama_lengkap,
      userData.username,
      userData.password,
      userData.email,
      userData.role_id,
      userData.faskes_id,
      userData.telepon
    ]);
    
    console.log('✅ User created successfully with ID:', result.insertId);
    
    // Verify the created user
    const [newUser] = await connection.promise().query(`
      SELECT u.id, u.nama_lengkap, u.username, u.email, u.faskes_id, u.telepon, u.created_at, 
             r.nama_role as role, f.nama_faskes
      FROM users u 
      LEFT JOIN roles r ON u.role_id = r.id 
      LEFT JOIN faskes f ON u.faskes_id = f.id
      WHERE u.id = ?
    `, [result.insertId]);
    
    if (newUser.length > 0) {
      const user = newUser[0];
      console.log('🎉 User verification:');
      console.log(`- ID: ${user.id}`);
      console.log(`- Name: ${user.nama_lengkap}`);
      console.log(`- Username: ${user.username}`);
      console.log(`- Email: ${user.email}`);
      console.log(`- Role: ${user.role}`);
      console.log(`- Faskes: ${user.nama_faskes} (ID: ${user.faskes_id})`);
      console.log(`- Phone: ${user.telepon}`);
      console.log(`- Created: ${user.created_at}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      connection.end();
    }
  }
}

createAdminRSUDLeuwiliang();
