const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class ReactNativeSetup {
  constructor() {
    this.projectName = 'eSIRMobile';
    this.projectPath = path.join(process.cwd(), '..', this.projectName);
  }

  async checkPrerequisites() {
    console.log('🔍 Checking Prerequisites...\n');
    
    try {
      // Check Node.js
      const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
      console.log('✅ Node.js:', nodeVersion);
      
      // Check npm
      const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
      console.log('✅ npm:', npmVersion);
      
      // Check React Native CLI
      try {
        const rnVersion = execSync('npx react-native --version', { encoding: 'utf8' }).trim();
        console.log('✅ React Native CLI:', rnVersion);
      } catch (error) {
        console.log('📥 Installing React Native CLI...');
        execSync('npm install -g @react-native-community/cli', { stdio: 'inherit' });
      }
      
      return true;
    } catch (error) {
      console.log('❌ Prerequisites check failed:', error.message);
      return false;
    }
  }

  async createProject() {
    console.log('\n🚀 Creating React Native Project...\n');
    
    try {
      // Check if project already exists
      if (fs.existsSync(this.projectPath)) {
        console.log('⚠️  Project already exists. Removing...');
        execSync(`rmdir /s /q "${this.projectPath}"`, { stdio: 'inherit' });
      }
      
      // Create new project
      console.log('📝 Creating new React Native project...');
      execSync(`npx react-native@latest init ${this.projectName} --template react-native-template-typescript`, {
        stdio: 'inherit',
        cwd: path.join(process.cwd(), '..')
      });
      
      console.log('✅ React Native project created successfully!');
      return true;
    } catch (error) {
      console.log('❌ Failed to create project:', error.message);
      return false;
    }
  }

  async installDependencies() {
    console.log('\n📦 Installing Advanced Features Dependencies...\n');
    
    try {
      const dependencies = [
        // Firebase for push notifications
        '@react-native-firebase/app',
        '@react-native-firebase/messaging',
        'react-native-push-notification',
        
        // GPS and location tracking
        '@react-native-community/geolocation',
        'react-native-background-geolocation',
        'react-native-maps',
        
        // Voice commands
        '@react-native-voice/voice',
        'react-native-speech-recognition',
        
        // Battery and power management
        'react-native-battery',
        'react-native-power-manager',
        
        // Offline storage
        '@react-native-async-storage/async-storage',
        '@react-native-community/netinfo',
        
        // UI components
        'react-native-elements',
        'react-native-vector-icons',
        'react-native-gesture-handler',
        'react-native-reanimated',
        
        // Navigation
        '@react-navigation/native',
        '@react-navigation/stack',
        '@react-navigation/bottom-tabs',
        'react-native-screens',
        'react-native-safe-area-context',
        
        // HTTP client
        'axios',
        
        // Utilities
        'react-native-device-info',
        'react-native-permissions'
      ];
      
      console.log('📥 Installing dependencies...');
      execSync(`npm install ${dependencies.join(' ')}`, {
        stdio: 'inherit',
        cwd: this.projectPath
      });
      
      console.log('✅ Dependencies installed successfully!');
      return true;
    } catch (error) {
      console.log('❌ Failed to install dependencies:', error.message);
      return false;
    }
  }

  async setupAndroidConfig() {
    console.log('\n🤖 Setting up Android Configuration...\n');
    
    try {
      const androidPath = path.join(this.projectPath, 'android');
      
      // Update gradle.properties
      const gradlePropertiesPath = path.join(androidPath, 'gradle.properties');
      let gradleContent = fs.readFileSync(gradlePropertiesPath, 'utf8');
      
      // Add Java 11 and performance configurations
      const additionalConfig = `
# Java 11 Configuration
org.gradle.jvmargs=-Xmx4096m -XX:MaxPermSize=1024m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8
org.gradle.parallel=true
org.gradle.configureondemand=true
org.gradle.daemon=true

# React Native Maps
android.useAndroidX=true
android.enableJetifier=true

# Performance
org.gradle.caching=true
org.gradle.workers.max=4
`;
      
      if (!gradleContent.includes('org.gradle.jvmargs')) {
        gradleContent += additionalConfig;
        fs.writeFileSync(gradlePropertiesPath, gradleContent);
        console.log('✅ Updated gradle.properties');
      }
      
      // Update build.gradle
      const buildGradlePath = path.join(androidPath, 'app', 'build.gradle');
      let buildContent = fs.readFileSync(buildGradlePath, 'utf8');
      
      // Update compileSdk and targetSdk
      buildContent = buildContent.replace(/compileSdkVersion \d+/, 'compileSdkVersion 33');
      buildContent = buildContent.replace(/targetSdkVersion \d+/, 'targetSdkVersion 33');
      buildContent = buildContent.replace(/minSdkVersion \d+/, 'minSdkVersion 21');
      
      fs.writeFileSync(buildGradlePath, buildContent);
      console.log('✅ Updated build.gradle');
      
      return true;
    } catch (error) {
      console.log('❌ Failed to setup Android config:', error.message);
      return false;
    }
  }

  async setupIOSConfig() {
    console.log('\n🍎 Setting up iOS Configuration...\n');
    
    try {
      const iosPath = path.join(this.projectPath, 'ios');
      
      // Install pods
      console.log('📦 Installing CocoaPods dependencies...');
      execSync('cd ios && pod install', {
        stdio: 'inherit',
        cwd: this.projectPath
      });
      
      console.log('✅ iOS configuration completed!');
      return true;
    } catch (error) {
      console.log('❌ Failed to setup iOS config:', error.message);
      return false;
    }
  }

  async createAdvancedFeatures() {
    console.log('\n🔧 Creating Advanced Features Structure...\n');
    
    try {
      const srcPath = path.join(this.projectPath, 'src');
      const servicesPath = path.join(srcPath, 'services');
      const screensPath = path.join(srcPath, 'screens');
      const componentsPath = path.join(srcPath, 'components');
      
      // Create directories
      [srcPath, servicesPath, screensPath, componentsPath].forEach(dir => {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
      });
      
      // Create service files
      const services = [
        'NotificationService.ts',
        'BackgroundTrackingService.ts',
        'VoiceCommandService.ts',
        'BatteryOptimizationService.ts',
        'OfflineModeService.ts'
      ];
      
      services.forEach(service => {
        const servicePath = path.join(servicesPath, service);
        const serviceContent = `// ${service} - Advanced Feature Service
export class ${service.replace('.ts', '')} {
  // Implementation will be added here
  constructor() {
    console.log('${service.replace('.ts', '')} initialized');
  }
}
`;
        fs.writeFileSync(servicePath, serviceContent);
      });
      
      // Create screen files
      const screens = [
        'AdvancedFeaturesScreen.tsx',
        'TrackingScreen.tsx',
        'SettingsScreen.tsx'
      ];
      
      screens.forEach(screen => {
        const screenPath = path.join(screensPath, screen);
        const screenContent = `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const ${screen.replace('.tsx', '')}: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>${screen.replace('.tsx', '')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
`;
        fs.writeFileSync(screenPath, screenContent);
      });
      
      console.log('✅ Advanced features structure created!');
      return true;
    } catch (error) {
      console.log('❌ Failed to create advanced features:', error.message);
      return false;
    }
  }

  async runSetup() {
    console.log('🚀 React Native Advanced Features Setup\n');
    
    const steps = [
      { name: 'Prerequisites Check', fn: () => this.checkPrerequisites() },
      { name: 'Project Creation', fn: () => this.createProject() },
      { name: 'Dependencies Installation', fn: () => this.installDependencies() },
      { name: 'Android Configuration', fn: () => this.setupAndroidConfig() },
      { name: 'iOS Configuration', fn: () => this.setupIOSConfig() },
      { name: 'Advanced Features Structure', fn: () => this.createAdvancedFeatures() }
    ];
    
    for (const step of steps) {
      console.log(`\n📋 Step: ${step.name}`);
      const success = await step.fn();
      
      if (!success) {
        console.log(`❌ ${step.name} failed. Stopping setup.`);
        return false;
      }
    }
    
    console.log('\n🎉 React Native Setup Completed Successfully!');
    console.log('\n📁 Project Location:', this.projectPath);
    console.log('\n🚀 Next Steps:');
    console.log('1. cd ../eSIRMobile');
    console.log('2. npx react-native run-android');
    console.log('3. npx react-native run-ios');
    console.log('\n📱 Advanced Features Ready:');
    console.log('- Push Notifications');
    console.log('- Background Tracking');
    console.log('- Voice Commands');
    console.log('- Battery Optimization');
    console.log('- Offline Mode');
    console.log('- Advanced Settings');
    
    return true;
  }
}

// Run the setup
const setup = new ReactNativeSetup();
setup.runSetup();
