const mysql = require('mysql2');

async function checkRSUDLeuwiliang() {
  let connection;
  try {
    connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'prodsysesirv02'
    });

    console.log('🔍 Checking RSUD Leuwiliang...');
    
    const [faskes] = await connection.promise().query(`
      SELECT id, nama_faskes, tipe, alamat, telepon
      FROM faskes 
      WHERE nama_faskes LIKE '%Leuwiliang%'
    `);
    
    if (faskes.length > 0) {
      console.log('🏥 RSUD Leuwiliang found:');
      faskes.forEach(f => {
        console.log(`- ID: ${f.id}, Name: ${f.nama_faskes}, Type: ${f.tipe}`);
        console.log(`  Address: ${f.alamat}`);
        console.log(`  Phone: ${f.telepon}`);
      });
    } else {
      console.log('❌ RSUD Leuwiliang not found');
      
      // Check all faskes to see what's available
      const [allFaskes] = await connection.promise().query(`
        SELECT id, nama_faskes, tipe 
        FROM faskes 
        ORDER BY nama_faskes
      `);
      
      console.log('📋 All available faskes:');
      allFaskes.forEach(f => {
        console.log(`- ID: ${f.id}, Name: ${f.nama_faskes}, Type: ${f.tipe}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      connection.end();
    }
  }
}

checkRSUDLeuwiliang();
