const io = require('socket.io-client');

console.log('🔌 Testing Socket.IO connection...');

const socket = io('http://localhost:3001', {
  auth: {
    token: 'test-token'
  },
  transports: ['websocket', 'polling'],
  timeout: 20000,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000
});

socket.on('connect', () => {
  console.log('✅ Socket connected successfully!');
  console.log('Socket ID:', socket.id);
  console.log('Connected:', socket.connected);
});

socket.on('disconnect', (reason) => {
  console.log('❌ Socket disconnected:', reason);
});

socket.on('connect_error', (error) => {
  console.error('❌ Socket connection error:', error.message);
  console.error('Error details:', error);
});

socket.on('reconnect', (attemptNumber) => {
  console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
});

socket.on('reconnect_error', (error) => {
  console.error('❌ Socket reconnection error:', error);
});

socket.on('reconnect_failed', () => {
  console.error('❌ Socket reconnection failed');
});

// Test tracking update event
socket.on('tracking-update', (data) => {
  console.log('📡 Tracking update received:', data);
});

// Test after 5 seconds
setTimeout(() => {
  console.log('\n📊 Connection Status:');
  console.log('Connected:', socket.connected);
  console.log('ID:', socket.id);
  console.log('Disconnected:', socket.disconnected);
  
  if (socket.connected) {
    console.log('✅ Socket connection test PASSED');
  } else {
    console.log('❌ Socket connection test FAILED');
  }
  
  socket.disconnect();
  process.exit(0);
}, 5000);

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Disconnecting socket...');
  socket.disconnect();
  process.exit(0);
});
