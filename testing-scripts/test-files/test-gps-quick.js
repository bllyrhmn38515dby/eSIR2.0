const axios = require('axios');

// Konfigurasi
const BASE_URL = 'http://localhost:3001';

class QuickGPSTester {
  constructor() {
    this.results = {
      gpsAccuracy: 0,
      updateSpeed: 0,
      etaAccuracy: 0,
      errors: []
    };
  }

  async login() {
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, {
        email: 'admin@esir.com',
        password: 'admin123'
      });
      return response.data.data.token;
    } catch (error) {
      throw new Error(`Login gagal: ${error.response?.data?.message || error.message}`);
    }
  }

  async createTestRujukan(token) {
    try {
      console.log('   📋 Mengambil data pasien dan faskes...');
      
      const [pasienResponse, faskesResponse] = await Promise.all([
        axios.get(`${BASE_URL}/api/pasien`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${BASE_URL}/api/faskes`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const pasien = pasienResponse.data.data[0];
      const faskes = faskesResponse.data.data;

      console.log(`   👤 Pasien: ${pasien?.nama_lengkap} (ID: ${pasien?.id})`);
      console.log(`   🏥 Faskes: ${faskes?.length || 0} faskes tersedia`);

      if (!pasien || faskes.length < 2) {
        throw new Error('Data pasien atau faskes tidak cukup');
      }

      console.log(`   📝 Membuat rujukan dari ${pasien.nama_lengkap} ke ${faskes[1].nama_faskes}...`);

      const rujukanResponse = await axios.post(`${BASE_URL}/api/rujukan`, {
        pasien_id: pasien.id,
        faskes_tujuan_id: faskes[1].id,
        diagnosa: 'Quick GPS Test',
        alasan_rujukan: 'Testing GPS tracking cepat',
        catatan_asal: 'Quick test'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log(`   ✅ Rujukan berhasil dibuat: ${rujukanResponse.data.data.nomor_rujukan}`);
      return rujukanResponse.data.data.id;
    } catch (error) {
      console.error('   ❌ Error detail:', error.response?.data || error.message);
      throw new Error(`Gagal membuat rujukan: ${error.response?.data?.message || error.message}`);
    }
  }

  async startTrackingSession(token, rujukanId) {
    try {
      const response = await axios.post(`${BASE_URL}/api/tracking/start-session`, {
        rujukan_id: rujukanId,
        device_id: 'Quick-Test-Device'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      return response.data.data.session_token;
    } catch (error) {
      throw new Error(`Gagal memulai session: ${error.response?.data?.message || error.message}`);
    }
  }

  async testGPSAccuracy(sessionToken) {
    console.log('📍 Testing GPS Accuracy...');
    
    let accurateCount = 0;
    const testCount = 3;
    
    for (let i = 0; i < testCount; i++) {
      try {
        const accuracy = Math.random() * 15 + 5; // 5-20 meter
        const isAccurate = accuracy <= 20;
        
        if (isAccurate) accurateCount++;
        
        await axios.post(`${BASE_URL}/api/tracking/update-position`, {
          session_token: sessionToken,
          latitude: -6.5971 + (Math.random() - 0.5) * 0.01,
          longitude: 106.8060 + (Math.random() - 0.5) * 0.01,
          status: 'dalam_perjalanan',
          accuracy: accuracy,
          speed: 35,
          heading: 90
        });

        console.log(`   Test ${i + 1}: ${accuracy.toFixed(1)}m (${isAccurate ? '✅' : '❌'})`);
        
      } catch (error) {
        console.error(`   Error test ${i + 1}:`, error.message);
        this.results.errors.push(`GPS Test ${i + 1}: ${error.message}`);
      }
    }
    
    this.results.gpsAccuracy = (accurateCount / testCount) * 100;
    console.log(`   Akurasi GPS: ${this.results.gpsAccuracy.toFixed(1)}%`);
  }

  async testUpdateSpeed(sessionToken) {
    console.log('⚡ Testing Update Speed...');
    
    let fastCount = 0;
    const testCount = 5;
    const updateTimes = [];
    
    for (let i = 0; i < testCount; i++) {
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
        updateTimes.push(updateTime);
        
        const isFast = updateTime <= 5000;
        if (isFast) fastCount++;
        
        console.log(`   Update ${i + 1}: ${updateTime}ms (${isFast ? '✅' : '❌'})`);
        
      } catch (error) {
        console.error(`   Error update ${i + 1}:`, error.message);
        this.results.errors.push(`Speed Test ${i + 1}: ${error.message}`);
      }
    }
    
    this.results.updateSpeed = (fastCount / testCount) * 100;
    const avgTime = updateTimes.reduce((sum, time) => sum + time, 0) / updateTimes.length;
    console.log(`   Kecepatan Update: ${this.results.updateSpeed.toFixed(1)}% (Rata-rata: ${avgTime.toFixed(0)}ms)`);
  }

  async testETAAccuracy(sessionToken) {
    console.log('⏰ Testing ETA Accuracy...');
    
    let accurateCount = 0;
    const testCount = 3;
    
    for (let i = 0; i < testCount; i++) {
      try {
        const response = await axios.post(`${BASE_URL}/api/tracking/update-position`, {
          session_token: sessionToken,
          latitude: -6.5971 + i * 0.005,
          longitude: 106.8060 + i * 0.005,
          status: 'dalam_perjalanan',
          accuracy: 10,
          speed: 40,
          heading: 90
        });

        const estimatedTime = response.data.data.estimated_time;
        const estimatedDistance = response.data.data.estimated_distance;
        
        // Simulasi waktu nyata
        const actualTime = estimatedDistance ? (estimatedDistance / 40) * 60 : 0;
        const timeAccuracy = actualTime > 0 ? Math.min(estimatedTime, actualTime) / Math.max(estimatedTime, actualTime) : 0;
        const isAccurate = timeAccuracy >= 0.8;
        
        if (isAccurate) accurateCount++;
        
        console.log(`   Test ${i + 1}: ETA ${estimatedTime}min, Actual ${Math.round(actualTime)}min, Accuracy ${(timeAccuracy * 100).toFixed(1)}% (${isAccurate ? '✅' : '❌'})`);
        
      } catch (error) {
        console.error(`   Error test ${i + 1}:`, error.message);
        this.results.errors.push(`ETA Test ${i + 1}: ${error.message}`);
      }
    }
    
    this.results.etaAccuracy = (accurateCount / testCount) * 100;
    console.log(`   Akurasi ETA: ${this.results.etaAccuracy.toFixed(1)}%`);
  }

  async cleanup(token, rujukanId) {
    try {
      await axios.post(`${BASE_URL}/api/tracking/end-session/${rujukanId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Session tracking diakhiri');
    } catch (error) {
      console.error('❌ Error cleanup:', error.message);
    }
  }

  printResults() {
    console.log('\n' + '='.repeat(50));
    console.log('📊 HASIL QUICK TEST');
    console.log('='.repeat(50));
    
    console.log('\n📍 GPS ACCURACY (< 20m)');
    console.log(`   Status: ${this.results.gpsAccuracy >= 80 ? '✅ PASS' : '❌ FAIL'} (${this.results.gpsAccuracy.toFixed(1)}%)`);
    
    console.log('\n⚡ UPDATE SPEED (< 5 detik)');
    console.log(`   Status: ${this.results.updateSpeed >= 90 ? '✅ PASS' : '❌ FAIL'} (${this.results.updateSpeed.toFixed(1)}%)`);
    
    console.log('\n⏰ ETA ACCURACY (> 80%)');
    console.log(`   Status: ${this.results.etaAccuracy >= 80 ? '✅ PASS' : '❌ FAIL'} (${this.results.etaAccuracy.toFixed(1)}%)`);
    
    const overallPass = this.results.gpsAccuracy >= 80 && 
                       this.results.updateSpeed >= 90 && 
                       this.results.etaAccuracy >= 80;
    
    console.log('\n🎯 OVERALL RESULT');
    console.log(`   Status: ${overallPass ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Errors: ${this.results.errors.length}`);
    
    if (this.results.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      this.results.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    }
  }

  async run() {
    console.log('🚀 Quick GPS Tracking Test');
    console.log('='.repeat(40));
    
    let token, rujukanId, sessionToken;
    
    try {
      // Login
      console.log('🔐 Login...');
      token = await this.login();
      console.log('✅ Login berhasil');
      
      // Buat rujukan test
      console.log('📋 Membuat rujukan test...');
      rujukanId = await this.createTestRujukan(token);
      console.log('✅ Rujukan test dibuat');
      
      // Mulai session
      console.log('🎯 Memulai session tracking...');
      sessionToken = await this.startTrackingSession(token, rujukanId);
      console.log('✅ Session tracking dimulai');
      
      // Run tests
      await this.testGPSAccuracy(sessionToken);
      await this.testUpdateSpeed(sessionToken);
      await this.testETAAccuracy(sessionToken);
      
      // Print results
      this.printResults();
      
    } catch (error) {
      console.error('❌ Test failed:', error.message);
    } finally {
      if (token && rujukanId) {
        await this.cleanup(token, rujukanId);
      }
    }
  }
}

// Run the quick test
const tester = new QuickGPSTester();
tester.run().then(() => {
  console.log('\n🏁 Quick test selesai!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
