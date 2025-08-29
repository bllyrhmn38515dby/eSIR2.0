const mysql = require('mysql2/promise');

async function checkDatabase() {
  try {
    // Create connection
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'esirv2'
    });

    console.log('Checking database...');
    
    // Check if tables exist
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('Tables in database:', tables.map(t => Object.values(t)[0]));
    
    // Check if rujukan table exists
    const [rujukanTable] = await connection.execute('SHOW TABLES LIKE "rujukan"');
    if (rujukanTable.length > 0) {
      console.log('✅ Rujukan table exists');
      
      // Check table structure
      const [columns] = await connection.execute('DESCRIBE rujukan');
      console.log('Rujukan table columns:', columns.map(c => c.Field));
      
      // Check data
      const [count] = await connection.execute('SELECT COUNT(*) as count FROM rujukan');
      console.log('Rujukan records:', count[0].count);
    } else {
      console.log('❌ Rujukan table does not exist');
    }
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
  }
}

checkDatabase();
