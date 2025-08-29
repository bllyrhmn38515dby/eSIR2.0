const mysql = require('mysql2/promise');
require('dotenv').config();

// Database connection
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'esirv2'
};

// Utility functions
const log = (message, type = 'INFO') => {
  const timestamp = new Date().toISOString();
  const emoji = {
    'INFO': 'ℹ️',
    'SUCCESS': '✅',
    'ERROR': '❌',
    'WARNING': '⚠️',
    'TEST': '🧪',
    'DB': '🗄️'
  };
  console.log(`${emoji[type]} [${timestamp}] ${message}`);
};

let db = null;

// Connect to database
async function connectDatabase() {
  try {
    db = await mysql.createConnection(dbConfig);
    log('Database connected successfully', 'SUCCESS');
    return true;
  } catch (error) {
    log(`Database connection failed: ${error.message}`, 'ERROR');
    return false;
  }
}

// Test 1: Check Database Schema
async function testDatabaseSchema() {
  try {
    log('Testing database schema...', 'TEST');
    
    // Check tracking_sessions table
    const [sessionsColumns] = await db.execute(`DESCRIBE tracking_sessions`);
    log(`tracking_sessions has ${sessionsColumns.length} columns`, 'DB');
    
    // Check tracking_data table
    const [dataColumns] = await db.execute(`DESCRIBE tracking_data`);
    log(`tracking_data has ${dataColumns.length} columns`, 'DB');
    
    // Check if tables have data
    const [sessionsCount] = await db.execute(`SELECT COUNT(*) as count FROM tracking_sessions`);
    const [dataCount] = await db.execute(`SELECT COUNT(*) as count FROM tracking_data`);
    
    log(`tracking_sessions has ${sessionsCount[0].count} records`, 'DB');
    log(`tracking_data has ${dataCount[0].count} records`, 'DB');
    
    return true;
  } catch (error) {
    log(`Schema test error: ${error.message}`, 'ERROR');
    return false;
  }
}

// Test 2: Check Sample Data
async function testSampleData() {
  try {
    log('Testing sample data...', 'TEST');
    
    // Check rujukan data
    const [rujukanData] = await db.execute(`
      SELECT r.id, r.nomor_rujukan, r.status, p.nama_lengkap as nama_pasien
      FROM rujukan r
      LEFT JOIN pasien p ON r.pasien_id = p.id
      LIMIT 5
    `);
    
    log(`Found ${rujukanData.length} rujukan records`, 'DB');
    rujukanData.forEach((rujukan, index) => {
      log(`  ${index + 1}. ${rujukan.nomor_rujukan} - ${rujukan.nama_pasien} (${rujukan.status})`, 'INFO');
    });
    
    // Check faskes data
    const [faskesData] = await db.execute(`
      SELECT id, nama_faskes, latitude, longitude
      FROM faskes
      LIMIT 5
    `);
    
    log(`Found ${faskesData.length} faskes records`, 'DB');
    faskesData.forEach((faskes, index) => {
      log(`  ${index + 1}. ${faskes.nama_faskes} (${faskes.latitude}, ${faskes.longitude})`, 'INFO');
    });
    
    return true;
  } catch (error) {
    log(`Sample data test error: ${error.message}`, 'ERROR');
    return false;
  }
}

