const fs = require('fs');
const path = require('path');

console.log('🚀 Testing eSIR 2.0 PWA Implementation\n');

// Test results
let passed = 0;
let failed = 0;

function test(name, testFn) {
  try {
    const result = testFn();
    if (result.success) {
      console.log(`✅ ${name}: ${result.message}`);
      passed++;
    } else {
      console.log(`❌ ${name}: ${result.message}`);
      failed++;
    }
  } catch (error) {
    console.log(`❌ ${name}: Error - ${error.message}`);
    failed++;
  }
}

// Test manifest.json
test('Manifest File', () => {
  const manifestPath = path.join(__dirname, '../frontend/public/manifest.json');
  if (!fs.existsSync(manifestPath)) {
    return { success: false, message: 'manifest.json not found' };
  }
  
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  if (manifest.name !== 'Sistem Informasi Rujukan 2.0') {
    return { success: false, message: 'Manifest name not set correctly' };
  }
  
  return { success: true, message: 'Manifest is properly configured' };
});

// Test service worker
test('Service Worker', () => {
  const swPath = path.join(__dirname, '../frontend/public/sw.js');
  if (!fs.existsSync(swPath)) {
    return { success: false, message: 'Service worker not found' };
  }
  
  const swContent = fs.readFileSync(swPath, 'utf8');
  if (!swContent.includes('install') || !swContent.includes('fetch')) {
    return { success: false, message: 'Service worker missing required events' };
  }
  
  return { success: true, message: 'Service worker is properly configured' };
});

// Test PWA component
test('PWA Component', () => {
  const componentPath = path.join(__dirname, '../frontend/src/components/PWAInstall.js');
  if (!fs.existsSync(componentPath)) {
    return { success: false, message: 'PWAInstall component not found' };
  }
  
  return { success: true, message: 'PWA component exists' };
});

// Test PWA CSS
test('PWA CSS', () => {
  const cssPath = path.join(__dirname, '../frontend/src/components/PWAInstall.css');
  if (!fs.existsSync(cssPath)) {
    return { success: false, message: 'PWA CSS file not found' };
  }
  
  return { success: true, message: 'PWA CSS exists' };
});

// Test App.js integration
test('App Integration', () => {
  const appPath = path.join(__dirname, '../frontend/src/App.js');
  const appContent = fs.readFileSync(appPath, 'utf8');
  
  if (!appContent.includes('PWAInstall')) {
    return { success: false, message: 'PWA component not integrated in App.js' };
  }
  
  return { success: true, message: 'PWA component is integrated' };
});

// Test icons
test('PWA Icons', () => {
  const publicPath = path.join(__dirname, '../frontend/public');
  const requiredIcons = ['logo192.png', 'logo512.png'];
  
  for (const icon of requiredIcons) {
    if (!fs.existsSync(path.join(publicPath, icon))) {
      return { success: false, message: `Missing icon: ${icon}` };
    }
  }
  
  return { success: true, message: 'All PWA icons are present' };
});

// Generate report
console.log('\n' + '='.repeat(50));
console.log('PWA TEST RESULTS');
console.log('='.repeat(50));
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📊 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

if (failed === 0) {
  console.log('\n🎉 ALL PWA TESTS PASSED!');
  console.log('eSIR 2.0 PWA is ready for testing!');
  console.log('\nTo test PWA:');
  console.log('1. Open http://localhost:3000 in Chrome');
  console.log('2. Look for "Install" prompt');
  console.log('3. Test offline functionality');
} else {
  console.log('\n⚠️  Some tests failed. Please fix the issues.');
}

console.log('='.repeat(50));
