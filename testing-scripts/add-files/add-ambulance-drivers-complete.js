const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'esirv2'
};

// Complete data sopir ambulans
const ambulanceDrivers = [
  {
    nama_lengkap: 'Ahmad Supriadi',
    username: 'ahmad.supriadi',
    email: 'ahmad.supriadi@ambulans.com',
    password: 'sopir123',
    telepon: '081234567890',
    faskes_id: 1,
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
    faskes_id: 1,
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
    faskes_id: 2,
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
    faskes_id: 2,
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
    faskes_id: 3,
    nomor_sim: 'B1234571',
    nomor_ambulans: 'AMB-005',
    status: 'aktif'
  },
  {
    nama_lengkap: 'Fajar Ramadhan',
    username: 'fajar.ramadhan',
    email: 'fajar.ramadhan@ambulans.com',
    password: 'sopir123',
    telepon: '081234567895',
    faskes_id: 3,
    nomor_sim: 'B1234572',
    nomor_ambulans: 'AMB-006',
    status: 'aktif'
  },
  {
    nama_lengkap: 'Gunawan Setiawan',
    username: 'gunawan.setiawan',
    email: 'gunawan.setiawan@ambulans.com',
    password: 'sopir123',
    telepon: '081234567896',
    faskes_id: 4,
    nomor_sim: 'B1234573',
    nomor_ambulans: 'AMB-007',
    status: 'aktif'
  },
  {
    nama_lengkap: 'Hendra Kusuma',
    username: 'hendra.kusuma',
    email: 'hendra.kusuma@ambulans.com',
    password: 'sopir123',
    telepon: '081234567897',
    faskes_id: 4,
    nomor_sim: 'B1234574',
    nomor_ambulans: 'AMB-008',
    status: 'aktif'
  },
  {
    nama_lengkap: 'Indra Permana',
    username: 'indra.permana',
    email: 'indra.permana@ambulans.com',
    password: 'sopir123',
    telepon: '081234567898',
    faskes_id: 5,
    nomor_sim: 'B1234575',
    nomor_ambulans: 'AMB-009',
    status: 'aktif'
  },
  {
    nama_lengkap: 'Joko Widodo',
    username: 'joko.widodo',
    email: 'joko.widodo@ambulans.com',
    password: 'sopir123',
    telepon: '081234567899',
    faskes_id: 5,
    nomor_sim: 'B1234576',
    nomor_ambulans: 'AMB-010',
    status: 'aktif'
  }
];