// Test 3: Simulate Tracking Session
async function testTrackingSession() {
  try {
    log('Testing tracking session simulation...', 'TEST');
    
    // Get a sample rujukan
    const [rujukanRows] = await db.execute(`
      SELECT r.id, r.nomor_rujukan, p.nama_lengkap as nama_pasien
      FROM rujukan r
      LEFT JOIN pasien p ON r.pasien_id = p.id
      WHERE r.status = 'diterima'
      LIMIT 1
    `);
    
    if (rujukanRows.length === 0) {
      log('No rujukan found for testing', 'WARNING');
      return false;
    }
    
    const rujukan = rujukanRows[0];
    log(`Using rujukan: ${rujukan.nomor_rujukan} - ${rujukan.nama_pasien}`, 'INFO');
    
    // Create tracking session
    const sessionToken = require('crypto').randomBytes(32).toString('hex');
    const [sessionResult] = await db.execute(`
      INSERT INTO tracking_sessions (rujukan_id, user_id, device_id, session_token, is_active)
      VALUES (?, ?, ?, ?, TRUE)
    `, [rujukan.id, 1, 'TEST_DEVICE_001', sessionToken]);
    
    const sessionId = sessionResult.insertId;
    log(`Created tracking session: ${sessionId}`, 'SUCCESS');
    
    // Create initial tracking data
    await db.execute(`
      INSERT INTO tracking_data (rujukan_id, latitude, longitude, status, estimated_time, estimated_distance)
      VALUES (?, ?, ?, 'menunggu', NULL, NULL)
    `, [rujukan.id, -6.5971, 106.8060]);
    
    log('Created initial tracking data', 'SUCCESS');
    
    return { sessionId, sessionToken, rujukanId: rujukan.id };
  } catch (error) {
    log(`Tracking session test error: ${error.message}`, 'ERROR');
    return false;
  }
}

