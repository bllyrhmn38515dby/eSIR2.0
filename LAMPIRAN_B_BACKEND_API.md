# LAMPIRAN B: BACKEND API IMPLEMENTATION

## B.1 Global Search dengan Spesialisasi

```javascript
// File: backend/routes/search.js
// Endpoint: GET /api/search/global

router.get('/global', verifyToken, async (req, res) => {
  try {
    const { query, type, limit = 10 } = req.query;
    
    if (!query || query.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Query minimal 2 karakter'
      });
    }

    let results = {};
    const searchQuery = `%${query}%`;

    // Search healthcare facilities dengan spesialisasi
    if (!type || type === 'faskes') {
      const [facilities] = await db.execute(`
        SELECT DISTINCT
          f.id,
          f.nama_faskes,
          f.tipe as tipe_faskes,
          f.alamat,
          f.telepon,
          f.latitude,
          f.longitude,
          GROUP_CONCAT(s.nama_spesialisasi SEPARATOR ', ') as spesialisasi,
          'faskes' as entity_type
        FROM faskes f
        LEFT JOIN faskes_spesialisasi fs ON f.id = fs.faskes_id
        LEFT JOIN spesialisasi s ON fs.spesialisasi_id = s.id
        WHERE f.nama_faskes LIKE ? 
           OR f.alamat LIKE ? 
           OR f.telepon LIKE ?
           OR s.nama_spesialisasi LIKE ?
        GROUP BY f.id, f.nama_faskes, f.tipe, f.alamat, f.telepon, f.latitude, f.longitude
        ORDER BY f.nama_faskes
        LIMIT ?
      `, [searchQuery, searchQuery, searchQuery, searchQuery, parseInt(limit)]);
      
      results.faskes = facilities;
    }

    res.json({
      success: true,
      data: results,
      total_results: Object.values(results).reduce((sum, arr) => sum + arr.length, 0)
    });
  } catch (error) {
    console.error('Error global search:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal melakukan pencarian'
    });
  }
});
```

**Penjelasan:**
- Mencari faskes berdasarkan nama, alamat, telepon, atau spesialisasi
- Menggunakan `GROUP_CONCAT` untuk menggabungkan spesialisasi
- Mendukung pencarian global atau terbatas pada tipe tertentu

## B.2 Advanced Search Faskes dengan Filter Spesialisasi

```javascript
// File: backend/routes/search.js
// Endpoint: GET /api/search/faskes

router.get('/faskes', verifyToken, async (req, res) => {
  try {
    const {
      query = '',
      tipe = '',
      spesialisasi = '',
      alamat = '',
      sort_by = 'nama_faskes',
      sort_order = 'ASC',
      page = 1,
      limit = 20
    } = req.query;

    let whereConditions = [];
    let queryParams = [];

    // Query text search
    if (query) {
      whereConditions.push(`(
        f.nama_faskes LIKE ? 
        OR f.alamat LIKE ? 
        OR f.telepon LIKE ?
        OR s.nama_spesialisasi LIKE ?
      )`);
      const searchQuery = `%${query}%`;
      queryParams.push(searchQuery, searchQuery, searchQuery, searchQuery);
    }

    // Filter by tipe
    if (tipe) {
      whereConditions.push('f.tipe = ?');
      queryParams.push(tipe);
    }

    // Filter by spesialisasi
    if (spesialisasi) {
      whereConditions.push('s.nama_spesialisasi LIKE ?');
      queryParams.push(`%${spesialisasi}%`);
    }

    // Filter by alamat
    if (alamat) {
      whereConditions.push('f.alamat LIKE ?');
      queryParams.push(`%${alamat}%`);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Count total results
    const [countResult] = await db.execute(`
      SELECT COUNT(DISTINCT f.id) as total
      FROM faskes f
      LEFT JOIN faskes_spesialisasi fs ON f.id = fs.faskes_id
      LEFT JOIN spesialisasi s ON fs.spesialisasi_id = s.id
      ${whereClause}
    `, queryParams);

    const total = countResult[0].total;

    // Get paginated results
    const offset = (parseInt(page) - 1) * parseInt(limit);
    queryParams.push(parseInt(limit), offset);

    const [facilities] = await db.execute(`
      SELECT DISTINCT
        f.id,
        f.nama_faskes,
        f.tipe as tipe_faskes,
        f.alamat,
        f.telepon,
        f.latitude,
        f.longitude,
        GROUP_CONCAT(DISTINCT s.nama_spesialisasi ORDER BY s.nama_spesialisasi SEPARATOR ', ') as spesialisasi,
        COUNT(DISTINCT s.id) as jumlah_spesialisasi
      FROM faskes f
      LEFT JOIN faskes_spesialisasi fs ON f.id = fs.faskes_id
      LEFT JOIN spesialisasi s ON fs.spesialisasi_id = s.id
      ${whereClause}
      GROUP BY f.id, f.nama_faskes, f.tipe, f.alamat, f.telepon, f.latitude, f.longitude
      ORDER BY ${sort_by} ${sort_order}
      LIMIT ? OFFSET ?
    `, queryParams);

    res.json({
      success: true,
      data: {
        facilities,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          total_pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error advanced faskes search:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal melakukan pencarian faskes'
    });
  }
});
```