async function createAmbulanceDriversTable(connection) {
  try {
    console.log('🏗️ Creating ambulance_drivers table...');
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS ambulance_drivers (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        nomor_sim VARCHAR(20) NOT NULL,
        nomor_ambulans VARCHAR(20) NOT NULL,
        status ENUM('aktif', 'nonaktif', 'cuti', 'sakit') DEFAULT 'aktif',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_nomor_sim (nomor_sim),
        UNIQUE KEY unique_nomor_ambulans (nomor_ambulans),
        UNIQUE KEY unique_user_driver (user_id)
      )
    `);
    
    // Create indexes
    await connection.execute('CREATE INDEX IF NOT EXISTS idx_ambulance_drivers_status ON ambulance_drivers(status)');
    await connection.execute('CREATE INDEX IF NOT EXISTS idx_ambulance_drivers_faskes ON ambulance_drivers(user_id)');
    
    console.log('✅ Ambulance drivers table created successfully');
    
  } catch (error) {
    console.error('❌ Error creating table:', error);
    throw error;
  }
}

async function addAmbulanceDriverRole(connection) {
  try {
    console.log('🚑 Adding Ambulance Driver Role...');
    
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
  }
}

async function addAmbulanceDriversComplete() {
  let connection;
  
  try {
    console.log('🚑 Adding Complete Ambulance Drivers Data...\n');
    
    // Connect to database
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');
    
    // Step 1: Create table
    await createAmbulanceDriversTable(connection);
    
    // Step 2: Add role
    const roleId = await addAmbulanceDriverRole(connection);
    
    // Step 3: Check available faskes
    const [faskes] = await connection.execute('SELECT id, nama_faskes FROM faskes');
    console.log('📋 Available faskes:');
    faskes.forEach(f => console.log(`  - ID: ${f.id}, Nama: ${f.nama_faskes}`));
    
    // Step 4: Add each ambulance driver
    const addedDrivers = [];
    const skippedDrivers = [];
    
    for (const driver of ambulanceDrivers) {
      try {
        // Check if user already exists
        const [existingUsers] = await connection.execute(
          'SELECT id FROM users WHERE email = ?',
          [driver.email]
        );
        
        if (existingUsers.length > 0) {
          console.log(`⚠️ User ${driver.nama_lengkap} already exists`);
          skippedDrivers.push(driver.nama_lengkap);
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
        console.log(`   Faskes ID: ${driver.faskes_id}`);
        
        addedDrivers.push({
          id: userId,
          nama_lengkap: driver.nama_lengkap,
          email: driver.email,
          nomor_ambulans: driver.nomor_ambulans,
          faskes_id: driver.faskes_id
        });
        
      } catch (error) {
        console.error(`❌ Error adding driver ${driver.nama_lengkap}:`, error.message);
      }
    }
    
    // Step 5: Show summary
    console.log('\n📊 Summary:');
    console.log(`✅ Successfully added ${addedDrivers.length} ambulance drivers`);
    console.log(`⚠️ Skipped ${skippedDrivers.length} existing drivers`);
    
    if (addedDrivers.length > 0) {
      console.log('\n👥 Added Drivers:');
      addedDrivers.forEach(driver => {
        console.log(`  - ${driver.nama_lengkap} (${driver.email}) - ${driver.nomor_ambulans} - Faskes ${driver.faskes_id}`);
      });
    }
    
    if (skippedDrivers.length > 0) {
      console.log('\n⚠️ Skipped Drivers:');
      skippedDrivers.forEach(name => {
        console.log(`  - ${name} (already exists)`);
      });
    }
    
    // Step 6: Show final statistics
    const [stats] = await connection.execute(`
      SELECT 
        COUNT(*) as total_drivers,
        COUNT(CASE WHEN ad.status = 'aktif' THEN 1 END) as aktif_drivers,
        COUNT(CASE WHEN ad.status = 'nonaktif' THEN 1 END) as nonaktif_drivers,
        COUNT(CASE WHEN ad.status = 'cuti' THEN 1 END) as cuti_drivers,
        COUNT(CASE WHEN ad.status = 'sakit' THEN 1 END) as sakit_drivers
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      LEFT JOIN ambulance_drivers ad ON u.id = ad.user_id
      WHERE r.nama_role = 'sopir_ambulans'
    `);
    
    console.log('\n📈 Final Statistics:');
    console.log(`   Total Drivers: ${stats[0].total_drivers}`);
    console.log(`   Aktif: ${stats[0].aktif_drivers}`);
    console.log(`   Nonaktif: ${stats[0].nonaktif_drivers}`);
    console.log(`   Cuti: ${stats[0].cuti_drivers}`);
    console.log(`   Sakit: ${stats[0].sakit_drivers}`);
    
    // Step 7: Show drivers by faskes
    const [faskesStats] = await connection.execute(`
      SELECT 
        f.nama_faskes,
        COUNT(*) as total_drivers,
        GROUP_CONCAT(u.nama_lengkap SEPARATOR ', ') as drivers
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      LEFT JOIN faskes f ON u.faskes_id = f.id
      LEFT JOIN ambulance_drivers ad ON u.id = ad.user_id
      WHERE r.nama_role = 'sopir_ambulans'
      GROUP BY f.id, f.nama_faskes
      ORDER BY f.nama_faskes
    `);
    
    console.log('\n🏥 Drivers by Faskes:');
    faskesStats.forEach(stat => {
      console.log(`   ${stat.nama_faskes}: ${stat.total_drivers} drivers`);
      console.log(`     ${stat.drivers}`);
    });
    
    return {
      addedDrivers,
      skippedDrivers,
      stats: stats[0],
      faskesStats
    };
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

module.exports = { addAmbulanceDriversComplete };

// Run if called directly
if (require.main === module) {
  addAmbulanceDriversComplete()
    .then(result => {
      console.log('\n🎉 Complete Ambulance Drivers setup completed!');
      console.log(`Total drivers added: ${result.addedDrivers.length}`);
      console.log(`Total drivers skipped: ${result.skippedDrivers.length}`);
      
      console.log('\n🔑 Login Credentials:');
      console.log('   Email: [driver_email]@ambulans.com');
      console.log('   Password: sopir123');
      
      console.log('\n🚀 Next Steps:');
      console.log('   1. Test login with new accounts');
      console.log('   2. Update backend routes to support sopir_ambulans role');
      console.log('   3. Create ambulance driver dashboard');
      console.log('   4. Add tracking features for ambulances');
      
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Setup failed:', error);
      process.exit(1);
    });
}
