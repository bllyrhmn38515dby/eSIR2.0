const axios = require('axios');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuration
const BASE_URL = 'http://localhost:3001';
const API_URL = `${BASE_URL}/api`;

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
    'DEBUG': '🔍',
    'FIX': '🔧'
  };
  console.log(`${emoji[type]} [${timestamp}] ${message}`);
};

// Database connection
let db = null;

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

// Debug 1: Check Database Schema
async function debugDatabaseSchema() {
  try {
    log('Checking database schema...', 'DEBUG');
    
    // Check tracking_sessions table
    const [sessionsColumns] = await db.execute(`DESCRIBE tracking_sessions`);
    log(`tracking_sessions has ${sessionsColumns.length} columns`, 'INFO');
    
    // Check tracking_data table
    const [dataColumns] = await db.execute(`DESCRIBE tracking_data`);
    log(`tracking_data has ${dataColumns.length} columns`, 'INFO');
    
    return true;
  } catch (error) {
    log(`Schema check error: ${error.message}`, 'ERROR');
    return false;
  }
}

// Debug 2: Check Data Integrity
async function debugDataIntegrity() {
  try {
    log('Checking data integrity...', 'DEBUG');
    
    // Check for orphaned tracking data
    const [orphanedData] = await db.execute(`
      SELECT COUNT(*) as count FROM tracking_data td
      LEFT JOIN rujukan r ON td.rujukan_id = r.id
      WHERE r.id IS NULL
    `);
    
    if (orphanedData[0].count > 0) {
      log(`Found ${orphanedData[0].count} orphaned tracking data records`, 'WARNING');
    } else {
      log('No orphaned tracking data found', 'SUCCESS');
    }
    
    // Check for duplicate active sessions
    const [duplicateSessions] = await db.execute(`
      SELECT COUNT(*) as count FROM (
        SELECT rujukan_id FROM tracking_sessions
        WHERE is_active = TRUE
        GROUP BY rujukan_id
        HAVING COUNT(*) > 1
      ) as duplicates
    `);
    
    if (duplicateSessions[0].count > 0) {
      log(`Found ${duplicateSessions[0].count} rujukan with multiple active sessions`, 'WARNING');
    } else {
      log('No duplicate active sessions found', 'SUCCESS');
    }
    
    return true;
  } catch (error) {
    log(`Data integrity check error: ${error.message}`, 'ERROR');
    return false;
  }
}

// Debug 3: Check API Endpoints
async function debugAPIEndpoints() {
  try {
    log('Checking API endpoints...', 'DEBUG');
    
    const endpoints = [
      { path: '/api/health', method: 'GET', name: 'Health Check' },
      { path: '/api/tracking/sessions/active', method: 'GET', name: 'Active Sessions' }
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await axios({
          method: endpoint.method,
          url: `${BASE_URL}${endpoint.path}`,
          timeout: 5000,
          validateStatus: () => true
        });
        
        if (response.status === 200 || response.status === 401) {
          log(`${endpoint.name}: ✅ Available (${response.status})`, 'SUCCESS');
        } else {
          log(`${endpoint.name}: ⚠️  Available but returned ${response.status}`, 'WARNING');
        }
      } catch (error) {
        if (error.code === 'ECONNREFUSED') {
          log(`${endpoint.name}: ❌ Server not running`, 'ERROR');
        } else {
          log(`${endpoint.name}: ❌ Error - ${error.message}`, 'ERROR');
        }
      }
    }
    
    return true;
  } catch (error) {
    log(`API check error: ${error.message}`, 'ERROR');
    return false;
  }
}

// Fix 1: Clean Orphaned Data
async function fixOrphanedData() {
  try {
    log('Cleaning orphaned data...', 'FIX');
    
    // Delete orphaned tracking data
    const [orphanedDataResult] = await db.execute(`
      DELETE td FROM tracking_data td
      LEFT JOIN rujukan r ON td.rujukan_id = r.id
      WHERE r.id IS NULL
    `);
    
    if (orphanedDataResult.affectedRows > 0) {
      log(`Deleted ${orphanedDataResult.affectedRows} orphaned tracking data records`, 'SUCCESS');
    } else {
      log('No orphaned tracking data to clean', 'INFO');
    }
    
    return true;
  } catch (error) {
    log(`Clean orphaned data error: ${error.message}`, 'ERROR');
    return false;
  }
}

