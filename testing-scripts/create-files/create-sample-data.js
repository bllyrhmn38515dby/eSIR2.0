require('dotenv').config();
const mysql = require('mysql2');

async function createSampleData() {
  try {
    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT
    });

    console.log('🔗 Terhubung ke database...');

    // Cek apakah sudah ada data
    const [existingPasien] = await connection.promise().execute('SELECT COUNT(*) as count FROM pasien');
    const [existingFaskes] = await connection.promise().execute('SELECT COUNT(*) as count FROM faskes');

    console.log(`📊 Data existing: ${existingPasien[0].count} pasien, ${existingFaskes[0].count} faskes`);

    // Tambah faskes jika belum ada
    if (existingFaskes[0].count === 0) {
      console.log('🏥 Menambahkan data faskes...');
      
      await connection.promise().execute(
        'INSERT INTO faskes (nama_faskes, alamat, tipe, telepon, latitude, longitude, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
        ['Puskesmas Bogor Utara', 'Jl. Raya Bogor No. 123', 'Puskesmas', '0251-123456', -6.5971, 106.8060]
      );

      await connection.promise().execute(
        'INSERT INTO faskes (nama_faskes, alamat, tipe, telepon, latitude, longitude, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
        ['RSUD Bogor', 'Jl. Raya Bogor No. 456', 'Rumah Sakit', '0251-654321', -6.5900, 106.8100]
      );

      console.log('✅ Data faskes berhasil ditambahkan');
    }

    // Tambah pasien jika belum ada
    if (existingPasien[0].count === 0) {
      console.log('👤 Menambahkan data pasien...');
      
      await connection.promise().execute(
        'INSERT INTO pasien (nama_lengkap, nik, tanggal_lahir, jenis_kelamin, alamat, telepon, golongan_darah, alergi, riwayat_penyakit, no_rm, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
        ['Ahmad Santoso', '3273010101990001', '1990-01-01', 'L', 'Jl. Bogor No. 1', '081234567890', 'O', 'Tidak ada', 'Tidak ada', 'RM001', NOW(), NOW()]
      );

      await connection.promise().execute(
        'INSERT INTO pasien (nama_lengkap, nik, tanggal_lahir, jenis_kelamin, alamat, telepon, golongan_darah, alergi, riwayat_penyakit, no_rm, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
        ['Siti Nurhaliza', '3273010201990002', '1990-02-02', 'P', 'Jl. Bogor No. 2', '081234567891', 'A', 'Tidak ada', 'Tidak ada', 'RM002', NOW(), NOW()]
      );

      console.log('✅ Data pasien berhasil ditambahkan');
    }

    // Tampilkan data yang ada
    const [pasien] = await connection.promise().execute('SELECT id, nama_lengkap, nik FROM pasien LIMIT 5');
    const [faskes] = await connection.promise().execute('SELECT id, nama_faskes, tipe FROM faskes LIMIT 5');

    console.log('\n📋 Data Pasien:');
    pasien.forEach(p => console.log(`   ID: ${p.id}, Nama: ${p.nama_lengkap}, NIK: ${p.nik}`));

    console.log('\n🏥 Data Faskes:');
    faskes.forEach(f => console.log(`   ID: ${f.id}, Nama: ${f.nama_faskes}, Tipe: ${f.tipe}`));

    await connection.promise().end();
    console.log('\n🎉 Setup data sample selesai!');

  } catch (error) {
    console.error('❌ Error setup data sample:', error);
    process.exit(1);
  }
}

createSampleData();
