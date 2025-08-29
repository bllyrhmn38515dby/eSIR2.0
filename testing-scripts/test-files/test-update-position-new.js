const { exec } = require('child_process');

function testUpdatePositionNew() {
  console.log('🧪 Testing update-position dengan koordinat GPS baru...\n');

  // Test dengan koordinat GPS yang dilaporkan user
  console.log('1. Testing dengan koordinat GPS user (-6.5933988, 106.6582559)...');
  exec(`curl -X POST "http://localhost:3001/api/tracking/update-position" -H "Content-Type: application/json" -d "{\\"session_token\\": \\"9596b377de164787acf655564e0d9a8c4405fc5f0a5affd4221d44a43489555c\\", \\"latitude\\": -6.5933988, \\"longitude\\": 106.6582559, \\"status\\": \\"dijemput\\", \\"speed\\": 0, \\"heading\\": null, \\"accuracy\\": 1000, \\"battery_level\\": 80}"`, (error, stdout, stderr) => {
    if (error) {
      console.log('❌ Error:', error.message);
      return;
    }
    console.log('✅ Response:', stdout);
  });
}

testUpdatePositionNew();
