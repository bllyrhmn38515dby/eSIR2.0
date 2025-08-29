const fs = require('fs');
const path = require('path');

const rujukanFile = path.join(__dirname, 'backend', 'routes', 'rujukan.js');

async function fixRujukanQueries() {
  try {
    console.log('🔧 Fixing rujukan queries...');
    
    // Read the file
    let content = fs.readFileSync(rujukanFile, 'utf8');
    
    // Fix the UPDATE query - line 153
    content = content.replace(
      /await db\.execute\(`\s*UPDATE pasien \s*SET nama_lengkap = \?, tanggal_lahir = \?, jenis_kelamin = \?, \s*alamat = \?, telepon = \?, updated_at = NOW\(\)\s*WHERE id = \?\s*`, \[nama_pasien, tanggal_lahir, jenis_kelamin, alamat, telepon, pasienId\]\);/g,
      `await db.execute(\`
        UPDATE pasien 
        SET nama_lengkap = ?, tanggal_lahir = ?, jenis_kelamin = ?, 
            alamat = ?, telepon = ?, updated_at = NOW()
        WHERE id = ?
      \`, [nama_pasien, tanggal_lahir, jenis_kelamin, alamat, telepon, pasienId]);`
    );
    
    // Fix the INSERT query - line 159
    content = content.replace(
      /const \[pasienResult\] = await db\.execute\(`\s*INSERT INTO pasien \(nik, nama_lengkap, tanggal_lahir, jenis_kelamin, alamat, telepon\)\s*VALUES \(\?, \?, \?, \?, \?, \?\)\s*`, \[nik, nama_pasien, tanggal_lahir, jenis_kelamin, alamat, telepon\]\);/g,
      `const [pasienResult] = await db.execute(\`
        INSERT INTO pasien (nik, nama_lengkap, tanggal_lahir, jenis_kelamin, alamat, telepon)
        VALUES (?, ?, ?, ?, ?, ?)
      \`, [nik, nama_pasien, tanggal_lahir, jenis_kelamin, alamat, telepon]);`
    );
    
    // Write the fixed content back
    fs.writeFileSync(rujukanFile, content, 'utf8');
    
    console.log('✅ Rujukan queries fixed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing rujukan queries:', error);
  }
}

fixRujukanQueries();
