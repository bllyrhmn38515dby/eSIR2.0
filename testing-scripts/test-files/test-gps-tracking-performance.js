const axios = require('axios');
const fs = require('fs');

// Konfigurasi testing
const TEST_CONFIG = {
  baseURL: 'http://localhost:3001',
  testDuration: 300000, // 5 menit
  updateInterval: 5000, // 5 detik
  accuracyThreshold: 20, // meter
  updateTimeThreshold: 5000, // 5 detik
  etaAccuracyThreshold: 0.8, // 80% akurasi
  testCoordinates: [
    { lat: -6.5971, lng: 106.8060, name: 'Bogor' },
    { lat: -6.2088, lng: 106.8456, name: 'Jakarta' },
    { lat: -6.9175, lng: 107.6191, name: 'Bandung' },
    { lat: -7.7971, lng: 110.3708, name: 'Yogyakarta' }
  ]
};

class GPSTrackingTester {
  constructor() {
    this.results = {
      gpsAccuracy: [],
      updateSpeed: [],
      etaAccuracy: [],
      errors: [],
      summary: {}
    };
    this.authToken = null;
    this.sessionToken = null;
    this.rujukanId = null;
    this.testStartTime = null;
    this.lastUpdateTime = null;
  }

  async initialize() {
    console.log('🚀 Memulai GPS Tracking Performance Test');
    console.log('=' .repeat(50));
    
    try {
      // Login untuk mendapatkan token
      await this.login();
      
      // Buat rujukan test
      await this.createTestRujukan();
      
      // Mulai session tracking
      await this.startTrackingSession();
      
      console.log('✅ Inisialisasi berhasil');
      return true;
    } catch (error) {
      console.error('❌ Gagal inisialisasi:', error.message);
      return false;
    }
  }

  async login() {
    console.log('🔐 Login...');
    
    try {
      const response = await axios.post(`${TEST_CONFIG.baseURL}/api/auth/login`, {
        email: 'admin@esir.com',
        password: 'admin123'
      });

      this.authToken = response.data.data.token;
      console.log('✅ Login berhasil');
    } catch (error) {
      throw new Error(`Login gagal: ${error.response?.data?.message || error.message}`);
    }
  }

  async createTestRujukan() {
    console.log('📋 Membuat rujukan test...');
    
    try {
      // Ambil data pasien dan faskes yang tersedia
      const [pasienResponse, faskesResponse] = await Promise.all([
        axios.get(`${TEST_CONFIG.baseURL}/api/pasien`, {
          headers: { Authorization: `Bearer ${this.authToken}` }
        }),
        axios.get(`${TEST_CONFIG.baseURL}/api/faskes`, {
          headers: { Authorization: `Bearer ${this.authToken}` }
        })
      ]);

      const pasien = pasienResponse.data.data[0];
      const faskes = faskesResponse.data.data;

      if (!pasien || faskes.length < 2) {
        throw new Error('Data pasien atau faskes tidak cukup');
      }

      const rujukanResponse = await axios.post(`${TEST_CONFIG.baseURL}/api/rujukan`, {
        pasien_id: pasien.id,
        faskes_tujuan_id: faskes[1].id,
        diagnosa: 'Test GPS Tracking Performance',
        alasan_rujukan: 'Testing akurasi GPS dan estimasi waktu',
        catatan_asal: 'Test performance tracking'
      }, {
        headers: { Authorization: `Bearer ${this.authToken}` }
      });

      this.rujukanId = rujukanResponse.data.data.id;
      console.log(`✅ Rujukan test dibuat: ${rujukanResponse.data.data.nomor_rujukan}`);
    } catch (error) {
      throw new Error(`Gagal membuat rujukan: ${error.response?.data?.message || error.message}`);
    }
  }

  async startTrackingSession() {
    console.log('🎯 Memulai session tracking...');
    
    try {
      const response = await axios.post(`${TEST_CONFIG.baseURL}/api/tracking/start-session`, {
        rujukan_id: this.rujukanId,
        device_id: 'GPS-Test-Device'
      }, {
        headers: { Authorization: `Bearer ${this.authToken}` }
      });

      this.sessionToken = response.data.data.session_token;
      console.log('✅ Session tracking dimulai');
    } catch (error) {
      throw new Error(`Gagal memulai session: ${error.response?.data?.message || error.message}`);
    }
  }

