const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'esirv2',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function addSampleRujukan() {
  try {
    console.log('Menambahkan data sample rujukan...');

    // Cek apakah ada data faskes dan pasien
    const [faskesCount] = await pool.execute('SELECT COUNT(*) as count FROM faskes');
    const [pasienCount] = await pool.execute('SELECT COUNT(*) as count FROM pasien');
    const [userCount] = await pool.execute('SELECT COUNT(*) as count FROM users');

    console.log(`📊 Data existing: ${faskesCount[0].count} faskes, ${pasienCount[0].count} pasien, ${userCount[0].count} users`);

    if (faskesCount[0].count === 0 || pasienCount[0].count === 0 || userCount[0].count === 0) {
      console.log('❌ Data faskes, pasien, atau user tidak cukup. Jalankan add-sample-data.js terlebih dahulu.');
      return;
    }

    // Ambil data existing untuk referensi
    const [faskes] = await pool.execute('SELECT id FROM faskes LIMIT 2');
    const [pasien] = await pool.execute('SELECT id FROM pasien LIMIT 1');
    const [users] = await pool.execute('SELECT id FROM users LIMIT 1');

    if (faskes.length < 2 || pasien.length === 0 || users.length === 0) {
      console.log('❌ Data referensi tidak cukup');
      return;
    }

    // Sample data rujukan
    const sampleRujukan = [
      {
        nomor_rujukan: 'RUJ-2024-001',
        pasien_id: pasien[0].id,
        faskes_asal_id: faskes[0].id,
        faskes_tujuan_id: faskes[1].id,
        diagnosa: 'Demam Berdarah Dengue',
        alasan_rujukan: 'Memerlukan perawatan intensif',
        catatan_asal: 'Pasien dalam kondisi stabil',
        status: 'pending',
        user_id: users[0].id,
        tanggal_rujukan: new Date().toISOString().split('T')[0]
      },
      {
        nomor_rujukan: 'RUJ-2024-002',
        pasien_id: pasien[0].id,
        faskes_asal_id: faskes[1].id,
        faskes_tujuan_id: faskes[0].id,
        diagnosa: 'Pneumonia',
        alasan_rujukan: 'Memerlukan pemeriksaan lebih lanjut',
        catatan_asal: 'Pasien dengan gejala batuk dan sesak nafas',
        status: 'diterima',
        user_id: users[0].id,
        tanggal_rujukan: new Date(Date.now() - 86400000).toISOString().split('T')[0] // Kemarin
      }
    ];

    // Cek apakah rujukan sudah ada
    const [existingRujukan] = await pool.execute('SELECT COUNT(*) as count FROM rujukan');
    
    if (existingRujukan[0].count === 0) {
      console.log('📝 Menambahkan data rujukan sample...');
      
      for (const rujukan of sampleRujukan) {
        await pool.execute(
          `INSERT INTO rujukan (
            nomor_rujukan, pasien_id, faskes_asal_id, faskes_tujuan_id, 
            diagnosa, alasan_rujukan, catatan_asal, status, user_id, tanggal_rujukan
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            rujukan.nomor_rujukan, rujukan.pasien_id, rujukan.faskes_asal_id, rujukan.faskes_tujuan_id,
            rujukan.diagnosa, rujukan.alasan_rujukan, rujukan.catatan_asal, rujukan.status, 
            rujukan.user_id, rujukan.tanggal_rujukan
          ]
        );
        console.log(`✅ Rujukan ${rujukan.nomor_rujukan} berhasil ditambahkan`);
      }
      
      console.log('✅ Data rujukan sample berhasil ditambahkan');
    } else {
      console.log('ℹ️ Data rujukan sudah ada, skip...');
    }

    // Verifikasi data
    const [finalCount] = await pool.execute('SELECT COUNT(*) as count FROM rujukan');
    console.log(`📊 Total rujukan di database: ${finalCount[0].count}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

addSampleRujukan();