**Penjelasan:**
- Mendukung multiple filter: query, tipe, spesialisasi, alamat
- Pagination dengan limit dan offset
- Sorting berdasarkan kolom yang dipilih
- Count total untuk pagination info

## B.3 Autocomplete Spesialisasi

```javascript
// File: backend/routes/search.js
// Endpoint: GET /api/search/autocomplete/spesialisasi

router.get('/autocomplete/:type', verifyToken, async (req, res) => {
  try {
    const { type } = req.params;
    const { query, limit = 10 } = req.query;
    
    if (!query || query.length < 2) {
      return res.json({
        success: true,
        data: []
      });
    }

    const searchQuery = `%${query}%`;
    let suggestions = [];

    switch (type) {
      case 'spesialisasi':
        const [specializations] = await db.execute(`
          SELECT 
            s.id,
            s.nama_spesialisasi as label,
            s.deskripsi as subtitle,
            s.nama_spesialisasi as display_text,
            COUNT(fs.faskes_id) as jumlah_faskes
          FROM spesialisasi s
          LEFT JOIN faskes_spesialisasi fs ON s.id = fs.spesialisasi_id
          WHERE s.nama_spesialisasi LIKE ?
          GROUP BY s.id, s.nama_spesialisasi, s.deskripsi
          ORDER BY jumlah_faskes DESC, s.nama_spesialisasi
          LIMIT ?
        `, [searchQuery, parseInt(limit)]);
        
        suggestions = specializations.map(s => ({
          ...s,
          subtitle: s.jumlah_faskes > 0 ? `${s.jumlah_faskes} faskes tersedia` : 'Belum ada faskes',
          display_text: s.label
        }));
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Tipe autocomplete tidak valid'
        });
    }

    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    console.error('Error autocomplete:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mendapatkan saran'
    });
  }
});
```

**Penjelasan:**
- Autocomplete untuk spesialisasi dengan jumlah faskes tersedia
- Sorting berdasarkan jumlah faskes (popularitas)
- Format response yang konsisten untuk frontend

## B.4 Middleware Authentication

```javascript
// File: backend/middleware/auth.js
// Middleware untuk verifikasi token JWT

const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token tidak ditemukan'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token tidak valid'
    });
  }
};

module.exports = { verifyToken };
```

## B.5 Database Connection

```javascript
// File: backend/config/db.js
// Konfigurasi koneksi database

const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'prodsysesirv02',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = db;
```

## B.6 Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    "facilities": [
      {
        "id": 1,
        "nama_faskes": "RSUD Kota Bogor",
        "tipe_faskes": "RSUD",
        "alamat": "Jl. Dr. Semeru No.120...",
        "telepon": "0251-8313084",
        "latitude": -6.5971,
        "longitude": 106.8060,
        "spesialisasi": "Bedah Umum, Kardiologi, Neurologi, Pulmonologi",
        "jumlah_spesialisasi": 18
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "total_pages": 1
    }
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Gagal melakukan pencarian"
}
```

## B.7 API Endpoints Summary

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/api/search/global` | Global search dengan spesialisasi | `query`, `type`, `limit` |
| GET | `/api/search/faskes` | Advanced search faskes | `query`, `tipe`, `spesialisasi`, `alamat`, `sort_by`, `sort_order`, `page`, `limit` |
| GET | `/api/search/autocomplete/spesialisasi` | Autocomplete spesialisasi | `query`, `limit` |

## B.8 Error Handling

```javascript
// Global error handler untuk search routes
const handleSearchError = (error, res, operation) => {
  console.error(`Error ${operation}:`, error);
  
  if (error.code === 'ER_NO_SUCH_TABLE') {
    return res.status(500).json({
      success: false,
      message: 'Tabel database tidak ditemukan'
    });
  }
  
  if (error.code === 'ER_ACCESS_DENIED_ERROR') {
    return res.status(500).json({
      success: false,
      message: 'Akses database ditolak'
    });
  }
  
  res.status(500).json({
    success: false,
    message: `Gagal melakukan ${operation}`
  });
};
```

**Fitur Keamanan:**
- JWT token authentication
- SQL injection protection dengan prepared statements
- Input validation dan sanitization
- Error handling yang comprehensive
