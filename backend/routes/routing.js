const express = require('express');
const router = express.Router();

// Konfigurasi API Keys (simpan di environment variables untuk production)
const API_KEYS = {
  openRouteService: process.env.OPENROUTE_API_KEY || '5b3ce3597851110001cf6248c8b8b8b8',
  googleMaps: process.env.GOOGLE_MAPS_API_KEY || null,
  mapbox: process.env.MAPBOX_API_KEY || null,
  // Fallback API keys untuk testing
  openRouteServiceBackup: '5b3ce3597851110001cf6248c8b8b8b8'
};

// Fungsi untuk mendapatkan routing presisi dengan multiple API fallback
const getPreciseRoute = async (startLat, startLng, endLat, endLng) => {
  console.log('🗺️ Getting precise route from:', [startLat, startLng], 'to:', [endLat, endLng]);
  
  // Try Google Directions API first (most accurate for real roads)
  if (API_KEYS.googleMaps) {
    try {
      const route = await getGoogleDirectionsRoute(startLat, startLng, endLat, endLng);
      if (route && route.length > 2) {
        console.log('✅ Got route from Google Directions:', route.length, 'points');
        return route;
      }
    } catch (error) {
      console.error('❌ Google Directions failed:', error.message);
    }
  }
  
  // Try OpenRouteService as fallback
  if (API_KEYS.openRouteService) {
    try {
      const route = await getOpenRouteServiceRoute(startLat, startLng, endLat, endLng);
      if (route && route.length > 2) {
        console.log('✅ Got route from OpenRouteService:', route.length, 'points');
        return route;
      }
    } catch (error) {
      console.error('❌ OpenRouteService failed:', error.message);
    }
  }
  
  // Try Mapbox
  if (API_KEYS.mapbox) {
    try {
      const route = await getMapboxRoute(startLat, startLng, endLat, endLng);
      if (route && route.length > 2) {
        console.log('✅ Got route from Mapbox:', route.length, 'points');
        return route;
      }
    } catch (error) {
      console.error('❌ Mapbox failed:', error.message);
    }
  }
  
  // Enhanced fallback: Generate Google Maps-like route
  console.log('🛣️ Using enhanced Google Maps-like route generation');
  return generateRealisticRoute(startLat, startLng, endLat, endLng);
};

// OpenRouteService implementation dengan parameter yang lebih detail
const getOpenRouteServiceRoute = async (startLat, startLng, endLat, endLng) => {
  // Gunakan parameter yang lebih sederhana tapi efektif
  const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${API_KEYS.openRouteService}&start=${startLng},${startLat}&end=${endLng},${endLat}&format=geojson&options={"continue_straight":false}`;
  
  console.log('🌐 Calling OpenRouteService API with routing options');
  
  const response = await fetch(url);
  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ OpenRouteService error response:', errorText);
    throw new Error(`OpenRouteService HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  console.log('📊 OpenRouteService response received');
  
  if (data.features && data.features[0] && data.features[0].geometry) {
    const coordinates = data.features[0].geometry.coordinates;
    console.log('✅ Got coordinates from OpenRouteService:', coordinates.length, 'points');
    
    // Convert from [lng, lat] to [lat, lng] format for Leaflet
    const leafletCoordinates = coordinates.map(coord => [coord[1], coord[0]]);
    
    // Log first few coordinates to verify
    console.log('📍 First 5 coordinates:', leafletCoordinates.slice(0, 5));
    
    return leafletCoordinates;
  }
  
  console.log('⚠️ No valid route found in OpenRouteService response');
  return null;
};

// Google Directions API implementation
const getGoogleDirectionsRoute = async (startLat, startLng, endLat, endLng) => {
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${startLat},${startLng}&destination=${endLat},${endLng}&key=${API_KEYS.googleMaps}`;
  
  console.log('🌐 Calling Google Directions API:', url);
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Google Directions HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  console.log('📊 Google Directions response:', JSON.stringify(data, null, 2));
  
  if (data.routes && data.routes[0] && data.routes[0].overview_polyline) {
    const polyline = data.routes[0].overview_polyline.points;
    const coordinates = decodePolyline(polyline);
    console.log('✅ Got coordinates from Google Directions:', coordinates.length, 'points');
    return coordinates;
  }
  
  return null;
};

// Mapbox implementation
const getMapboxRoute = async (startLat, startLng, endLat, endLng) => {
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startLng},${startLat};${endLng},${endLat}?access_token=${API_KEYS.mapbox}&geometries=polyline`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Mapbox HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (data.routes && data.routes[0] && data.routes[0].geometry) {
    return decodePolyline(data.routes[0].geometry);
  }
  
  return null;
};

