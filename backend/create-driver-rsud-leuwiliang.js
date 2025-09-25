const mysql = require('mysql2');

async function createDriverRSUDLeuwiliang() {
  let connection;
  try {
    connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'prodsysesirv02'
    });

    console.log('🚑 Creating driver user for RSUD Leuwiliang...');
    
    // Check if driver user already exists
    const [existingUsers] = await connection.promise().query(`
      SELECT id, nama_lengkap, email, username
      FROM users 
      WHERE email = 'driver@rsudleuwiliang.go.id' OR username = 'driver_rsud_leuwiliang'
    `);
    
    if (existingUsers.length > 0) {
      console.log('⚠️ Driver user already exists:');
      existingUsers.forEach(user => {
        console.log(`- ID: ${user.id}, Name: ${user.nama_lengkap}, Email: ${user.email}, Username: ${user.username}`);
      });
      return;
    }
    
    // Get role_id for sopir_ambulans
    const [roles] = await connection.promise().query(`
      SELECT id FROM roles WHERE nama_role = 'sopir_ambulans'
    `);
    
    if (roles.length === 0) {
      console.log('❌ Role sopir_ambulans not found');
      return;
    }
    
    const role_id = roles[0].id;
    console.log('✅ Found role sopir_ambulans with ID:', role_id);
    
    // Create new driver user
    const userData = {
      nama_lengkap: 'Sopir Ambulans RSUD Leuwiliang',
      username: 'driver_rsud_leuwiliang',
      email: 'driver@rsudleuwiliang.go.id',
      password: 'driver123', // Plain text for development
      role_id: role_id,
      faskes_id: 26, // RSUD Leuwiliang ID
      telepon: '0251-8643291'
    };
    
    console.log('📝 Driver user data:', userData);
    
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
    
    console.log('✅ Driver user created successfully with ID:', result.insertId);
    
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
      console.log('🎉 Driver user verification:');
      console.log(`- ID: ${user.id}`);
      console.log(`- Name: ${user.nama_lengkap}`);
      console.log(`- Username: ${user.username}`);
      console.log(`- Email: ${user.email}`);
      console.log(`- Role: ${user.role}`);
      console.log(`- Faskes: ${user.nama_faskes} (ID: ${user.faskes_id})`);
      console.log(`- Phone: ${user.telepon}`);
      console.log(`- Created: ${user.created_at}`);
    }
    
    // Also create ambulance driver record if table exists
    try {
      const [ambulanceResult] = await connection.promise().query(`
        INSERT INTO ambulance_drivers (user_id, nama_lengkap, faskes_id, telepon, status, created_at, updated_at) 
        VALUES (?, ?, ?, ?, 'active', NOW(), NOW())
      `, [
        result.insertId,
        userData.nama_lengkap,
        userData.faskes_id,
        userData.telepon
      ]);
      
      console.log('🚑 Ambulance driver record created with ID:', ambulanceResult.insertId);
    } catch (error) {
      console.log('⚠️ Ambulance driver table might not exist:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      connection.end();
    }
  }
}

createDriverRSUDLeuwiliang();
