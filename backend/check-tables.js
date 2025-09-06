const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkTables() {
  let connection;
  
  try {
    // Connect to database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'esirv2'
    });

    console.log('🔗 Connected to database');

    // Check all tables
    const [tables] = await connection.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = '${process.env.DB_DATABASE || 'esirv2'}'
      ORDER BY table_name
    `);

    console.log('\n📊 Database tables:');
    if (tables.length === 0) {
      console.log('  No tables found');
    } else {
      tables.forEach(table => {
        console.log(`  - ${table.table_name}`);
      });
    }

    // Check faskes table structure
    if (tables.some(t => t.table_name === 'faskes')) {
      console.log('\n🏥 Faskes table structure:');
      const [faskesColumns] = await connection.query('DESCRIBE faskes');
      faskesColumns.forEach(col => {
        console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'}`);
      });
    }

    // Check pasien table structure
    if (tables.some(t => t.table_name === 'pasien')) {
      console.log('\n👥 Pasien table structure:');
      const [pasienColumns] = await connection.query('DESCRIBE pasien');
      pasienColumns.forEach(col => {
        console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the check
checkTables();
