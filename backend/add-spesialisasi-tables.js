const mysql = require('mysql2/promise');

async function addSpesialisasiTables() {
  let connection;
  
  try {
    // Koneksi ke database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'prodsysesirv02'
    });

    console.log('🔗 Connected to database prodsysesirv02');

    // 1. Buat tabel spesialisasi
    console.log('\n1️⃣ Creating spesialisasi table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS spesialisasi (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama_spesialisasi VARCHAR(100) NOT NULL UNIQUE,
        deskripsi TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table spesialisasi created');

    // 2. Buat tabel relasi faskes-spesialisasi
    console.log('\n2️⃣ Creating faskes_spesialisasi table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS faskes_spesialisasi (
        id INT AUTO_INCREMENT PRIMARY KEY,
        faskes_id INT NOT NULL,
        spesialisasi_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (faskes_id) REFERENCES faskes(id) ON DELETE CASCADE,
        FOREIGN KEY (spesialisasi_id) REFERENCES spesialisasi(id) ON DELETE CASCADE,
        UNIQUE KEY unique_faskes_spesialisasi (faskes_id, spesialisasi_id)
      )
    `);
    console.log('✅ Table faskes_spesialisasi created');

    // 3. Insert data spesialisasi
    console.log('\n3️⃣ Inserting spesialisasi data...');
    const spesialisasiData = [
      ['Bedah Umum', 'Layanan operasi bedah umum'],
      ['Bedah Jantung', 'Layanan operasi jantung dan pembuluh darah'],
      ['Bedah Saraf', 'Layanan operasi saraf dan otak'],
      ['Bedah Ortopedi', 'Layanan operasi tulang dan sendi'],
      ['Kardiologi', 'Layanan penyakit jantung dan pembuluh darah'],
      ['Neurologi', 'Layanan penyakit saraf dan otak'],
      ['Pulmonologi', 'Layanan penyakit paru-paru dan pernapasan'],
      ['Gastroenterologi', 'Layanan penyakit pencernaan'],
      ['Nefrologi', 'Layanan penyakit ginjal'],
      ['Endokrinologi', 'Layanan penyakit kelenjar dan hormon'],
      ['Dermatologi', 'Layanan penyakit kulit'],
      ['Oftalmologi', 'Layanan penyakit mata'],
      ['THT', 'Layanan penyakit telinga, hidung, dan tenggorokan'],
      ['Urologi', 'Layanan penyakit saluran kemih'],
      ['Ginekologi', 'Layanan kesehatan wanita'],
      ['Pediatri', 'Layanan kesehatan anak'],
      ['Psikiatri', 'Layanan kesehatan jiwa'],
      ['Anestesiologi', 'Layanan anestesi dan perawatan intensif'],
      ['Radiologi', 'Layanan pencitraan medis'],
      ['Patologi', 'Layanan pemeriksaan laboratorium'],
      ['Fisioterapi', 'Layanan rehabilitasi medis'],
      ['ICU', 'Layanan perawatan intensif'],
      ['NICU', 'Layanan perawatan intensif neonatus'],
      ['PICU', 'Layanan perawatan intensif pediatrik']
    ];

    for (const [nama, deskripsi] of spesialisasiData) {
      await connection.execute(`
        INSERT IGNORE INTO spesialisasi (nama_spesialisasi, deskripsi) 
        VALUES (?, ?)
      `, [nama, deskripsi]);
    }
    console.log('✅ Spesialisasi data inserted');

    // 4. Assign spesialisasi ke faskes yang ada
    console.log('\n4️⃣ Assigning spesialisasi to existing faskes...');
    
    // RSUD biasanya memiliki banyak spesialisasi
    const rsudSpesialisasi = [
      'Bedah Umum', 'Kardiologi', 'Neurologi', 'Pulmonologi', 
      'Gastroenterologi', 'Nefrologi', 'Endokrinologi', 'Dermatologi',
      'Oftalmologi', 'THT', 'Urologi', 'Ginekologi', 'Pediatri',
      'Psikiatri', 'Anestesiologi', 'Radiologi', 'Patologi', 'ICU'
    ];

    // RS Swasta biasanya memiliki spesialisasi terbatas
    const rsSwastaSpesialisasi = [
      'Bedah Umum', 'Kardiologi', 'Pulmonologi', 'Ginekologi', 
      'Pediatri', 'Radiologi', 'ICU'
    ];

    // Puskesmas memiliki layanan dasar
    const puskesmasSpesialisasi = [
      'Bedah Umum', 'Pediatri', 'Fisioterapi'
    ];

    // Klinik memiliki layanan terbatas
    const klinikSpesialisasi = [
      'Bedah Umum', 'Pediatri'
    ];

    // Ambil semua faskes
    const [faskes] = await connection.execute('SELECT id, nama_faskes, tipe FROM faskes');
    
    for (const faskesItem of faskes) {
      let spesialisasiToAssign = [];
      
      switch (faskesItem.tipe) {
        case 'RSUD':
          spesialisasiToAssign = rsudSpesialisasi;
          break;
        case 'RS Swasta':
          spesialisasiToAssign = rsSwastaSpesialisasi;
          break;
        case 'Puskesmas':
          spesialisasiToAssign = puskesmasSpesialisasi;
          break;
        case 'Klinik':
          spesialisasiToAssign = klinikSpesialisasi;
          break;
        default:
          spesialisasiToAssign = ['Bedah Umum', 'Pediatri'];
      }

      // Assign spesialisasi ke faskes
      for (const namaSpesialisasi of spesialisasiToAssign) {
        await connection.execute(`
          INSERT IGNORE INTO faskes_spesialisasi (faskes_id, spesialisasi_id)
          SELECT ?, s.id 
          FROM spesialisasi s 
          WHERE s.nama_spesialisasi = ?
        `, [faskesItem.id, namaSpesialisasi]);
      }
      
      console.log(`✅ Assigned ${spesialisasiToAssign.length} spesialisasi to ${faskesItem.nama_faskes}`);
    }

    console.log('\n🎉 Spesialisasi tables and data setup completed successfully!');
    
    // 5. Verifikasi data
    console.log('\n5️⃣ Verifying data...');
    const [spesialisasiCount] = await connection.execute('SELECT COUNT(*) as count FROM spesialisasi');
    const [faskesSpesialisasiCount] = await connection.execute('SELECT COUNT(*) as count FROM faskes_spesialisasi');
    
    console.log(`📊 Total spesialisasi: ${spesialisasiCount[0].count}`);
    console.log(`📊 Total faskes-spesialisasi relations: ${faskesSpesialisasiCount[0].count}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Jalankan script
if (require.main === module) {
  addSpesialisasiTables()
    .then(() => {
      console.log('✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = addSpesialisasiTables;
