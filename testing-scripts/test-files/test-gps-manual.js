const axios = require('axios');
const readline = require('readline');

// Konfigurasi
const BASE_URL = 'http://localhost:3001';
let authToken = null;
let sessionToken = null;
let rujukanId = null;

// Interface untuk input/output
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class ManualGPSTester {
  constructor() {
    this.testResults = {
      gpsAccuracy: [],
      updateSpeed: [],
      etaAccuracy: [],
      errors: []
    };
  }

  async question(prompt) {
    return new Promise((resolve) => {
      rl.question(prompt, resolve);
    });
  }

  async login() {
    console.log('🔐 Login ke sistem...');
    
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, {
        email: 'admin@esir.com',
        password: 'admin123'
      });

      authToken = response.data.data.token;
      console.log('✅ Login berhasil');
      return true;
    } catch (error) {
      console.error('❌ Login gagal:', error.response?.data?.message || error.message);
      return false;
    }
  }

  async createTestRujukan() {
    console.log('📋 Membuat rujukan test...');
    
    try {
      // Ambil data yang diperlukan
      const [pasienResponse, faskesResponse] = await Promise.all([
        axios.get(`${BASE_URL}/api/pasien`, {
          headers: { Authorization: `Bearer ${authToken}` }
        }),
        axios.get(`${BASE_URL}/api/faskes`, {
          headers: { Authorization: `Bearer ${authToken}` }
        })
      ]);

      const pasien = pasienResponse.data.data[0];
      const faskes = faskesResponse.data.data;

      if (!pasien || faskes.length < 2) {
        throw new Error('Data pasien atau faskes tidak cukup');
      }

      const rujukanResponse = await axios.post(`${BASE_URL}/api/rujukan`, {
        pasien_id: pasien.id,
        faskes_tujuan_id: faskes[1].id,
        diagnosa: 'Test GPS Manual',
        alasan_rujukan: 'Testing GPS tracking manual',
        catatan_asal: 'Test manual tracking'
      }, {
        headers: { Authorization: `Bearer ${authToken}` }
      });

      rujukanId = rujukanResponse.data.data.id;
      console.log(`✅ Rujukan test dibuat: ${rujukanResponse.data.data.nomor_rujukan}`);
      return true;
    } catch (error) {
      console.error('❌ Gagal membuat rujukan:', error.response?.data?.message || error.message);
      return false;
    }
  }

  async startTrackingSession() {
    console.log('🎯 Memulai session tracking...');
    
    try {
      const response = await axios.post(`${BASE_URL}/api/tracking/start-session`, {
        rujukan_id: rujukanId,
        device_id: 'Manual-Test-Device'
      }, {
        headers: { Authorization: `Bearer ${authToken}` }
      });

      sessionToken = response.data.data.session_token;
      console.log('✅ Session tracking dimulai');
      return true;
    } catch (error) {
      console.error('❌ Gagal memulai session:', error.response?.data?.message || error.message);
      return false;
    }
  }

  async testGPSAccuracy() {
    console.log('\n📍 Testing GPS Accuracy (< 20m)');
    console.log('Masukkan koordinat GPS untuk testing:');
    
    const testCount = 5;
    
    for (let i = 0; i < testCount; i++) {
      console.log(`\n--- Test ${i + 1}/${testCount} ---`);
      
      const lat = await this.question('Latitude: ');
      const lng = await this.question('Longitude: ');
      const accuracy = await this.question('Akurasi GPS (meter): ');
      
      try {
        const startTime = Date.now();
        
        const response = await axios.post(`${BASE_URL}/api/tracking/update-position`, {
          session_token: sessionToken,
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
          status: 'dalam_perjalanan',
          accuracy: parseFloat(accuracy),
          speed: 35,
          heading: 90
        });

        const updateTime = Date.now() - startTime;
        const isAccurate = parseFloat(accuracy) <= 20;
        
        this.testResults.gpsAccuracy.push({
          testNumber: i + 1,
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
          accuracy: parseFloat(accuracy),
          isAccurate,
          updateTime,
          timestamp: new Date().toISOString()
        });

        console.log(`📍 Test ${i + 1}: Akurasi ${accuracy}m (${isAccurate ? '✅' : '❌'}) - Update: ${updateTime}ms`);
        
        // Tampilkan hasil estimasi
        const estimatedTime = response.data.data.estimated_time;
        const estimatedDistance = response.data.data.estimated_distance;
        console.log(`   Jarak: ${estimatedDistance?.toFixed(2)} km, ETA: ${estimatedTime} menit`);
        
      } catch (error) {
        console.error(`❌ Error test ${i + 1}:`, error.response?.data?.message || error.message);
        this.testResults.errors.push({
          test: 'GPS Accuracy',
          testNumber: i + 1,
          error: error.message
        });
      }
    }
  }

  async testUpdateSpeed() {
    console.log('\n⚡ Testing Update Speed (< 5 detik)');
    console.log('Melakukan 10 update berturut-turut...');
    
    for (let i = 0; i < 10; i++) {
      try {
        const startTime = Date.now();
        
        await axios.post(`${BASE_URL}/api/tracking/update-position`, {
          session_token: sessionToken,
          latitude: -6.5971 + (Math.random() - 0.5) * 0.01,
          longitude: 106.8060 + (Math.random() - 0.5) * 0.01,
          status: 'dalam_perjalanan',
          accuracy: 10,
          speed: 35,
          heading: 90
        });

        const updateTime = Date.now() - startTime;
        const isFast = updateTime <= 5000;
        
        this.testResults.updateSpeed.push({
          testNumber: i + 1,
          updateTime,
          isFast,
          timestamp: new Date().toISOString()
        });

        console.log(`⚡ Update ${i + 1}: ${updateTime}ms (${isFast ? '✅' : '❌'})`);
        
        // Tunggu sebentar
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`❌ Error update ${i + 1}:`, error.response?.data?.message || error.message);
        this.testResults.errors.push({
          test: 'Update Speed',
          testNumber: i + 1,
          error: error.message
        });
      }
    }
  }

  async testETAAccuracy() {
    console.log('\n⏰ Testing ETA Accuracy (> 80%)');
    console.log('Simulasi perjalanan dengan koordinat yang berubah...');
    
    const route = [
      { lat: -6.5971, lng: 106.8060, name: 'Start (Bogor)' },
      { lat: -6.5900, lng: 106.8100, name: 'Checkpoint 1' },
      { lat: -6.5800, lng: 106.8200, name: 'Checkpoint 2' },
      { lat: -6.5700, lng: 106.8300, name: 'Destination' }
    ];

    for (let i = 0; i < route.length; i++) {
      const coord = route[i];
      
      try {
        console.log(`\n📍 ${coord.name}: ${coord.lat}, ${coord.lng}`);
        
        const startTime = Date.now();
        
        const response = await axios.post(`${BASE_URL}/api/tracking/update-position`, {
          session_token: sessionToken,
          latitude: coord.lat,
          longitude: coord.lng,
          status: 'dalam_perjalanan',
          accuracy: 10,
          speed: 40,
          heading: 90
        });

        const updateTime = Date.now() - startTime;
        const estimatedTime = response.data.data.estimated_time;
        const estimatedDistance = response.data.data.estimated_distance;
        
        // Simulasi waktu nyata
        const actualTime = estimatedDistance ? (estimatedDistance / 40) * 60 : 0;
        const timeAccuracy = actualTime > 0 ? Math.min(estimatedTime, actualTime) / Math.max(estimatedTime, actualTime) : 0;
        const isAccurate = timeAccuracy >= 0.8;
        
        this.testResults.etaAccuracy.push({
          location: coord.name,
          estimatedTime,
          actualTime: Math.round(actualTime),
          timeAccuracy,
          estimatedDistance,
          isAccurate,
          updateTime,
          timestamp: new Date().toISOString()
        });

        console.log(`⏰ ETA: ${estimatedTime} min, Actual: ${Math.round(actualTime)} min`);
        console.log(`   Accuracy: ${(timeAccuracy * 100).toFixed(1)}% (${isAccurate ? '✅' : '❌'})`);
        console.log(`   Update time: ${updateTime}ms`);
        
        // Tunggu input user untuk melanjutkan
        if (i < route.length - 1) {
          await this.question('Tekan Enter untuk melanjutkan ke checkpoint berikutnya...');
        }
        
      } catch (error) {
        console.error(`❌ Error testing ${coord.name}:`, error.response?.data?.message || error.message);
        this.testResults.errors.push({
          test: 'ETA Accuracy',
          location: coord.name,
          error: error.message
        });
      }
    }
  }

  async showResults() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 HASIL TESTING MANUAL');
    console.log('='.repeat(60));
    
    // GPS Accuracy
    const accurateGPS = this.testResults.gpsAccuracy.filter(r => r.isAccurate).length;
    const totalGPS = this.testResults.gpsAccuracy.length;
    const gpsAccuracyRate = totalGPS > 0 ? (accurateGPS / totalGPS) * 100 : 0;
    
    console.log('\n📍 GPS ACCURACY (< 20m)');
    console.log(`   Akurasi: ${gpsAccuracyRate.toFixed(1)}% (${accurateGPS}/${totalGPS})`);
    console.log(`   Status: ${gpsAccuracyRate >= 80 ? '✅ PASS' : '❌ FAIL'}`);
    
    // Update Speed
    const fastUpdates = this.testResults.updateSpeed.filter(r => r.isFast).length;
    const totalUpdates = this.testResults.updateSpeed.length;
    const updateSpeedRate = totalUpdates > 0 ? (fastUpdates / totalUpdates) * 100 : 0;
    const avgUpdateTime = totalUpdates > 0 ? 
      this.testResults.updateSpeed.reduce((sum, r) => sum + r.updateTime, 0) / totalUpdates : 0;
    
    console.log('\n⚡ UPDATE SPEED (< 5 detik)');
    console.log(`   Kecepatan: ${updateSpeedRate.toFixed(1)}% (${fastUpdates}/${totalUpdates})`);
    console.log(`   Rata-rata: ${avgUpdateTime.toFixed(0)}ms`);
    console.log(`   Status: ${updateSpeedRate >= 90 ? '✅ PASS' : '❌ FAIL'}`);
    
    // ETA Accuracy
    const accurateETA = this.testResults.etaAccuracy.filter(r => r.isAccurate).length;
    const totalETA = this.testResults.etaAccuracy.length;
    const etaAccuracyRate = totalETA > 0 ? (accurateETA / totalETA) * 100 : 0;
    
    console.log('\n⏰ ETA ACCURACY (> 80%)');
    console.log(`   Akurasi: ${etaAccuracyRate.toFixed(1)}% (${accurateETA}/${totalETA})`);
    console.log(`   Status: ${etaAccuracyRate >= 80 ? '✅ PASS' : '❌ FAIL'}`);
    
    // Overall
    const overallPass = gpsAccuracyRate >= 80 && updateSpeedRate >= 90 && etaAccuracyRate >= 80;
    
    console.log('\n🎯 OVERALL RESULT');
    console.log(`   Status: ${overallPass ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Errors: ${this.testResults.errors.length}`);
    
    // Detail errors
    if (this.testResults.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      this.testResults.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error.test}: ${error.error}`);
      });
    }
  }

  async cleanup() {
    console.log('\n🧹 Cleaning up...');
    
    try {
      if (sessionToken && rujukanId) {
        await axios.post(`${BASE_URL}/api/tracking/end-session/${rujukanId}`, {}, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Session tracking diakhiri');
      }
    } catch (error) {
      console.error('❌ Error cleanup:', error.message);
    }
    
    rl.close();
  }

  async run() {
    console.log('🚀 Manual GPS Tracking Test');
    console.log('='.repeat(40));
    
    try {
      // Login
      if (!(await this.login())) {
        return;
      }
      
      // Buat rujukan test
      if (!(await this.createTestRujukan())) {
        return;
      }
      
      // Mulai session
      if (!(await this.startTrackingSession())) {
        return;
      }
      
      // Menu testing
      while (true) {
        console.log('\n📋 Menu Testing:');
        console.log('1. Test GPS Accuracy');
        console.log('2. Test Update Speed');
        console.log('3. Test ETA Accuracy');
        console.log('4. Tampilkan Hasil');
        console.log('5. Keluar');
        
        const choice = await this.question('\nPilih menu (1-5): ');
        
        switch (choice) {
          case '1':
            await this.testGPSAccuracy();
            break;
          case '2':
            await this.testUpdateSpeed();
            break;
          case '3':
            await this.testETAAccuracy();
            break;
          case '4':
            await this.showResults();
            break;
          case '5':
            await this.cleanup();
            console.log('👋 Testing selesai!');
            return;
          default:
            console.log('❌ Pilihan tidak valid');
        }
      }
      
    } catch (error) {
      console.error('❌ Error:', error.message);
    } finally {
      await this.cleanup();
    }
  }
}

// Run the manual tester
const tester = new ManualGPSTester();
tester.run().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
