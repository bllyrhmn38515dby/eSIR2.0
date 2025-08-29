const pool = require('./config/db');

async function addSampleData() {
  try {
    console.log('🔄 Menambahkan data sample untuk testing peta...');

    // Check if faskes already exists
    const [existingFaskes] = await pool.execute('SELECT COUNT(*) as count FROM faskes');
    
    if (existingFaskes[0].count === 0) {
      console.log('📝 Menambahkan data faskes sample...');
      
      // Add sample faskes
      const sampleFaskes = [
        {
          nama_faskes: 'RSUD Kota Bogor',
          alamat: 'Jl. Dr. Semeru No.120, Bogor Tengah, Kota Bogor',
          tipe: 'RSUD',
          telepon: '0251-8313084',
          latitude: -6.5950,
          longitude: 106.8166
        },
        {
          nama_faskes: 'Puskesmas Bogor Utara',
          alamat: 'Jl. Raya Bogor No.45, Bogor Utara, Kota Bogor',
          tipe: 'Puskesmas',
          telepon: '0251-8312345',
          latitude: -6.5800,
          longitude: 106.8200
        },
        {
          nama_faskes: 'Klinik Sejahtera',
          alamat: 'Jl. Suryakencana No.78, Bogor Tengah, Kota Bogor',
          tipe: 'Klinik',
          telepon: '0251-8315678',
          latitude: -6.6000,
          longitude: 106.8100
        },
        {
          nama_faskes: 'RS Hermina Bogor',
          alamat: 'Jl. Raya Tajur No.168, Bogor Timur, Kota Bogor',
          tipe: 'RS Swasta',
          telepon: '0251-8319999',
          latitude: -6.5700,
          longitude: 106.8300
        }
      ];

      for (const faskes of sampleFaskes) {
        await pool.execute(
          'INSERT INTO faskes (nama_faskes, alamat, tipe, telepon, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)',
          [faskes.nama_faskes, faskes.alamat, faskes.tipe, faskes.telepon, faskes.latitude, faskes.longitude]
        );
      }
      
      console.log('✅ Data faskes sample berhasil ditambahkan');
    } else {
      console.log('ℹ️ Data faskes sudah ada, skip...');
    }

    // Check if pasien exists
    const [existingPasien] = await pool.execute('SELECT COUNT(*) as count FROM pasien');
    
    if (existingPasien[0].count === 0) {
      console.log('📝 Menambahkan data pasien sample...');
      
      // Add sample pasien
      const samplePasien = [
        {
          nama_pasien: 'Ahmad Rizki',
          nik: '3201234567890001',
          jenis_kelamin: 'L',
          tanggal_lahir: '1990-05-15',
          alamat: 'Jl. Sudirman No.123, Bogor Tengah',
          no_rm: 'RM001'
        },
        {
          nama_pasien: 'Siti Nurhaliza',
          nik: '3201234567890002',
          jenis_kelamin: 'P',
          tanggal_lahir: '1985-08-20',
          alamat: 'Jl. Merdeka No.456, Bogor Utara',
          no_rm: 'RM002'
        }
      ];

      for (const pasien of samplePasien) {
        await pool.execute(
          'INSERT INTO pasien (nama_pasien, nik, jenis_kelamin, tanggal_lahir, alamat, no_rm) VALUES (?, ?, ?, ?, ?, ?)',
          [pasien.nama_pasien, pasien.nik, pasien.jenis_kelamin, pasien.tanggal_lahir, pasien.alamat, pasien.no_rm]
        );
      }
      
      console.log('✅ Data pasien sample berhasil ditambahkan');
    } else {
      console.log('ℹ️ Data pasien sudah ada, skip...');
    }

    // Check if rujukan exists
    const [existingRujukan] = await pool.execute('SELECT COUNT(*) as count FROM rujukan');
    
    if (existingRujukan[0].count === 0) {
      console.log('📝 Menambahkan data rujukan sample...');
      
      // Get faskes IDs and user ID
      const [faskesList] = await pool.execute('SELECT id FROM faskes ORDER BY id');
      const [pasienList] = await pool.execute('SELECT id FROM pasien ORDER BY id');
      const [userList] = await pool.execute('SELECT id FROM users ORDER BY id LIMIT 1');
      
      if (faskesList.length >= 2 && pasienList.length >= 1 && userList.length >= 1) {
        // Add sample rujukan
        const sampleRujukan = [
          {
            nomor_rujukan: 'RJ20241201001',
            pasien_id: pasienList[0].id,
            faskes_asal_id: faskesList[1].id, // Puskesmas
            faskes_tujuan_id: faskesList[0].id, // RSUD
            diagnosa: 'Demam Berdarah',
            alasan_rujukan: 'Pasien memerlukan perawatan intensif',
            status: 'diterima',
            tanggal_rujukan: new Date().toISOString().slice(0, 19).replace('T', ' '),
            user_id: userList[0].id
          },
          {
            nomor_rujukan: 'RJ20241201002',
            pasien_id: pasienList[1].id,
            faskes_asal_id: faskesList[2].id, // Klinik
            faskes_tujuan_id: faskesList[3].id, // RS Swasta
            diagnosa: 'Jantung Koroner',
            alasan_rujukan: 'Pasien memerlukan pemeriksaan spesialis jantung',
            status: 'pending',
            tanggal_rujukan: new Date().toISOString().slice(0, 19).replace('T', ' '),
            user_id: userList[0].id
          }
        ];

        for (const rujukan of sampleRujukan) {
          await pool.execute(
            'INSERT INTO rujukan (nomor_rujukan, pasien_id, faskes_asal_id, faskes_tujuan_id, diagnosa, alasan_rujukan, status, tanggal_rujukan, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [rujukan.nomor_rujukan, rujukan.pasien_id, rujukan.faskes_asal_id, rujukan.faskes_tujuan_id, rujukan.diagnosa, rujukan.alasan_rujukan, rujukan.status, rujukan.tanggal_rujukan, rujukan.user_id]
          );
        }
        
        console.log('✅ Data rujukan sample berhasil ditambahkan');
      } else {
        console.log('⚠️ Tidak cukup data faskes/pasien untuk membuat rujukan sample');
      }
    } else {
      console.log('ℹ️ Data rujukan sudah ada, skip...');
    }

    console.log('🎉 Setup data sample selesai!');
    console.log('📍 Sekarang Anda dapat mengakses halaman peta dengan data sample');
    
  } catch (error) {
    console.error('❌ Error menambahkan data sample:', error);
  } finally {
    process.exit(0);
  }
}

// Run the script
addSampleData();
