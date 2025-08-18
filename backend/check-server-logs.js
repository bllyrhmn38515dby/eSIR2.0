const { spawn } = require('child_process');

console.log('🔍 Starting backend server to check for errors...');

const server = spawn('node', ['index.js'], {
  stdio: 'pipe',
  cwd: process.cwd()
});

let output = '';

server.stdout.on('data', (data) => {
  const message = data.toString();
  output += message;
  console.log('📤 STDOUT:', message.trim());
});

server.stderr.on('data', (data) => {
  const message = data.toString();
  output += message;
  console.log('❌ STDERR:', message.trim());
});

server.on('close', (code) => {
  console.log(`\n🔍 Server process exited with code ${code}`);
  console.log('\n📋 Full output:');
  console.log(output);
});

// Kill server after 10 seconds
setTimeout(() => {
  console.log('\n⏰ Stopping server...');
  server.kill();
}, 10000);
