const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'esirv2'
};

async function fixRujukanDatabase() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database esirv2');

    // Drop existing rujukan table if exists
    console.log('\n1️⃣ Dropping existing rujukan table...');
    await connection.execute('DROP TABLE IF EXISTS rujukan');
    console.log('✅ Rujukan table dropped');

    // Create rujukan table with correct structure
    console.log('\n2️⃣ Creating rujukan table with correct structure...');
    await connection.execute(`
      CREATE TABLE rujukan (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nomor_rujukan VARCHAR(50) NOT NULL UNIQUE,
        pasien_id INT NOT NULL,
        faskes_asal_id INT NOT NULL,
        faskes_tujuan_id INT NOT NULL,
        diagnosa TEXT NOT NULL,
        alasan_rujukan TEXT NOT NULL,
        status ENUM('pending', 'diterima', 'ditolak', 'selesai') DEFAULT 'pending',
        catatan_asal TEXT,
        catatan_tujuan TEXT,
        tanggal_rujukan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        tanggal_respon TIMESTAMP NULL,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (pasien_id) REFERENCES pasien(id),
        FOREIGN KEY (faskes_asal_id) REFERENCES faskes(id),
        FOREIGN KEY (faskes_tujuan_id) REFERENCES faskes(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    console.log('✅ Rujukan table created successfully');

    // Insert sample rujukan data
    console.log('\n3️⃣ Inserting sample rujukan data...');
    
    // Get existing pasien, faskes, and users
    const [pasienData] = await connection.execute('SELECT id FROM pasien LIMIT 3');
    const [faskesData] = await connection.execute('SELECT id FROM faskes LIMIT 3');
    const [usersData] = await connection.execute('SELECT id FROM users LIMIT 3');

    if (pasienData.length === 0) {
      console.log('❌ No pasien data found. Please add pasien data first.');
      return;
    }

    if (faskesData.length === 0) {
      console.log('❌ No faskes data found. Please add faskes data first.');
      return;
    }

    if (usersData.length === 0) {
      console.log('❌ No users data found. Please add users data first.');
      return;
    }

    // Generate sample rujukan data
    const sampleRujukan = [
      {
        nomor_rujukan: 'RJ20250818001',
        pasien_id: pasienData[0].id,
        faskes_asal_id: faskesData[0].id,
        faskes_tujuan_id: faskesData[1].id,
        diagnosa: 'Demam berdarah dengue',
        alasan_rujukan: 'Memerlukan perawatan intensif dan transfusi trombosit',
        status: 'pending',
        catatan_asal: 'Pasien sudah diberikan obat penurun demam dan cairan infus',
        user_id: usersData[0].id
      },
      {
        nomor_rujukan: 'RJ20250818002',
        pasien_id: pasienData[1].id,
        faskes_asal_id: faskesData[1].id,
        faskes_tujuan_id: faskesData[2].id,
        diagnosa: 'Pneumonia',
        alasan_rujukan: 'Memerlukan pemeriksaan rontgen dan antibiotik intravena',
        status: 'diterima',
        catatan_asal: 'Pasien dengan sesak nafas dan batuk berdahak',
        catatan_tujuan: 'Pasien diterima untuk rawat inap di ruang perawatan',
        user_id: usersData[1].id
      },
      {
        nomor_rujukan: 'RJ20250818003',
        pasien_id: pasienData[2].id,
        faskes_asal_id: faskesData[2].id,
        faskes_tujuan_id: faskesData[0].id,
        diagnosa: 'Appendisitis akut',
        alasan_rujukan: 'Memerlukan operasi appendectomy segera',
        status: 'selesai',
        catatan_asal: 'Pasien dengan nyeri perut kanan bawah',
        catatan_tujuan: 'Operasi berhasil dilakukan, pasien sudah pulang',
        user_id: usersData[0].id
      }
    ];

    // Insert sample data
    for (const rujukan of sampleRujukan) {
      await connection.execute(`
        INSERT INTO rujukan (
          nomor_rujukan, pasien_id, faskes_asal_id, faskes_tujuan_id,
          diagnosa, alasan_rujukan, status, catatan_asal, catatan_tujuan, user_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        rujukan.nomor_rujukan,
        rujukan.pasien_id,
        rujukan.faskes_asal_id,
        rujukan.faskes_tujuan_id,
        rujukan.diagnosa,
        rujukan.alasan_rujukan,
        rujukan.status,
        rujukan.catatan_asal,
        rujukan.catatan_tujuan || null,
        rujukan.user_id
      ]);
    }
    console.log(`✅ Inserted ${sampleRujukan.length} sample rujukan records`);

    // Verify the data
    console.log('\n4️⃣ Verifying rujukan data...');
    const [rujukanCount] = await connection.execute('SELECT COUNT(*) as count FROM rujukan');
    console.log(`📊 Total rujukan: ${rujukanCount[0].count}`);

    // Test the API query
    console.log('\n5️⃣ Testing API query...');
    const [testQuery] = await connection.execute(`
      SELECT r.*, 
             p.nama_lengkap as nama_pasien, p.nik as nik_pasien,
             fa.nama_faskes as faskes_asal_nama,
             ft.nama_faskes as faskes_tujuan_nama,
             u.nama_lengkap as user_nama
      FROM rujukan r
      LEFT JOIN pasien p ON r.pasien_id = p.id
      LEFT JOIN faskes fa ON r.faskes_asal_id = fa.id
      LEFT JOIN faskes ft ON r.faskes_tujuan_id = ft.id
      LEFT JOIN users u ON r.user_id = u.id
      ORDER BY r.tanggal_rujukan DESC
    `);
    
    console.log(`✅ API query successful, returned ${testQuery.length} rows`);
    
    if (testQuery.length > 0) {
      console.log('\n📋 Sample rujukan data:');
      testQuery.forEach((rujukan, index) => {
        console.log(`\n${index + 1}. Rujukan ID: ${rujukan.id}`);
        console.log(`   Nomor: ${rujukan.nomor_rujukan}`);
        console.log(`   Pasien: ${rujukan.nama_pasien} (${rujukan.nik_pasien})`);
        console.log(`   Asal: ${rujukan.faskes_asal_nama}`);
        console.log(`   Tujuan: ${rujukan.faskes_tujuan_nama}`);
        console.log(`   Status: ${rujukan.status}`);
        console.log(`   Diagnosa: ${rujukan.diagnosa}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

fixRujukanDatabase()
  .then(() => {
    console.log('\n✅ Rujukan database fix completed!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Rujukan database fix failed:', error);
    process.exit(1);
  });
