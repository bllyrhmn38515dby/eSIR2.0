const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'esirv2'
};

async function addAmbulanceDriverRole() {
  let connection;
  
  try {
    console.log('🚑 Adding Ambulance Driver Role...\n');
    
    // Connect to database
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');
    
    // Check if role already exists
    const [existingRoles] = await connection.execute(
      'SELECT * FROM roles WHERE nama_role = ?',
      ['sopir_ambulans']
    );
    
    if (existingRoles.length > 0) {
      console.log('⚠️ Role sopir_ambulans already exists');
      console.log('Role ID:', existingRoles[0].id);
      return existingRoles[0].id;
    }
    
    // Add new role
    const [result] = await connection.execute(
      'INSERT INTO roles (nama_role, deskripsi, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
      ['sopir_ambulans', 'Sopir ambulans yang bertugas mengantar pasien']
    );
    
    console.log('✅ Role sopir_ambulans added successfully');
    console.log('Role ID:', result.insertId);
    
    return result.insertId;
    
  } catch (error) {
    console.error('❌ Error adding role:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

module.exports = { addAmbulanceDriverRole };

// Run if called directly
if (require.main === module) {
  addAmbulanceDriverRole()
    .then(roleId => {
      console.log('\n🎉 Ambulance driver role setup completed!');
      console.log('Role ID:', roleId);
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Setup failed:', error);
      process.exit(1);
    });
}
