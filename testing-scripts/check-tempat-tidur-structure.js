const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../backend/config.env' });

async function checkTempatTidurStructure() {
  console.log('🔍 Checking Tempat Tidur Table Structure...\n');
  
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

    // Check if tempat_tidur table exists
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

    // Check if there's data in tempat_tidur table
    console.log('\n📊 Checking tempat_tidur table data...');
    const [tempatTidurCount] = await connection.execute(`
      SELECT COUNT(*) as count FROM tempat_tidur
    `);
    
    console.log(`Tempat tidur table has ${tempatTidurCount[0].count} records`);

    if (tempatTidurCount[0].count > 0) {
      console.log('\n📋 Sample tempat_tidur data:');
      const [sampleData] = await connection.execute(`
        SELECT * FROM tempat_tidur LIMIT 3
      `);
      
      sampleData.forEach((row, index) => {
        console.log(`Record ${index + 1}:`);
        Object.keys(row).forEach(key => {
          console.log(`  - ${key}: ${row[key]}`);
        });
        console.log('');
      });
    }

    // Check if faskes table exists and has data
    console.log('\n📋 Checking faskes table...');
    const [faskesCount] = await connection.execute(`
      SELECT COUNT(*) as count FROM faskes
    `);
    
    console.log(`Faskes table has ${faskesCount[0].count} records`);

    // Test a simple query without joins
    console.log('\n🧪 Testing simple tempat_tidur query...');
    try {
      const [simpleResult] = await connection.execute(`
        SELECT * FROM tempat_tidur LIMIT 3
      `);
      
      console.log('✅ Simple query executed successfully!');
      console.log(`Found ${simpleResult.length} records`);
      
    } catch (queryError) {
      console.log('❌ Simple query failed:', queryError.message);
    }

  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run the check
checkTempatTidurStructure();
