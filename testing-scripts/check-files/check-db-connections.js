const fs = require('fs');
const path = require('path');

console.log('🔍 Memverifikasi koneksi database...\n');

// File-file yang perlu diperiksa
const filesToCheck = [
  'backend/config.env',
  'backend/config/db.js',
  'backend/database.sql',
  'backend/add-admin.sql',
  'backend/create-new-database.js',
  'add-ambulance-drivers-complete.js',
  'add-ambulance-driver-role.js',
  'add-ambulance-drivers.js',
  'setup-ambulance-drivers.js',
  'test-ambulance-drivers.js'
];

let allCorrect = true;

for (const file of filesToCheck) {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    
    if (content.includes('esirv2')) {
      console.log(`✅ ${file} - Menggunakan "esirv2"`);
    } else if (content.includes('esir_db') || content.includes('esir_db_new')) {
      console.log(`❌ ${file} - Masih menggunakan database lama`);
      allCorrect = false;
    } else {
      console.log(`⚠️  ${file} - Tidak ada referensi database`);
    }
  } else {
    console.log(`⚠️  ${file} - File tidak ditemukan`);
  }
}

console.log('\n📊 HASIL VERIFIKASI:');
if (allCorrect) {
  console.log('🎉 SEMUA FILE MENGGUNAKAN DATABASE "esirv2" DENGAN BENAR!');
} else {
  console.log('⚠️  DITEMUKAN MASALAH! Silakan perbaiki file-file di atas.');
}

// Periksa konfigurasi utama
console.log('\n🔧 KONFIGURASI UTAMA:');
const configContent = fs.readFileSync('backend/config.env', 'utf8');
const dbConfigContent = fs.readFileSync('backend/config/db.js', 'utf8');

if (configContent.includes('DB_DATABASE=esirv2')) {
  console.log('✅ backend/config.env - DB_DATABASE=esirv2');
} else {
  console.log('❌ backend/config.env - DB_DATABASE tidak sesuai');
}

if (dbConfigContent.includes("database: process.env.DB_DATABASE || 'esirv2'")) {
  console.log('✅ backend/config/db.js - Menggunakan esirv2 sebagai default');
} else {
  console.log('❌ backend/config/db.js - Default database tidak sesuai');
}
