const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'esirv2'
};

async function debugCreateRujukan() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database esirv2');

    // Test data yang akan digunakan
    const testData = {
      nik: '1234567890123457',
      nama_pasien: 'Test Pasien Baru',
      tanggal_lahir: '1995-06-15',
      jenis_kelamin: 'L',
      alamat: 'Jl. Test No. 123, Bogor',
      telepon: '081234567890',
      faskes_asal_id: 3,
      faskes_tujuan_id: 1,
      diagnosa: 'Demam berdarah dengue',
      alasan_rujukan: 'Memerlukan perawatan intensif dan transfusi trombosit',
      catatan_asal: 'Pasien sudah diberikan obat penurun demam dan cairan infus',
      user_id: 20 // willin user ID
    };

    console.log('\n1️⃣ Checking existing data...');
    
    // Check if pasien with this NIK exists
    const [existingPasien] = await connection.execute(
      'SELECT id FROM pasien WHERE nik = ?',
      [testData.nik]
    );
    console.log(`Pasien with NIK ${testData.nik} exists:`, existingPasien.length > 0);

    // Check faskes data
    const [faskesAsal] = await connection.execute(
      'SELECT id, nama_faskes FROM faskes WHERE id = ?',
      [testData.faskes_asal_id]
    );
    console.log(`Faskes asal (ID ${testData.faskes_asal_id}):`, faskesAsal.length > 0 ? faskesAsal[0].nama_faskes : 'Not found');

    const [faskesTujuan] = await connection.execute(
      'SELECT id, nama_faskes FROM faskes WHERE id = ?',
      [testData.faskes_tujuan_id]
    );
    console.log(`Faskes tujuan (ID ${testData.faskes_tujuan_id}):`, faskesTujuan.length > 0 ? faskesTujuan[0].nama_faskes : 'Not found');

    // Check user data
    const [userData] = await connection.execute(
      'SELECT id, nama_lengkap FROM users WHERE id = ?',
      [testData.user_id]
    );
    console.log(`User (ID ${testData.user_id}):`, userData.length > 0 ? userData[0].nama_lengkap : 'Not found');

    console.log('\n2️⃣ Testing pasien insert/update...');
    
    let pasienId;
    if (existingPasien.length > 0) {
      // Update existing pasien
      pasienId = existingPasien[0].id;
      console.log(`Updating existing pasien with ID: ${pasienId}`);
      
      await connection.execute(`
        UPDATE pasien 
        SET nama_lengkap = ?, tanggal_lahir = ?, jenis_kelamin = ?, 
            alamat = ?, telepon = ?, updated_at = NOW()
        WHERE id = ?
      `, [testData.nama_pasien, testData.tanggal_lahir, testData.jenis_kelamin, testData.alamat, testData.telepon, pasienId]);
      
      console.log('✅ Pasien updated successfully');
    } else {
      // Create new pasien
      console.log('Creating new pasien...');
      
      const [pasienResult] = await connection.execute(`
        INSERT INTO pasien (nik, nama_lengkap, tanggal_lahir, jenis_kelamin, alamat, telepon)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [testData.nik, testData.nama_pasien, testData.tanggal_lahir, testData.jenis_kelamin, testData.alamat, testData.telepon]);
      
      pasienId = pasienResult.insertId;
      console.log(`✅ New pasien created with ID: ${pasienId}`);
    }

    console.log('\n3️⃣ Testing nomor rujukan generation...');
    
    // Test nomor rujukan generation
    const [countResult] = await connection.execute(
      'SELECT COUNT(*) as count FROM rujukan WHERE DATE(tanggal_rujukan) = CURDATE()'
    );
    const count = countResult[0].count + 1;
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const nomorRujukan = `RJ${today}${count.toString().padStart(3, '0')}`;
    
    console.log(`Generated nomor rujukan: ${nomorRujukan}`);

    console.log('\n4️⃣ Testing rujukan insert...');
    
    // Test rujukan insert
    const [rujukanResult] = await connection.execute(`
      INSERT INTO rujukan (
        nomor_rujukan, pasien_id, faskes_asal_id, faskes_tujuan_id,
        diagnosa, alasan_rujukan, catatan_asal, status, tanggal_rujukan, user_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', NOW(), ?)
    `, [
      nomorRujukan, pasienId, testData.faskes_asal_id, testData.faskes_tujuan_id,
      testData.diagnosa, testData.alasan_rujukan, testData.catatan_asal, testData.user_id
    ]);
    
    console.log(`✅ Rujukan created with ID: ${rujukanResult.insertId}`);

    console.log('\n5️⃣ Testing rujukan query...');
    
    // Test the query that gets rujukan with details
    const [rujukanData] = await connection.execute(`
      SELECT r.*, 
             p.nama_lengkap as nama_pasien, p.nik as nik_pasien,
             fa.nama_faskes as faskes_asal_nama,
             ft.nama_faskes as faskes_tujuan_nama
      FROM rujukan r
      LEFT JOIN pasien p ON r.pasien_id = p.id
      LEFT JOIN faskes fa ON r.faskes_asal_id = fa.id
      LEFT JOIN faskes ft ON r.faskes_tujuan_id = ft.id
      WHERE r.id = ?
    `, [rujukanResult.insertId]);
    
    if (rujukanData.length > 0) {
      console.log('✅ Rujukan query successful');
      console.log('Rujukan data:', rujukanData[0]);
    } else {
      console.log('❌ Rujukan query failed - no data returned');
    }

    // Clean up - delete the test rujukan
    console.log('\n6️⃣ Cleaning up test data...');
    await connection.execute('DELETE FROM rujukan WHERE id = ?', [rujukanResult.insertId]);
    console.log('✅ Test rujukan deleted');

  } catch (error) {
    console.error('❌ Error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('SQL State:', error.sqlState);
    console.error('SQL Message:', error.sqlMessage);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

debugCreateRujukan()
  .then(() => {
    console.log('\n✅ Debug create rujukan completed!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Debug create rujukan failed:', error);
    process.exit(1);
  });
