const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:3001';
const TEST_USER = {
  email: 'admin@esirv2.com',
  password: 'password'
};

class AdvancedFeaturesTester {
  constructor() {
    this.token = null;
    this.testResults = {
      pushNotifications: false,
      backgroundTracking: false,
      voiceCommands: false,
      batteryOptimization: false,
      offlineMode: false,
      advancedSettings: false
    };
  }

  async initialize() {
    try {
      console.log('🚀 Initializing Advanced Features Tester...\n');
      
      // Login to get token
      const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, TEST_USER);
      
      if (loginResponse.data.success) {
        this.token = loginResponse.data.data.token;
        console.log('✅ Authentication successful');
        return true;
      } else {
        console.error('❌ Authentication failed');
        return false;
      }
    } catch (error) {
      console.error('❌ Initialization failed:', error.message);
      return false;
    }
  }

  async testPushNotifications() {
    try {
      console.log('\n📱 Testing Push Notifications...');
      
      // Test notification endpoints
      const testNotification = {
        title: 'Test Notification',
        message: 'This is a test notification from Advanced Features',
        type: 'test',
        priority: 'high',
        data: {
          rujukan_id: 1,
          action: 'test'
        }
      };

      const response = await axios.post(`${BASE_URL}/api/notifications/send`, testNotification, {
        headers: { Authorization: `Bearer ${this.token}` }
      });

      if (response.data.success) {
        console.log('✅ Push notification sent successfully');
        this.testResults.pushNotifications = true;
      } else {
        console.log('❌ Push notification failed');
      }
    } catch (error) {
      console.log('❌ Push notification test failed:', error.response?.data?.message || error.message);
    }
  }

  async testBackgroundTracking() {
    try {
      console.log('\n📱 Testing Background Tracking...');
      
      // Test tracking session creation
      const trackingSession = {
        rujukan_id: 1,
        start_location: {
          latitude: -6.5971,
          longitude: 106.8060,
          accuracy: 10
        },
        tracking_config: {
          interval: 30,
          battery_optimization: true,
          offline_storage: true
        }
      };

      const response = await axios.post(`${BASE_URL}/api/tracking/start-background`, trackingSession, {
        headers: { Authorization: `Bearer ${this.token}` }
      });

      if (response.data.success) {
        console.log('✅ Background tracking session created');
        this.testResults.backgroundTracking = true;
      } else {
        console.log('❌ Background tracking failed');
      }
    } catch (error) {
      console.log('❌ Background tracking test failed:', error.response?.data?.message || error.message);
    }
  }

  async testVoiceCommands() {
    try {
      console.log('\n🎤 Testing Voice Commands...');
      
      // Test voice command processing
      const voiceCommand = {
        command: 'start tracking',
        confidence: 0.95,
        user_id: 1,
        context: 'ambulance_driver'
      };

      const response = await axios.post(`${BASE_URL}/api/voice/process`, voiceCommand, {
        headers: { Authorization: `Bearer ${this.token}` }
      });

      if (response.data.success) {
        console.log('✅ Voice command processed successfully');
        console.log('   Response:', response.data.data.action);
        this.testResults.voiceCommands = true;
      } else {
        console.log('❌ Voice command processing failed');
      }
    } catch (error) {
      console.log('❌ Voice commands test failed:', error.response?.data?.message || error.message);
    }
  }

  async testBatteryOptimization() {
    try {
      console.log('\n🔋 Testing Battery Optimization...');
      
      // Test battery optimization settings
      const batterySettings = {
        low_battery_threshold: 20,
        power_saving_mode: true,
        gps_accuracy_reduction: true,
        background_process_limit: true
      };

      const response = await axios.post(`${BASE_URL}/api/settings/battery`, batterySettings, {
        headers: { Authorization: `Bearer ${this.token}` }
      });

      if (response.data.success) {
        console.log('✅ Battery optimization settings updated');
        this.testResults.batteryOptimization = true;
      } else {
        console.log('❌ Battery optimization failed');
      }
    } catch (error) {
      console.log('❌ Battery optimization test failed:', error.response?.data?.message || error.message);
    }
  }

  async testOfflineMode() {
    try {
      console.log('\n📶 Testing Offline Mode...');
      
      // Test offline data storage
      const offlineData = {
        tracking_data: [
          {
            latitude: -6.5971,
            longitude: 106.8060,
            timestamp: new Date().toISOString(),
            session_id: 1
          }
        ],
        sync_status: 'pending',
        created_at: new Date().toISOString()
      };

      const response = await axios.post(`${BASE_URL}/api/offline/store`, offlineData, {
        headers: { Authorization: `Bearer ${this.token}` }
      });

      if (response.data.success) {
        console.log('✅ Offline data stored successfully');
        this.testResults.offlineMode = true;
      } else {
        console.log('❌ Offline mode failed');
      }
    } catch (error) {
      console.log('❌ Offline mode test failed:', error.response?.data?.message || error.message);
    }
  }

  async testAdvancedSettings() {
    try {
      console.log('\n⚙️ Testing Advanced Settings...');
      
      // Test advanced settings configuration
      const advancedSettings = {
        push_notifications: true,
        background_tracking: true,
        voice_commands: true,
        battery_optimization: true,
        offline_mode: true,
        tracking_interval: 30,
        notification_sound: true,
        vibration_enabled: true
      };

      const response = await axios.post(`${BASE_URL}/api/settings/advanced`, advancedSettings, {
        headers: { Authorization: `Bearer ${this.token}` }
      });

      if (response.data.success) {
        console.log('✅ Advanced settings updated successfully');
        this.testResults.advancedSettings = true;
      } else {
        console.log('❌ Advanced settings failed');
      }
    } catch (error) {
      console.log('❌ Advanced settings test failed:', error.response?.data?.message || error.message);
    }
  }

  async runAllTests() {
    console.log('🧪 Running Advanced Features Tests...\n');
    
    if (!await this.initialize()) {
      console.log('❌ Cannot proceed without authentication');
      return;
    }

    // Run all tests
    await this.testPushNotifications();
    await this.testBackgroundTracking();
    await this.testVoiceCommands();
    await this.testBatteryOptimization();
    await this.testOfflineMode();
    await this.testAdvancedSettings();

    // Generate test report
    this.generateTestReport();
  }

  generateTestReport() {
    console.log('\n📊 ADVANCED FEATURES TEST REPORT');
    console.log('=====================================');
    
    const totalTests = Object.keys(this.testResults).length;
    const passedTests = Object.values(this.testResults).filter(result => result).length;
    const failedTests = totalTests - passedTests;

    console.log(`\n📈 Test Results:`);
    console.log(`   Total Tests: ${totalTests}`);
    console.log(`   ✅ Passed: ${passedTests}`);
    console.log(`   ❌ Failed: ${failedTests}`);
    console.log(`   📊 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

    console.log('\n🔍 Detailed Results:');
    Object.entries(this.testResults).forEach(([feature, result]) => {
      const status = result ? '✅ PASS' : '❌ FAIL';
      const featureName = feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      console.log(`   ${status} ${featureName}`);
    });

    console.log('\n🎯 Recommendations:');
    if (failedTests === 0) {
      console.log('   🎉 All advanced features are working perfectly!');
      console.log('   🚀 Ready for production deployment');
    } else {
      console.log('   🔧 Some features need attention');
      console.log('   📝 Check backend endpoints and configurations');
      console.log('   🧪 Run individual tests for detailed debugging');
    }

    console.log('\n🚀 Next Steps:');
    console.log('   1. Test on actual mobile devices');
    console.log('   2. Verify Firebase integration');
    console.log('   3. Test offline scenarios');
    console.log('   4. Validate battery optimization');
    console.log('   5. Deploy to app stores');
  }
}

// Run the tests
const tester = new AdvancedFeaturesTester();
tester.runAllTests();
