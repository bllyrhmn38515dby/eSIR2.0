const fs = require('fs');
const path = require('path');

console.log('🔍 Memverifikasi koneksi database...\n');

// Fungsi untuk mencari file yang menggunakan database
function findDatabaseConnections(dir) {
  const files = [];
  
  function scanDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        scanDirectory(fullPath);
      } else if (stat.isFile() && (item.endsWith('.js') || item.endsWith('.sql'))) {
        files.push(fullPath);
      }
    }
  }
  
  scanDirectory(dir);
  return files;
}

// Fungsi untuk memeriksa konten file
function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    
    // Periksa penggunaan database yang salah
    if (content.includes('esir_db') && !content.includes('esirv2')) {
      issues.push('❌ Menggunakan "esir_db" (seharusnya "esirv2")');
    }
    
    if (content.includes('esir_db_new') && !content.includes('esirv2')) {
      issues.push('❌ Menggunakan "esir_db_new" (seharusnya "esirv2")');
    }
    
    if (content.includes('DB_NAME') && !content.includes('DB_DATABASE')) {
      issues.push('❌ Menggunakan "DB_NAME" (seharusnya "DB_DATABASE")');
    }
    
    // Periksa penggunaan yang benar
    if (content.includes('esirv2')) {
      issues.push('✅ Menggunakan "esirv2"');
    }
    
    if (content.includes('DB_DATABASE')) {
      issues.push('✅ Menggunakan "DB_DATABASE"');
    }
    
    return issues;
  } catch (error) {
    return [`❌ Error membaca file: ${error.message}`];
  }
}

// Scan semua file
const allFiles = findDatabaseConnections('.');
const databaseFiles = allFiles.filter(file => {
  const content = fs.readFileSync(file, 'utf8');
  return content.includes('database') || content.includes('DB_') || content.includes('CREATE DATABASE') || content.includes('USE ');
});

console.log(`📁 Ditemukan ${databaseFiles.length} file yang berhubungan dengan database:\n`);

let totalIssues = 0;
let correctFiles = 0;

for (const file of databaseFiles) {
  const relativePath = path.relative('.', file);
  const issues = checkFile(file);
  
  if (issues.some(issue => issue.startsWith('❌'))) {
    console.log(`📄 ${relativePath}:`);
    issues.forEach(issue => {
      console.log(`   ${issue}`);
      if (issue.startsWith('❌')) totalIssues++;
    });
    console.log('');
  } else if (issues.some(issue => issue.startsWith('✅'))) {
    correctFiles++;
  }
}

console.log('📊 RINGKASAN VERIFIKASI:');
console.log(`✅ File yang benar: ${correctFiles}`);
console.log(`❌ Masalah yang ditemukan: ${totalIssues}`);

if (totalIssues === 0) {
  console.log('\n🎉 SEMUA FILE MENGGUNAKAN DATABASE "esirv2" DENGAN BENAR!');
} else {
  console.log('\n⚠️  DITEMUKAN MASALAH! Silakan perbaiki file-file di atas.');
}

// Periksa file konfigurasi utama
console.log('\n🔧 KONFIGURASI UTAMA:');
const configFiles = [
  'backend/config.env',
  'backend/config/db.js',
  'backend/database.sql'
];

for (const configFile of configFiles) {
  if (fs.existsSync(configFile)) {
    const content = fs.readFileSync(configFile, 'utf8');
    if (content.includes('esirv2')) {
      console.log(`✅ ${configFile} - Menggunakan "esirv2"`);
    } else {
      console.log(`❌ ${configFile} - TIDAK menggunakan "esirv2"`);
    }
  } else {
    console.log(`⚠️  ${configFile} - File tidak ditemukan`);
  }
}
