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

async function addSampleFaskes() {
  try {
    console.log('Menambahkan data sample faskes...');

    // Sample data faskes
    const sampleFaskes = [
      {
        nama_faskes: 'RSUD Kota Bogor',
        alamat: 'Jl. Dr. Semeru No. 120, Bogor',
        tipe: 'RSUD',
        telepon: '0251-8313083',
        latitude: -6.5971,
        longitude: 106.8060
      },
      {
        nama_faskes: 'Puskesmas Bogor Utara',
        alamat: 'Jl. Raya Bogor No. 45, Bogor',
        tipe: 'Puskesmas',
        telepon: '0251-8312345',
        latitude: -6.5950,
        longitude: 106.8080
      },
      {
        nama_faskes: 'Klinik Sejahtera',
        alamat: 'Jl. Sudirman No. 78, Bogor',
        tipe: 'Klinik',
        telepon: '0251-8315678',
        latitude: -6.5990,
        longitude: 106.8040
      },
      {
        nama_faskes: 'RS Swasta Bogor Medical Center',
        alamat: 'Jl. Pajajaran No. 123, Bogor',
        tipe: 'RS Swasta',
        telepon: '0251-8319999',
        latitude: -6.5930,
        longitude: 106.8100
      },
      {
        nama_faskes: 'Puskesmas Bogor Selatan',
        alamat: 'Jl. Siliwangi No. 56, Bogor',
        tipe: 'Puskesmas',
        telepon: '0251-8317777',
        latitude: -6.6010,
        longitude: 106.8020
      }
    ];

    for (const faskes of sampleFaskes) {
      // Cek apakah faskes sudah ada berdasarkan nama
      const [existing] = await pool.execute(
        'SELECT id FROM faskes WHERE nama_faskes = ?',
        [faskes.nama_faskes]
      );

      if (existing.length === 0) {
        // Insert faskes baru
        await pool.execute(
          'INSERT INTO faskes (nama_faskes, alamat, tipe, telepon, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)',
          [faskes.nama_faskes, faskes.alamat, faskes.tipe, faskes.telepon, faskes.latitude, faskes.longitude]
        );
        console.log(`✅ Faskes ${faskes.nama_faskes} (${faskes.tipe}) berhasil ditambahkan`);
      } else {
        console.log(`⚠️ Faskes ${faskes.nama_faskes} sudah ada`);
      }
    }

    console.log('✅ Selesai menambahkan data sample faskes');
    console.log('\n📋 Data faskes yang tersedia untuk testing:');
    console.log('- RSUD Kota Bogor (RSUD)');
    console.log('- Puskesmas Bogor Utara (Puskesmas)');
    console.log('- Klinik Sejahtera (Klinik)');
    console.log('- RS Swasta Bogor Medical Center (RS Swasta)');
    console.log('- Puskesmas Bogor Selatan (Puskesmas)');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

addSampleFaskes();
