# LAMPIRAN E: SETUP & CONFIGURATION

## E.1 Database Setup Script

```javascript
// File: backend/add-spesialisasi-tables.js
const mysql = require('mysql2/promise');

async function addSpesialisasiTables() {
  let connection;
  
  try {
    // Koneksi ke database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'prodsysesirv02'
    });

    console.log('🔗 Connected to database prodsysesirv02');

    // 1. Buat tabel spesialisasi
    console.log('\n1️⃣ Creating spesialisasi table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS spesialisasi (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama_spesialisasi VARCHAR(100) NOT NULL UNIQUE,
        deskripsi TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table spesialisasi created');

    // 2. Buat tabel relasi faskes-spesialisasi
    console.log('\n2️⃣ Creating faskes_spesialisasi table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS faskes_spesialisasi (
        id INT AUTO_INCREMENT PRIMARY KEY,
        faskes_id INT NOT NULL,
        spesialisasi_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (faskes_id) REFERENCES faskes(id) ON DELETE CASCADE,
        FOREIGN KEY (spesialisasi_id) REFERENCES spesialisasi(id) ON DELETE CASCADE,
        UNIQUE KEY unique_faskes_spesialisasi (faskes_id, spesialisasi_id)
      )
    `);
    console.log('✅ Table faskes_spesialisasi created');

    // 3. Insert data spesialisasi
    console.log('\n3️⃣ Inserting spesialisasi data...');
    const spesialisasiData = [
      ['Bedah Umum', 'Layanan operasi bedah umum'],
      ['Bedah Jantung', 'Layanan operasi jantung dan pembuluh darah'],
      ['Bedah Saraf', 'Layanan operasi saraf dan otak'],
      ['Bedah Ortopedi', 'Layanan operasi tulang dan sendi'],
      ['Kardiologi', 'Layanan penyakit jantung dan pembuluh darah'],
      ['Neurologi', 'Layanan penyakit saraf dan otak'],
      ['Pulmonologi', 'Layanan penyakit paru-paru dan pernapasan'],
      ['Gastroenterologi', 'Layanan penyakit pencernaan'],
      ['Nefrologi', 'Layanan penyakit ginjal'],
      ['Endokrinologi', 'Layanan penyakit kelenjar dan hormon'],
      ['Dermatologi', 'Layanan penyakit kulit'],
      ['Oftalmologi', 'Layanan penyakit mata'],
      ['THT', 'Layanan penyakit telinga, hidung, dan tenggorokan'],
      ['Urologi', 'Layanan penyakit saluran kemih'],
      ['Ginekologi', 'Layanan kesehatan wanita'],
      ['Pediatri', 'Layanan kesehatan anak'],
      ['Psikiatri', 'Layanan kesehatan jiwa'],
      ['Anestesiologi', 'Layanan anestesi dan perawatan intensif'],
      ['Radiologi', 'Layanan pencitraan medis'],
      ['Patologi', 'Layanan pemeriksaan laboratorium'],
      ['Fisioterapi', 'Layanan rehabilitasi medis'],
      ['ICU', 'Layanan perawatan intensif'],
      ['NICU', 'Layanan perawatan intensif neonatus'],
      ['PICU', 'Layanan perawatan intensif pediatrik']
    ];

    for (const [nama, deskripsi] of spesialisasiData) {
      await connection.execute(`
        INSERT IGNORE INTO spesialisasi (nama_spesialisasi, deskripsi) 
        VALUES (?, ?)
      `, [nama, deskripsi]);
    }
    console.log('✅ Spesialisasi data inserted');

    // 4. Assign spesialisasi ke faskes yang ada
    console.log('\n4️⃣ Assigning spesialisasi to existing faskes...');
    
    // RSUD biasanya memiliki banyak spesialisasi
    const rsudSpesialisasi = [
      'Bedah Umum', 'Kardiologi', 'Neurologi', 'Pulmonologi', 
      'Gastroenterologi', 'Nefrologi', 'Endokrinologi', 'Dermatologi',
      'Oftalmologi', 'THT', 'Urologi', 'Ginekologi', 'Pediatri',
      'Psikiatri', 'Anestesiologi', 'Radiologi', 'Patologi', 'ICU'
    ];

    // RS Swasta biasanya memiliki spesialisasi terbatas
    const rsSwastaSpesialisasi = [
      'Bedah Umum', 'Kardiologi', 'Pulmonologi', 'Ginekologi', 
      'Pediatri', 'Radiologi', 'ICU'
    ];

    // Puskesmas memiliki layanan dasar
    const puskesmasSpesialisasi = [
      'Bedah Umum', 'Pediatri', 'Fisioterapi'
    ];

    // Klinik memiliki layanan terbatas
    const klinikSpesialisasi = [
      'Bedah Umum', 'Pediatri'
    ];

    // Ambil semua faskes
    const [faskes] = await connection.execute('SELECT id, nama_faskes, tipe FROM faskes');
    
    for (const faskesItem of faskes) {
      let spesialisasiToAssign = [];
      
      switch (faskesItem.tipe) {
        case 'RSUD':
          spesialisasiToAssign = rsudSpesialisasi;
          break;
        case 'RS Swasta':
          spesialisasiToAssign = rsSwastaSpesialisasi;
          break;
        case 'Puskesmas':
          spesialisasiToAssign = puskesmasSpesialisasi;
          break;
        case 'Klinik':
          spesialisasiToAssign = klinikSpesialisasi;
          break;
        default:
          spesialisasiToAssign = ['Bedah Umum', 'Pediatri'];
      }

      // Assign spesialisasi ke faskes
      for (const namaSpesialisasi of spesialisasiToAssign) {
        await connection.execute(`
          INSERT IGNORE INTO faskes_spesialisasi (faskes_id, spesialisasi_id)
          SELECT ?, s.id 
          FROM spesialisasi s 
          WHERE s.nama_spesialisasi = ?
        `, [faskesItem.id, namaSpesialisasi]);
      }
      
      console.log(`✅ Assigned ${spesialisasiToAssign.length} spesialisasi to ${faskesItem.nama_faskes}`);
    }

    console.log('\n🎉 Spesialisasi tables and data setup completed successfully!');
    
    // 5. Verifikasi data
    console.log('\n5️⃣ Verifying data...');
    const [spesialisasiCount] = await connection.execute('SELECT COUNT(*) as count FROM spesialisasi');
    const [faskesSpesialisasiCount] = await connection.execute('SELECT COUNT(*) as count FROM faskes_spesialisasi');
    
    console.log(`📊 Total spesialisasi: ${spesialisasiCount[0].count}`);
    console.log(`📊 Total faskes-spesialisasi relations: ${faskesSpesialisasiCount[0].count}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Jalankan script
if (require.main === module) {
  addSpesialisasiTables()
    .then(() => {
      console.log('✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = addSpesialisasiTables;
```

## E.2 Environment Configuration

```bash
# File: backend/.env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_DATABASE=prodsysesirv02

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Server Configuration
PORT=3001
NODE_ENV=development

# API Keys (Optional)
OPENROUTE_API_KEY=your_openroute_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## E.3 Package.json Dependencies

```json
{
  "name": "esir2-backend",
  "version": "2.0.0",
  "description": "Backend API untuk eSIR 2.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "setup-db": "node add-spesialisasi-tables.js",
    "test-search": "node test-spesialisasi-search.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "helmet": "^7.0.0",
    "express-rate-limit": "^6.8.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.6.2"
  }
}
```

## E.4 Frontend Package.json

```json
{
  "name": "esir2-frontend",
  "version": "2.0.0",
  "description": "Frontend untuk eSIR 2.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.14.2",
    "axios": "^1.4.0",
    "leaflet": "^1.9.4",
    "react-leaflet": "^4.2.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.3",
    "vite": "^4.4.5"
  }
}
```

## E.5 Server Configuration

```javascript
// File: backend/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/search', require('./routes/search'));
app.use('/api/faskes', require('./routes/faskes'));
app.use('/api/pasien', require('./routes/pasien'));
app.use('/api/rujukan', require('./routes/rujukan'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
});
```

## E.6 Database Connection Configuration

```javascript
// File: backend/config/db.js
const mysql = require('mysql2/promise');

