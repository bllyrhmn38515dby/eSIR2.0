const db = require('./config/db');

async function debugTrackingData() {
  console.log('🔍 Debugging tracking data...\n');

  try {
    // Check tracking_data table
    console.log('1. Checking tracking_data table...');
    const [trackingDataRows] = await db.execute('SELECT * FROM tracking_data WHERE rujukan_id = 1');
    console.log('Tracking data for rujukan_id = 1:', trackingDataRows);

    // Check tracking_sessions table
    console.log('\n2. Checking tracking_sessions table...');
    const [sessionRows] = await db.execute('SELECT * FROM tracking_sessions WHERE rujukan_id = 1');
    console.log('Sessions for rujukan_id = 1:', sessionRows);

    // Check rujukan table
    console.log('\n3. Checking rujukan table...');
    const [rujukanRows] = await db.execute('SELECT * FROM rujukan WHERE id = 1');
    console.log('Rujukan with id = 1:', rujukanRows);

    // Check if tracking_data exists for any rujukan
    console.log('\n4. Checking all tracking_data...');
    const [allTrackingData] = await db.execute('SELECT * FROM tracking_data');
    console.log('All tracking data:', allTrackingData);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

debugTrackingData();
