const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Konfigurasi database yang akan dicoba
const dbConfigs = [
  {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'esirv2'
  },
  {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'esirv2'
  },
  {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'esirv2'
  },
  {
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'esirv2'
  }
];

async function testDatabaseConnection(config) {
  try {
    console.log(`🔍 Testing connection with: ${config.user}@${config.host} (password: ${config.password ? '***' : 'empty'})`);
    
    // Test connection tanpa database dulu
    const connection = await mysql.createConnection({
      host: config.host,
      user: config.user,
      password: config.password
    });
    
    console.log('✅ Connected to MySQL server');
    
    // Cek apakah database exists
    const [rows] = await connection.query(`SHOW DATABASES LIKE '${config.database}'`);
    
    if (rows.length === 0) {
      console.log(`📦 Database '${config.database}' tidak ditemukan, membuat database...`);
      await connection.query(`CREATE DATABASE ${config.database}`);
      console.log(`✅ Database '${config.database}' berhasil dibuat`);
    } else {
      console.log(`✅ Database '${config.database}' sudah ada`);
    }
    
    // Gunakan database
    await connection.query(`USE ${config.database}`);
    
    // Cek apakah tabel sudah ada
    const [tables] = await connection.query('SHOW TABLES');
    
    if (tables.length === 0) {
      console.log('📋 Tabel belum ada, mengimport schema...');
      
      // Baca file database.sql
      const sqlFile = path.join(__dirname, 'database.sql');
      if (fs.existsSync(sqlFile)) {
        const sqlContent = fs.readFileSync(sqlFile, 'utf8');
        const statements = sqlContent.split(';').filter(stmt => stmt.trim());
        
        for (const statement of statements) {
          if (statement.trim()) {
            try {
              await connection.query(statement);
            } catch (error) {
              if (!error.message.includes('already exists')) {
                console.log(`⚠️  Warning: ${error.message}`);
              }
            }
          }
        }
        console.log('✅ Schema berhasil diimport');
      } else {
        console.log('❌ File database.sql tidak ditemukan');
      }
    } else {
      console.log(`✅ ${tables.length} tabel sudah ada`);
    }
    
    await connection.end();
    return config;
    
  } catch (error) {
    console.log(`❌ Connection failed: ${error.message}`);
    return null;
  }
}

async function updateEnvFile(config) {
  try {
    const envPath = path.join(__dirname, '.env');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    // Update atau tambah konfigurasi database
    const lines = envContent.split('\n');
    const updatedLines = [];
    let dbConfigUpdated = false;
    
    for (const line of lines) {
      if (line.startsWith('DB_HOST=')) {
        updatedLines.push(`DB_HOST=${config.host}`);
        dbConfigUpdated = true;
      } else if (line.startsWith('DB_USER=')) {
        updatedLines.push(`DB_USER=${config.user}`);
        dbConfigUpdated = true;
      } else if (line.startsWith('DB_PASSWORD=')) {
        updatedLines.push(`DB_PASSWORD=${config.password}`);
        dbConfigUpdated = true;
      } else if (line.startsWith('DB_DATABASE=')) {
        updatedLines.push(`DB_DATABASE=${config.database}`);
        dbConfigUpdated = true;
      } else {
        updatedLines.push(line);
      }
    }
    
    // Tambah konfigurasi jika belum ada
    if (!dbConfigUpdated) {
      updatedLines.push(`DB_HOST=${config.host}`);
      updatedLines.push(`DB_USER=${config.user}`);
      updatedLines.push(`DB_PASSWORD=${config.password}`);
      updatedLines.push(`DB_DATABASE=${config.database}`);
      updatedLines.push('DB_PORT=3306');
    }
    
    // Tambah JWT secret jika belum ada
    if (!updatedLines.some(line => line.startsWith('JWT_SECRET='))) {
      const crypto = require('crypto');
      const jwtSecret = crypto.randomBytes(64).toString('hex');
      updatedLines.push(`JWT_SECRET=${jwtSecret}`);
    }
    
    // Tambah konfigurasi server jika belum ada
    if (!updatedLines.some(line => line.startsWith('PORT='))) {
      updatedLines.push('PORT=3001');
    }
    
    if (!updatedLines.some(line => line.startsWith('NODE_ENV='))) {
      updatedLines.push('NODE_ENV=development');
    }
    
    fs.writeFileSync(envPath, updatedLines.join('\n'));
    console.log('✅ File .env berhasil diupdate');
    
  } catch (error) {
    console.log(`❌ Error updating .env: ${error.message}`);
  }
}

async function main() {
  console.log('🔧 Database Connection Fix Tool');
  console.log('================================');
  
  for (const config of dbConfigs) {
    const workingConfig = await testDatabaseConnection(config);
    if (workingConfig) {
      console.log('\n✅ Database connection berhasil!');
      await updateEnvFile(workingConfig);
      console.log('\n🚀 Sekarang Anda bisa menjalankan: npm start');
      return;
    }
  }
  
  console.log('\n❌ Tidak ada konfigurasi database yang berhasil');
  console.log('\n📋 Solusi:');
  console.log('1. Install MySQL Server');
  console.log('2. Pastikan MySQL service berjalan');
  console.log('3. Buat user MySQL dengan password yang sesuai');
  console.log('4. Update file .env dengan kredensial yang benar');
}

main().catch(console.error);
