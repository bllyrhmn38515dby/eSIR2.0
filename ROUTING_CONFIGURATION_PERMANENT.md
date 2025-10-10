# 🗺️ ROUTING CONFIGURATION PERMANENT SETTINGS

## ⚠️ **PERINGATAN PENTING**
**File ini berisi konfigurasi routing yang sudah dioptimasi dan TIDAK BOLEH DIUBAH**
kecuali ada perubahan requirement yang signifikan dari stakeholder.

---

## 📋 **KONFIGURASI PERMANEN**

### 🔧 **API Priority Order (TIDAK BOLEH DIUBAH URUTANNYA)**
```javascript
apiPriority: [
  'googleMaps',      // Prioritas 1: Google Directions API (real-time traffic)
  'openRouteService', // Prioritas 2: OpenRouteService (fallback)
  'mapbox',         // Prioritas 3: Mapbox (alternatif)
  'fallback'        // Prioritas 4: Algorithm fallback
]
```

### 🌐 **Google Directions API Settings (OPTIMAL)**
```javascript
googleMaps: {
  enabled: true,
  parameters: {
    departure_time: 'now',           // Real-time traffic
    traffic_model: 'best_guess',     // Prediksi traffic terbaik
    avoid: 'tolls',                  // Hindari tol untuk ambulans
    mode: 'driving',                 // Mode mengemudi
    alternatives: false,             // Satu rute optimal saja
    optimize: true                   // Optimasi rute
  },
  features: {
    realTimeTraffic: true,           // Traffic real-time
    roadConditions: true,            // Kondisi jalan
    delayCalculation: true,           // Kalkulasi delay
    trafficLevelDetection: true      // Deteksi level traffic
  }
}
```

### 🛣️ **OpenRouteService Settings (FALLBACK)**
```javascript
openRouteService: {
  enabled: true,
  parameters: {
    format: 'geojson',               // Format GeoJSON
    options: {
      continue_straight: false       // Tidak lurus terus
    }
  },
  features: {
    realTimeTraffic: false,          // Tidak ada traffic real-time
    roadConditions: false,           // Tidak ada kondisi jalan real-time
    delayCalculation: false,          // Tidak ada kalkulasi delay
    trafficLevelDetection: false     // Tidak ada deteksi traffic
  }
}
```

### 🎨 **Mapbox Settings (ALTERNATIVE)**
```javascript
mapbox: {
  enabled: true,
  parameters: {
    geometries: 'polyline',          // Format polyline
    overview: 'full',                // Overview penuh
    steps: false                     // Tidak perlu step-by-step
  },
  features: {
    realTimeTraffic: false,          // Tidak ada traffic real-time
    roadConditions: false,           // Tidak ada kondisi jalan real-time
    delayCalculation: false,          // Tidak ada kalkulasi delay
    trafficLevelDetection: false     // Tidak ada deteksi traffic
  }
}
```

### 🔄 **Fallback Algorithm Settings**
```javascript
fallback: {
  enabled: true,
  parameters: {
    pointsPerKm: 2,                  // 2 titik per km
    minPoints: 20,                   // Minimum 20 titik
    maxPoints: 200,                  // Maximum 200 titik
    variation: 0.003,                // Variasi untuk simulasi jalan
    perpendicularVariation: 0.002    // Variasi tegak lurus
  },
  features: {
    realTimeTraffic: false,          // Tidak ada traffic real-time
    roadConditions: false,           // Tidak ada kondisi jalan real-time
    delayCalculation: false,          // Tidak ada kalkulasi delay
    trafficLevelDetection: false     // Tidak ada deteksi traffic
  }
}
```

---

## 🎯 **UI SETTINGS**

### 🚦 **Traffic Status Colors**
```javascript
trafficColors: {
  heavy: '#ff4444',               // Merah untuk macet
  moderate: '#ffaa00',            // Kuning untuk sedang
  light: '#44aa44',               // Hijau untuk lancar
  normal: '#666666'               // Abu-abu untuk normal
}
```

### 📊 **Display Options**
```javascript
ui: {
  showTrafficInfo: true,             // Tampilkan info traffic
  showDelayInfo: true,              // Tampilkan info delay
  showRealTimeStatus: true,         // Tampilkan status real-time
  showApiProvider: true,            // Tampilkan provider API
}
```

---

## ⚡ **PERFORMANCE SETTINGS**

```javascript
performance: {
  cacheRoutes: true,                // Cache rute untuk performa
  cacheTimeout: 300000,            // 5 menit cache timeout
  maxRetries: 3,                   // Maximum 3 retry
  timeoutMs: 10000,                // 10 detik timeout
  concurrentRequests: 5             // Maximum 5 request bersamaan
}
```

---

## 🔒 **SECURITY SETTINGS**

```javascript
security: {
  validateCoordinates: true,        // Validasi koordinat
  maxDistanceKm: 1000,             // Maximum 1000km
  rateLimitPerMinute: 60,          // 60 requests per menit
  logAllRequests: true             // Log semua request
}
```

---

## 📁 **FILE STRUCTURE**

```
backend/
├── config/
│   └── routing-config.js          # Konfigurasi permanen
├── routes/
│   └── routing.js                 # Implementasi routing
└── .env                           # API Keys
```

---

## 🔑 **ENVIRONMENT VARIABLES**

```bash
# API Keys (wajib diisi untuk production)
OPENROUTE_API_KEY=your_openroute_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
MAPBOX_API_KEY=your_mapbox_api_key
```

---

## 🚀 **DEPLOYMENT CHECKLIST**

- [ ] ✅ Konfigurasi permanen sudah dibuat
- [ ] ✅ API Keys sudah diatur di .env
- [ ] ✅ Backend sudah restart dengan konfigurasi baru
- [ ] ✅ Frontend sudah menggunakan konfigurasi permanen
- [ ] ✅ Testing routing dengan semua API provider
- [ ] ✅ Dokumentasi sudah lengkap

---

## 📞 **SUPPORT & MAINTENANCE**

### 🔧 **Jika Perlu Mengubah Konfigurasi:**
1. **Diskusikan dengan stakeholder** terlebih dahulu
2. **Buat backup** konfigurasi lama
3. **Test thoroughly** sebelum deploy
4. **Update dokumentasi** sesuai perubahan
5. **Notify team** tentang perubahan

### 📋 **Monitoring:**
- Monitor API usage dan limits
- Check error logs untuk routing failures
- Monitor performance metrics
- Track user feedback tentang routing accuracy

---

## 🎯 **EXPECTED RESULTS**

Dengan konfigurasi permanen ini, sistem routing eSIR2.0 akan:

✅ **Real-time traffic-aware routing** dengan Google Directions API  
✅ **Fallback mechanism** yang robust dengan OpenRouteService  
✅ **Consistent performance** dengan caching dan retry logic  
✅ **Secure implementation** dengan validation dan rate limiting  
✅ **User-friendly UI** dengan traffic information display  
✅ **Maintainable code** dengan konfigurasi terpusat  

---

**📅 Last Updated:** $(date)  
**👨‍💻 Maintained by:** Development Team  
**📧 Contact:** dev-team@esir2.com  

---

*⚠️ **PERINGATAN:** Jangan mengubah konfigurasi ini tanpa persetujuan stakeholder dan testing yang menyeluruh!*
