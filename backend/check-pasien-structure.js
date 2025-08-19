const db = require('./config/db');

async function checkPasienStructure() {
  console.log('🔍 Checking pasien table structure...\n');

  try {
    // Describe pasien table
    console.log('1. Pasien table structure:');
    const [columns] = await db.execute('DESCRIBE pasien');
    console.log(columns);

    // Check sample data
    console.log('\n2. Sample pasien data:');
    const [rows] = await db.execute('SELECT * FROM pasien LIMIT 3');
    console.log(rows);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

checkPasienStructure();
