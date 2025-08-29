const mysql = require('mysql2/promise');
const { addAmbulanceDriverRole } = require('./add-ambulance-driver-role');
const { addAmbulanceDrivers } = require('./add-ambulance-drivers');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'esirv2'
};

async function createAmbulanceDriversTable() {
  let connection;
  
  try {
    console.log('🏗️ Creating ambulance_drivers table...\n');
    
    connection = await mysql.createConnection(dbConfig);
    
    // Read SQL file content
    const fs = require('fs');
    const sqlContent = fs.readFileSync('./create-ambulance-drivers-table.sql', 'utf8');
    
    // Split SQL statements
    const statements = sqlContent.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement);
      }
    }
    
    console.log('✅ Ambulance drivers table created successfully');
    
  } catch (error) {
    console.error('❌ Error creating table:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function setupAmbulanceDrivers() {
  try {
    console.log('🚑 Setting up Ambulance Drivers System...\n');
    
    // Step 1: Create table
    await createAmbulanceDriversTable();
    
    // Step 2: Add role
    const roleId = await addAmbulanceDriverRole();
    
    // Step 3: Add drivers
    const drivers = await addAmbulanceDrivers();
    
    console.log('\n🎉 Ambulance Drivers Setup Completed!');
    console.log('📋 Summary:');
    console.log(`   ✅ Table created: ambulance_drivers`);
    console.log(`   ✅ Role added: sopir_ambulans (ID: ${roleId})`);
    console.log(`   ✅ Drivers added: ${drivers.length}`);
    
    console.log('\n🔑 Login Credentials:');
    drivers.forEach(driver => {
      console.log(`   👤 ${driver.nama_lengkap}`);
      console.log(`      Email: ${driver.email}`);
      console.log(`      Password: sopir123`);
      console.log(`      Ambulance: ${driver.nomor_ambulans}`);
      console.log('');
    });
    
    console.log('🚀 Next Steps:');
    console.log('   1. Update backend routes to support sopir_ambulans role');
    console.log('   2. Create ambulance driver dashboard');
    console.log('   3. Add tracking features for ambulances');
    console.log('   4. Test login with new accounts');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

// Run setup
if (require.main === module) {
  setupAmbulanceDrivers()
    .then(() => {
      console.log('\n✅ All done!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupAmbulanceDrivers };
