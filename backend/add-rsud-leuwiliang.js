const mysql = require('mysql2/promise');
require('dotenv').config();

async function addRSUDLeuwiliang() {
  let connection;
  
  try {
    // Connect to database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'prodsysesirv02',
      port: process.env.DB_PORT || 3306
    });

    console.log('🔗 Terhubung ke database');

    // Data RSUD Leuwiliang
    const rsudLeuwiliang = {
      nama_faskes: 'RSUD Leuwiliang',
      alamat: 'Jl. Raya Cibeber No.I, Cibeber I, Kec. Leuwiliang, Kabupaten Bogor, Jawa Barat 16640',
      tipe: 'RSUD',
      telepon: '0251-8643290',
      latitude: -6.574579,
      longitude: 106.627721
    };

    // Cek apakah RSUD Leuwiliang sudah ada
    const [existingFaskes] = await connection.execute(
      'SELECT id FROM faskes WHERE nama_faskes = ?',
      [rsudLeuwiliang.nama_faskes]
    );

    if (existingFaskes.length > 0) {
      console.log('⚠️ RSUD Leuwiliang sudah ada di database dengan ID:', existingFaskes[0].id);
      
      // Update data yang sudah ada
      await connection.execute(
        `UPDATE faskes SET 
         alamat = ?, tipe = ?, telepon = ?, 
         latitude = ?, longitude = ? 
         WHERE nama_faskes = ?`,
        [
          rsudLeuwiliang.alamat,
          rsudLeuwiliang.tipe,
          rsudLeuwiliang.telepon,
          rsudLeuwiliang.latitude,
          rsudLeuwiliang.longitude,
          rsudLeuwiliang.nama_faskes
        ]
      );
      
      console.log('✅ Data RSUD Leuwiliang berhasil diupdate');
    } else {
      // Insert data baru
      const [result] = await connection.execute(
        `INSERT INTO faskes (nama_faskes, alamat, tipe, telepon, latitude, longitude) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          rsudLeuwiliang.nama_faskes,
          rsudLeuwiliang.alamat,
          rsudLeuwiliang.tipe,
          rsudLeuwiliang.telepon,
          rsudLeuwiliang.latitude,
          rsudLeuwiliang.longitude
        ]
      );

      console.log('✅ RSUD Leuwiliang berhasil ditambahkan dengan ID:', result.insertId);
    }

    // Verifikasi data yang baru ditambahkan/diupdate
    const [verification] = await connection.execute(
      'SELECT * FROM faskes WHERE nama_faskes = ?',
      [rsudLeuwiliang.nama_faskes]
    );

    console.log('\n📋 Data RSUD Leuwiliang:');
    console.log('ID:', verification[0].id);
    console.log('Nama:', verification[0].nama_faskes);
    console.log('Alamat:', verification[0].alamat);
    console.log('Tipe:', verification[0].tipe);
    console.log('Telepon:', verification[0].telepon);
    console.log('Latitude:', verification[0].latitude);
    console.log('Longitude:', verification[0].longitude);
    console.log('Created At:', verification[0].created_at);

    console.log('\n🎯 Koordinat RSUD Leuwiliang:');
    console.log(`Latitude: ${rsudLeuwiliang.latitude}`);
    console.log(`Longitude: ${rsudLeuwiliang.longitude}`);
    console.log(`Google Maps: https://www.google.com/maps?q=${rsudLeuwiliang.latitude},${rsudLeuwiliang.longitude}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Koneksi database ditutup');
    }
  }
}

// Jalankan script jika dipanggil langsung
if (require.main === module) {
  addRSUDLeuwiliang()
    .then(() => {
      console.log('\n✅ Script selesai dijalankan');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Script gagal:', error);
      process.exit(1);
    });
}

module.exports = addRSUDLeuwiliang;
