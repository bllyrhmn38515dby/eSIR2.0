# Sprint 2: Fitur Inti Rujukan - Backend

## Yang Sudah Selesai ✅

### 1. Database Schema
- ✅ Tabel `pasien` untuk data pasien
- ✅ Tabel `rujukan` untuk data rujukan
- ✅ Data awal faskes (RSUD, Puskesmas)
- ✅ Foreign key relationships

### 2. API Endpoints Pasien
- ✅ `GET /api/pasien` - Get semua pasien
- ✅ `GET /api/pasien/:id` - Get pasien by ID
- ✅ `POST /api/pasien` - Create pasien baru
- ✅ `PUT /api/pasien/:id` - Update pasien
- ✅ `DELETE /api/pasien/:id` - Delete pasien

### 3. API Endpoints Rujukan
- ✅ `GET /api/rujukan` - Get semua rujukan (dengan filter role)
- ✅ `GET /api/rujukan/:id` - Get rujukan by ID
- ✅ `POST /api/rujukan` - Create rujukan baru
- ✅ `PUT /api/rujukan/:id/status` - Update status rujukan
- ✅ `GET /api/rujukan/stats/overview` - Get statistik rujukan

### 4. API Endpoints Faskes
- ✅ `GET /api/faskes` - Get semua faskes
- ✅ `GET /api/faskes/:id` - Get faskes by ID
- ✅ `POST /api/faskes` - Create faskes (admin_pusat only)
- ✅ `PUT /api/faskes/:id` - Update faskes (admin_pusat only)
- ✅ `DELETE /api/faskes/:id` - Delete faskes (admin_pusat only)

### 5. Fitur Keamanan
- ✅ Role-based access control
- ✅ Filter data berdasarkan faskes user
- ✅ Validasi input dan business rules
- ✅ Error handling yang proper

## Struktur Database

### Tabel Pasien
```sql
CREATE TABLE pasien (
    id INT AUTO_INCREMENT PRIMARY KEY,
    no_rm VARCHAR(20) NOT NULL UNIQUE,
    nama_pasien VARCHAR(100) NOT NULL,
    tanggal_lahir DATE NOT NULL,
    jenis_kelamin ENUM('L', 'P') NOT NULL,
    alamat TEXT,
    telepon VARCHAR(20),
    nama_wali VARCHAR(100),
    telepon_wali VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Tabel Rujukan
```sql
CREATE TABLE rujukan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nomor_rujukan VARCHAR(50) NOT NULL UNIQUE,
    pasien_id INT NOT NULL,
    faskes_asal_id INT NOT NULL,
    faskes_tujuan_id INT NOT NULL,
    diagnosa TEXT NOT NULL,
    alasan_rujukan TEXT NOT NULL,
    status ENUM('pending', 'diterima', 'ditolak', 'selesai') DEFAULT 'pending',
    catatan_asal TEXT,
    catatan_tujuan TEXT,
    tanggal_rujukan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tanggal_respon TIMESTAMP NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (pasien_id) REFERENCES pasien(id),
    FOREIGN KEY (faskes_asal_id) REFERENCES faskes(id),
    FOREIGN KEY (faskes_tujuan_id) REFERENCES faskes(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## API Documentation

### Pasien Endpoints

#### Get Semua Pasien
```bash
GET /api/pasien
Authorization: Bearer <token>
```

#### Create Pasien Baru
```bash
POST /api/pasien
Authorization: Bearer <token>
Content-Type: application/json

{
  "no_rm": "RM001",
  "nama_pasien": "John Doe",
  "tanggal_lahir": "1990-01-01",
  "jenis_kelamin": "L",
  "alamat": "Jl. Contoh No. 123",
  "telepon": "08123456789",
  "nama_wali": "Jane Doe",
  "telepon_wali": "08123456788"
}
```

### Rujukan Endpoints

#### Get Semua Rujukan
```bash
GET /api/rujukan
Authorization: Bearer <token>
```

#### Create Rujukan Baru
```bash
POST /api/rujukan
Authorization: Bearer <token>
Content-Type: application/json

{
  "pasien_id": 1,
  "faskes_tujuan_id": 2,
  "diagnosa": "Demam berdarah",
  "alasan_rujukan": "Memerlukan perawatan intensif",
  "catatan_asal": "Pasien sudah diberikan obat penurun demam"
}
```

#### Update Status Rujukan
```bash
PUT /api/rujukan/1/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "diterima",
  "catatan_tujuan": "Pasien diterima untuk rawat inap"
}
```

### Faskes Endpoints

#### Get Semua Faskes
```bash
GET /api/faskes
Authorization: Bearer <token>
```

#### Create Faskes Baru (Admin Pusat Only)
```bash
POST /api/faskes
Authorization: Bearer <token>
Content-Type: application/json

{
  "nama_faskes": "RS Contoh",
  "alamat": "Jl. Contoh No. 456",
  "tipe": "RSUD",
  "telepon": "031-1234567",
  "latitude": -7.2575,
  "longitude": 112.7521
}
```

## Business Rules

### Role-based Access
- **Admin Pusat**: Dapat melihat semua data, mengelola faskes
- **Admin Faskes**: Hanya dapat melihat data faskes sendiri

### Validasi Data
- No RM harus unik
- Pasien tidak dapat dihapus jika memiliki rujukan
- Faskes tidak dapat dihapus jika memiliki rujukan atau user
- Status rujukan: pending → diterima/ditolak → selesai

### Auto-generated Fields
- Nomor rujukan: `RJK-YYYYMMDD-XXX` (format: RJK-20241201-001)
- Timestamp: created_at, updated_at, tanggal_rujukan, tanggal_respon

## Testing

### 1. Test Pasien API
```bash
# Create pasien
curl -X POST http://localhost:3001/api/pasien \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "no_rm": "RM001",
    "nama_pasien": "John Doe",
    "tanggal_lahir": "1990-01-01",
    "jenis_kelamin": "L",
    "alamat": "Jl. Contoh No. 123"
  }'

# Get semua pasien
curl -X GET http://localhost:3001/api/pasien \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. Test Rujukan API
```bash
# Create rujukan
curl -X POST http://localhost:3001/api/rujukan \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pasien_id": 1,
    "faskes_tujuan_id": 2,
    "diagnosa": "Demam berdarah",
    "alasan_rujukan": "Memerlukan perawatan intensif"
  }'

# Update status
curl -X PUT http://localhost:3001/api/rujukan/1/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "diterima",
    "catatan_tujuan": "Pasien diterima"
  }'
```

## Langkah Selanjutnya

Setelah Sprint 2 Backend selesai, kita akan lanjut ke:
1. **Sprint 2 Frontend**: Form dan halaman untuk manajemen pasien dan rujukan
2. **Sprint 3**: Implementasi Realtime dengan Socket.IO
3. **Sprint 4**: Peta Interaktif dengan Leaflet.js

## Troubleshooting

### Common Issues

1. **Foreign Key Constraint Error**
   - Pastikan data referensi ada sebelum insert
   - Cek apakah faskes_id user sudah benar

2. **Role Access Error**
   - Pastikan user memiliki role yang sesuai
   - Cek middleware requireRole

3. **Data Filtering Issue**
   - Pastikan user.faskes_id sudah terisi untuk admin_faskes
   - Cek query filter berdasarkan role
