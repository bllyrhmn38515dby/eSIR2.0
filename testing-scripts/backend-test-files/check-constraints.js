const mysql = require('mysql2/promise');

async function checkConstraints() {
  try {
    console.log('🔍 Mengecek foreign key constraints...');
    
    const config = {
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'esirv2',
      port: 3306
    };

    const connection = await mysql.createConnection(config);
    console.log('✅ Koneksi database berhasil');

    // Cek semua tabel
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('\n📋 Tabel yang ada:');
    tables.forEach(table => {
      console.log(`- ${Object.values(table)[0]}`);
    });

    // Cek foreign key constraints
    const [constraints] = await connection.execute(`
      SELECT 
        TABLE_NAME,
        COLUMN_NAME,
        CONSTRAINT_NAME,
        REFERENCED_TABLE_NAME,
        REFERENCED_COLUMN_NAME
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
      WHERE REFERENCED_TABLE_SCHEMA = 'esirv2' 
      AND REFERENCED_TABLE_NAME IS NOT NULL
    `);

    if (constraints.length > 0) {
      console.log('\n🔗 Foreign Key Constraints:');
      constraints.forEach(constraint => {
        console.log(`- ${constraint.TABLE_NAME}.${constraint.COLUMN_NAME} -> ${constraint.REFERENCED_TABLE_NAME}.${constraint.REFERENCED_COLUMN_NAME}`);
      });
    } else {
      console.log('\n✅ Tidak ada foreign key constraints');
    }

    // Cek struktur tabel roles
    console.log('\n👥 Struktur tabel roles:');
    const [rolesColumns] = await connection.execute('DESCRIBE roles');
    rolesColumns.forEach(col => {
      console.log(`- ${col.Field}: ${col.Type} ${col.Key ? `(${col.Key})` : ''}`);
    });

    await connection.end();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkConstraints();