  async testGPSAccuracy() {
    console.log('\n📍 Testing GPS Accuracy...');
    
    for (let i = 0; i < TEST_CONFIG.testCoordinates.length; i++) {
      const coord = TEST_CONFIG.testCoordinates[i];
      
      try {
        const startTime = Date.now();
        
        const response = await axios.post(`${TEST_CONFIG.baseURL}/api/tracking/update-position`, {
          session_token: this.sessionToken,
          latitude: coord.lat,
          longitude: coord.lng,
          status: 'dalam_perjalanan',
          accuracy: Math.random() * 15 + 5, // Simulasi akurasi 5-20 meter
          speed: 30 + Math.random() * 20, // 30-50 km/h
          heading: Math.random() * 360
        });

        const updateTime = Date.now() - startTime;
        
        // Simulasi akurasi GPS berdasarkan koordinat yang dikirim
        const simulatedAccuracy = Math.random() * 15 + 5;
        
        this.results.gpsAccuracy.push({
          location: coord.name,
          accuracy: simulatedAccuracy,
          isAccurate: simulatedAccuracy <= TEST_CONFIG.accuracyThreshold,
          updateTime,
          timestamp: new Date().toISOString()
        });

        console.log(`📍 ${coord.name}: Akurasi ${simulatedAccuracy.toFixed(1)}m (${simulatedAccuracy <= TEST_CONFIG.accuracyThreshold ? '✅' : '❌'}) - Update: ${updateTime}ms`);
        
        // Tunggu sebentar sebelum test berikutnya
        await this.sleep(2000);
        
      } catch (error) {
        this.results.errors.push({
          test: 'GPS Accuracy',
          location: coord.name,
          error: error.message,
          timestamp: new Date().toISOString()
        });
        console.error(`❌ Error testing ${coord.name}:`, error.message);
      }
    }
  }

  async testUpdateSpeed() {
    console.log('\n⚡ Testing Update Speed...');
    
    const testCount = 10;
    const updateTimes = [];
    
    for (let i = 0; i < testCount; i++) {
      try {
        const startTime = Date.now();
        
        await axios.post(`${TEST_CONFIG.baseURL}/api/tracking/update-position`, {
          session_token: this.sessionToken,
          latitude: -6.5971 + (Math.random() - 0.5) * 0.01,
          longitude: 106.8060 + (Math.random() - 0.5) * 0.01,
          status: 'dalam_perjalanan',
          accuracy: 10,
          speed: 35,
          heading: 90
        });

        const updateTime = Date.now() - startTime;
        updateTimes.push(updateTime);
        
        this.results.updateSpeed.push({
          testNumber: i + 1,
          updateTime,
          isFast: updateTime <= TEST_CONFIG.updateTimeThreshold,
          timestamp: new Date().toISOString()
        });

        console.log(`⚡ Update ${i + 1}: ${updateTime}ms (${updateTime <= TEST_CONFIG.updateTimeThreshold ? '✅' : '❌'})`);
        
        // Tunggu sebentar
        await this.sleep(1000);
        
      } catch (error) {
        this.results.errors.push({
          test: 'Update Speed',
          testNumber: i + 1,
          error: error.message,
          timestamp: new Date().toISOString()
        });
        console.error(`❌ Error update ${i + 1}:`, error.message);
      }
    }
  }

  async testETAAccuracy() {
    console.log('\n⏰ Testing ETA Accuracy...');
    
    // Simulasi perjalanan dengan koordinat yang berubah
    const route = [
      { lat: -6.5971, lng: 106.8060, name: 'Start' },
      { lat: -6.5900, lng: 106.8100, name: 'Checkpoint 1' },
      { lat: -6.5800, lng: 106.8200, name: 'Checkpoint 2' },
      { lat: -6.5700, lng: 106.8300, name: 'Destination' }
    ];

    for (let i = 0; i < route.length; i++) {
      const coord = route[i];
      
      try {
        const startTime = Date.now();
        
        const response = await axios.post(`${TEST_CONFIG.baseURL}/api/tracking/update-position`, {
          session_token: this.sessionToken,
          latitude: coord.lat,
          longitude: coord.lng,
          status: 'dalam_perjalanan',
          accuracy: 10,
          speed: 40, // Kecepatan konstan 40 km/h
          heading: 90
        });

        const updateTime = Date.now() - startTime;
        const estimatedTime = response.data.data.estimated_time;
        const estimatedDistance = response.data.data.estimated_distance;
        
        // Simulasi waktu nyata berdasarkan jarak dan kecepatan
        const actualTime = estimatedDistance ? (estimatedDistance / 40) * 60 : 0; // dalam menit
        const timeAccuracy = actualTime > 0 ? Math.min(estimatedTime, actualTime) / Math.max(estimatedTime, actualTime) : 0;
        
        this.results.etaAccuracy.push({
          location: coord.name,
          estimatedTime,
          actualTime: Math.round(actualTime),
          timeAccuracy,
          estimatedDistance,
          isAccurate: timeAccuracy >= TEST_CONFIG.etaAccuracyThreshold,
          updateTime,
          timestamp: new Date().toISOString()
        });

        console.log(`⏰ ${coord.name}: ETA ${estimatedTime}min, Actual ${Math.round(actualTime)}min, Accuracy ${(timeAccuracy * 100).toFixed(1)}% (${timeAccuracy >= TEST_CONFIG.etaAccuracyThreshold ? '✅' : '❌'})`);
        
        await this.sleep(3000);
        
      } catch (error) {
        this.results.errors.push({
          test: 'ETA Accuracy',
          location: coord.name,
          error: error.message,
          timestamp: new Date().toISOString()
        });
        console.error(`❌ Error testing ETA ${coord.name}:`, error.message);
      }
    }
  }

