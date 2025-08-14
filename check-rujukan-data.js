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

async function checkRujukanData() {
  try {
    console.log('🔍 Mengecek data rujukan di database...\n');

    // Cek struktur tabel
    console.log('📋 Struktur tabel rujukan:');
    const [rujukanStructure] = await pool.execute('DESCRIBE rujukan');
    console.table(rujukanStructure);

    // Cek jumlah data di setiap tabel
    console.log('\n📊 Jumlah data di setiap tabel:');
    const [rujukanCount] = await pool.execute('SELECT COUNT(*) as count FROM rujukan');
    const [pasienCount] = await pool.execute('SELECT COUNT(*) as count FROM pasien');
    const [faskesCount] = await pool.execute('SELECT COUNT(*) as count FROM faskes');
    const [usersCount] = await pool.execute('SELECT COUNT(*) as count FROM users');

    console.log(`- Rujukan: ${rujukanCount[0].count}`);
    console.log(`- Pasien: ${pasienCount[0].count}`);
    console.log(`- Faskes: ${faskesCount[0].count}`);
    console.log(`- Users: ${usersCount[0].count}`);

    // Cek data rujukan
    if (rujukanCount[0].count > 0) {
      console.log('\n📋 Data rujukan:');
      const [rujukanData] = await pool.execute('SELECT * FROM rujukan');
      console.table(rujukanData);
    } else {
      console.log('\n❌ Tidak ada data rujukan di database');
    }

    // Cek data pasien
    if (pasienCount[0].count > 0) {
      console.log('\n📋 Data pasien (sample):');
      const [pasienData] = await pool.execute('SELECT * FROM pasien LIMIT 3');
      console.table(pasienData);
    }

    // Cek data faskes
    if (faskesCount[0].count > 0) {
      console.log('\n📋 Data faskes:');
      const [faskesData] = await pool.execute('SELECT * FROM faskes');
      console.table(faskesData);
    }

    // Cek data users
    if (usersCount[0].count > 0) {
      console.log('\n📋 Data users (sample):');
      const [usersData] = await pool.execute('SELECT id, nama, email, role FROM users LIMIT 3');
      console.table(usersData);
    }

    // Test query JOIN
    console.log('\n🔍 Test query JOIN:');
    try {
      const [joinResult] = await pool.execute(`
        SELECT r.*, 
               p.nama_pasien, p.nik as nik_pasien,
               fa.nama_faskes as faskes_asal_nama,
               ft.nama_faskes as faskes_tujuan_nama,
               u.nama as user_nama
        FROM rujukan r
        LEFT JOIN pasien p ON r.pasien_id = p.id
        LEFT JOIN faskes fa ON r.faskes_asal_id = fa.id
        LEFT JOIN faskes ft ON r.faskes_tujuan_id = ft.id
        LEFT JOIN users u ON r.user_id = u.id
        ORDER BY r.tanggal_rujukan DESC
      `);
      
      if (joinResult.length > 0) {
        console.log('✅ Query JOIN berhasil, data:');
        console.table(joinResult);
      } else {
        console.log('❌ Query JOIN tidak mengembalikan data');
      }
    } catch (joinError) {
      console.error('❌ Error pada query JOIN:', joinError.message);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

checkRujukanData();
