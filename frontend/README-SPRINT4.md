# Sprint 4: Peta Interaktif - Leaflet.js

## Yang Sudah Selesai ✅

### 1. Leaflet.js Integration
- ✅ Leaflet.js dan react-leaflet installation
- ✅ Map container dengan OpenStreetMap tiles
- ✅ Custom markers untuk faskes berdasarkan tipe
- ✅ Interactive popup dengan informasi faskes

### 2. Faskes Mapping
- ✅ Marker untuk setiap faskes dengan koordinat
- ✅ Custom icons berdasarkan tipe (RSUD, Puskesmas, Klinik)
- ✅ Popup dengan detail faskes dan jumlah rujukan
- ✅ Click handler untuk menampilkan detail panel

### 3. Rujukan Lines
- ✅ Garis rujukan antar faskes
- ✅ Warna garis berdasarkan status rujukan
- ✅ Popup dengan detail rujukan
- ✅ Toggle untuk show/hide garis rujukan

### 4. Realtime Integration
- ✅ Socket.IO integration untuk realtime updates
- ✅ Auto-refresh data saat ada rujukan baru
- ✅ Auto-refresh data saat ada update status
- ✅ Connection status indicator

### 5. Interactive Features
- ✅ Faskes details panel dengan informasi lengkap
- ✅ Legend untuk marker dan status rujukan
- ✅ Map bounds auto-fit untuk semua faskes
- ✅ Responsive design untuk mobile

## Struktur Komponen Baru

```
frontend/src/
├── components/
│   ├── MapPage.js              # Komponen peta utama
│   ├── MapPage.css             # Styling peta
│   └── [komponen yang diupdate...]
└── [file lainnya...]
```

## Fitur yang Tersedia

### 🗺️ Interactive Map
- **OpenStreetMap Integration**: Peta dasar dari OpenStreetMap
- **Custom Markers**: Marker khusus untuk setiap tipe faskes
- **Interactive Popups**: Informasi detail saat klik marker
- **Auto-fit Bounds**: Peta otomatis menyesuaikan dengan semua faskes

