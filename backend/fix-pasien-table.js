const db = require('./config/db');

async function fixPasienTable() {
  try {
    console.log('🔧 Memperbaiki tabel pasien...\n');

    // Cek apakah tabel pasien ada
    const [tables] = await db.execute("SHOW TABLES LIKE 'pasien'");
    if (tables.length === 0) {
      console.log('📋 Membuat tabel pasien...');
      await db.execute(`
        CREATE TABLE pasien (
          id INT AUTO_INCREMENT PRIMARY KEY,
          no_rm VARCHAR(20) UNIQUE NOT NULL,
          nama_pasien VARCHAR(255) NOT NULL,
          nik VARCHAR(16) UNIQUE NOT NULL,
          tanggal_lahir DATE NOT NULL,
          jenis_kelamin ENUM('L', 'P') NOT NULL,
          alamat TEXT NOT NULL,
          telepon VARCHAR(20),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_no_rm (no_rm),
          INDEX idx_nik (nik),
          INDEX idx_nama (nama_pasien)
        )
      `);
      console.log('✅ Tabel pasien berhasil dibuat');
    } else {
      console.log('✅ Tabel pasien sudah ada');
    }

    // Cek struktur tabel
    const [columns] = await db.execute('DESCRIBE pasien');
    console.log('\n📋 Struktur tabel pasien:');
    columns.forEach(col => {
      console.log(`  ${col.Field} - ${col.Type}`);
    });

    // Cek apakah ada data
    const [count] = await db.execute('SELECT COUNT(*) as total FROM pasien');
    console.log(`\n📊 Total data pasien: ${count[0].total}`);

    if (count[0].total === 0) {
      console.log('📝 Menambahkan sample data pasien...');
      await db.execute(`
        INSERT INTO pasien (no_rm, nama_pasien, nik, tanggal_lahir, jenis_kelamin, alamat, telepon) VALUES
        ('RM001', 'Ahmad Santoso', '3573010101990001', '1999-01-01', 'L', 'Jl. Ahmad Yani No.10, Bogor', '081234567890'),
        ('RM002', 'Siti Nurhaliza', '3573010202990002', '1999-02-02', 'P', 'Jl. Gubeng Jaya No.15, Bogor', '081234567891'),
        ('RM003', 'Budi Prasetyo', '3573010303990003', '1999-03-03', 'L', 'Jl. Kenjeran No.20, Bogor', '081234567892'),
        ('RM004', 'Dewi Sartika', '3573010404990004', '1999-04-04', 'P', 'Jl. Wonokromo No.25, Bogor', '081234567893'),
        ('RM005', 'Eko Prasetyo', '3573010505990005', '1999-05-05', 'L', 'Jl. Tambaksari No.30, Bogor', '081234567894')
      `);
      console.log('✅ Sample data pasien berhasil ditambahkan');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

fixPasienTable();
