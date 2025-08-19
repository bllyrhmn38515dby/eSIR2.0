const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'esirv2'
};

async function checkNotificationsTable() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database esirv2');

    // Check if notifications table exists
    console.log('\n1️⃣ Checking notifications table...');
    const [tables] = await connection.execute(`
      SHOW TABLES LIKE 'notifications'
    `);
    
    if (tables.length === 0) {
      console.log('❌ Table notifications does not exist!');
      console.log('This is likely causing the 500 error when creating rujukan.');
      return;
    }
    
    console.log('✅ Table notifications exists');

    // Check table structure
    const [columns] = await connection.execute(`
      DESCRIBE notifications
    `);
    
    console.log('\n📋 Notifications table columns:');
    columns.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    // Check if there are any notifications
    const [countResult] = await connection.execute(`
      SELECT COUNT(*) as count FROM notifications
    `);
    console.log(`\n📊 Total notifications: ${countResult[0].count}`);

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkNotificationsTable()
  .then(() => {
    console.log('\n✅ Notifications table check completed!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Notifications table check failed:', error);
    process.exit(1);
  });
