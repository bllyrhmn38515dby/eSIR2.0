# 🔍 Fitur Pencarian eSIR 2.0

## 📋 Ringkasan

Fitur pencarian eSIR 2.0 menyediakan kemampuan pencarian yang komprehensif dan canggih untuk semua entitas dalam sistem, termasuk pasien, rujukan, fasilitas kesehatan, dan tempat tidur. Fitur ini dirancang dengan antarmuka yang user-friendly dan performa yang optimal.

## ✨ Fitur Utama

### 1. 🔍 Pencarian Global
- Pencarian lintas entitas dalam satu query
- Mendukung pencarian di semua tabel: pasien, rujukan, faskes, tempat tidur
- Hasil yang dikelompokkan berdasarkan jenis entitas
- Tampilan card yang informatif dan mudah dibaca

### 2. 🎯 Pencarian Lanjutan
- **Pencarian Pasien**: Filter berdasarkan jenis kelamin, rentang usia, alamat
- **Pencarian Rujukan**: Filter berdasarkan status, faskes asal/tujuan, tanggal, diagnosa
- **Pencarian Tempat Tidur**: Filter berdasarkan status, tipe kamar, ketersediaan
- Pagination dan sorting yang fleksibel

### 3. 💡 Autocomplete
- Saran otomatis untuk input pencarian
- Mendukung semua jenis entitas
- Menampilkan frekuensi penggunaan untuk diagnosa

### 4. 📊 Analytics Pencarian
- Trend pencarian harian
- Term pencarian populer
- Performa pencarian per entitas
- Statistik penggunaan

## 🏗️ Arsitektur

### Backend (Node.js + Express)

#### File Utama:
- `backend/routes/search.js` - Route handler untuk semua endpoint pencarian
- `backend/setup-search-database.js` - Script setup database
- `backend/test-search-api.js` - Script testing API

#### Database:
- Tabel `search_logs` untuk analytics pencarian
- Foreign key ke tabel `users` untuk tracking

### Frontend (React)

#### Komponen:
- `frontend/src/components/SearchPage.js` - Komponen utama pencarian
- `frontend/src/components/SearchPage.css` - Styling komponen

#### Integrasi:
- Route `/search` di `App.js`
- Link navigasi di `Navigation.js`

## 🚀 API Endpoints

### 1. Global Search
```
GET /api/search/global?query={term}&type={entity_type}&limit={number}
```

**Parameter:**
- `query` (required): Term pencarian (min 2 karakter)
- `type` (optional): Jenis entitas (global, pasien, rujukan, faskes, tempat-tidur)
- `limit` (optional): Jumlah hasil maksimal (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "pasien": [...],
    "rujukan": [...],
    "faskes": [...],
    "tempat_tidur": [...]
  },
  "total_results": 15
}
```

### 2. Advanced Patient Search
```
GET /api/search/pasien?query={term}&jenis_kelamin={L/P}&usia_min={number}&usia_max={number}&alamat={term}&sort_by={field}&sort_order={ASC/DESC}&page={number}&limit={number}
```

### 3. Advanced Referral Search
```
GET /api/search/rujukan?query={term}&status={status}&faskes_asal={term}&faskes_tujuan={term}&tanggal_mulai={date}&tanggal_akhir={date}&diagnosa={term}&sort_by={field}&sort_order={ASC/DESC}&page={number}&limit={number}
```

### 4. Advanced Bed Search
```
GET /api/search/tempat-tidur?query={term}&faskes={term}&status={status}&tipe_kamar={type}&tersedia={true/false}&sort_by={field}&sort_order={ASC/DESC}&page={number}&limit={number}
```

### 5. Autocomplete
```
GET /api/search/autocomplete/{type}?query={term}&limit={number}
```

**Types:** pasien, faskes, diagnosa, rujukan

### 6. Search Analytics
```
GET /api/search/analytics?date_range={days}
```

## 🎨 UI/UX Features

### Design System
- **Color Scheme**: Gradient biru-ungu (#667eea → #764ba2)
- **Typography**: Clean dan readable
- **Spacing**: Consistent padding dan margin
- **Shadows**: Subtle elevation untuk depth

### Responsive Design
- **Desktop**: Grid layout dengan multiple columns
- **Tablet**: Adaptive grid dengan breakpoints
- **Mobile**: Single column layout dengan optimized touch targets

### Interactive Elements
- **Hover Effects**: Smooth transitions pada cards dan buttons
- **Loading States**: Spinner animation saat pencarian
- **Status Indicators**: Color-coded status badges
- **Pagination**: Intuitive navigation controls

## 🔧 Setup & Installation

### 1. Setup Database
```bash
cd backend
node setup-search-database.js
```

### 2. Test API
```bash
cd backend
node test-search-api.js
```

### 3. Start Development
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

## 📊 Database Schema

### Tabel search_logs
```sql
CREATE TABLE search_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    search_term VARCHAR(255) NOT NULL,
    entity_type ENUM('pasien', 'rujukan', 'faskes', 'tempat_tidur', 'global') NOT NULL,
    results_count INT DEFAULT 0,
    response_time_ms INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 🔒 Security & Performance

### Authentication
- Semua endpoint memerlukan JWT token
- Role-based access control
- User activity logging

### Performance Optimization
- Database indexing pada kolom pencarian
- Query optimization dengan prepared statements
- Pagination untuk large datasets
- Response time tracking

### Error Handling
- Comprehensive error messages
- Input validation
- Graceful degradation

## 🧪 Testing

### API Testing
- Unit tests untuk setiap endpoint
- Integration tests untuk workflow lengkap
- Error scenario testing
- Performance testing

### Frontend Testing
- Component testing dengan React Testing Library
- User interaction testing
- Responsive design testing
- Accessibility testing

## 📈 Analytics & Monitoring

### Search Metrics
- Total searches per day
- Popular search terms
- Search success rate
- Average response time
- User engagement patterns

### Performance Monitoring
- Query execution time
- Database connection usage
- Memory consumption
- Error rates

## 🔮 Future Enhancements

### Planned Features
- **Full-text Search**: Implementasi Elasticsearch
- **Search Suggestions**: AI-powered recommendations
- **Search History**: Personal search history
- **Export Results**: PDF/Excel export functionality
- **Advanced Filters**: Date range picker, multi-select filters
- **Search Alerts**: Email notifications for new results

### Technical Improvements
- **Caching**: Redis implementation untuk frequent queries
- **Search Indexing**: Optimized database indexes
- **API Rate Limiting**: Protection against abuse
- **Real-time Search**: Live search suggestions

## 🤝 Contributing

### Development Guidelines
1. Follow existing code style
2. Add comprehensive error handling
3. Include unit tests for new features
4. Update documentation
5. Test on multiple devices

### Code Review Checklist
- [ ] Functionality works as expected
- [ ] Error handling is comprehensive
- [ ] Performance is acceptable
- [ ] UI/UX follows design guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated

## 📞 Support

Untuk pertanyaan atau masalah terkait fitur pencarian, silakan hubungi:
- **Email**: support@esir.com
- **Documentation**: [Link ke dokumentasi lengkap]
- **Issue Tracker**: [Link ke GitHub Issues]

---

**Versi**: 1.0.0  
**Terakhir Diupdate**: Desember 2024  
**Status**: Production Ready ✅
