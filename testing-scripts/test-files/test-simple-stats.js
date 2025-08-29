const mysql = require('mysql2/promise');

async function testStatsQuery() {
  try {
    // Create connection
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'esirv2'
    });

    console.log('Testing stats query directly...');
    
    // Test the query directly
    const [rows] = await connection.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'diterima' THEN 1 ELSE 0 END) as diterima,
        SUM(CASE WHEN status = 'ditolak' THEN 1 ELSE 0 END) as ditolak,
        SUM(CASE WHEN status = 'selesai' THEN 1 ELSE 0 END) as selesai
      FROM rujukan
    `);
    
    console.log('✅ Query result:', rows[0]);
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
  }
}

testStatsQuery();
