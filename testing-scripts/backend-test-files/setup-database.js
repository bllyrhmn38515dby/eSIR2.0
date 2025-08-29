require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  try {
    console.log('Setting up database...');
    
    // Create connection without database
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: ''
    });

    console.log('✅ MySQL connection successful');
    
    // Create database if not exists
    await connection.execute('CREATE DATABASE IF NOT EXISTS esirv2');
    console.log('✅ Database esirv2 created/verified');
    
    // Use the database
    await connection.execute('USE esirv2');
    
    // Read and execute SQL file
    const sqlFile = path.join(__dirname, 'database.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    // Split SQL by semicolon and execute each statement
    const statements = sqlContent.split(';').filter(stmt => stmt.trim());
    
    for (let statement of statements) {
      if (statement.trim()) {
        try {
          await connection.execute(statement);
          console.log('✅ Executed SQL statement');
        } catch (error) {
          console.log('⚠️ SQL statement error (might be duplicate):', error.message);
        }
      }
    }
    
    console.log('✅ Database setup completed');
    
    // Verify tables
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('Tables created:', tables.map(t => Object.values(t)[0]));
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Database setup error:', error.message);
  }
}

setupDatabase();