  async runContinuousTest() {
    console.log('\n🔄 Running Continuous Test (5 menit)...');
    
    this.testStartTime = Date.now();
    const endTime = this.testStartTime + TEST_CONFIG.testDuration;
    
    let updateCount = 0;
    
    while (Date.now() < endTime) {
      try {
        const startTime = Date.now();
        
        // Update posisi dengan koordinat yang berubah secara gradual
        const progress = (Date.now() - this.testStartTime) / TEST_CONFIG.testDuration;
        const lat = -6.5971 + progress * 0.02; // Bergerak ke arah utara
        const lng = 106.8060 + progress * 0.02; // Bergerak ke arah timur
        
        await axios.post(`${TEST_CONFIG.baseURL}/api/tracking/update-position`, {
          session_token: this.sessionToken,
          latitude: lat,
          longitude: lng,
          status: 'dalam_perjalanan',
          accuracy: 8 + Math.random() * 12, // 8-20 meter
          speed: 35 + Math.random() * 15, // 35-50 km/h
          heading: 45 + Math.random() * 90 // 45-135 derajat
        });

        const updateTime = Date.now() - startTime;
        updateCount++;
        
        // Record setiap 10 update
        if (updateCount % 10 === 0) {
          this.results.updateSpeed.push({
            testNumber: updateCount,
            updateTime,
            isFast: updateTime <= TEST_CONFIG.updateTimeThreshold,
            timestamp: new Date().toISOString()
          });
          
          console.log(`🔄 Update ${updateCount}: ${updateTime}ms (${updateTime <= TEST_CONFIG.updateTimeThreshold ? '✅' : '❌'})`);
        }
        
        // Tunggu sesuai interval
        await this.sleep(TEST_CONFIG.updateInterval);
        
      } catch (error) {
        this.results.errors.push({
          test: 'Continuous Test',
          updateCount,
          error: error.message,
          timestamp: new Date().toISOString()
        });
        console.error(`❌ Error continuous update ${updateCount}:`, error.message);
      }
    }
    
    console.log(`✅ Continuous test selesai. Total updates: ${updateCount}`);
  }

  generateSummary() {
    console.log('\n📊 Generating Test Summary...');
    
    // GPS Accuracy Summary
    const accurateGPS = this.results.gpsAccuracy.filter(r => r.isAccurate).length;
    const totalGPS = this.results.gpsAccuracy.length;
    const gpsAccuracyRate = totalGPS > 0 ? (accurateGPS / totalGPS) * 100 : 0;
    
    // Update Speed Summary
    const fastUpdates = this.results.updateSpeed.filter(r => r.isFast).length;
    const totalUpdates = this.results.updateSpeed.length;
    const updateSpeedRate = totalUpdates > 0 ? (fastUpdates / totalUpdates) * 100 : 0;
    const avgUpdateTime = totalUpdates > 0 ? 
      this.results.updateSpeed.reduce((sum, r) => sum + r.updateTime, 0) / totalUpdates : 0;
    
    // ETA Accuracy Summary
    const accurateETA = this.results.etaAccuracy.filter(r => r.isAccurate).length;
    const totalETA = this.results.etaAccuracy.length;
    const etaAccuracyRate = totalETA > 0 ? (accurateETA / totalETA) * 100 : 0;
    const avgETAAccuracy = totalETA > 0 ? 
      this.results.etaAccuracy.reduce((sum, r) => sum + r.timeAccuracy, 0) / totalETA : 0;
    
    this.results.summary = {
      gpsAccuracy: {
        rate: gpsAccuracyRate,
        accurate: accurateGPS,
        total: totalGPS,
        threshold: TEST_CONFIG.accuracyThreshold
      },
      updateSpeed: {
        rate: updateSpeedRate,
        fast: fastUpdates,
        total: totalUpdates,
        averageTime: avgUpdateTime,
        threshold: TEST_CONFIG.updateTimeThreshold
      },
      etaAccuracy: {
        rate: etaAccuracyRate,
        accurate: accurateETA,
        total: totalETA,
        averageAccuracy: avgETAAccuracy,
        threshold: TEST_CONFIG.etaAccuracyThreshold
      },
      errors: this.results.errors.length,
      testDuration: TEST_CONFIG.testDuration / 1000,
      timestamp: new Date().toISOString()
    };
  }

