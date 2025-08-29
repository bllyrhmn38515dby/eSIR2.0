require('dotenv').config();
const mysql = require('mysql2');

async function addFaskesIdToUsers() {
  try {
    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT
    });

    console.log('=== ADD FASKES_ID TO USERS TABLE ===');

    // Periksa struktur tabel users
    console.log('\n1. Struktur tabel users saat ini:');
    const [columns] = await connection.promise().query('DESCRIBE users');
    columns.forEach(col => {
      console.log(`  ${col.Field} - ${col.Type} - ${col.Key}`);
    });

    // Tambahkan kolom faskes_id jika belum ada
    console.log('\n2. Menambahkan kolom faskes_id...');
    try {
      await connection.promise().query(`
        ALTER TABLE users 
        ADD COLUMN faskes_id INT UNSIGNED
      `);
      console.log('  ✅ Kolom faskes_id berhasil ditambahkan');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('  ℹ️ Kolom faskes_id sudah ada');
      } else {
        throw error;
      }
    }

    // Update user admin@pusat.com dengan faskes_id
    console.log('\n3. Update user admin@pusat.com dengan faskes_id...');
    await connection.promise().execute(
      'UPDATE users SET faskes_id = ? WHERE email = ?',
      [1, 'admin@pusat.com']
    );
    console.log('  ✅ User admin@pusat.com diupdate dengan faskes_id = 1');

    // Update user admin@faskes.com dengan faskes_id
    console.log('\n4. Update user admin@faskes.com dengan faskes_id...');
    await connection.promise().execute(
      'UPDATE users SET faskes_id = ? WHERE email = ?',
      [2, 'admin@faskes.com']
    );
    console.log('  ✅ User admin@faskes.com diupdate dengan faskes_id = 2');

    // Update user test@example.com dengan faskes_id
    console.log('\n5. Update user test@example.com dengan faskes_id...');
    await connection.promise().execute(
      'UPDATE users SET faskes_id = ? WHERE email = ?',
      [1, 'test@example.com']
    );
    console.log('  ✅ User test@example.com diupdate dengan faskes_id = 1');

    // Periksa struktur tabel users setelah update
    console.log('\n6. Struktur tabel users setelah update:');
    const [updatedColumns] = await connection.promise().query('DESCRIBE users');
    updatedColumns.forEach(col => {
      console.log(`  ${col.Field} - ${col.Type} - ${col.Key}`);
    });

    // Periksa data user setelah update
    console.log('\n7. Data user setelah update:');
    const [users] = await connection.promise().execute(
      'SELECT id, nama, email, role, faskes_id FROM users WHERE email IN (?, ?, ?)',
      ['admin@pusat.com', 'admin@faskes.com', 'test@example.com']
    );
    
    users.forEach(user => {
      console.log(`  ${user.email}: faskes_id = ${user.faskes_id}`);
    });

    await connection.promise().end();
    console.log('\n=== SELESAI ===');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addFaskesIdToUsers();