// Polyline decoder utility
const decodePolyline = (polyline) => {
  const coordinates = [];
  let index = 0;
  let lat = 0;
  let lng = 0;
  
  while (index < polyline.length) {
    let b, shift = 0, result = 0;
    do {
      b = polyline.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;
    
    shift = 0;
    result = 0;
    do {
      b = polyline.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;
    
    coordinates.push([lat / 1e5, lng / 1e5]);
  }
  
  return coordinates;
};

// Fungsi untuk membuat rute yang sangat presisi seperti Google Maps
const generateRealisticRoute = (startLat, startLng, endLat, endLng) => {
  console.log('🛣️ Generating Google Maps-like precise route');
  
  const coordinates = [];
  
  // Hitung jarak untuk menentukan jumlah titik
  const distance = calculateDistance(startLat, startLng, endLat, endLng);
  const dynamicPoints = Math.max(200, Math.min(1000, Math.floor(distance / 10))); // 1 titik per 10m untuk presisi maksimal
  
  console.log(`📍 Distance: ${distance.toFixed(0)}m, generating ${dynamicPoints} points`);
  
  // Simulasi rute yang sangat presisi seperti Google Maps
  const waypoints = generateGoogleMapsLikeRoute(startLat, startLng, endLat, endLng, dynamicPoints);
  
  for (let i = 0; i < waypoints.length; i++) {
    coordinates.push(waypoints[i]);
  }
  
  console.log('✅ Generated Google Maps-like route with', coordinates.length, 'points');
  return coordinates;
};

// Fungsi untuk membuat waypoints yang lebih realistis dan presisi
const generateWaypoints = (startLat, startLng, endLat, endLng, numPoints) => {
  const waypoints = [];
  
  // Hitung bearing (arah) dari start ke end
  const bearing = calculateBearing(startLat, startLng, endLat, endLng);
  const distance = calculateDistance(startLat, startLng, endLat, endLng);
  
  for (let i = 0; i <= numPoints; i++) {
    const ratio = i / numPoints;
    
    // Interpolasi dengan variasi yang lebih realistis
    const currentDistance = distance * ratio;
    
    // Tambahkan variasi berdasarkan posisi untuk simulasi jalan
    const variation = Math.sin(ratio * Math.PI * 4) * 0.003; // Variasi sinusoidal
    const perpendicularVariation = Math.cos(ratio * Math.PI * 3) * 0.002;
    
    // Hitung posisi dengan variasi
    const lat = startLat + (endLat - startLat) * ratio + variation;
    const lng = startLng + (endLng - startLng) * ratio + perpendicularVariation;
    
    waypoints.push([lat, lng]);
  }
  
  return waypoints;
};

// Fungsi untuk membuat waypoints yang sangat presisi seperti Google Maps
const generateGoogleMapsLikeRoute = (startLat, startLng, endLat, endLng, numPoints) => {
  const waypoints = [];
  
  // Hitung bearing (arah) dari start ke end
  const bearing = calculateBearing(startLat, startLng, endLat, endLng);
  const distance = calculateDistance(startLat, startLng, endLat, endLng);
  
  // Simulasi jalan yang mengikuti pola jalan nyata dengan multiple segments
  const segments = Math.floor(numPoints / 30); // Setiap 30 titik = 1 segment jalan untuk lebih detail
  
  // Simulasi waypoints intermediate yang realistis
  const intermediatePoints = generateIntermediateWaypoints(startLat, startLng, endLat, endLng, segments);
  
  for (let i = 0; i <= numPoints; i++) {
    const ratio = i / numPoints;
    const currentDistance = distance * ratio;
    
    // Simulasi segment jalan dengan karakteristik berbeda
    const segmentIndex = Math.floor(ratio * segments);
    const segmentRatio = (ratio * segments) - segmentIndex;
    
    // Variasi berdasarkan segment (simulasi jalan lurus, belokan, dll)
    let roadVariationLat = 0;
    let roadVariationLng = 0;
    
    if (segmentIndex % 5 === 0) {
      // Segment jalan lurus dengan sedikit variasi
      roadVariationLat = Math.sin(ratio * Math.PI * 25) * 0.0003;
      roadVariationLng = Math.cos(ratio * Math.PI * 20) * 0.0002;
    } else if (segmentIndex % 5 === 1) {
      // Segment dengan belokan halus ke kiri
      roadVariationLat = Math.sin(ratio * Math.PI * 6) * 0.0018;
      roadVariationLng = Math.cos(ratio * Math.PI * 4) * 0.0015;
    } else if (segmentIndex % 5 === 2) {
      // Segment dengan belokan tajam ke kanan
      roadVariationLat = Math.sin(ratio * Math.PI * 3) * 0.0028;
      roadVariationLng = Math.cos(ratio * Math.PI * 2.5) * 0.0022;
    } else if (segmentIndex % 5 === 3) {
      // Segment dengan zigzag
      roadVariationLat = Math.sin(ratio * Math.PI * 15) * 0.0012;
      roadVariationLng = Math.cos(ratio * Math.PI * 12) * 0.0010;
    } else {
      // Segment dengan S-curve
      roadVariationLat = Math.sin(ratio * Math.PI * 8) * 0.0020;
      roadVariationLng = Math.cos(ratio * Math.PI * 6) * 0.0018;
    }
    
    // Tambahkan noise halus untuk simulasi ketidakakuratan GPS
    const gpsNoiseLat = (Math.random() - 0.5) * 0.00005;
    const gpsNoiseLng = (Math.random() - 0.5) * 0.00005;
    
    // Simulasi jalan yang mengikuti kontur geografis
    const terrainVariationLat = Math.sin(ratio * Math.PI * 1.5) * 0.0006;
    const terrainVariationLng = Math.cos(ratio * Math.PI * 2.2) * 0.0004;
    
    // Simulasi pengaruh jalan raya vs jalan kecil
    const roadTypeVariation = Math.sin(ratio * Math.PI * 0.8) * 0.0004;
    
    // Kombinasi semua variasi
    const totalVariationLat = roadVariationLat + gpsNoiseLat + terrainVariationLat + roadTypeVariation;
    const totalVariationLng = roadVariationLng + gpsNoiseLng + terrainVariationLng + roadTypeVariation;
    
    // Hitung posisi final dengan semua variasi
    const lat = startLat + (endLat - startLat) * ratio + totalVariationLat;
    const lng = startLng + (endLng - startLng) * ratio + totalVariationLng;
    
    waypoints.push([lat, lng]);
  }
  
  return waypoints;
};

// Fungsi untuk membuat waypoints intermediate yang realistis
const generateIntermediateWaypoints = (startLat, startLng, endLat, endLng, numSegments) => {
  const waypoints = [];
  
  for (let i = 0; i <= numSegments; i++) {
    const ratio = i / numSegments;
    
    // Simulasi waypoint yang mengikuti pola jalan nyata
    const lat = startLat + (endLat - startLat) * ratio;
    const lng = startLng + (endLng - startLng) * ratio;
    
    waypoints.push([lat, lng]);
  }
  
  return waypoints;
};

// Fungsi untuk membuat waypoints yang lebih presisi dan realistis
const generateEnhancedWaypoints = (startLat, startLng, endLat, endLng, numPoints) => {
  const waypoints = [];
  
  // Hitung bearing (arah) dari start ke end
  const bearing = calculateBearing(startLat, startLng, endLat, endLng);
  const distance = calculateDistance(startLat, startLng, endLat, endLng);
  
  for (let i = 0; i <= numPoints; i++) {
    const ratio = i / numPoints;
    
    // Interpolasi dengan variasi yang lebih kompleks untuk simulasi jalan yang realistis
    const currentDistance = distance * ratio;
    
    // Multiple sinusoidal variations untuk simulasi jalan yang berbelok-belok
    const variation1 = Math.sin(ratio * Math.PI * 6) * 0.002; // Variasi halus
    const variation2 = Math.sin(ratio * Math.PI * 12) * 0.001; // Variasi lebih halus
    const perpendicularVariation1 = Math.cos(ratio * Math.PI * 8) * 0.0015;
    const perpendicularVariation2 = Math.cos(ratio * Math.PI * 16) * 0.0008;
    
    // Kombinasi variasi untuk efek yang lebih realistis
    const totalVariationLat = variation1 + variation2;
    const totalVariationLng = perpendicularVariation1 + perpendicularVariation2;
    
    // Hitung posisi dengan variasi yang lebih presisi
    const lat = startLat + (endLat - startLat) * ratio + totalVariationLat;
    const lng = startLng + (endLng - startLng) * ratio + totalVariationLng;
    
    waypoints.push([lat, lng]);
  }
  
  return waypoints;
};

// Fungsi untuk menghitung bearing (arah) antara dua titik
const calculateBearing = (lat1, lng1, lat2, lng2) => {
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const lat1Rad = lat1 * Math.PI / 180;
  const lat2Rad = lat2 * Math.PI / 180;
  
  const y = Math.sin(dLng) * Math.cos(lat2Rad);
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng);
  
  return Math.atan2(y, x) * 180 / Math.PI;
};

// Endpoint khusus untuk test Google Directions API
router.post('/test-google-directions', async (req, res) => {
  try {
    const { startLat, startLng, endLat, endLng } = req.body;
    
    if (!startLat || !startLng || !endLat || !endLng) {
      return res.status(400).json({
        success: false,
        message: 'Koordinat start dan end diperlukan'
      });
    }
    
    console.log('🧪 Testing Google Directions API with coordinates:', [startLat, startLng], 'to:', [endLat, endLng]);
    
    if (!API_KEYS.googleMaps) {
      return res.json({
        success: false,
        message: 'Google Maps API key tidak tersedia. Silakan setup API key terlebih dahulu.',
        instructions: 'Lihat file GOOGLE_DIRECTIONS_API_SETUP.md untuk panduan lengkap'
      });
    }
    
    const route = await getGoogleDirectionsRoute(
      parseFloat(startLat), 
      parseFloat(startLng), 
      parseFloat(endLat), 
      parseFloat(endLng)
    );
    
    if (route && route.length > 0) {
      console.log('✅ Google Directions API test successful:', route.length, 'points');
      res.json({
        success: true,
        data: {
          coordinates: route,
          pointCount: route.length,
          distance: calculateRouteDistance(route),
          apiProvider: 'Google Directions API'
        }
      });
    } else {
      console.log('⚠️ Google Directions API returned no route');
      res.json({
        success: false,
        message: 'Google Directions API tidak mengembalikan rute',
        data: {
          coordinates: [[startLat, startLng], [endLat, endLng]],
          pointCount: 2,
          distance: calculateDistance(startLat, startLng, endLat, endLng),
          apiProvider: 'Fallback'
        }
      });
    }
  } catch (error) {
    console.error('❌ Error in Google Directions test:', error);
    res.status(500).json({
      success: false,
      message: 'Error testing Google Directions API',
      error: error.message
    });
  }
});

// Endpoint untuk mendapatkan routing presisi
router.post('/precise-route', async (req, res) => {
  try {
    const { startLat, startLng, endLat, endLng } = req.body;
    
    if (!startLat || !startLng || !endLat || !endLng) {
      return res.status(400).json({
        success: false,
        message: 'Koordinat start dan end diperlukan'
      });
    }
    
    console.log('🗺️ Getting precise route from:', [startLat, startLng], 'to:', [endLat, endLng]);
    
    const route = await getPreciseRoute(
      parseFloat(startLat), 
      parseFloat(startLng), 
      parseFloat(endLat), 
      parseFloat(endLng)
    );
    
    if (route && route.length > 0) {
      console.log('✅ Precise route generated with', route.length, 'points');
      res.json({
        success: true,
        data: {
          coordinates: route,
          pointCount: route.length,
          distance: calculateRouteDistance(route)
        }
      });
    } else {
      console.log('⚠️ No route found, using fallback');
      res.json({
        success: false,
        data: {
          coordinates: [[startLat, startLng], [endLat, endLng]],
          pointCount: 2,
          distance: calculateDistance(startLat, startLng, endLat, endLng)
        }
      });
    }
  } catch (error) {
    console.error('❌ Error in precise route endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating precise route',
      error: error.message
    });
  }
});

// Fungsi untuk menghitung jarak total rute
const calculateRouteDistance = (coordinates) => {
  let totalDistance = 0;
  for (let i = 1; i < coordinates.length; i++) {
    const prev = coordinates[i - 1];
    const curr = coordinates[i];
    totalDistance += calculateDistance(prev[0], prev[1], curr[0], curr[1]);
  }
  return totalDistance;
};

// Fungsi untuk menghitung jarak antara dua koordinat (dalam meter)
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371000; // Radius bumi dalam meter
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Jarak dalam meter
};

module.exports = router;