### 🏥 Faskes Markers
- **RSUD Markers**: Warna biru (#1976d2) dengan icon "R"
- **Puskesmas Markers**: Warna hijau (#388e3c) dengan icon "P"
- **Klinik Markers**: Warna orange (#f57c00) dengan icon "K"
- **Popup Information**: Nama, tipe, alamat, telepon, total rujukan

### 📋 Rujukan Lines
- **Status-based Colors**:
  - Menunggu: Kuning (#ffc107)
  - Diterima: Hijau (#28a745)
  - Ditolak: Merah (#dc3545)
  - Selesai: Biru (#17a2b8)
- **Interactive Lines**: Klik garis untuk detail rujukan
- **Toggle Control**: Show/hide garis rujukan

### 🔄 Realtime Features
- **Live Updates**: Data peta update otomatis
- **Connection Status**: Indicator koneksi realtime
- **Socket Integration**: Terintegrasi dengan Socket.IO

### 📱 Responsive Design
- **Mobile Optimized**: Peta responsive untuk mobile
- **Touch Friendly**: Marker dan popup mudah diakses
- **Adaptive Layout**: Layout menyesuaikan ukuran layar

## Cara Menjalankan

### 1. Pastikan Backend Berjalan
```bash
cd backend
npm run dev
```

### 2. Jalankan Frontend
```bash
cd frontend
npm start
```

### 3. Akses Peta
1. Login ke aplikasi
2. Klik menu "Peta" di navigation
3. Peta akan menampilkan semua faskes dengan koordinat

## Testing Peta Interaktif

### 1. Basic Map Testing
1. **Load Peta**: Pastikan peta terbuka dengan benar
2. **Marker Display**: Lihat semua faskes muncul sebagai marker
3. **Legend**: Periksa legend untuk memahami warna dan simbol
4. **Zoom/Pan**: Test zoom in/out dan pan peta

### 2. Marker Interaction
1. **Click Markers**: Klik marker faskes untuk popup
2. **Popup Content**: Periksa informasi dalam popup
3. **Details Panel**: Klik marker untuk membuka panel detail
4. **Close Panel**: Test tombol close pada panel

### 3. Rujukan Lines Testing
1. **Toggle Lines**: Test checkbox "Tampilkan Garis Rujukan"
2. **Line Colors**: Periksa warna garis sesuai status
3. **Line Popup**: Klik garis untuk detail rujukan
4. **Line Visibility**: Pastikan garis muncul/hilang sesuai toggle

### 4. Realtime Testing
1. **Connection Status**: Lihat status koneksi realtime
2. **Live Updates**: Buat rujukan baru dan lihat update di peta
3. **Status Changes**: Update status rujukan dan lihat perubahan warna garis

## Data Testing

### Sample Faskes Data
Database sudah berisi 8 faskes dengan koordinat Surabaya:
- **RSUD Dr. Soetomo**: Koordinat (-7.2575, 112.7521)
- **Puskesmas Kenjeran**: Koordinat (-7.2456, 112.7890)
- **Puskesmas Gubeng**: Koordinat (-7.2654, 112.7456)
- **Klinik Sejahtera**: Koordinat (-7.2700, 112.7400)
- **RSUD Haji**: Koordinat (-7.2800, 112.7800)
- **Puskesmas Wonokromo**: Koordinat (-7.2900, 112.7300)
- **Klinik Medika**: Koordinat (-7.2600, 112.7350)
- **Puskesmas Tambaksari**: Koordinat (-7.2500, 112.7500)

### Sample Rujukan Data
Database berisi 5 rujukan untuk testing:
- Rujukan antar faskes dengan berbagai status
- Garis rujukan dengan warna berbeda
- Data untuk testing popup dan detail

## Map Features

### Custom Icons
```javascript
const createCustomIcon = (type) => {
  const iconColors = {
    'RSUD': '#1976d2',
    'Puskesmas': '#388e3c',
    'Klinik': '#f57c00'
  };
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${iconColors[type]}">${type.charAt(0)}</div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};
```

### Status Colors
```javascript
const getStatusColor = (status) => {
  const colors = {
    'pending': '#ffc107',
    'diterima': '#28a745',
    'ditolak': '#dc3545',
    'selesai': '#17a2b8'
  };
  return colors[status] || '#666';
};
```

### Realtime Updates
```javascript
useEffect(() => {
  if (socket) {
    socket.on('rujukan-baru', (data) => {
      fetchRujukan(); // Refresh data
    });
    
    socket.on('status-update', (data) => {
      fetchRujukan(); // Refresh data
    });
  }
}, [socket]);
```

## Performance Considerations

### Map Optimization
- **Lazy Loading**: Marker hanya render untuk faskes dengan koordinat valid
- **Efficient Rendering**: Re-render hanya saat data berubah
- **Memory Management**: Cleanup event listeners

### Data Management
- **Filtered Data**: Hanya faskes dengan koordinat yang ditampilkan
- **Cached Data**: Data disimpan dalam state untuk performa
- **Optimized Queries**: API calls yang efisien

## Browser Compatibility

### Supported Features
- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Leaflet.js support
- ✅ WebSocket support untuk realtime
- ✅ CSS Grid/Flexbox untuk layout

### Fallbacks
- **No Coordinates**: Faskes tanpa koordinat tidak ditampilkan
- **No Internet**: Peta tetap berfungsi dengan data lokal
- **Mobile**: Responsive design untuk semua ukuran layar

## Langkah Selanjutnya

Setelah Sprint 4 selesai, kita akan lanjut ke:
1. **Sprint 5**: Fitur Pendukung & UI Polish
   - Manajemen tempat tidur
   - Laporan dan statistik detail
   - Export data
   - Search dan filter advanced

## Troubleshooting

### Common Issues

1. **Map Not Loading**
   - Pastikan internet connection untuk OpenStreetMap tiles
   - Check browser console untuk errors
   - Verify Leaflet.js installation

2. **Markers Not Showing**
   - Pastikan faskes memiliki koordinat valid
   - Check database untuk data latitude/longitude
   - Verify coordinate format (decimal degrees)

3. **Lines Not Displaying**
   - Pastikan ada rujukan dengan faskes_asal_id dan faskes_tujuan_id
   - Check toggle "Tampilkan Garis Rujukan"
   - Verify faskes memiliki koordinat

4. **Realtime Not Working**
   - Check Socket.IO connection
   - Verify backend berjalan
   - Check browser console untuk connection errors

### Debug Mode

1. **Map Debug**:
   ```javascript
   // Check map instance
   console.log('Map ref:', mapRef.current);
   
   // Check faskes data
   console.log('Faskes:', faskes);
   
   // Check rujukan data
   console.log('Rujukan:', rujukan);
   ```

2. **Coordinate Debug**:
   ```javascript
   // Check valid coordinates
   const validFaskes = faskes.filter(f => f.latitude && f.longitude);
   console.log('Valid faskes:', validFaskes);
   ```

### Development Tips

1. **Testing Coordinates**:
   - Gunakan Google Maps untuk verifikasi koordinat
   - Test dengan koordinat yang berbeda
   - Pastikan format decimal degrees

2. **Performance Testing**:
   - Test dengan banyak faskes
   - Monitor memory usage
   - Check rendering performance

3. **Mobile Testing**:
   - Test di berbagai ukuran layar
   - Test touch interactions
   - Verify responsive behavior
