const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = require('./config/db');

async function restoreMissingTables() {
  let connection;
  
  try {
    console.log('🔧 Restoring Missing Tables...\n');
    
    // Connect to database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'esirv2'
    });
    
    console.log('✅ Connected to database esirv2');
    
    // 1. Check current tables
    console.log('\n1️⃣ Checking current tables...');
    const [tables] = await connection.execute('SHOW TABLES');
    const currentTables = tables.map(t => Object.values(t)[0]);
    console.log('Current tables:', currentTables);
    
    // 2. Create missing tables
    console.log('\n2️⃣ Creating missing tables...');
    
    // Create pasien table
    if (!currentTables.includes('pasien')) {
      console.log('🔨 Creating pasien table...');
      await connection.execute(`
        CREATE TABLE pasien (
          id INT PRIMARY KEY AUTO_INCREMENT,
          nama_lengkap VARCHAR(255) NOT NULL,
          nik VARCHAR(16) UNIQUE NOT NULL,
          tanggal_lahir DATE NOT NULL,
          jenis_kelamin ENUM('L', 'P') NOT NULL,
          alamat TEXT NOT NULL,
          telepon VARCHAR(20),
          faskes_id INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (faskes_id) REFERENCES faskes(id) ON DELETE SET NULL
        )
      `);
      console.log('✅ pasien table created');
    } else {
      console.log('✅ pasien table already exists');
    }
    
    // Create rujukan table
    if (!currentTables.includes('rujukan')) {
      console.log('🔨 Creating rujukan table...');
      await connection.execute(`
        CREATE TABLE rujukan (
          id INT PRIMARY KEY AUTO_INCREMENT,
          pasien_id INT NOT NULL,
          faskes_asal_id INT NOT NULL,
          faskes_tujuan_id INT NOT NULL,
          alasan_rujukan TEXT NOT NULL,
          status ENUM('pending', 'diterima', 'ditolak', 'selesai') DEFAULT 'pending',
          tanggal_rujukan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          tanggal_respon TIMESTAMP NULL,
          catatan_respon TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (pasien_id) REFERENCES pasien(id) ON DELETE CASCADE,
          FOREIGN KEY (faskes_asal_id) REFERENCES faskes(id) ON DELETE RESTRICT,
          FOREIGN KEY (faskes_tujuan_id) REFERENCES faskes(id) ON DELETE RESTRICT
        )
      `);
      console.log('✅ rujukan table created');
    } else {
      console.log('✅ rujukan table already exists');
    }
    
    // Create tempat_tidur table
    if (!currentTables.includes('tempat_tidur')) {
      console.log('🔨 Creating tempat_tidur table...');
      await connection.execute(`
        CREATE TABLE tempat_tidur (
          id INT PRIMARY KEY AUTO_INCREMENT,
          faskes_id INT NOT NULL,
          nomor_kamar VARCHAR(10) NOT NULL,
          nomor_bed VARCHAR(10) NOT NULL,
          tipe_kamar ENUM('VIP', 'Kelas 1', 'Kelas 2', 'Kelas 3', 'ICU', 'NICU') NOT NULL,
          status ENUM('tersedia', 'terisi', 'maintenance') DEFAULT 'tersedia',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (faskes_id) REFERENCES faskes(id) ON DELETE CASCADE,
          UNIQUE KEY unique_bed (faskes_id, nomor_kamar, nomor_bed)
        )
      `);
      console.log('✅ tempat_tidur table created');
    } else {
      console.log('✅ tempat_tidur table already exists');
    }
    
    // Create tracking_data table
    if (!currentTables.includes('tracking_data')) {
      console.log('🔨 Creating tracking_data table...');
      await connection.execute(`
        CREATE TABLE tracking_data (
          id INT PRIMARY KEY AUTO_INCREMENT,
          session_id VARCHAR(255) NOT NULL,
          user_id INT,
          latitude DECIMAL(10, 8) NOT NULL,
          longitude DECIMAL(11, 8) NOT NULL,
          accuracy DECIMAL(10, 2),
          speed DECIMAL(10, 2),
          heading DECIMAL(5, 2),
          altitude DECIMAL(10, 2),
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
          INDEX idx_session_id (session_id),
          INDEX idx_user_id (user_id),
          INDEX idx_timestamp (timestamp)
        )
      `);
      console.log('✅ tracking_data table created');
    } else {
      console.log('✅ tracking_data table already exists');
    }
    
    // Create tracking_sessions table
    if (!currentTables.includes('tracking_sessions')) {
      console.log('🔨 Creating tracking_sessions table...');
      await connection.execute(`
        CREATE TABLE tracking_sessions (
          id INT PRIMARY KEY AUTO_INCREMENT,
          session_id VARCHAR(255) UNIQUE NOT NULL,
          user_id INT NOT NULL,
          start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          end_time TIMESTAMP NULL,
          status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
          total_distance DECIMAL(10, 2) DEFAULT 0,
          total_duration INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          INDEX idx_user_id (user_id),
          INDEX idx_status (status),
          INDEX idx_start_time (start_time)
        )
      `);
      console.log('✅ tracking_sessions table created');
    } else {
      console.log('✅ tracking_sessions table already exists');
    }
    
    // 3. Add sample data if tables are empty
    console.log('\n3️⃣ Adding sample data...');
    
    // Check if pasien table is empty
    const [pasienCount] = await connection.execute('SELECT COUNT(*) as count FROM pasien');
    if (pasienCount[0].count === 0) {
      console.log('📝 Adding sample pasien data...');
      await connection.execute(`
        INSERT INTO pasien (nama_lengkap, nik, tanggal_lahir, jenis_kelamin, alamat, telepon, faskes_id) VALUES
        ('Ahmad Supriadi', '1234567890123456', '1990-01-15', 'L', 'Jl. Sudirman No. 123, Jakarta', '081234567890', 1),
        ('Siti Nurhaliza', '2345678901234567', '1985-05-20', 'P', 'Jl. Thamrin No. 456, Jakarta', '081234567891', 1),
        ('Budi Santoso', '3456789012345678', '1992-08-10', 'L', 'Jl. Gatot Subroto No. 789, Jakarta', '081234567892', 2)
      `);
      console.log('✅ Sample pasien data added');
    }
    
    // Check if rujukan table is empty
    const [rujukanCount] = await connection.execute('SELECT COUNT(*) as count FROM rujukan');
    if (rujukanCount[0].count === 0) {
      console.log('📝 Adding sample rujukan data...');
      await connection.execute(`
        INSERT INTO rujukan (pasien_id, faskes_asal_id, faskes_tujuan_id, alasan_rujukan, status) VALUES
        (1, 1, 2, 'Pasien memerlukan perawatan intensif', 'pending'),
        (2, 2, 1, 'Pasien memerlukan pemeriksaan khusus', 'diterima'),
        (3, 1, 2, 'Pasien memerlukan operasi', 'selesai')
      `);
      console.log('✅ Sample rujukan data added');
    }
    
    // Check if tempat_tidur table is empty
    const [tempatTidurCount] = await connection.execute('SELECT COUNT(*) as count FROM tempat_tidur');
    if (tempatTidurCount[0].count === 0) {
      console.log('📝 Adding sample tempat_tidur data...');
      await connection.execute(`
        INSERT INTO tempat_tidur (faskes_id, nomor_kamar, nomor_bed, tipe_kamar, status) VALUES
        (1, 'A101', '1', 'VIP', 'tersedia'),
        (1, 'A101', '2', 'VIP', 'terisi'),
        (1, 'B201', '1', 'Kelas 1', 'tersedia'),
        (2, 'C301', '1', 'ICU', 'tersedia'),
        (2, 'C301', '2', 'ICU', 'maintenance')
      `);
      console.log('✅ Sample tempat_tidur data added');
    }
    
    // 4. Show final summary
    console.log('\n4️⃣ Final summary:');
    const [finalTables] = await connection.execute('SHOW TABLES');
    const finalTableList = finalTables.map(t => Object.values(t)[0]);
    console.log('All tables:', finalTableList);
    
    // Count records in each table
    const tableCounts = {};
    for (const table of finalTableList) {
      const [count] = await connection.execute(`SELECT COUNT(*) as count FROM ${table}`);
      tableCounts[table] = count[0].count;
    }
    
    console.log('\nRecord counts:');
    Object.entries(tableCounts).forEach(([table, count]) => {
      console.log(`  - ${table}: ${count} records`);
    });
    
    console.log('\n✅ All missing tables restored successfully!');
    
  } catch (error) {
    console.error('❌ Restore failed:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run restore
restoreMissingTables()
  .then(() => {
    console.log('\n🎉 Table restoration completed!');
    console.log('\n🚀 Next steps:');
    console.log('  1. Test the application');
    console.log('  2. Verify all features work properly');
    console.log('  3. Check if data is accessible');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Restoration failed:', error);
    process.exit(1);
  });
