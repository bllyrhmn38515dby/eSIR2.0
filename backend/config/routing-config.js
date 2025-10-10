// Routing Configuration - PERMANENT SETTINGS
// File ini berisi konfigurasi routing yang sudah dioptimasi dan tidak boleh diubah
// kecuali ada perubahan requirement yang signifikan

const ROUTING_CONFIG = {
  // API Priority Order (tidak boleh diubah urutannya)
  apiPriority: [
    'googleMaps',      // Prioritas 1: Google Directions API (real-time traffic)
    'openRouteService', // Prioritas 2: OpenRouteService (fallback)
    'mapbox',         // Prioritas 3: Mapbox (alternatif)
    'fallback'        // Prioritas 4: Algorithm fallback
  ],

  // Google Directions API Settings (OPTIMAL)
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
  },

  // OpenRouteService Settings (FALLBACK)
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
  },

  // Mapbox Settings (ALTERNATIVE)
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
  },

  // Fallback Algorithm Settings
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
  },

  // UI Settings
  ui: {
    showTrafficInfo: true,             // Tampilkan info traffic
    showDelayInfo: true,              // Tampilkan info delay
    showRealTimeStatus: true,         // Tampilkan status real-time
    showApiProvider: true,            // Tampilkan provider API
    trafficColors: {
      heavy: '#ff4444',               // Merah untuk macet
      moderate: '#ffaa00',            // Kuning untuk sedang
      light: '#44aa44',               // Hijau untuk lancar
      normal: '#666666'               // Abu-abu untuk normal
    }
  },

  // Performance Settings
  performance: {
    cacheRoutes: true,                // Cache rute untuk performa
    cacheTimeout: 300000,            // 5 menit cache timeout
    maxRetries: 3,                   // Maximum 3 retry
    timeoutMs: 10000,                // 10 detik timeout
    concurrentRequests: 5             // Maximum 5 request bersamaan
  },

  // Security Settings
  security: {
    validateCoordinates: true,        // Validasi koordinat
    maxDistanceKm: 1000,             // Maximum 1000km
    rateLimitPerMinute: 60,          // 60 requests per menit
    logAllRequests: true             // Log semua request
  }
};

// Export untuk digunakan di file lain
module.exports = ROUTING_CONFIG;
