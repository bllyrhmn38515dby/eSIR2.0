const db = require('./config/db');

async function testRujukanQuery() {
  try {
    console.log('🔍 Testing rujukan query...');
    
    // Simulasi user admin pusat
    const user = {
      role: 'admin_pusat',
      faskes_id: null
    };
    
    let query = `
      SELECT r.*, 
             p.nama_pasien, p.nik as nik_pasien,
             fa.nama_faskes as faskes_asal_nama,
             ft.nama_faskes as faskes_tujuan_nama,
             u.nama_lengkap as user_nama
      FROM rujukan r
      LEFT JOIN pasien p ON r.pasien_id = p.id
      LEFT JOIN faskes fa ON r.faskes_asal_id = fa.id
      LEFT JOIN faskes ft ON r.faskes_tujuan_id = ft.id
      LEFT JOIN users u ON r.user_id = u.id
    `;

    const params = [];

    // Filter berdasarkan role
    if (user.role === 'admin_faskes' && user.faskes_id) {
      query += ' WHERE (r.faskes_asal_id = ? OR r.faskes_tujuan_id = ?)';
      params.push(user.faskes_id, user.faskes_id);
    }

    query += ' ORDER BY r.tanggal_rujukan DESC';

    console.log('🔍 Executing query:', query);
    console.log('🔍 Query params:', params);
    
    const [rows] = await db.execute(query, params);
    
    console.log('✅ Query executed successfully');
    console.log('📊 Rows count:', rows.length);
    if (rows.length > 0) {
      console.log('📋 Sample row:', JSON.stringify(rows[0], null, 2));
    } else {
      console.log('📋 No data found');
    }

  } catch (error) {
    console.error('❌ Error executing query:', error);
  }
}

testRujukanQuery();
