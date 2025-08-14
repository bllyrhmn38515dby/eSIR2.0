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

async function addSimpleRujukan() {
  try {
    console.log('🔍 Menambahkan data rujukan sederhana...\n');

    // Cek data existing
    const [rujukanCount] = await pool.execute('SELECT COUNT(*) as count FROM rujukan');
    console.log(`📊 Jumlah rujukan existing: ${rujukanCount[0].count}`);

    if (rujukanCount[0].count > 0) {
      console.log('ℹ️ Data rujukan sudah ada, skip...');
      return;
    }

    // Ambil ID pertama dari setiap tabel
    const [pasien] = await pool.execute('SELECT id FROM pasien LIMIT 1');
    const [faskes] = await pool.execute('SELECT id FROM faskes LIMIT 2');
    const [users] = await pool.execute('SELECT id FROM users LIMIT 1');

    if (pasien.length === 0 || faskes.length < 2 || users.length === 0) {
      console.log('❌ Data referensi tidak cukup');
      console.log(`- Pasien: ${pasien.length}`);
      console.log(`- Faskes: ${faskes.length}`);
      console.log(`- Users: ${users.length}`);
      return;
    }

    console.log('✅ Data referensi tersedia');

    // Tambah data rujukan sederhana
    const rujukanData = {
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
    };

    console.log('📝 Menambahkan rujukan:', rujukanData.nomor_rujukan);

    await pool.execute(
      `INSERT INTO rujukan (
        nomor_rujukan, pasien_id, faskes_asal_id, faskes_tujuan_id, 
        diagnosa, alasan_rujukan, catatan_asal, status, user_id, tanggal_rujukan
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        rujukanData.nomor_rujukan, rujukanData.pasien_id, rujukanData.faskes_asal_id, rujukanData.faskes_tujuan_id,
        rujukanData.diagnosa, rujukanData.alasan_rujukan, rujukanData.catatan_asal, rujukanData.status, 
        rujukanData.user_id, rujukanData.tanggal_rujukan
      ]
    );

    console.log('✅ Rujukan berhasil ditambahkan');

    // Verifikasi
    const [finalCount] = await pool.execute('SELECT COUNT(*) as count FROM rujukan');
    console.log(`📊 Total rujukan setelah penambahan: ${finalCount[0].count}`);

    // Tampilkan data yang baru ditambahkan
    const [newRujukan] = await pool.execute('SELECT * FROM rujukan WHERE nomor_rujukan = ?', [rujukanData.nomor_rujukan]);
    console.log('📋 Data rujukan yang baru ditambahkan:');
    console.table(newRujukan);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

addSimpleRujukan();
