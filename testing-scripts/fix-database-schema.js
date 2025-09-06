const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../backend/config.env' });

async function fixDatabaseSchema() {
  console.log('🔧 Fixing Database Schema...\n');
  
  let connection;
  
  try {
    // Connect to database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'esirv2'
    });

    console.log('✅ Connected to database:', process.env.DB_DATABASE || 'esirv2');

    // Check current pasien table structure
    console.log('\n📋 Checking current pasien table structure...');
    const [pasienColumns] = await connection.execute(`
      DESCRIBE pasien
    `);
    
    console.log('Current pasien table columns:');
    pasienColumns.forEach(col => {
      console.log(`  - ${col.Field} (${col.Type})`);
    });

    // Check if nama_pasien column exists
    const namaPasienColumn = pasienColumns.find(col => col.Field === 'nama_pasien');
    const namaLengkapColumn = pasienColumns.find(col => col.Field === 'nama_lengkap');

    if (!namaPasienColumn && namaLengkapColumn) {
      console.log('\n🔄 Adding nama_pasien column as alias to nama_lengkap...');
      
      // Add nama_pasien column as alias
      await connection.execute(`
        ALTER TABLE pasien 
        ADD COLUMN nama_pasien VARCHAR(255) AS (nama_lengkap) STORED
      `);
      
      console.log('✅ Added nama_pasien column as computed column');
      
    } else if (namaPasienColumn && !namaLengkapColumn) {
      console.log('\n🔄 Adding nama_lengkap column as alias to nama_pasien...');
      
      // Add nama_lengkap column as alias
      await connection.execute(`
        ALTER TABLE pasien 
        ADD COLUMN nama_lengkap VARCHAR(255) AS (nama_pasien) STORED
      `);
      
      console.log('✅ Added nama_lengkap column as computed column');
      
    } else if (namaPasienColumn && namaLengkapColumn) {
      console.log('\n✅ Both nama_pasien and nama_lengkap columns exist');
      
    } else {
      console.log('\n❌ Neither nama_pasien nor nama_lengkap column exists!');
      console.log('💡 This is a critical issue. Please check the database schema.');
      return;
    }

    // Verify the fix
    console.log('\n🔍 Verifying the fix...');
    const [updatedColumns] = await connection.execute(`
      DESCRIBE pasien
    `);
    
    console.log('Updated pasien table columns:');
    updatedColumns.forEach(col => {
      console.log(`  - ${col.Field} (${col.Type})`);
    });

    // Test the problematic query
    console.log('\n🧪 Testing the fixed query...');
    try {
      const [testResult] = await connection.execute(`
        SELECT tt.*, 
               f.nama_faskes,
               p.nama_pasien,
               p.no_rm
        FROM tempat_tidur tt
        LEFT JOIN faskes f ON tt.faskes_id = f.id
        LEFT JOIN pasien p ON tt.pasien_id = p.id
        LIMIT 1
      `);
      
      console.log('✅ Query executed successfully!');
      console.log('Sample result:', testResult[0] || 'No data');
      
    } catch (queryError) {
      console.log('❌ Query still failed:', queryError.message);
      console.log('Error code:', queryError.code);
      console.log('SQL State:', queryError.sqlState);
    }

    console.log('\n🎉 Database schema fix completed!');

  } catch (error) {
    console.error('❌ Database error:', error.message);
    console.error('Error details:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run the fix
fixDatabaseSchema();
