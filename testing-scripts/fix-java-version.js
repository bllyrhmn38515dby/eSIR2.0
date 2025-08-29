const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class JavaVersionFixer {
  constructor() {
    this.javaVersion = null;
    this.gradleVersion = null;
  }

  async checkJavaVersion() {
    try {
      console.log('🔍 Checking Java version...');
      
      const javaOutput = execSync('java -version', { encoding: 'utf8', stdio: 'pipe' });
      console.log('✅ Java is installed:', javaOutput.split('\n')[0]);
      
      // Extract version
      const versionMatch = javaOutput.match(/version "([^"]+)"/);
      if (versionMatch) {
        this.javaVersion = versionMatch[1];
        console.log('📋 Java Version:', this.javaVersion);
        
        // Check if it's Java 11 or higher
        const majorVersion = parseInt(this.javaVersion.split('.')[0]);
        if (majorVersion >= 11) {
          console.log('✅ Java version is compatible (11 or higher)');
          return true;
        } else {
          console.log('❌ Java version is too old. Need Java 11 or higher');
          return false;
        }
      }
    } catch (error) {
      console.log('❌ Java is not installed or not in PATH');
      return false;
    }
  }

  async checkGradleVersion() {
    try {
      console.log('\n🔍 Checking Gradle version...');
      
      const gradleOutput = execSync('gradle --version', { encoding: 'utf8', stdio: 'pipe' });
      const lines = gradleOutput.split('\n');
      
      for (const line of lines) {
        if (line.includes('Gradle')) {
          this.gradleVersion = line.trim();
          console.log('📋 Gradle Version:', this.gradleVersion);
          break;
        }
      }
      
      console.log('✅ Gradle is installed');
      return true;
    } catch (error) {
      console.log('❌ Gradle is not installed or not in PATH');
      return false;
    }
  }

  async fixJavaVersion() {
    console.log('\n🔧 Fixing Java Version Issues...\n');
    
    const javaOk = await this.checkJavaVersion();
    const gradleOk = await this.checkGradleVersion();
    
    if (!javaOk) {
      console.log('\n📥 Installing Java 11...');
      console.log('Please follow these steps:');
      console.log('1. Download OpenJDK 11 from: https://adoptium.net/');
      console.log('2. Install it on your system');
      console.log('3. Set JAVA_HOME environment variable');
      console.log('4. Add Java to your PATH');
      
      console.log('\n💡 Alternative: Use SDKMAN (Linux/Mac)');
      console.log('curl -s "https://get.sdkman.io" | bash');
      console.log('source "$HOME/.sdkman/bin/sdkman-init.sh"');
      console.log('sdk install java 11.0.21-tem');
      
      console.log('\n💡 For Windows:');
      console.log('1. Download from: https://adoptium.net/');
      console.log('2. Install and set JAVA_HOME');
      console.log('3. Add to PATH: %JAVA_HOME%\\bin');
    }
    
    if (!gradleOk) {
      console.log('\n📥 Installing Gradle...');
      console.log('Please follow these steps:');
      console.log('1. Download Gradle from: https://gradle.org/releases/');
      console.log('2. Extract to a directory');
      console.log('3. Set GRADLE_HOME environment variable');
      console.log('4. Add Gradle to your PATH');
      
      console.log('\n💡 Alternative: Use SDKMAN (Linux/Mac)');
      console.log('sdk install gradle 8.4');
    }
    
    if (javaOk && gradleOk) {
      console.log('\n✅ All dependencies are properly installed!');
      console.log('🚀 You can now run React Native commands');
    }
  }

  async createGradleWrapper() {
    console.log('\n🔧 Creating Gradle Wrapper...');
    
    try {
      // Check if we're in a React Native project
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        
        if (packageJson.dependencies && packageJson.dependencies['react-native']) {
          console.log('✅ React Native project detected');
          
          // Create gradle wrapper if it doesn't exist
          const gradlewPath = path.join(process.cwd(), 'android', 'gradlew');
          if (!fs.existsSync(gradlewPath)) {
            console.log('📝 Creating Gradle wrapper...');
            execSync('cd android && gradle wrapper', { stdio: 'inherit' });
          } else {
            console.log('✅ Gradle wrapper already exists');
          }
        }
      }
    } catch (error) {
      console.log('❌ Error creating Gradle wrapper:', error.message);
    }
  }

  async updateGradleConfig() {
    console.log('\n🔧 Updating Gradle Configuration...');
    
    try {
      const gradlePropertiesPath = path.join(process.cwd(), 'android', 'gradle.properties');
      
      if (fs.existsSync(gradlePropertiesPath)) {
        let content = fs.readFileSync(gradlePropertiesPath, 'utf8');
        
        // Add Java 11 configuration
        if (!content.includes('org.gradle.java.home')) {
          content += '\n# Java 11 Configuration\n';
          content += 'org.gradle.java.home=/path/to/java11\n';
          content += 'org.gradle.jvmargs=-Xmx2048m -XX:MaxPermSize=512m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8\n';
          
          fs.writeFileSync(gradlePropertiesPath, content);
          console.log('✅ Updated gradle.properties with Java 11 config');
        } else {
          console.log('✅ gradle.properties already configured');
        }
      }
    } catch (error) {
      console.log('❌ Error updating Gradle config:', error.message);
    }
  }

  async runFix() {
    console.log('🚀 Java Version Fixer for React Native\n');
    
    await this.fixJavaVersion();
    await this.createGradleWrapper();
    await this.updateGradleConfig();
    
    console.log('\n🎯 Next Steps:');
    console.log('1. Install Java 11 or higher');
    console.log('2. Set JAVA_HOME environment variable');
    console.log('3. Install Gradle (if not already installed)');
    console.log('4. Run: npx react-native run-android');
    console.log('5. Or run: npx react-native run-ios');
    
    console.log('\n💡 Environment Variables to Set:');
    console.log('JAVA_HOME=C:\\Program Files\\Java\\jdk-11.0.21');
    console.log('GRADLE_HOME=C:\\gradle-8.4');
    console.log('PATH=%JAVA_HOME%\\bin;%GRADLE_HOME%\\bin;%PATH%');
    
    console.log('\n🔗 Useful Links:');
    console.log('- Java 11: https://adoptium.net/');
    console.log('- Gradle: https://gradle.org/releases/');
    console.log('- React Native: https://reactnative.dev/docs/environment-setup');
  }
}

// Run the fixer
const fixer = new JavaVersionFixer();
fixer.runFix();