// Fix 2: Fix Duplicate Active Sessions
async function fixDuplicateSessions() {
  try {
    log('Fixing duplicate active sessions...', 'FIX');
    
    // Get duplicate sessions
    const [duplicates] = await db.execute(`
      SELECT rujukan_id, GROUP_CONCAT(id ORDER BY started_at DESC) as session_ids
      FROM tracking_sessions
      WHERE is_active = TRUE
      GROUP BY rujukan_id
      HAVING COUNT(*) > 1
    `);
    
    for (const dup of duplicates) {
      const sessionIds = dup.session_ids.split(',').map(id => parseInt(id));
      const keepId = sessionIds[0]; // Keep the newest one
      const deleteIds = sessionIds.slice(1);
      
      // Deactivate older sessions
      await db.execute(`
        UPDATE tracking_sessions 
        SET is_active = FALSE, ended_at = NOW()
        WHERE id IN (${deleteIds.join(',')})
      `);
      
      log(`Fixed duplicate sessions for rujukan ${dup.rujukan_id}`, 'SUCCESS');
    }
    
    if (duplicates.length === 0) {
      log('No duplicate sessions to fix', 'INFO');
    }
    
    return true;
  } catch (error) {
    log(`Fix duplicate sessions error: ${error.message}`, 'ERROR');
    return false;
  }
}

// Main debug runner
async function runDebugAndFix() {
  log('🔍 Starting eSIR2.0 Tracking System Debug & Fix', 'DEBUG');
  log('================================================', 'DEBUG');
  
  // Connect to database
  if (!await connectDatabase()) {
    log('Cannot proceed without database connection', 'ERROR');
    return;
  }
  
  const results = {
    debug: { total: 0, passed: 0, failed: 0 },
    fix: { total: 0, passed: 0, failed: 0 }
  };
  
  // Run debug checks
  log('\n🔍 DEBUG CHECKS', 'DEBUG');
  log('==============', 'DEBUG');
  
  const debugChecks = [
    { name: 'Database Schema', fn: debugDatabaseSchema },
    { name: 'Data Integrity', fn: debugDataIntegrity },
    { name: 'API Endpoints', fn: debugAPIEndpoints }
  ];
  
  for (const check of debugChecks) {
    results.debug.total++;
    log(`\n🔍 Running debug: ${check.name}`, 'DEBUG');
    
    try {
      const success = await check.fn();
      if (success) {
        results.debug.passed++;
        log(`✅ ${check.name}: PASSED`, 'SUCCESS');
      } else {
        results.debug.failed++;
        log(`❌ ${check.name}: FAILED`, 'ERROR');
      }
    } catch (error) {
      results.debug.failed++;
      log(`❌ ${check.name}: ERROR - ${error.message}`, 'ERROR');
    }
  }
  
  // Run fixes
  log('\n🔧 AUTOMATIC FIXES', 'FIX');
  log('==================', 'FIX');
  
  const fixes = [
    { name: 'Clean Orphaned Data', fn: fixOrphanedData },
    { name: 'Fix Duplicate Sessions', fn: fixDuplicateSessions }
  ];
  
  for (const fix of fixes) {
    results.fix.total++;
    log(`\n🔧 Running fix: ${fix.name}`, 'FIX');
    
    try {
      const success = await fix.fn();
      if (success) {
        results.fix.passed++;
        log(`✅ ${fix.name}: COMPLETED`, 'SUCCESS');
      } else {
        results.fix.failed++;
        log(`❌ ${fix.name}: FAILED`, 'ERROR');
      }
    } catch (error) {
      results.fix.failed++;
      log(`❌ ${fix.name}: ERROR - ${error.message}`, 'ERROR');
    }
  }
  
  // Summary
  log('\n📊 DEBUG & FIX SUMMARY', 'DEBUG');
  log('======================', 'DEBUG');
  log(`Debug Checks: ${results.debug.passed}/${results.debug.total} passed`, 'INFO');
  log(`Fixes Applied: ${results.fix.passed}/${results.fix.total} completed`, 'INFO');
  
  if (results.debug.failed === 0 && results.fix.failed === 0) {
    log('\n🎉 All debug checks passed and fixes completed successfully!', 'SUCCESS');
  } else {
    log('\n⚠️  Some issues were found or fixes failed. Please review the output above.', 'WARNING');
  }
  
  // Close database connection
  if (db) {
    await db.end();
    log('Database connection closed', 'INFO');
  }
}

// Run debug if this file is executed directly
if (require.main === module) {
  runDebugAndFix().catch(error => {
    log(`Fatal error: ${error.message}`, 'ERROR');
    process.exit(1);
  });
}

module.exports = {
  runDebugAndFix,
  debugDatabaseSchema,
  debugDataIntegrity,
  debugAPIEndpoints,
  fixOrphanedData,
  fixDuplicateSessions
};
