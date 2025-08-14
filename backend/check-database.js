const mysql = require('mysql2/promise');

async function checkDatabase() {
  try {
    console.log('🔍 Mengecek koneksi database...');
    
    // Coba beberapa konfigurasi database
    const configs = [
      {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'esir_db',
        port: 3306
      },
      {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'esir_db',
        port: 3306
      },
      {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'esir_db',
        port: 3306
      },
      {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'esir_db',
        port: 3306
      }
    ];

    let workingConfig = null;

    for (let i = 0; i < configs.length; i++) {
      const config = configs[i];
      console.log(`\n🧪 Mencoba konfigurasi ${i + 1}: ${config.user}@${config.host}:${config.port}`);
      
      try {
        const connection = await mysql.createConnection(config);
        console.log('✅ Koneksi berhasil!');
        
        // Test query
        const [rows] = await connection.execute('SHOW TABLES');
        console.log('✅ Database tables:', rows.map(r => Object.values(r)[0]));
        
        // Check if rujukan table exists
        const [rujukanTable] = await connection.execute('SHOW TABLES LIKE "rujukan"');
        if (rujukanTable.length > 0) {
          console.log('✅ Tabel rujukan ditemukan!');
          
          // Check data
          const [count] = await connection.execute('SELECT COUNT(*) as count FROM rujukan');
          console.log(`✅ Jumlah data rujukan: ${count[0].count}`);
          
          // Test stats query
          const [stats] = await connection.execute(`
            SELECT 
              COUNT(*) as total,
              SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
              SUM(CASE WHEN status = 'diterima' THEN 1 ELSE 0 END) as diterima,
              SUM(CASE WHEN status = 'ditolak' THEN 1 ELSE 0 END) as ditolak,
              SUM(CASE WHEN status = 'selesai' THEN 1 ELSE 0 END) as selesai
            FROM rujukan
          `);
          console.log('✅ Stats query berhasil:', stats[0]);
        } else {
          console.log('⚠️ Tabel rujukan tidak ditemukan');
        }
        
        await connection.end();
        workingConfig = config;
        break;
        
      } catch (error) {
        console.log(`❌ Gagal: ${error.message}`);
      }
    }

    if (workingConfig) {
      console.log('\n🎉 Konfigurasi database yang bekerja:');
      console.log(JSON.stringify(workingConfig, null, 2));
      
      // Buat file .env dengan konfigurasi yang bekerja
      const envContent = `# Database Configuration
DB_HOST=${workingConfig.host}
DB_USER=${workingConfig.user}
DB_PASSWORD=${workingConfig.password}
DB_DATABASE=${workingConfig.database}
DB_PORT=${workingConfig.port}

# JWT Configuration
JWT_SECRET=esir_jwt_secret_key_2024
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3001
NODE_ENV=development
`;
      
      console.log('\n📝 Konfigurasi .env yang direkomendasikan:');
      console.log(envContent);
      
      console.log('\n💡 Untuk menggunakan database:');
      console.log('1. Buat file .env di folder backend');
      console.log('2. Copy konfigurasi di atas ke file .env');
      console.log('3. Jalankan: node index.js');
      
    } else {
      console.log('\n❌ Tidak ada konfigurasi database yang bekerja');
      console.log('💡 Pastikan MySQL berjalan dan database esir_db ada');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkDatabase();