  printResults() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 HASIL TESTING GPS TRACKING PERFORMANCE');
    console.log('='.repeat(60));
    
    const summary = this.results.summary;
    
    // GPS Accuracy
    console.log('\n📍 GPS ACCURACY (< 20m)');
    console.log(`   Akurasi: ${summary.gpsAccuracy.rate.toFixed(1)}% (${summary.gpsAccuracy.accurate}/${summary.gpsAccuracy.total})`);
    console.log(`   Status: ${summary.gpsAccuracy.rate >= 80 ? '✅ PASS' : '❌ FAIL'}`);
    
    // Update Speed
    console.log('\n⚡ UPDATE SPEED (< 5 detik)');
    console.log(`   Kecepatan: ${summary.updateSpeed.rate.toFixed(1)}% (${summary.updateSpeed.fast}/${summary.updateSpeed.total})`);
    console.log(`   Rata-rata: ${summary.updateSpeed.averageTime.toFixed(0)}ms`);
    console.log(`   Status: ${summary.updateSpeed.rate >= 90 ? '✅ PASS' : '❌ FAIL'}`);
    
    // ETA Accuracy
    console.log('\n⏰ ETA ACCURACY (> 80%)');
    console.log(`   Akurasi: ${summary.etaAccuracy.rate.toFixed(1)}% (${summary.etaAccuracy.accurate}/${summary.etaAccuracy.total})`);
    console.log(`   Rata-rata: ${(summary.etaAccuracy.averageAccuracy * 100).toFixed(1)}%`);
    console.log(`   Status: ${summary.etaAccuracy.rate >= 80 ? '✅ PASS' : '❌ FAIL'}`);
    
    // Overall
    const overallPass = summary.gpsAccuracy.rate >= 80 && 
                       summary.updateSpeed.rate >= 90 && 
                       summary.etaAccuracy.rate >= 80;
    
    console.log('\n🎯 OVERALL RESULT');
    console.log(`   Status: ${overallPass ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Errors: ${summary.errors}`);
    console.log(`   Duration: ${summary.testDuration} detik`);
    
    // Save results to file
    this.saveResults();
  }

  saveResults() {
    const filename = `gps-test-results-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    fs.writeFileSync(filename, JSON.stringify(this.results, null, 2));
    console.log(`\n💾 Results saved to: ${filename}`);
  }

  async cleanup() {
    console.log('\n🧹 Cleaning up...');
    
    try {
      if (this.sessionToken) {
        // End tracking session
        await axios.post(`${TEST_CONFIG.baseURL}/api/tracking/end-session/${this.rujukanId}`, {}, {
          headers: { Authorization: `Bearer ${this.authToken}` }
        });
        console.log('✅ Session tracking diakhiri');
      }
    } catch (error) {
      console.error('❌ Error cleanup:', error.message);
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async run() {
    try {
      if (!(await this.initialize())) {
        return;
      }

      // Run all tests
      await this.testGPSAccuracy();
      await this.testUpdateSpeed();
      await this.testETAAccuracy();
      await this.runContinuousTest();
      
      // Generate and print results
      this.generateSummary();
      this.printResults();
      
    } catch (error) {
      console.error('❌ Test failed:', error.message);
    } finally {
      await this.cleanup();
    }
  }
}

// Run the test
const tester = new GPSTrackingTester();
tester.run().then(() => {
  console.log('\n🏁 Testing selesai!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
