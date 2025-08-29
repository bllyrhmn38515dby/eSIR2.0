const axios = require('axios');

async function checkBackendStatus() {
  try {
    console.log('🔍 Checking Backend Status...');
    const response = await axios.get('http://localhost:3001/test', { timeout: 5000 });
    console.log('✅ Backend is running:', response.data.message);
    return true;
  } catch (error) {
    console.log('❌ Backend is not running or not responding');
    return false;
  }
}

async function checkFrontendStatus() {
  try {
    console.log('🔍 Checking Frontend Status...');
    const response = await axios.get('http://localhost:3000', { timeout: 5000 });
    console.log('✅ Frontend is running');
    return true;
  } catch (error) {
    console.log('❌ Frontend is not running or not responding');
    return false;
  }
}

async function checkDatabaseStatus() {
  try {
    console.log('🔍 Checking Database Status...');
    const response = await axios.get('http://localhost:3001/api/health', { timeout: 5000 });
    console.log('✅ Database is connected:', response.data.database.isConnected);
    return response.data.database.isConnected;
  } catch (error) {
    console.log('❌ Database check failed');
    return false;
  }
}

async function main() {
  console.log('🚀 eSIR 2.0 Status Check');
  console.log('='.repeat(40));
  
  const backendStatus = await checkBackendStatus();
  const frontendStatus = await checkFrontendStatus();
  const databaseStatus = await checkDatabaseStatus();
  
  console.log('\n📊 Summary:');
  console.log('Backend:', backendStatus ? '✅ Running' : '❌ Not Running');
  console.log('Frontend:', frontendStatus ? '✅ Running' : '❌ Not Running');
  console.log('Database:', databaseStatus ? '✅ Connected' : '❌ Not Connected');
  
  if (backendStatus && frontendStatus && databaseStatus) {
    console.log('\n🎉 All systems are operational!');
    console.log('🌐 Access the application at: http://localhost:3000');
  } else {
    console.log('\n⚠️  Some systems are not running properly');
    console.log('💡 Try running: npm start in both backend and frontend folders');
  }
}

main().catch(console.error);
