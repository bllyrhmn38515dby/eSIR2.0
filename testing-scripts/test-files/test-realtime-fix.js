const io = require('socket.io-client');

console.log('🔌 Testing Realtime Socket.IO Fix...');

// Test dengan token yang valid (ganti dengan token yang sebenarnya)
const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTczNTA5NzQzMSwiZXhwIjoxNzM1MTgzODMxfQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';

const socket = io('http://localhost:3001', {
  auth: {
    token: testToken
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
  
  // Test join admin room
  socket.emit('join-admin');
  console.log('👑 Joined admin room');
});

socket.on('disconnect', (reason) => {
  console.log('❌ Socket disconnected:', reason);
});

socket.on('connect_error', (error) => {
  console.error('❌ Socket connection error:', error.message);
});

socket.on('reconnect', (attemptNumber) => {
  console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
});

socket.on('reconnect_error', (error) => {
  console.error('❌ Socket reconnection error:', error.message);
});

socket.on('reconnect_failed', () => {
  console.error('❌ Socket reconnection failed');
});

// Test notification events
socket.on('rujukan-baru', (data) => {
  console.log('📢 Received rujukan baru notification:', data);
});

socket.on('status-update', (data) => {
  console.log('📢 Received status update notification:', data);
});

socket.on('tracking-update', (data) => {
  console.log('📢 Received tracking update notification:', data);
});

// Test sending a notification
setTimeout(() => {
  console.log('📤 Testing notification broadcast...');
  
  // Simulate sending a notification (this would normally be done by the server)
  socket.emit('test-notification', {
    type: 'test',
    title: 'Test Notification',
    message: 'This is a test notification',
    timestamp: new Date().toISOString()
  });
  
  setTimeout(() => {
    console.log('✅ Realtime test completed');
    socket.disconnect();
    process.exit(0);
  }, 2000);
}, 3000);

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Test interrupted');
  socket.disconnect();
  process.exit(0);
});
