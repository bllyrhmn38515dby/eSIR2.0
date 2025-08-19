const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'esirv2'
};

async function fixNotificationsTable() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database esirv2');

    // Drop existing notifications table
    console.log('\n1️⃣ Dropping existing notifications table...');
    await connection.execute('DROP TABLE IF EXISTS notifications');
    console.log('✅ Notifications table dropped');

    // Create notifications table with correct structure
    console.log('\n2️⃣ Creating notifications table with correct structure...');
    await connection.execute(`
      CREATE TABLE notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        recipient_id INT NULL,
        sender_id INT NOT NULL,
        faskes_id INT NULL,
        rujukan_id INT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (sender_id) REFERENCES users(id),
        FOREIGN KEY (faskes_id) REFERENCES faskes(id) ON DELETE SET NULL,
        FOREIGN KEY (rujukan_id) REFERENCES rujukan(id) ON DELETE SET NULL
      )
    `);
    console.log('✅ Notifications table created successfully');

    // Verify the table structure
    console.log('\n3️⃣ Verifying table structure...');
    const [columns] = await connection.execute(`
      DESCRIBE notifications
    `);
    
    console.log('\n📋 Notifications table columns:');
    columns.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    // Test inserting a notification
    console.log('\n4️⃣ Testing notification insert...');
    const [testResult] = await connection.execute(`
      INSERT INTO notifications (type, title, message, sender_id, faskes_id)
      VALUES (?, ?, ?, ?, ?)
    `, ['test', 'Test Notification', 'This is a test notification', 20, 3]);
    
    console.log(`✅ Test notification created with ID: ${testResult.insertId}`);

    // Clean up test data
    await connection.execute('DELETE FROM notifications WHERE id = ?', [testResult.insertId]);
    console.log('✅ Test notification cleaned up');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

fixNotificationsTable()
  .then(() => {
    console.log('\n✅ Notifications table fix completed!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Notifications table fix failed:', error);
    process.exit(1);
  });