// Connection pool configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'prodsysesirv02',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

const db = mysql.createPool(dbConfig);

// Test connection
db.getConnection()
  .then(connection => {
    console.log('✅ Database connected successfully');
    connection.release();
  })
  .catch(error => {
    console.error('❌ Database connection failed:', error.message);
  });

module.exports = db;
```

## E.7 Installation Commands

```bash
# Backend Setup
cd backend
npm install
npm run setup-db
npm start

# Frontend Setup
cd frontend
npm install
npm start

# Test Setup
cd backend
npm run test-search
```

## E.8 Docker Configuration (Optional)

```dockerfile
# File: Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3001

# Start application
CMD ["npm", "start"]
```

```yaml
# File: docker-compose.yml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: prodsysesirv02
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      DB_HOST: mysql
      DB_USER: root
      DB_PASSWORD: rootpassword
      DB_DATABASE: prodsysesirv02
    depends_on:
      - mysql

volumes:
  mysql_data:
```

## E.9 Production Configuration

```javascript
// File: backend/config/production.js
module.exports = {
  database: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '24h'
  },
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true
  }
};
```

## E.10 Backup Script

```bash
#!/bin/bash
# File: backup-database.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="prodsysesirv02"

# Create backup directory if not exists
mkdir -p $BACKUP_DIR

# Create database backup
mysqldump -u root -p$DB_PASSWORD $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/backup_$DATE.sql

echo "Backup created: $BACKUP_DIR/backup_$DATE.sql.gz"
```

**Setup Requirements:**
- Node.js 18+
- MySQL 8.0+
- npm atau yarn
- Environment variables configured
- Database permissions set
