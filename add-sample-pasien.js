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

async function addSamplePasien() {
  try {
    console.log('Menambahkan data sample pasien...');

    // Sample data pasien
    const samplePasien = [
      {
        nik: '3201234567890001',
        nama_pasien: 'Ahmad Rizki',
        tanggal_lahir: '1990-05-15',
        jenis_kelamin: 'L',
        alamat: 'Jl. Sudirman No. 123, Bogor',
        telepon: '08123456789',
        no_rm: 'RM001'
      },
      {
        nik: '3201234567890002',
        nama_pasien: 'Siti Nurhaliza',
        tanggal_lahir: '1985-08-20',
        jenis_kelamin: 'P',
        alamat: 'Jl. Merdeka No. 45, Bogor',
        telepon: '08198765432',
        no_rm: 'RM002'
      },
      {
        nik: '3201234567890003',
        nama_pasien: 'Budi Santoso',
        tanggal_lahir: '1992-12-10',
        jenis_kelamin: 'L',
        alamat: 'Jl. Pahlawan No. 67, Bogor',
        telepon: '08111222333',
        no_rm: 'RM003'
      }
    ];

    for (const pasien of samplePasien) {
      // Cek apakah pasien sudah ada
      const [existing] = await pool.execute(
        'SELECT id FROM pasien WHERE nik = ?',
        [pasien.nik]
      );

      if (existing.length === 0) {
        // Insert pasien baru
        await pool.execute(
          'INSERT INTO pasien (nik, nama_pasien, tanggal_lahir, jenis_kelamin, alamat, telepon, no_rm) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [pasien.nik, pasien.nama_pasien, pasien.tanggal_lahir, pasien.jenis_kelamin, pasien.alamat, pasien.telepon, pasien.no_rm]
        );
        console.log(`✅ Pasien ${pasien.nama_pasien} (NIK: ${pasien.nik}) berhasil ditambahkan`);
      } else {
        console.log(`⚠️ Pasien ${pasien.nama_pasien} (NIK: ${pasien.nik}) sudah ada`);
      }
    }

    console.log('✅ Selesai menambahkan data sample pasien');
    console.log('\n📋 Data pasien yang tersedia untuk testing:');
    console.log('- NIK: 3201234567890001 (Ahmad Rizki)');
    console.log('- NIK: 3201234567890002 (Siti Nurhaliza)');
    console.log('- NIK: 3201234567890003 (Budi Santoso)');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

addSamplePasien();
