const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'esirv2'
};

// Sample data sopir ambulans
const ambulanceDrivers = [
  {
    nama_lengkap: 'Ahmad Supriadi',
    username: 'ahmad.supriadi',
    email: 'ahmad.supriadi@ambulans.com',
    password: 'sopir123',
    telepon: '081234567890',
    faskes_id: 1, // Sesuaikan dengan ID faskes yang ada
    nomor_sim: 'B1234567',
    nomor_ambulans: 'AMB-001',
    status: 'aktif'
  },
  {
    nama_lengkap: 'Budi Santoso',
    username: 'budi.santoso',
    email: 'budi.santoso@ambulans.com',
    password: 'sopir123',
    telepon: '081234567891',
    faskes_id: 1, // Sesuaikan dengan ID faskes yang ada
    nomor_sim: 'B1234568',
    nomor_ambulans: 'AMB-002',
    status: 'aktif'
  },
  {
    nama_lengkap: 'Candra Wijaya',
    username: 'candra.wijaya',
    email: 'candra.wijaya@ambulans.com',
    password: 'sopir123',
    telepon: '081234567892',
    faskes_id: 2, // Sesuaikan dengan ID faskes yang ada
    nomor_sim: 'B1234569',
    nomor_ambulans: 'AMB-003',
    status: 'aktif'
  },
  {
    nama_lengkap: 'Dedi Kurniawan',
    username: 'dedi.kurniawan',
    email: 'dedi.kurniawan@ambulans.com',
    password: 'sopir123',
    telepon: '081234567893',
    faskes_id: 2, // Sesuaikan dengan ID faskes yang ada
    nomor_sim: 'B1234570',
    nomor_ambulans: 'AMB-004',
    status: 'aktif'
  },
  {
    nama_lengkap: 'Eko Prasetyo',
    username: 'eko.prasetyo',
    email: 'eko.prasetyo@ambulans.com',
    password: 'sopir123',
    telepon: '081234567894',
    faskes_id: 3, // Sesuaikan dengan ID faskes yang ada
    nomor_sim: 'B1234571',
    nomor_ambulans: 'AMB-005',
    status: 'aktif'
  }
];

async function addAmbulanceDrivers() {
  let connection;
  
  try {
    console.log('🚑 Adding Ambulance Drivers...\n');
    
    // Connect to database
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');
    
    // Get role ID for sopir_ambulans
    const [roles] = await connection.execute(
      'SELECT id FROM roles WHERE nama_role = ?',
      ['sopir_ambulans']
    );
    
    if (roles.length === 0) {
      throw new Error('Role sopir_ambulans not found. Please run add-ambulance-driver-role.js first.');
    }
    
    const roleId = roles[0].id;
    console.log('✅ Found role sopir_ambulans with ID:', roleId);
    
    // Check available faskes
    const [faskes] = await connection.execute('SELECT id, nama_faskes FROM faskes');
    console.log('📋 Available faskes:');
    faskes.forEach(f => console.log(`  - ID: ${f.id}, Nama: ${f.nama_faskes}`));
    
    // Add each ambulance driver
    const addedDrivers = [];
    
    for (const driver of ambulanceDrivers) {
      try {
        // Check if user already exists
        const [existingUsers] = await connection.execute(
          'SELECT id FROM users WHERE email = ?',
          [driver.email]
        );
        
        if (existingUsers.length > 0) {
          console.log(`⚠️ User ${driver.nama_lengkap} already exists`);
          continue;
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(driver.password, 12);
        
        // Insert user
        const [userResult] = await connection.execute(
          `INSERT INTO users (
            nama_lengkap, username, password, email, role_id, faskes_id, telepon, 
            created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            driver.nama_lengkap,
            driver.username,
            hashedPassword,
            driver.email,
            roleId,
            driver.faskes_id,
            driver.telepon
          ]
        );
        
        const userId = userResult.insertId;
        
        // Insert ambulance driver details
        await connection.execute(
          `INSERT INTO ambulance_drivers (
            user_id, nomor_sim, nomor_ambulans, status, created_at, updated_at
          ) VALUES (?, ?, ?, ?, NOW(), NOW())`,
          [
            userId,
            driver.nomor_sim,
            driver.nomor_ambulans,
            driver.status
          ]
        );
        
        console.log(`✅ Added driver: ${driver.nama_lengkap} (ID: ${userId})`);
        console.log(`   Email: ${driver.email}`);
        console.log(`   Ambulance: ${driver.nomor_ambulans}`);
        console.log(`   SIM: ${driver.nomor_sim}`);
        
        addedDrivers.push({
          id: userId,
          nama_lengkap: driver.nama_lengkap,
          email: driver.email,
          nomor_ambulans: driver.nomor_ambulans
        });
        
      } catch (error) {
        console.error(`❌ Error adding driver ${driver.nama_lengkap}:`, error.message);
      }
    }
    
    console.log('\n📊 Summary:');
    console.log(`✅ Successfully added ${addedDrivers.length} ambulance drivers`);
    
    if (addedDrivers.length > 0) {
      console.log('\n👥 Added Drivers:');
      addedDrivers.forEach(driver => {
        console.log(`  - ${driver.nama_lengkap} (${driver.email}) - ${driver.nomor_ambulans}`);
      });
    }
    
    return addedDrivers;
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

module.exports = { addAmbulanceDrivers };

// Run if called directly
if (require.main === module) {
  addAmbulanceDrivers()
    .then(drivers => {
      console.log('\n🎉 Ambulance drivers setup completed!');
      console.log(`Total drivers added: ${drivers.length}`);
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Setup failed:', error);
      process.exit(1);
    });
}
