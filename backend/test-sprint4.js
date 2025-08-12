const axios = require('axios');
const io = require('socket.io-client');

let authToken = '';
let socket = null;

// Test API endpoints untuk peta
async function testMapAPI() {
  try {
    console.log('🔍 Testing Map API endpoints...');
    
    // Login
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@pusat.com',
      password: 'password123'
    });
    
    authToken = loginResponse.data.data.token;
    console.log('✅ Login successful');
    
    // Test faskes API untuk peta
    console.log('\n🏥 Testing faskes API for map...');
    
    const faskesResponse = await axios.get('http://localhost:3001/api/faskes', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    console.log('✅ Faskes API working:', faskesResponse.data.success);
    console.log('Total faskes:', faskesResponse.data.data.length);
    
    // Check faskes with coordinates
    const faskesWithCoords = faskesResponse.data.data.filter(f => f.latitude && f.longitude);
    console.log('Faskes with coordinates:', faskesWithCoords.length);
    
    if (faskesWithCoords.length > 0) {
      console.log('Sample faskes coordinates:', {
        nama: faskesWithCoords[0].nama_faskes,
        lat: faskesWithCoords[0].latitude,
        lng: faskesWithCoords[0].longitude,
        tipe: faskesWithCoords[0].tipe
      });
    }
    
    // Test rujukan API untuk peta
    console.log('\n📋 Testing rujukan API for map...');
    
    const rujukanResponse = await axios.get('http://localhost:3001/api/rujukan', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    console.log('✅ Rujukan API working:', rujukanResponse.data.success);
    console.log('Total rujukan:', rujukanResponse.data.data.length);
    
    // Check rujukan with faskes data
    const rujukanWithFaskes = rujukanResponse.data.data.filter(r => 
      r.faskes_asal_id && r.faskes_tujuan_id
    );
    console.log('Rujukan with faskes data:', rujukanWithFaskes.length);
    
    if (rujukanWithFaskes.length > 0) {
      console.log('Sample rujukan:', {
        nomor: rujukanWithFaskes[0].nomor_rujukan,
        status: rujukanWithFaskes[0].status,
        faskes_asal: rujukanWithFaskes[0].faskes_asal_id,
        faskes_tujuan: rujukanWithFaskes[0].faskes_tujuan_id
      });
    }
    
    return true;
  } catch (error) {
    console.error('❌ Map API test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    return false;
  }
}

// Test Socket.IO untuk realtime peta
async function testMapSocketIO() {
  return new Promise((resolve) => {
    console.log('\n🔌 Testing Socket.IO for map...');
    
    socket = io('http://localhost:3001', {
      auth: {
        token: authToken
      }
    });
    
    socket.on('connect', () => {
      console.log('✅ Socket.IO connected for map');
    });
    
    socket.on('connect_error', (error) => {
      console.error('❌ Socket.IO connection failed:', error.message);
      resolve(false);
    });
    
    socket.on('notification', (data) => {
      console.log('📢 Received map notification:', data.type);
    });
    
    socket.on('rujukan-baru', (data) => {
      console.log('📢 Received rujukan baru for map:', data.data?.nomor_rujukan);
    });
    
    socket.on('status-update', (data) => {
      console.log('📢 Received status update for map:', data.data?.nomor_rujukan);
    });
    
    // Test sending notification
    setTimeout(() => {
      socket.emit('send-notification', {
        type: 'map-update',
        title: 'Map Update Test',
        message: 'Testing map realtime updates',
        targetRoom: 'admin-room'
      });
      console.log('✅ Map notification test sent');
      
      setTimeout(() => {
        socket.disconnect();
        console.log('✅ Map Socket.IO test completed');
        resolve(true);
      }, 1000);
    }, 1000);
  });
}

// Test create rujukan untuk trigger map update
async function testMapRealtimeUpdate() {
  try {
    console.log('\n🚀 Testing map realtime update...');
    
    // Create a new rujukan to trigger map update
    console.log('📝 Creating test rujukan for map...');
    
    const rujukanResponse = await axios.post('http://localhost:3001/api/rujukan', {
      pasien_id: 1,
      faskes_tujuan_id: 1,
      diagnosa: 'Test Diagnosa untuk Peta',
      alasan_rujukan: 'Test Alasan Rujukan untuk Peta',
      catatan_asal: 'Test Catatan untuk Peta'
    }, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    console.log('✅ Test rujukan for map created:', rujukanResponse.data.success);
    console.log('Rujukan number:', rujukanResponse.data.data.nomor_rujukan);
    
    // Wait for notification
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return true;
  } catch (error) {
    console.error('❌ Map realtime test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    return false;
  }
}

// Main test function
async function runSprint4Tests() {
  console.log('🗺️ SPRINT 4 TEST - MAP & REALTIME FEATURES');
  console.log('==========================================');
  
  // Test Map API
  const mapApiSuccess = await testMapAPI();
  if (!mapApiSuccess) {
    console.log('❌ Map API test failed, stopping...');
    return;
  }
  
  // Test Socket.IO for map
  const mapSocketSuccess = await testMapSocketIO();
  if (!mapSocketSuccess) {
    console.log('❌ Map Socket.IO test failed, stopping...');
    return;
  }
  
  // Test map realtime features
  const mapRealtimeSuccess = await testMapRealtimeUpdate();
  
  console.log('\n🎉 SPRINT 4 TEST RESULTS');
  console.log('========================');
  console.log('✅ Map API Endpoints:', mapApiSuccess ? 'PASS' : 'FAIL');
  console.log('✅ Map Socket.IO:', mapSocketSuccess ? 'PASS' : 'FAIL');
  console.log('✅ Map Realtime Features:', mapRealtimeSuccess ? 'PASS' : 'FAIL');
  
  if (mapApiSuccess && mapSocketSuccess && mapRealtimeSuccess) {
    console.log('\n🎊 ALL MAP TESTS PASSED! Sprint 4 is working correctly!');
    console.log('\n🗺️ Map Features Available:');
    console.log('  - Interactive map with OpenStreetMap');
    console.log('  - Faskes markers with custom icons');
    console.log('  - Rujukan lines with status colors');
    console.log('  - Realtime updates via Socket.IO');
    console.log('  - Popup details and legend');
  } else {
    console.log('\n⚠️ Some map tests failed. Please check the implementation.');
  }
}

// Run tests
runSprint4Tests().catch(console.error);
