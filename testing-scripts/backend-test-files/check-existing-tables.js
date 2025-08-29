const mysql = require('mysql2/promise');

async function checkExistingTables() {
  try {
    console.log('🔍 Mengecek struktur tabel yang sudah ada...');
    
    const config = {
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'esirv2',
      port: 3306
    };

    const connection = await mysql.createConnection(config);
    console.log('✅ Koneksi database berhasil');

    // Cek semua tabel
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('\n📋 Tabel yang ada:');
    tables.forEach(table => {
      console.log(`- ${Object.values(table)[0]}`);
    });

    // Cek struktur tabel faskes
    console.log('\n🏥 Struktur tabel faskes:');
    const [faskesColumns] = await connection.execute('DESCRIBE faskes');
    faskesColumns.forEach(col => {
      console.log(`- ${col.Field}: ${col.Type} ${col.Key ? `(${col.Key})` : ''}`);
    });

    // Cek struktur tabel patients
    console.log('\n👥 Struktur tabel patients:');
    const [patientsColumns] = await connection.execute('DESCRIBE patients');
    patientsColumns.forEach(col => {
      console.log(`- ${col.Field}: ${col.Type} ${col.Key ? `(${col.Key})` : ''}`);
    });

    // Cek data di tabel faskes
    console.log('\n📊 Data faskes:');
    const [faskesData] = await connection.execute('SELECT * FROM faskes LIMIT 5');
    console.log(faskesData);

    // Cek data di tabel patients
    console.log('\n📊 Data patients:');
    const [patientsData] = await connection.execute('SELECT * FROM patients LIMIT 5');
    console.log(patientsData);

    await connection.end();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkExistingTables();