// Test 4: Simulate Position Updates
async function testPositionUpdates(sessionData) {
  try {
    log('Testing position updates...', 'TEST');
    
    if (!sessionData) {
      log('No session data provided', 'ERROR');
      return false;
    }
    
    const testCoordinates = [
      { lat: -6.5971, lng: 106.8060, status: 'menunggu' },
      { lat: -6.5960, lng: 106.8070, status: 'dijemput' },
      { lat: -6.5950, lng: 106.8080, status: 'dalam_perjalanan' },
      { lat: -6.5940, lng: 106.8090, status: 'dalam_perjalanan' },
      { lat: -6.5930, lng: 106.8100, status: 'tiba' }
    ];
    
    for (let i = 0; i < testCoordinates.length; i++) {
      const coord = testCoordinates[i];
      
      // Update tracking data
      await db.execute(`
        UPDATE tracking_data 
        SET latitude = ?, longitude = ?, status = ?, 
            speed = ?, heading = ?, accuracy = ?, battery_level = ?,
            updated_at = NOW()
        WHERE rujukan_id = ?
      `, [
        coord.lat, coord.lng, coord.status,
        30 + Math.random() * 20, Math.floor(Math.random() * 360),
        3.0 + Math.random() * 4.0, 85 - (i * 2),
        sessionData.rujukanId
      ]);
      
      log(`Updated position ${i + 1}/${testCoordinates.length}: ${coord.status}`, 'SUCCESS');
      
      // Wait 1 second
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return true;
  } catch (error) {
    log(`Position updates test error: ${error.message}`, 'ERROR');
    return false;
  }
}

// Test 5: Verify Tracking Data
async function verifyTrackingData(sessionData) {
  try {
    log('Verifying tracking data...', 'TEST');
    
    if (!sessionData) {
      log('No session data provided', 'ERROR');
      return false;
    }
    
    // Get tracking session
    const [sessionRows] = await db.execute(`
      SELECT ts.*, td.latitude, td.longitude, td.status as tracking_status,
             r.nomor_rujukan, p.nama_lengkap as nama_pasien
      FROM tracking_sessions ts
      LEFT JOIN tracking_data td ON ts.rujukan_id = td.rujukan_id
      LEFT JOIN rujukan r ON ts.rujukan_id = r.id
      LEFT JOIN pasien p ON r.pasien_id = p.id
      WHERE ts.id = ?
    `, [sessionData.sessionId]);
    
    if (sessionRows.length === 0) {
      log('No tracking session found', 'ERROR');
      return false;
    }
    
    const session = sessionRows[0];
    log('Tracking session details:', 'INFO');
    log(`  Session ID: ${session.id}`, 'INFO');
    log(`  Rujukan: ${session.nomor_rujukan}`, 'INFO');
    log(`  Pasien: ${session.nama_pasien}`, 'INFO');
    log(`  Status: ${session.tracking_status}`, 'INFO');
    log(`  Position: ${session.latitude}, ${session.longitude}`, 'INFO');
    log(`  Device: ${session.device_id}`, 'INFO');
    log(`  Started: ${session.started_at}`, 'INFO');
    
    return true;
  } catch (error) {
    log(`Verification test error: ${error.message}`, 'ERROR');
    return false;
  }
}

// Test 6: Cleanup Test Data
async function cleanupTestData(sessionData) {
  try {
    log('Cleaning up test data...', 'TEST');
    
    if (!sessionData) {
      log('No session data to clean', 'INFO');
      return true;
    }
    
    // Delete tracking data
    await db.execute(`DELETE FROM tracking_data WHERE rujukan_id = ?`, [sessionData.rujukanId]);
    log('Deleted tracking data', 'SUCCESS');
    
    // Delete tracking session
    await db.execute(`DELETE FROM tracking_sessions WHERE id = ?`, [sessionData.sessionId]);
    log('Deleted tracking session', 'SUCCESS');
    
    return true;
  } catch (error) {
    log(`Cleanup error: ${error.message}`, 'ERROR');
    return false;
  }
}

// Main test runner
async function runManualTests() {
  log('🚀 Starting Manual eSIR2.0 Tracking System Tests', 'TEST');
  log('================================================', 'TEST');
  
  let sessionData = null;
  
  try {
    // Connect to database
    if (!await connectDatabase()) {
      log('Cannot proceed without database connection', 'ERROR');
      return;
    }
    
    const results = {
      total: 0,
      passed: 0,
      failed: 0
    };
    
    const tests = [
      { name: 'Database Schema', fn: testDatabaseSchema },
      { name: 'Sample Data', fn: testSampleData },
      { name: 'Tracking Session', fn: testTrackingSession },
      { name: 'Position Updates', fn: () => testPositionUpdates(sessionData) },
      { name: 'Verify Data', fn: () => verifyTrackingData(sessionData) },
      { name: 'Cleanup', fn: () => cleanupTestData(sessionData) }
    ];
    
    for (const test of tests) {
      results.total++;
      log(`\n🧪 Running test: ${test.name}`, 'TEST');
      
      try {
        const result = await test.fn();
        if (result) {
          results.passed++;
          log(`✅ ${test.name}: PASSED`, 'SUCCESS');
          
          // Store session data for subsequent tests
          if (test.name === 'Tracking Session' && typeof result === 'object') {
            sessionData = result;
          }
        } else {
          results.failed++;
          log(`❌ ${test.name}: FAILED`, 'ERROR');
        }
      } catch (error) {
        results.failed++;
        log(`❌ ${test.name}: ERROR - ${error.message}`, 'ERROR');
      }
    }
    
    // Summary
    log('\n📊 MANUAL TEST SUMMARY', 'TEST');
    log('======================', 'TEST');
    log(`Total Tests: ${results.total}`, 'INFO');
    log(`Passed: ${results.passed}`, 'SUCCESS');
    log(`Failed: ${results.failed}`, results.failed > 0 ? 'ERROR' : 'SUCCESS');
    log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`, 'INFO');
    
    if (results.failed === 0) {
      log('\n🎉 All manual tests passed! Tracking system database is working correctly.', 'SUCCESS');
    } else {
      log('\n⚠️  Some tests failed. Please check the errors above.', 'WARNING');
    }
    
  } catch (error) {
    log(`Manual test error: ${error.message}`, 'ERROR');
  } finally {
    // Close database connection
    if (db) {
      await db.end();
      log('Database connection closed', 'INFO');
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runManualTests().catch(error => {
    log(`Fatal error: ${error.message}`, 'ERROR');
    process.exit(1);
  });
}

module.exports = {
  runManualTests,
  testDatabaseSchema,
  testSampleData,
  testTrackingSession,
  testPositionUpdates,
  verifyTrackingData,
  cleanupTestData
};
