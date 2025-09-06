const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../backend/config.env' });

async function checkDatabaseStructure() {
  console.log('🔍 Checking Database Structure...\n');
  
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

    // Check if pasien table exists
    console.log('\n📋 Checking pasien table...');
    const [pasienTables] = await connection.execute(`
      SHOW TABLES LIKE 'pasien'
    `);
    
    if (pasienTables.length === 0) {
      console.log('❌ Table pasien does not exist!');
      console.log('💡 Solution: Run the database.sql script to create the table');
      return;
    }
    
    console.log('✅ Table pasien exists');

    // Check pasien table structure
    console.log('\n📋 Checking pasien table structure...');
    const [pasienColumns] = await connection.execute(`
      DESCRIBE pasien
    `);
    
    console.log('Pasien table columns:');
    pasienColumns.forEach(col => {
      console.log(`  - ${col.Field} (${col.Type})`);
    });

    // Check if nama_pasien column exists
    const namaPasienColumn = pasienColumns.find(col => col.Field === 'nama_pasien');
    if (!namaPasienColumn) {
      console.log('\n❌ Column nama_pasien does not exist in pasien table!');
      console.log('💡 Solution: Add the column or check the database schema');
      return;
    }
    
    console.log('\n✅ Column nama_pasien exists');

    // Check tempat_tidur table
    console.log('\n📋 Checking tempat_tidur table...');
    const [tempatTidurTables] = await connection.execute(`
      SHOW TABLES LIKE 'tempat_tidur'
    `);
    
    if (tempatTidurTables.length === 0) {
      console.log('❌ Table tempat_tidur does not exist!');
      return;
    }
    
    console.log('✅ Table tempat_tidur exists');

    // Check tempat_tidur table structure
    console.log('\n📋 Checking tempat_tidur table structure...');
    const [tempatTidurColumns] = await connection.execute(`
      DESCRIBE tempat_tidur
    `);
    
    console.log('Tempat tidur table columns:');
    tempatTidurColumns.forEach(col => {
      console.log(`  - ${col.Field} (${col.Type})`);
    });

    // Test the problematic query
    console.log('\n🧪 Testing the problematic query...');
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
      
      console.log('✅ Query executed successfully');
      console.log('Sample result:', testResult[0] || 'No data');
      
    } catch (queryError) {
      console.log('❌ Query failed:', queryError.message);
      console.log('Error code:', queryError.code);
      console.log('SQL State:', queryError.sqlState);
    }

    // Check if there's data in pasien table
    console.log('\n📊 Checking pasien table data...');
    const [pasienCount] = await connection.execute(`
      SELECT COUNT(*) as count FROM pasien
    `);
    
    console.log(`Pasien table has ${pasienCount[0].count} records`);

    // Check if there's data in tempat_tidur table
    console.log('\n📊 Checking tempat_tidur table data...');
    const [tempatTidurCount] = await connection.execute(`
      SELECT COUNT(*) as count FROM tempat_tidur
    `);
    
    console.log(`Tempat tidur table has ${tempatTidurCount[0].count} records`);

    // Check if there's data in faskes table
    console.log('\n📊 Checking faskes table data...');
    const [faskesCount] = await connection.execute(`
      SELECT COUNT(*) as count FROM faskes
    `);
    
    console.log(`Faskes table has ${faskesCount[0].count} records`);

  } catch (error) {
    console.error('❌ Database connection error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run the check
checkDatabaseStructure();
